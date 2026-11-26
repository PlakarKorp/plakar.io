#!/bin/sh
#
# Regenerates content/docs/control-plane/references/terraform-provider/ from the
# schema `terraform providers schema -json` reports for the published
# plakarkorp/plakar provider, and the examples in the provider repository at the
# matching tag. The index holds the provider block, and each resource gets a
# page shared with the data source of the same name.
#
# Usage: scripts/update-terraform-doc.sh [version]
#
# Without a version, Terraform resolves the latest release.

REPO=${PLAKAR_TF_REPO:-https://github.com/PlakarKorp/terraform-provider-plakar.git}
TERRAFORM=${TERRAFORM:-terraform}
PYTHON=${PYTHON:-python3}
VERSION=${1:-}

PROG=$(basename "$0")
WARNINGS=0

warn() {
  WARNINGS=$((WARNINGS + 1))
  echo "${PROG}: warning: $*" >&2
}

die() {
  echo "${PROG}: error: $*" >&2
  exit 1
}

command -v "$TERRAFORM" >/dev/null 2>&1 ||
  die "${TERRAFORM} is required: install it, or set TERRAFORM"
command -v "$PYTHON" >/dev/null 2>&1 || die "${PYTHON} is required, set PYTHON to override"
command -v git >/dev/null 2>&1 || die "git is required"

TMPDIR=$(mktemp -d "/tmp/${PROG}.XXXXXX") || die "could not create a temporary directory"

# A cleanup trap that exited 0 would report success for every failure below.
cleanup() {
  status=$?
  rm -rf "$TMPDIR"
  exit $status
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

WORKDIR="${TMPDIR}/workspace"
mkdir -p "$WORKDIR" || die "could not create ${WORKDIR}"

{
  echo 'terraform {'
  echo '  required_providers {'
  echo '    plakar = {'
  echo '      source = "plakarkorp/plakar"'
  [ -n "$VERSION" ] && echo "      version = \"${VERSION}\""
  echo '    }'
  echo '  }'
  echo '}'
} > "${WORKDIR}/main.tf"

(cd "$WORKDIR" && "$TERRAFORM" init -no-color) > "${TMPDIR}/init.log" 2>&1 ||
  die "terraform init failed: $(tail -3 "${TMPDIR}/init.log")"

RESOLVED=$(cd "$WORKDIR" && "$TERRAFORM" version -json |
  "$PYTHON" -c 'import json, sys; print(json.load(sys.stdin)["provider_selections"]["registry.terraform.io/plakarkorp/plakar"])') ||
  die "could not determine which provider version terraform selected"

(cd "$WORKDIR" && "$TERRAFORM" providers schema -json) > "${TMPDIR}/schema.json" 2>"${TMPDIR}/schema.err" ||
  die "terraform providers schema failed: $(cat "${TMPDIR}/schema.err")"

# The examples are files in the repository rather than part of the
# schema, so they come from the tag that matches the provider terraform just
# resolved.
EXAMPLES="${TMPDIR}/src/examples"
if git clone --depth 1 -q "$REPO" -b "v${RESOLVED}" "${TMPDIR}/src" 2>"${TMPDIR}/clone.err"; then
  [ -d "$EXAMPLES" ] || {
    warn "no examples/ directory at v${RESOLVED}, the pages will carry no examples"
    EXAMPLES=""
  }
else
  warn "could not clone ${REPO} at v${RESOLVED}, the pages will carry no examples: $(cat "${TMPDIR}/clone.err")"
  EXAMPLES=""
fi

OUTDIR="${SCRIPT_DIR}/../content/docs/control-plane/references"
DEST="${OUTDIR}/terraform-provider"
STAGE="${TMPDIR}/terraform-provider"
mkdir -p "$STAGE" || die "could not create ${STAGE}"

echo "${PROG}: generating from plakarkorp/plakar ${RESOLVED}"

"$PYTHON" - "${TMPDIR}/schema.json" "$EXAMPLES" "$STAGE" "$RESOLVED" \
  "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" 2> "${TMPDIR}/warnings" <<'PY'
import json
import pathlib
import sys

PROVIDER = "registry.terraform.io/plakarkorp/plakar"

schema = json.loads(pathlib.Path(sys.argv[1]).read_text())
examples = pathlib.Path(sys.argv[2]) if sys.argv[2] else None
stage = pathlib.Path(sys.argv[3])
version = sys.argv[4]
date = sys.argv[5]
out = []


def warn(message):
  print("warning: " + message, file=sys.stderr)


def cell(text):
  return " ".join(str(text).split()).replace("|", "\\|")


def typename(spec):
  if isinstance(spec, str):
    return {"string": "String", "bool": "Boolean", "number": "Number"}.get(
      spec, spec.title()
    )
  if isinstance(spec, list) and spec:
    kind = spec[0]
    if kind in ("list", "set", "map") and len(spec) > 1:
      return "%s of %s" % (kind.title(), typename(spec[1]))
    return kind.title()
  return "Object"


def attribute_type(spec):
  name = typename(spec.get("type", "string"))
  return name + ", Sensitive" if spec.get("sensitive") else name


def group(name, spec):
  if spec.get("required"):
    return "Required"
  if spec.get("optional"):
    return "Optional"
  return "Read-Only"


def block_type(spec):
  mode = spec.get("nesting_mode", "single")
  return "Block List" if mode in ("list", "set") else "Block"


def block_group(spec):
  return "Required" if spec.get("min_items") else "Optional"


undescribed = []


def rows(block, owner):
  grouped = {"Required": [], "Optional": [], "Read-Only": []}
  for name, spec in sorted((block.get("attributes") or {}).items()):
    description = spec.get("description", "")
    if not description:
      undescribed.append("%s.%s" % (owner, name))
    grouped[group(name, spec)].append((name, attribute_type(spec), description))
  for name, spec in sorted((block.get("block_types") or {}).items()):
    grouped[block_group(spec)].append(
      (name, block_type(spec), (spec.get("block") or {}).get("description", ""))
    )
  return grouped


def emit_tables(block, owner):
  grouped = rows(block, owner)
  if not any(grouped.values()):
    warn("a block has neither arguments nor attributes")
  for label in ("Required", "Optional", "Read-Only"):
    entries = grouped[label]
    if not entries:
      continue
    out.append("**%s**" % label)
    out.append("")
    out.append(
      "| %s | Type | Description |" % ("Attribute" if label == "Read-Only" else "Argument")
    )
    out.append("| --- | --- | --- |")
    for name, kind, description in entries:
      out.append("| `%s` | %s | %s |" % (cell(name), cell(kind), cell(description)))
    out.append("")

  for name, spec in sorted((block.get("block_types") or {}).items()):
    out.append("### Nested Schema for `%s`" % name)
    out.append("")
    emit_tables(spec.get("block") or {}, "%s.%s" % (owner, name))


def emit_example(path, language, heading):
  if examples is None:
    return
  source = examples / path
  if not source.is_file():
    return
  body = source.read_text().strip()
  if not body:
    return
  if heading:
    out.append("### %s" % heading)
    out.append("")
  out.append("```%s" % language)
  out.append(body)
  out.append("```")
  out.append("")


def emit(heading, owner, block, example_dir, example_file):
  out.append("## %s" % heading)
  out.append("")
  description = (block.get("description") or "").strip()
  if description:
    out.append(description)
    out.append("")
  else:
    warn("%s has no description" % owner)
  emit_example("%s/%s" % (example_dir, example_file), "terraform", "Example Usage")
  emit_tables(block, owner)
  emit_example("%s/import.sh" % example_dir, "shell", "Import")


def front_matter(title, weight, summary):
  return [
    "---",
    'title: "%s"' % title,
    'date: "%s"' % date,
    "weight: %d" % weight,
    'summary: "%s"' % summary,
    "---",
    "",
  ]


def write(name, lines):
  (stage / name).write_text("\n".join(lines).rstrip() + "\n")


provider = schema.get("provider_schemas", {}).get(PROVIDER)
if provider is None:
  warn("the schema holds no %s" % PROVIDER)
  provider = {}

resources = provider.get("resource_schemas") or {}
datasources = provider.get("data_source_schemas") or {}
if not resources:
  warn("the schema holds no resources")

out = front_matter(
  "Terraform Provider",
  2,
  "Argument-by-argument reference for every resource and data source in the "
  "plakar Terraform provider.",
)
out += [
  "# Terraform provider reference",
  "",
  "This section lists every argument and attribute of every resource and data",
  "source in the `plakarkorp/plakar` Terraform provider, version %s. For an" % version,
  "introduction to what these resources are and how to use them, see",
  "[Terraform Provider](../../infrastructure-as-code/terraform).",
  "",
  "## Provider",
  "",
]
provider_block = (provider.get("provider") or {}).get("block") or {}
if provider_block.get("description"):
  out.append(provider_block["description"].strip())
  out.append("")
emit_example("provider/provider.tf", "terraform", "Example Usage")
emit_tables(provider_block, "provider")
out += ["## Resources and data sources", "", '{{< children description="true" >}}']
write("_index.md", out)

for weight, name in enumerate(sorted(set(resources) | set(datasources)), 1):
  kinds = [k for k, s in (("resource", resources), ("data source", datasources)) if name in s]
  out = front_matter(
    name,
    weight,
    "Arguments and attributes of the %s %s." % (name, " and ".join(kinds)),
  )
  out += ["# %s" % name, ""]
  if name in resources:
    emit(
      "Resource",
      "%s (Resource)" % name,
      resources[name].get("block") or {},
      "resources/" + name,
      "resource.tf",
    )
  if name in datasources:
    emit(
      "Data Source",
      "%s (Data Source)" % name,
      datasources[name].get("block") or {},
      "data-sources/" + name,
      "data-source.tf",
    )
  write(name.removeprefix("plakar_").replace("_", "-") + ".md", out)

if undescribed:
  warn(
    "%d attributes carry no description in the schema, so their cells are empty: %s"
    % (len(undescribed), ", ".join(sorted(undescribed)[:5]) + ", ...")
  )
PY

status=$?
[ "$status" -eq 0 ] || die "generation failed, ${DEST} was left unchanged"

# The renderer runs in a subshell, so its warnings are counted here.
while IFS= read -r line; do
  [ -n "$line" ] || continue
  WARNINGS=$((WARNINGS + 1))
  echo "${PROG}: ${line}" >&2
done < "${TMPDIR}/warnings"

expected=$(
  "$PYTHON" -c '
import json, sys
p = json.load(open(sys.argv[1]))["provider_schemas"]["registry.terraform.io/plakarkorp/plakar"]
print(len(p.get("resource_schemas") or {}) + len(p.get("data_source_schemas") or {}))
' "${TMPDIR}/schema.json"
)
found=$(cat "$STAGE"/*.md | grep -cE '^## (Resource|Data Source)$')
[ "$found" -eq "$expected" ] ||
  die "the schema holds ${expected} resources and data sources, ${found} sections were written"

# The directory is generated whole, so pages for removed resources go with it.
rm -rf "$DEST" "${OUTDIR}/terraform-provider.md" || die "could not remove the previous pages"
mv "$STAGE" "$DEST" || die "could not write ${DEST}"

# Formatted in place: outside the repository prettier misses its configuration.
if npx --no-install prettier --write "$DEST" >/dev/null; then
  :
else
  warn "prettier is not installed here, the pages are unformatted and will fail the repository format check, run 'npm install' and retry"
fi

pages=$(ls "$DEST"/*.md | wc -l | tr -d ' ')
# prettier pads the cells, so the header is matched loosely.
tables=$(cat "$DEST"/*.md | grep -cE '^\| *(Argument|Attribute) *\| *Type *\|')
echo "${PROG}: wrote ${DEST} (${pages} pages, ${found} sections, ${tables} schema tables, ${WARNINGS} warnings)"

[ "$WARNINGS" -eq 0 ] || echo "${PROG}: review the warnings above before committing" >&2
