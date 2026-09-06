---
title: "Managing packages"
date: "2026-04-10T00:00:00Z"
weight: 8
summary: "How to install, upgrade, and remove Plakar integration packages."
aliases:
  - /docs/v1.0.6/guides/managing-packages/
---

# Managing packages

Integration packages extend Plakar with connectors for cloud storage providers,
databases, and other systems. This guide covers the full lifecycle of a package:
installing, listing, upgrading, and removing.

Plakar ships intentionally clean with only base connectors such as the
filesystem connector. Plakar can be extended using integrations such as S3,
SFTP, PostgreSQL, or any other integration only when you need it, keeping the
base install small and dependency-free.

Integrations are also versioned independently from Plakar itself, so you can pin
a connector to a specific version or upgrade it without touching the rest of
your setup.

## List installed packages

To see which packages are currently installed:

```bash
$ plakar pkg list
```

## List available packages

Rather than what is installed, `-available` shows the prebuilt packages that can
be installed on the current system, which is how you discover what a given
platform and architecture can run before installing anything:

```bash
$ plakar pkg show -available
```

## Install a package

### Pre-built package

Pre-built packages are hosted on Plakar's infrastructure and require you to be
logged in to download them. To log in:

```bash
$ plakar login
```

> [!NOTE]+ Passphrase
>
> In v1.0.6 and below, only interactive login is supported. Non-interactive and
> token-based login are available from v1.1.0 and above.

Once logged in, install a package by name from the official plugin registry
(e.g. the S3 integration):

```bash
$ plakar pkg add s3
```

### Building from source

If you are not logged in or prefer not to use pre-built packages, you can build
packages locally with `plakar pkg build`. This compiles the integration from its
public repository, so it does not require a Plakar account.

```bash
$ plakar pkg build s3
```

On success, a `.ptar` archive is generated in the current directory. Install it
with:

```bash
$ plakar pkg add ./s3_v1.0.0_darwin_arm64.ptar
```

### Source availability

Community integrations are open source, which is what makes both installation
methods possible: a pre-built package, or a local build from the public
repository. Control Plane integrations are closed source, but some of them are
distributed to Community users as well, as pre-built packages only. The Windows
VSS and Microsoft SQL Server connectors are the current examples.

Once installed, these behave like any other package, and they are free to
install with a Plakar account. The difference is that `plakar pkg build` cannot
produce them, since there is no public source to compile, so installing the
pre-built package is the only option.

## Upgrade a package

To upgrade to the latest available version, remove the existing package and
reinstall it:

```bash
$ plakar pkg rm s3
$ plakar pkg add s3
```

Upgrading preserves existing store, source, and destination configurations.

## Remove a package

```bash
$ plakar pkg rm s3
```
