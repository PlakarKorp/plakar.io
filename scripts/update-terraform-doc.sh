#!/bin/sh
#
# Regenerates content/docs/control-plane/references/terraform-provider.md from
# the tfplugindocs output in PlakarKorp/terraform-provider-plakar.
#
# The transformation below depends on the shape of that output. When the
# provider changes it, this script warns rather than writing a page that looks
# right and is not, and fails outright when the result cannot be trusted at
# all. Read the warnings: each one names the file and the line that no longer
# matches what this script expects.
#
# Usage: scripts/update-terraform-doc.sh [ref]

# PLAKAR_TF_REPO points the generator at a local clone or a fork, which is how
# a change to this script is tested against modified tfplugindocs output.
REPO=${PLAKAR_TF_REPO:-https://github.com/PlakarKorp/terraform-provider-plakar.git}
REF=${1:-main}

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

command -v git >/dev/null 2>&1 || die "git is required"

TMPDIR=$(mktemp -d "/tmp/${PROG}.XXXXXX") || die "could not create a temporary directory"

# Preserve the exit status. A cleanup trap that exits 0 would report success
# for every failure below.
cleanup() {
  status=$?
  rm -rf "$TMPDIR"
  exit $status
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

git clone --depth 1 "$REPO" -b "$REF" "$TMPDIR" ||
  die "could not clone ${REPO} at ref '${REF}'"

SRCDIR="${TMPDIR}/docs"
[ -d "$SRCDIR" ] || die "no docs/ directory in terraform-provider-plakar @ ${REF}, tfplugindocs output is expected there"
[ -f "${SRCDIR}/index.md" ] || die "docs/index.md not found in terraform-provider-plakar @ ${REF}"

# An empty glob would otherwise be emitted as a literal path.
RESOURCES=$(find "${SRCDIR}/resources" -name '*.md' 2>/dev/null | sort)
DATASOURCES=$(find "${SRCDIR}/data-sources" -name '*.md' 2>/dev/null | sort)
[ -n "$RESOURCES" ] || die "no resource pages in docs/resources/, nothing to generate"
[ -n "$DATASOURCES" ] || warn "no data source pages in docs/data-sources/"

N_RESOURCES=$(printf '%s\n' "$RESOURCES" | grep -c .)
N_DATASOURCES=$(printf '%s\n' "$DATASOURCES" | grep -c . || true)

OUTDIR="${SCRIPT_DIR}/../content/docs/control-plane/references"
mkdir -p "$OUTDIR" || die "could not create ${OUTDIR}"
DEST="${OUTDIR}/terraform-provider.md"

echo "${PROG}: generating from ${REF}: ${N_RESOURCES} resources, ${N_DATASOURCES} data sources"

# Drop the source file's front matter and the tfplugindocs markers, then push
# every heading down two levels so the page keeps a single H1 of its own.
#
# Three exceptions keep the page off H5, which the theme renders at body size,
# leaving those headings indistinguishable from the text around them.
# "Required", "Optional" and "Read-Only" label the list right below them
# rather than opening a section, so they become bold text, matching the plain
# "Optional:" labels tfplugindocs already writes inside nested schema blocks.
# The "Schema" heading above them is then redundant and is dropped. "Nested
# Schema for x" moves down one level instead of two, which keeps it visible as
# a heading next to the example it qualifies.
#
# Every schema entry tfplugindocs writes has the same shape, a name, a type
# and an optional description, so each run of them becomes a table. A run that
# holds an entry in any other shape is left as the original list and reported.
#
# Lines inside fenced code blocks are left alone: a `#` there is a comment in
# the example, not a heading.
emit() {
  awk -v file="$(basename "$1")" '
    function warn(msg) { print "warning: " file ": " msg > "/dev/stderr" }

    function reset(   i) { for (i = 1; i <= n; i++) delete buf[i]; n = 0 }

    # Split "- `name` (Type) description" into its three parts. Returns 0 when
    # the line is a list item of any other shape.
    function parse(line,   rest, tick, paren) {
      if (substr(line, 1, 3) != "- `") return 0
      rest = substr(line, 4)
      tick = index(rest, "`")
      if (tick == 0) return 0
      pname = substr(rest, 1, tick - 1)
      rest = substr(rest, tick + 1)
      if (substr(rest, 1, 2) != " (") return 0
      paren = index(rest, ")")
      if (paren == 0) return 0
      ptype = substr(rest, 3, paren - 3)
      pdesc = substr(rest, paren + 1)
      sub(/^ +/, "", pdesc)
      return 1
    }

    function flush(   i, head) {
      if (n == 0) return
      head = (label == "Read-Only") ? "Attribute" : "Argument"
      if (tabular) {
        tables++
        print "| " head " | Type | Description |"
        print "| --- | --- | --- |"
        for (i = 1; i <= n; i++) print rows[i]
      } else {
        for (i = 1; i <= n; i++) print buf[i]
      }
      reset()
      tabular = 1
    }

    BEGIN {
      fm = 0; fence = 0; n = 0; tabular = 1
      label = ""; tables = 0; entries = 0; sawschema = 0; title = 0
    }

    /^---$/ { if (fence == 0) { fm++; next } }
    fm < 2 { next }
    /^```/ { flush(); fence = !fence; print; next }
    fence { print; next }

    /^- / {
      n++
      buf[n] = $0
      if (parse($0)) {
        entries++
        gsub(/\|/, "\\|", pdesc)
        rows[n] = "| `" pname "` | " ptype " | " pdesc " |"
      } else {
        if (tabular) warn("schema entry not recognised, group left as a list: " $0)
        tabular = 0
      }
      next
    }

    { flush() }

    /^<!-- schema generated by tfplugindocs -->$/ { next }
    /^## Schema$/ { sawschema = 1; next }
    /^### (Required|Optional|Read-Only)$/ {
      sub(/^### /, "")
      label = $0
      print "**" $0 "**"
      next
    }
    /^(Required|Optional|Read-Only):$/ { label = substr($0, 1, length($0) - 1) }
    /^### Nested Schema for / { print "#" $0; next }
    /^# / { title++ }
    /^#### / { warn("heading is deeper than this script rewrites: " $0) }
    /^#/ { print "##" $0; next }
    { print }

    END {
      flush()
      if (fence) warn("code fence left open at end of file")
      if (title != 1) warn("expected exactly one H1, found " title)
      if (sawschema && entries == 0) warn("a Schema section produced no entries, the schema format has probably changed")
      if (tables == 0 && sawschema) warn("no tables were generated")
    }
  ' "$1"
}

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
in the \`plakarkorp/plakar\` Terraform provider. For an introduction to what
these resources are and how to use them, see
[Terraform Provider](../../infrastructure-as-code/terraform).

## Provider
EOF

  # The provider page's own title duplicates the section heading above it.
  emit "${SRCDIR}/index.md" | grep -v '^### plakar Provider$'

  echo
  echo "## Resources"
  echo

  for f in $RESOURCES; do
    emit "$f"
    echo
  done

  echo "## Data sources"
  echo

  for f in $DATASOURCES; do
    emit "$f"
    echo
  done
} > "$DEST" 2> "${TMPDIR}/warnings" || die "generation failed, ${DEST} may be incomplete"

# emit() runs in a subshell, so its warnings are collected here rather than
# counted as they are produced.
while IFS= read -r line; do
  [ -n "$line" ] || continue
  WARNINGS=$((WARNINGS + 1))
  echo "${PROG}: ${line}" >&2
done < "${TMPDIR}/warnings"

# The page is only useful if every source file made it through, so check the
# result rather than trusting the pipeline above.
[ -s "$DEST" ] || die "generated ${DEST} is empty"

expected=$((N_RESOURCES + N_DATASOURCES))
found=$(grep -c '^### ' "$DEST")
[ "$found" -eq "$expected" ] ||
  die "expected ${expected} resource and data source sections, found ${found} in ${DEST}"

grep -q '^## Resources$' "$DEST" || die "generated page has no Resources section"
if deep=$(grep -n '^##### ' "$DEST"); then
  warn "headings below H4 survived, the theme renders them at body size:
${deep}"
fi

if npx --no-install prettier --write "$DEST"; then
  :
else
  warn "prettier is not installed here, ${DEST} is unformatted and will fail the repository format check, run 'npm install' and retry"
fi

tables=$(grep -cE '^\| *(Argument|Attribute) *\| *Type *\|' "$DEST")
echo "${PROG}: wrote ${DEST} (${expected} sections, ${tables} schema tables, ${WARNINGS} warnings)"

[ "$WARNINGS" -eq 0 ] || echo "${PROG}: review the warnings above before committing" >&2
