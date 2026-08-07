#!/bin/sh

REF=${1:-main}

tempfoo=$(basename "$0")
TMPDIR=$(mktemp -d /tmp/${tempfoo}.XXXXXX) || exit 1

onexit() {
  rm -rf "$TMPDIR"
  exit 0
}
trap 'onexit' EXIT INT TERM

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

git clone --depth 1 https://github.com/PlakarKorp/plakar-operator.git -b "${REF}" "${TMPDIR}" || { echo "Clone failed for ref '${REF}'"; exit 1; }

SRC="${TMPDIR}/docs/api-reference.md"
if [ ! -f "$SRC" ]; then
  echo "docs/api-reference.md not found in plakar-operator @ ${REF}"
  exit 1
fi

OUTDIR="${SCRIPT_DIR}/../content/docs/control-plane/references"
mkdir -p "${OUTDIR}"
DEST="${OUTDIR}/kubernetes-operator.md"

echo "generating Kubernetes operator API reference (ref: ${REF})"

{
  cat <<EOF
---
title: "Kubernetes Operator"
date: "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
weight: 1
summary: "Field-by-field reference for every custom resource defined by plakar-operator."
---

# Kubernetes Operator API reference

This page lists every field on every custom resource defined by
[plakar-operator](https://github.com/PlakarKorp/plakar-operator). For an
introduction to what these resources are and how to use them, see
[Kubernetes Operator](../../infrastructure-as-code/kubernetes-operator).

EOF

  # Drop the source file's own Jekyll front matter and its "# API Reference"
  # title, since Hugo front matter above already supplies both.
  awk '
    BEGIN { fm = 0 }
    /^---$/ { fm++; next }
    fm < 2 { next }
    /^# API Reference$/ { next }
    { print }
  ' "$SRC"
} > "$DEST"

npx --no-install prettier --write "$DEST"

echo "wrote ${DEST}"
