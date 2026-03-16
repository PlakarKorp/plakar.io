---
title: "Creating a Kloset Store"
date: "2026-03-16T00:00:00Z"
weight: 3
summary: "Create a Kloset Store on the filesystem using Plakar."
---

# Creating a Kloset Store

A Kloset store is Plakar's immutable storage backend for backup data. This guide covers filesystem-based store creation. You can learn more in the [Kloset deep dive article](https://www.plakar.io/posts/2025-04-29/kloset-the-immutable-data-store/)

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

## Update store configuration

```bash
$ plakar store set mybackups passphrase=yyy
```

> [!WARNING]+ Passphrase Changes
> Updating the passphrase only affects the configuration. Existing data created with the old passphrase requires the original passphrase to access.

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
