---
title: "Managing packages"
date: "2026-04-10T00:00:00Z"
weight: 9
summary: "How to install, upgrade, and remove Plakar integration packages."
---

# Managing packages

Integration packages extend Plakar with connectors for cloud storage providers, databases, and other systems. This guide covers the full lifecycle of a package: installing, listing, upgrading, and removing.

Plakar ships intentionally clean with only base connectors such as the filesystem connector. Plakar can be extended using integrations such as S3, SFTP, PostgreSQL, or any other integration only when you need it, keeping the base install small and dependency-free.

Integrations are also versioned independently from Plakar itself, so you can pin a connector to a specific version or upgrade it without touching the rest of your setup.

## List installed packages

To see which packages are currently installed:

```bash
$ plakar pkg list
```

## Install a package

### Pre-built package

Pre-built packages are hosted on Plakar's infrastructure and require you to be logged in to download them. If you are not logged in, `plakar pkg add` will fail with an authentication error.

To log in:

```bash
$ plakar login
```

For CI pipelines or automated environments where interactive login is not possible, see [Logging In to Plakar](../../guides/logging-in-to-plakar/#non-interactive-login).

Once logged in, install a package by name from the official plugin registry (e.g. the S3 integration):

```bash
$ plakar pkg add s3
```

To install a specific version:

```bash
$ plakar pkg add s3@v1.0.0
```

### Building from source

If you are not logged in or prefer not to use pre-built packages, you can build packages locally with `plakar pkg build`. This does not require a Plakar account but does require a working Go toolchain and `make`.

```bash
$ plakar pkg build s3
```

On success, a `.ptar` archive is generated in the current directory. Install it with:

```bash
$ plakar pkg add ./s3_v1.0.0_darwin_arm64.ptar
```

## Upgrade a package

To upgrade a specific package to the latest available version:

```bash
$ plakar pkg add -u s3
```

To upgrade all installed packages at once:

```bash
$ plakar pkg add -u
```

Upgrading preserves existing store, source, and destination configurations.

## Remove a package

```bash
$ plakar pkg rm s3
```
