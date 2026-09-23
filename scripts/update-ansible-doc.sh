#!/bin/sh
#
# Regenerates content/docs/control-plane/references/ansible-collection.md from
# the plakarkorp.plakar Ansible collection, as reported by `ansible-doc --json`.
#
# Usage: scripts/update-ansible-doc.sh [ref]
#        PLAKAR_ANSIBLE_DIR=<path> scripts/update-ansible-doc.sh
#
# The first form clones the collection at a ref. The second reads a collection
# already on disk, which is how the page is generated from the released one:
#
#   ansible-galaxy collection install plakarkorp.plakar -p /tmp/collections
#   PLAKAR_ANSIBLE_DIR=/tmp/collections scripts/update-ansible-doc.sh

REPO=${PLAKAR_ANSIBLE_REPO:-https://github.com/PlakarKorp/ansible-collection-plakar.git}
REF=${1:-main}
PYTHON=${PYTHON:-python3}
ANSIBLE_DOC=${ANSIBLE_DOC:-ansible-doc}
SRCROOT=${PLAKAR_ANSIBLE_DIR:-}

COLLECTION=plakarkorp.plakar
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

command -v "$ANSIBLE_DOC" >/dev/null 2>&1 ||
  die "${ANSIBLE_DOC} is required: install ansible-core ('brew install ansible'), or set ANSIBLE_DOC"
command -v "$PYTHON" >/dev/null 2>&1 || die "${PYTHON} is required, set PYTHON to override"
[ -n "$SRCROOT" ] || command -v git >/dev/null 2>&1 || die "git is required"

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

if [ -n "$SRCROOT" ]; then
  [ -d "$SRCROOT" ] || die "PLAKAR_ANSIBLE_DIR=${SRCROOT} is not a directory"
  [ -d "${SRCROOT}/ansible_collections/plakarkorp/plakar" ] ||
    die "no ansible_collections/plakarkorp/plakar under ${SRCROOT}: install it there with 'ansible-galaxy collection install ${COLLECTION} -p ${SRCROOT}'"
  ORIGIN="$SRCROOT"
else
  CLONE="${TMPDIR}/ansible_collections/plakarkorp/plakar"
  mkdir -p "$CLONE" || die "could not create ${CLONE}"
  git clone --depth 1 "$REPO" -b "$REF" "$CLONE" ||
    die "could not clone ${REPO} at ref '${REF}'"
  SRCROOT="$TMPDIR"
  ORIGIN="${REPO} @ ${REF}"
fi

ANSIBLE_COLLECTIONS_PATH="$SRCROOT"
export ANSIBLE_COLLECTIONS_PATH

# Naming the modules in the dump below keeps the page's contents decided here
# rather than by whatever else is installed alongside the collection.
MODULES=$("$ANSIBLE_DOC" -l "$COLLECTION" --json 2>"${TMPDIR}/list.err" |
  "$PYTHON" -c 'import json, sys; print("\n".join(sorted(json.load(sys.stdin))))') ||
  die "could not list the modules of ${COLLECTION}: $(cat "${TMPDIR}/list.err")"

[ -n "$MODULES" ] ||
  die "${COLLECTION} exposes no modules in ${ORIGIN}, nothing to generate"

N_MODULES=$(printf '%s\n' "$MODULES" | grep -c .)

OUTDIR="${SCRIPT_DIR}/../content/docs/control-plane/references"
mkdir -p "$OUTDIR" || die "could not create ${OUTDIR}"
DEST="${OUTDIR}/ansible-collection.md"

echo "${PROG}: generating from ${ORIGIN}: ${N_MODULES} modules"

# shellcheck disable=SC2086
"$ANSIBLE_DOC" --json $MODULES > "${TMPDIR}/doc.json" 2>"${TMPDIR}/doc.err" ||
  die "ansible-doc failed: $(cat "${TMPDIR}/doc.err")"

"$PYTHON" - "${TMPDIR}/doc.json" > "$DEST" 2> "${TMPDIR}/warnings" <<'PY'
import json
import pathlib
import re
import sys


def warn(message):
  print("warning: " + message, file=sys.stderr)


# Ansible's semantic markup, which ansible-doc passes through: C(code),
# O(option), V(value), E(ENVVAR), M(module), B(bold), L(text, url) and so on.
MARKUP = re.compile(r"\b(C|O|V|E|RV|M|B|I|U|L|R)\(([^()]*(?:\([^()]*\)[^()]*)*)\)")


def markup(text):
  def replace(match):
    kind, body = match.group(1), match.group(2)
    body = " ".join(body.split())
    if kind in ("C", "O", "V", "E", "RV", "M"):
      return "`%s`" % body
    if kind == "B":
      return "**%s**" % body
    if kind == "I":
      return "_%s_" % body
    if kind == "U":
      return body
    head, _, tail = body.rpartition(",")
    if not head:
      return body
    head, tail = head.strip(), tail.strip()
    return "[%s](%s)" % (head, tail) if kind == "L" else head

  return MARKUP.sub(replace, text)


def paragraphs(value):
  if value is None:
    return []
  if isinstance(value, str):
    values = [value]
  elif isinstance(value, list):
    values = [str(v) for v in value]
  else:
    values = [str(value)]
  return [markup(v.strip()) for v in values if v.strip()]


def cell(text):
  return " ".join(str(text).split()).replace("|", "\\|")


def literal(value):
  if isinstance(value, bool):
    return "true" if value else "false"
  return str(value)


def typename(spec):
  name = spec.get("type", "str")
  elements = spec.get("elements")
  if name == "list" and elements:
    return "list of %s" % elements
  return name


def describe(spec):
  text = " ".join(paragraphs(spec.get("description")))
  values = spec.get("choices")
  if values:
    if isinstance(values, dict):
      values = list(values)
    choices = ", ".join("`%s`" % literal(v) for v in values)
    text = (text + " One of " + choices).strip() + "."
  return text


def option_rows(options, out, prefix=""):
  nested = []
  out.append("| Option | Type | Required | Default | Description |")
  out.append("| --- | --- | --- | --- | --- |")
  for name in sorted(options):
    spec = options[name] or {}
    if not isinstance(spec, dict):
      warn("option %s%s: expected a mapping, left undocumented" % (prefix, name))
      continue
    default = spec.get("default")
    out.append(
      "| `%s` | %s | %s | %s | %s |"
      % (
        cell(name),
        cell(typename(spec)),
        "Yes" if spec.get("required") else "No",
        "`%s`" % cell(literal(default)) if default is not None else "",
        cell(describe(spec)),
      )
    )
    if isinstance(spec.get("suboptions"), dict):
      nested.append((name, spec["suboptions"]))

  for name, suboptions in nested:
    out.append("")
    out.append("**Suboptions of `%s%s`**" % (prefix, name))
    out.append("")
    option_rows(suboptions, out, prefix="%s%s." % (prefix, name))


def return_rows(values, out, prefix=""):
  nested = []
  out.append("| Key | Type | Returned | Description |")
  out.append("| --- | --- | --- | --- |")
  for name in sorted(values):
    spec = values[name] or {}
    if not isinstance(spec, dict):
      warn("return %s%s: expected a mapping, left undocumented" % (prefix, name))
      continue
    out.append(
      "| `%s` | %s | %s | %s |"
      % (
        cell(name),
        cell(typename(spec)),
        cell(markup(str(spec.get("returned", "")))),
        cell(describe(spec)),
      )
    )
    if isinstance(spec.get("contains"), dict):
      nested.append((name, spec["contains"]))

  for name, contains in nested:
    out.append("")
    out.append("**Keys of `%s%s`**" % (prefix, name))
    out.append("")
    return_rows(contains, out, prefix="%s%s." % (prefix, name))


def note(text, out):
  out.append("> [!NOTE]")
  out.append(">")
  out.append("> " + text)
  out.append("")


def render(fqcn, entry, shared_notes, out):
  doc = entry.get("doc")
  if not isinstance(doc, dict):
    warn("%s: ansible-doc returned no doc section, module skipped" % fqcn)
    return False

  out.append("### %s" % (doc.get("module") or fqcn.rsplit(".", 1)[-1]))
  out.append("")

  short = doc.get("short_description")
  if short:
    short = markup(str(short).strip())
    out.append(short if short.endswith(".") else short + ".")
    out.append("")
  else:
    warn("%s: no short_description" % fqcn)

  for paragraph in paragraphs(doc.get("description")):
    out.append(paragraph)
    out.append("")

  options = doc.get("options")
  if isinstance(options, dict) and options:
    out.append("**Options**")
    out.append("")
    option_rows(options, out)
    out.append("")
  elif options:
    warn("%s: options is not a mapping, no table generated" % fqcn)
  else:
    out.append("This module takes no options.")
    out.append("")

  returns = entry.get("return")
  if isinstance(returns, dict) and returns:
    out.append("**Returns**")
    out.append("")
    return_rows(returns, out)
    out.append("")

  for text in paragraphs(doc.get("notes")):
    if text not in shared_notes:
      note(text, out)

  return True


entries = json.loads(pathlib.Path(sys.argv[1]).read_text())
out = []
rendered = 0

# A note every module carries comes from the collection's doc fragment and
# describes the collection, so it is written once instead of sixteen times.
per_module = [
  set(paragraphs(((entries[fqcn] or {}).get("doc") or {}).get("notes")))
  for fqcn in entries
]
shared_notes = set.intersection(*per_module) if per_module else set()

for text in sorted(shared_notes):
  note(text, out)

for fqcn in sorted(entries):
  if render(fqcn, entries[fqcn] or {}, shared_notes, out):
    rendered += 1

if rendered == 0:
  warn("no module produced any documentation")

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
title: "Ansible Collection"
date: "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
weight: 3
summary: "Option-by-option reference for every module in the plakarkorp.plakar Ansible collection."
---

# Ansible collection reference

This page lists every option of every module in the \`plakarkorp.plakar\`
Ansible collection. For an introduction to what these modules do and how a
playbook uses them, see
[Ansible Collection](../../infrastructure-as-code/ansible).

Module names are written in full in a playbook. The \`backup\` module below is
\`plakarkorp.plakar.backup\` in a task.

## Modules

EOF
  cat "$BODY"
} > "$DEST" || die "could not write ${DEST}"

found=$(grep -c '^### ' "$DEST")
[ "$found" -eq "$N_MODULES" ] ||
  warn "ansible-doc listed ${N_MODULES} modules but ${found} sections were written, some produced nothing"
[ "$found" -gt 0 ] || die "generated page documents no module"

grep -q '^## Modules$' "$DEST" || die "generated page has no Modules section"

if npx --no-install prettier --write "$DEST"; then
  :
else
  warn "prettier is not installed here, ${DEST} is unformatted and will fail the repository format check, run 'npm install' and retry"
fi

# prettier pads the cells, so the header is matched loosely.
tables=$(grep -cE '^\| *Option *\| *Type *\| *Required *\|' "$DEST")
echo "${PROG}: wrote ${DEST} (${found} modules, ${tables} option tables, ${WARNINGS} warnings)"

[ "$WARNINGS" -eq 0 ] || echo "${PROG}: review the warnings above before committing" >&2
