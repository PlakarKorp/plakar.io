#!/bin/sh

PROG=$(basename "$0")

die() {
  echo "${PROG}: error: $*" >&2
  exit 1
}

BASE_URL=$1
TOKEN=$2
API_VERSION=${3:-v1}
PYTHON=${PYTHON:-python3}

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

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${ROOT_DIR}/static/openapi/${API_VERSION}.json"
URL="${BASE_URL%/}/swagger/openapi.json"

# The document requires authentication. An API key is first exchanged for a
# badge, anything else is sent as a badge. Credentials go through files so that
# curl never shows them in the process list.
case $TOKEN in
pcp_ak_*)
  LOGIN_URL="${BASE_URL%/}/api/v1/auth/login/apikey"
  "$PYTHON" -c 'import json, sys; print(json.dumps({"api_key": sys.argv[1]}))' \
    "$TOKEN" >"${TMPDIR}/login.json" || die "could not encode the API key"
  curl -fsS -X POST "$LOGIN_URL" -H "Content-Type: application/json" \
    --data @"${TMPDIR}/login.json" -o "${TMPDIR}/login-response.json" \
    2>"${TMPDIR}/curl.err" ||
    die "could not log in at ${LOGIN_URL}: $(cat "${TMPDIR}/curl.err")"
  BADGE=$("$PYTHON" -c 'import json, sys; print(json.load(open(sys.argv[1]))["token"])' \
    "${TMPDIR}/login-response.json") || die "${LOGIN_URL} did not return a badge"
  ;;
*)
  BADGE=$TOKEN
  ;;
esac
printf 'Authorization: Bearer %s\n' "$BADGE" >"${TMPDIR}/headers"

curl -fsS -H @"${TMPDIR}/headers" "$URL" -o "${TMPDIR}/openapi.json" \
  2>"${TMPDIR}/curl.err" ||
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

# The instance serves the document with a relative server URL, which would
# resolve to plakar.io once published there. Each user reaches the API on the
# host of their own instance instead.
spec["servers"] = [{
  "url": "https://{host}",
  "description": "Your Plakar Control Plane instance",
  "variables": {
    "host": {
      "default": "pcp.example.com",
      "description": "Host name or address of your instance, as reached from your network",
    },
  },
}]

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
