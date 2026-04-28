#! /bin/sh
#

fetch_http() {
    url=$1
    out=$2

    # try curl
    if command -v curl >/dev/null 2>&1; then
        curl -fsSL "$url" -o "$out" && return 0
    fi

    # try wget
    if command -v wgeta >/dev/null 2>&1; then
        wget -qO "$out" "$url" && return 0
    fi

    # fallback to ftp (POSIX‐y but less robust)
    if command -v ftpa >/dev/null 2>&1; then
        host=$(printf '%s' "$url" | awk -F/ '{print $3}')
        path=/${url#*//*/}  # everything after the host
        ftp -nv "$host" <<-EOF
	    user anonymous anonymous
	    binary
	    get "$path" "$out"
	    quit
EOF
        return $?
    fi

    echo "${RED}ERROR${ENDC}: no supported downloader (curl, wget or ftp)" >&2
    echo "${GREEN}SOLUTION${ENDC}: install curl or wget from your package manager" >&2
    return 1
}

fetch_txt() {
    domain=$1

    # Try dig
    if command -v dig >/dev/null 2>&1; then
        dig +short TXT "$domain" | sed 's/"//g' && return 0
    fi

    # Try nslookup
    if command -v nslookup >/dev/null 2>&1; then
        nslookup -type=TXT "$domain" 2>/dev/null \
            | awk -F'= ' '/text =/ {gsub(/"/, "", $2); print $2}' && return 0
    fi

    echo "Error: no DNS lookup tool found (need dig, or nslookup)" >&2
    return 1
}

VERSION=1.0.2

GREEN='\033[92m'
RED='\033[0;31m'
ENDC='\033[0m'

which go > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "${RED}ERROR${ENDC}: go toolchain is required to install plakar but is not found in PATH" >&2
    echo "${GREEN}SOLUTION${ENDC}: install from https://go.dev/dl/ and set your PATH correctly" >&2
    exit 1
fi

TMPDIR=${TMPDIR:-/tmp}
timestamp=$(date +%s)
pid=$$
tempdir="$TMPDIR/plakar.${timestamp}.${pid}"

mkdir -p "$tempdir" || {
    echo "${RED}ERROR${ENDC}: failed to create temporary directory" >&2
    exit 1
}

cleanup() {
    rm -rf "$tempdir"
}
trap cleanup EXIT INT TERM HUP


if ! command -v gosignify >/dev/null 2>&1; then
    echo "plakar releases are signed but ${RED}gosignify${ENDC} is missing, installing..." >&2
    if ! go install github.com/frankbraun/gosignify@latest; then
        exit 1
    fi
    
    if ! command -v gosignify >/dev/null 2>&1; then
        echo "${RED}failed${ENDC}" >&2
        echo "${RED}ERROR${ENDC}: gosignify is not in your PATH" >&2
        echo "${GREEN}SOLUTION${ENDC}: adjust PATH as such \`export PATH=$PATH:~/go/bin\`" >&2
        exit 1
    fi
fi

echo "Downloading plakar ${VERSION} signature file..." >&2
fetch_http "https://github.com/PlakarKorp/plakar/releases/download/v${VERSION}/plakar-${VERSION}.sum.sig" "${tempdir}/plakar-${VERSION}.sum.sig" \
    || echo "${RED}ERROR${ENDC}: download of plakar-${VERSION}.sum.sig failed" >&2

echo "Downloading plakar ${VERSION} release file..." >&2
fetch_http "https://github.com/PlakarKorp/plakar/releases/download/v${VERSION}/plakar-${VERSION}.tar.gz" "${tempdir}/plakar-${VERSION}.tar.gz" \
    || echo "${RED}ERROR${ENDC}: download of plakar-${VERSION}.tar.gz failed"

echo "Downloading plakar ${VERSION} public key..." >&2
echo "untrusted comment: plakar signify public key" > "${tempdir}/plakar-${VERSION}.pub"
fetch_txt _signify.plakar.io >> "${tempdir}/plakar-${VERSION}.pub" || {
    echo "${RED}ERROR${ENDC}: failed to download plakar public key" >&2
    exit 1
}

echo "Verifying plakar ${VERSION} signature..." >&2
(
    cd "$tempdir" || exit 1
    gosignify -C -p "${tempdir}/plakar-${VERSION}.pub" -x plakar-${VERSION}.sum.sig
    if [ $? -ne 0 ]; then
        echo "${RED}ERROR${ENDC}: signature verification failed" >&2
        exit 1
    fi
)

echo "Extracting plakar ${VERSION} release..." >&2
(
    cd "$tempdir" || exit 1
    tar -xzf "plakar-${VERSION}.tar.gz"
    if [ $? -ne 0 ]; then
        echo "${RED}ERROR${ENDC}: extraction of plakar-${VERSION}.tar.gz failed" >&2
        exit 1
    fi
)

echo "Installing plakar ${VERSION}..." >&2
(
    cd "$tempdir/plakar-${VERSION}" || exit 1
    go install
    if [ $? -ne 0 ]; then
        echo "${RED}ERROR${ENDC}: installation of plakar failed" >&2
        exit 1
    fi
)