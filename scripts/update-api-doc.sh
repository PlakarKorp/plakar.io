#!/bin/sh

BASE_URL=${1:-http://localhost:8080}
API_VERSION=${2:-v1}
PYTHON=${PYTHON:-python3}

PROG=$(basename "$0")

die() {
  echo "${PROG}: error: $*" >&2
  exit 1
}

command -v curl >/dev/null 2>&1 || die "curl is required"
command -v "$PYTHON" >/dev/null 2>&1 || die "${PYTHON} is required, set PYTHON to override"

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
DEST="${SCRIPT_DIR}/../data/openapi/${API_VERSION}.json"
URL="${BASE_URL%/}/swagger/openapi.json"

curl -fsS "$URL" -o "${TMPDIR}/openapi.json" 2>"${TMPDIR}/curl.err" ||
  die "could not fetch ${URL}: $(cat "${TMPDIR}/curl.err")"

# Sorted keys and a fixed indent keep the diff between two refreshes down to
# what actually changed in the API.
"$PYTHON" - "${TMPDIR}/openapi.json" "${TMPDIR}/normalized.json" <<'PY' || die "${URL} did not return a usable OpenAPI 3 document"
import json
import sys

with open(sys.argv[1]) as f:
  spec = json.load(f)

if not str(spec.get("openapi", "")).startswith("3."):
  sys.exit("not an OpenAPI 3 document")
for key in ("info", "paths", "tags"):
  if key not in spec:
    sys.exit("missing top-level key: " + key)

with open(sys.argv[2], "w") as f:
  json.dump(spec, f, indent=2, sort_keys=True, ensure_ascii=False)
  f.write("\n")

print("{} {}, {} paths".format(
  spec["info"].get("title", ""), spec["info"].get("version", ""),
  len(spec["paths"])))
PY

mkdir -p "$(dirname "$DEST")" || die "could not create $(dirname "$DEST")"
mv "${TMPDIR}/normalized.json" "$DEST" || die "could not write ${DEST}"
npx --no-install prettier --log-level warn --write "$DEST" ||
  die "prettier failed on ${DEST}"

echo "${PROG}: wrote ${DEST}"
