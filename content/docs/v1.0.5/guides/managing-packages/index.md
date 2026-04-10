---
title: Managing packages
summary: How to install, upgrade, and remove Plakar integration packages.
date: "2026-04-10T00:00:00Z"
weight: 9
---

Integration packages extend Plakar with connectors for cloud storage providers, databases, and other systems. This guide covers the full lifecycle of a package: installing, listing, upgrading, and removing.

## List installed packages

To see which packages are currently installed:

```bash
$ plakar pkg list
```

## Install a package

### Pre-built package

Install a package by name from the official plugin registry, (e.g s3 integration):

```bash
$ plakar pkg add s3
```

**Note:** Fetching pre-built packages requires a Plakar account. See [Logging In to Plakar](../../guides/logging-in-to-plakar/).

### Local archive

If you built the package from source or have a `.ptar` file on hand, pass the path directly:

```bash
$ plakar pkg add ./s3_v1.0.0_darwin_arm64.ptar
```

This does not require a Plakar account.

## Upgrade a package

To upgrade to the latest available version, remove the existing package and reinstall it:

```bash
$ plakar pkg rm s3
$ plakar pkg add s3
```

Upgrading preserves existing store, source, and destination configurations.

## Remove a package

```bash
$ plakar pkg rm s3
```
