---
title: "Creating a Kloset Store"
date: "2026-03-16T00:00:00Z"
weight: 3
summary: "Create a Kloset Store on the filesystem using Plakar."
aliases:
  - /docs/v1.0.6/guides/create-kloset-repository/
---

# Creating a Kloset Store

A Kloset store is Plakar's immutable storage backend for backup data. This guide
covers filesystem-based store creation. You can learn more in the
[Kloset deep dive article](https://www.plakar.io/posts/2025-04-29/kloset-the-immutable-data-store/).

## Why you need a Kloset store

Before you can run any backup, you'll need to create a Kloset store to hold the
data. It can be hosted anywhere that Plakar has an integration with a
[storage connector](/integrations/?category=storage). For example, a local
filesystem path, a remote S3 bucket, another server via SFTP, or other supported
backends.

## Create a store with a path

```bash
$ plakar at /var/backups create
```

Plakar prompts for an encryption passphrase. To avoid the prompt, set:

```bash
$ export PLAKAR_PASSPHRASE="my-secret-passphrase"
$ plakar at /var/backups create
```

Plakar encrypts the store by default. A few flags modify this behaviour:

- `-keyfile <path>`: reads the passphrase from a file, taking precedence over
  the environment variable. Useful when a file-based secret is preferred over an
  environment variable for non-interactive services.
- `-plaintext`: disables encryption entirely (not recommended for production).
- `-weak-passphrase`: allows a weak passphrase to be accepted (avoid in
  production).

## Default store location

Without specifying a path, `plakar create` uses `~/.plakar`:

```bash
$ plakar create
```

## Create a store with an alias

Configure a store once, then reference it by alias in all subsequent commands:

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

> [!WARNING]+ Passphrase changes
>
> Updating the passphrase only affects the configuration. Existing data created
> with the old passphrase requires the original passphrase to access.

## When to use aliases

Use aliases for:

- Stores requiring credentials (S3, cloud storage)
- Multiple stores with different configurations
- Avoiding repetitive path specifications

## Why the repository may appear larger than the data

In a small test environment, the repository size can exceed the size of the
saved data. For example, 8.9 MB for the repository against 3 MB of source data.
This is because Plakar has a fixed structural overhead of roughly 5–6 MB (index,
state, and packfile structures) that dominates when the data volume is small.
The gains from deduplication and compression only become apparent at scale, on
real repetitive data with a history of multiple snapshots. A toy folder is not a
representative benchmark.
