#!/bin/sh
#
# Regenerates content/docs/control-plane/references/terraform-provider.md from
# the schema `terraform providers schema -json` reports for the published
# plakarkorp/plakar provider, and the example files in the provider repository
# at the matching tag.
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

# The examples are files in the repository rather than part of the schema, so
# they come from the tag that matches the provider terraform just resolved.
EXAMPLES="${TMPDIR}/src/examples"
if git clone --depth 1 -q "$REPO" -b "v${RESOLVED}" "${TMPDIR}/src" 2>"${TMPDIR}/clone.err"; then
  [ -d "$EXAMPLES" ] || {
    warn "no examples/ directory at v${RESOLVED}, the page will carry no examples"
    EXAMPLES=""
  }
else
  warn "could not clone ${REPO} at v${RESOLVED}, the page will carry no examples: $(cat "${TMPDIR}/clone.err")"
  EXAMPLES=""
fi

OUTDIR="${SCRIPT_DIR}/../content/docs/control-plane/references"
mkdir -p "$OUTDIR" || die "could not create ${OUTDIR}"
DEST="${OUTDIR}/terraform-provider.md"

echo "${PROG}: generating from plakarkorp/plakar ${RESOLVED}"

"$PYTHON" - "${TMPDIR}/schema.json" "$EXAMPLES" > "$DEST" 2> "${TMPDIR}/warnings" <<'PY'
import json
import pathlib
import sys

PROVIDER = "registry.terraform.io/plakarkorp/plakar"

schema = json.loads(pathlib.Path(sys.argv[1]).read_text())
examples = pathlib.Path(sys.argv[2]) if sys.argv[2] else None
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
    out.append("#### Nested Schema for `%s`" % name)
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
    out.append("#### %s" % heading)
    out.append("")
  out.append("```%s" % language)
  out.append(body)
  out.append("```")
  out.append("")


def emit(title, block, example_dir, example_file, language):
  out.append("### %s" % title)
  out.append("")
  description = (block.get("description") or "").strip()
  if description:
    out.append(description)
    out.append("")
  else:
    warn("%s has no description" % title)
  if example_dir:
    emit_example("%s/%s" % (example_dir, example_file), language, "Example Usage")
  emit_tables(block, title)
  if example_dir:
    emit_example("%s/import.sh" % example_dir, "shell", "Import")


provider = schema.get("provider_schemas", {}).get(PROVIDER)
if provider is None:
  warn("the schema holds no %s" % PROVIDER)
  provider = {}

out.append("## Provider")
out.append("")
provider_block = (provider.get("provider") or {}).get("block") or {}
if provider_block.get("description"):
  out.append(provider_block["description"].strip())
  out.append("")
emit_example("provider/provider.tf", "terraform", "Example Usage")
emit_tables(provider_block, "provider")

resources = provider.get("resource_schemas") or {}
datasources = provider.get("data_source_schemas") or {}
if not resources:
  warn("the schema holds no resources")

out.append("## Resources")
out.append("")
for name in sorted(resources):
  emit(
    "%s (Resource)" % name,
    resources[name].get("block") or {},
    "resources/%s" % name,
    "resource.tf",
    "terraform",
  )

out.append("## Data sources")
out.append("")
for name in sorted(datasources):
  emit(
    "%s (Data Source)" % name,
    datasources[name].get("block") or {},
    "data-sources/%s" % name,
    "data-source.tf",
    "terraform",
  )

if undescribed:
  warn(
    "%d attributes carry no description in the schema, so their cells are empty: %s"
    % (len(undescribed), ", ".join(sorted(undescribed)[:5]) + ", ...")
  )

print("\n".join(out).rstrip())
PY

status=$?
[ "$status" -eq 0 ] || die "generation failed, ${DEST} may be incomplete"

# The renderer runs in a subshell, so its warnings are counted here.
while IFS= read -r line; do
  [ -n "$line" ] || continue
  WARNINGS=$((WARNINGS + 1))
  echo "${PROG}: ${line}" >&2
done < "${TMPDIR}/warnings"

[ -s "$DEST" ] || die "generated ${DEST} is empty"

BODY="${TMPDIR}/body.md"
mv "$DEST" "$BODY"

{
  cat <<EOF
---
title: "Terraform Provider"
date: "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
weight: 2
summary: "Argument-by-argument reference for every resource and data source in the plakar Terraform provider."
---

# Terraform provider reference

This page lists every argument and attribute of every resource and data source
in the \`plakarkorp/plakar\` Terraform provider, version ${RESOLVED}. For an
introduction to what these resources are and how to use them, see
[Terraform Provider](../../infrastructure-as-code/terraform).

EOF
  cat "$BODY"
} > "$DEST" || die "could not write ${DEST}"

expected=$(
  "$PYTHON" -c '
import json, sys
p = json.load(open(sys.argv[1]))["provider_schemas"]["registry.terraform.io/plakarkorp/plakar"]
print(len(p.get("resource_schemas") or {}) + len(p.get("data_source_schemas") or {}))
' "${TMPDIR}/schema.json"
)
found=$(grep -c '^### ' "$DEST")
[ "$found" -eq "$expected" ] ||
  die "the schema holds ${expected} resources and data sources, ${found} sections were written"

grep -q '^## Resources$' "$DEST" || die "generated page has no Resources section"

if npx --no-install prettier --write "$DEST"; then
  :
else
  warn "prettier is not installed here, ${DEST} is unformatted and will fail the repository format check, run 'npm install' and retry"
fi

# prettier pads the cells, so the header is matched loosely.
tables=$(grep -cE '^\| *(Argument|Attribute) *\| *Type *\|' "$DEST")
echo "${PROG}: wrote ${DEST} (${found} sections, ${tables} schema tables, ${WARNINGS} warnings)"

[ "$WARNINGS" -eq 0 ] || echo "${PROG}: review the warnings above before committing" >&2
