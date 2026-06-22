---
title: "Creating a Kloset Store"
date: "2026-03-16T00:00:00Z"
weight: 3
summary: "Create a Kloset Store on the filesystem using Plakar."
aliases:
  - /docs/v1.1.0/guides/create-kloset-repository/
---

# Creating a Kloset Store

A Kloset store is Plakar's immutable storage backend for backup data. This guide
covers filesystem-based store creation. You can learn more in the
[Kloset deep dive article](https://www.plakar.io/posts/2025-04-29/kloset-the-immutable-data-store/)

## Why you need a Kloset store

Before you can run any backup, you'll need to create a Kloset store to store the
data. It can be hosted anywhere that Plakar has an integration with a
[storage connector](/integrations/?category=storage) for e.g a local filesystem
path, a remote S3 bucket, another server via SFTP, or other supported backends.

## Create Store with Path

```bash
$ plakar at /var/backups create
```

Plakar prompts for an encryption passphrase. To avoid the prompt, set:

```bash
$ export PLAKAR_PASSPHRASE="my-secret-passphrase"
$ plakar at /var/backups create
```

## Create Store with Alias

Configure store once, reference by alias in all commands:

```bash
$ plakar store add mybackups /var/backups passphrase=xxx
```

Use the configured store:

```bash
$ plakar at @mybackups create
$ plakar at @mybackups ls
```

## Override a Store Path at Runtime

When using a config alias, you can override the root path of the store without
changing the stored configuration. This is useful when the alias points to a
base location and you want to target a subdirectory or an entirely different
path for a specific operation.

Given an alias `foobar` configured as `sftp://localhost/tmp`:

```bash
# Use the configured root as-is
$ plakar at @foobar

# Append a relative subdirectory: resolves to sftp://localhost/tmp/etc
$ plakar at @foobar:etc

# Override with an absolute path: resolves to sftp://localhost/etc
$ plakar at @foobar:/etc
```

The same override syntax applies when specifying a **backup source**. Given an
alias `foobar` configured as `sftp://localhost/etc`:

```bash
# Use the configured source root
$ plakar backup @foobar

# Append a relative path: resolves to sftp://localhost/etc/uucp
$ plakar backup @foobar:uucp

# Override with an absolute path: resolves to sftp://localhost/etc/uucp
$ plakar backup @foobar:/etc/uucp
```

## Backing Up Multiple Directories

You can back up more than one directory in a single snapshot by passing multiple
paths to `plakar backup`:

```bash
$ plakar backup /etc /home
```

> [!NOTE]+ Cross-connector sources
>
> Currently, multi-directory backup requires all sources to use the same
> connector. Support for combining sources across connectors (e.g. a local path
> alongside s3 connector) is still in development.

## Update store configuration

```bash
$ plakar store set mybackups passphrase=yyy
```

> [!WARNING]+ Passphrase Changes
>
> Updating the passphrase only affects the configuration. Existing data created
> with the old passphrase requires the original passphrase to access.

## Default Store Location

Without specifying a path, `plakar create` uses `~/.plakar`:

```bash
$ plakar create
```

## When to Use Aliases

Use aliases for:

- Stores requiring credentials (S3, cloud storage)
- Multiple stores with different configurations
- Avoiding repetitive path specifications
