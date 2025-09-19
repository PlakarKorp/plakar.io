---
title: "Plakar v1.0.2"
type: "download"
layout: "single"
version: "v1.0.2"
summary: "Installation instructions for Plakar v1.0.2 (no official binaries; install via Go toolchain)."
description: "How to install and use Plakar v1.0.2 when only source-based installation via go install was available."
release_notes_url: "https://github.com/PlakarKorp/plakar/releases/tag/v1.0.2"
tests_status_url: "https://github.com/PlakarKorp/plakar/actions"
---

## About this Release

Plakar **v1.0.2** predates the introduction of official binary packages (tarballs, deb, apk, etc.).  
Installation was only supported via the Go toolchain. If you need pre-built artifacts, upgrade to a later version (e.g. v1.0.4 or newer).

## Install Using Go

You need a recent Go toolchain (Go 1.23.3 or later recommended).

```bash
go install github.com/PlakarKorp/plakar@v1.0.2
```

By default the binary is placed in `~/go/bin`. Ensure it is on your PATH:

```bash
export PATH="$PATH:~/go/bin"
```

Verify:

```bash
plakar version
# Expected: v1.0.2
```

## Platform Requirements

| Component | Requirement |
|----------|-------------|
| Go toolchain | 1.23.3+ |
| Network (optional) | For remote repositories (SFTP, object storage) |
| Build tools | Only Go (no C toolchain needed) |

If Go is missing:

```bash
# macOS (Homebrew)
brew install go

# Debian / Ubuntu
sudo apt-get update && sudo apt-get install -y ca-certificates golang

# OpenBSD
doas pkg_add go
```

## What You Do NOT Get in v1.0.2

- No official checksummed binaries
- No package repositories (APT / RPM / APK)
- No pre-built integration bundles
- No automated upgrade script

If you need those, pick a later version from the version selector.

## Basic Usage Recap

Create a repository:

```bash
plakar at ~/backups create
```

Run a backup:

```bash
plakar at ~/backups backup /etc
```

List snapshots:

```bash
plakar at ~/backups ls
```

Restore:

```bash
plakar at ~/backups restore -to /tmp/restore <snapshot-id>
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `plakar: command not found` | Add `~/go/bin` to PATH |
| Wrong version after install | Run `go clean -cache -modcache` then reinstall |
| Slow first command | Start the agent: `plakar agent` |

## Security Note

Your repository passphrase is **not recoverable**. Store it safely.  
If you later adopt multiple repositories or remote sync, rotate passphrases and document procedures.

## Next Steps

- Read the Quickstart for this historical version (concepts still apply).
- Plan migration to a newer release to benefit from packaging and integrations.

---
*This page intentionally reflects the historical state of v1.0.2 for users maintaining legacy environments.*
