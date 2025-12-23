---
date: "2025-08-21T00:00:00Z"
title: Create a Kloset Store
summary: "Learn how to create a Kloset Store on the filesystem using Plakar. In Plakar terms, the Kloset Store is the place where all your backup data is stored."
last_reviewed: "2025-12-08"
last_reviewed_version: "v1.0.6"
weight: 21
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

A **Kloset store** is Plakar’s immutable storage backend where all your data lives. You can learn more in the [Kloset deep dive article](https://www.plakar.io/posts/2025-04-29/kloset-the-immutable-data-store/).

This tutorial explains how to create a Kloset repository on the filesystem.

## Option 1. Using a simple path

Run the following command:

```bash
plakar at /var/backups create
```

When you create a store this way, Plakar will **prompt you interactively for an encryption passphrase**.

To avoid the prompt, you can set the passphrase via the environment variable:

```bash
export PLAKAR_PASSPHRASE="my-secret-passphrase"
```

## Option 2. Using an alias to refer to a store configuration

Plakar offers a more flexible way to configure stores using an alias.
This works in two steps:

1. **Configure the store once** with `plakar store`.
2. **Refer to it later** in all Plakar commands using the `@name` shortcut.

This approach is especially useful for integrations that require parameters (e.g. credentials in S3).
For filesystem repositories, you can still set parameters such as the `passphrase`.

### Example: configuring and using a filesystem store

```bash
plakar store add mybackups /var/backups passphrase=xxx
```

You can later update the passphrase of an existing store:

```bash
plakar store set mybackups passphrase=yyy
```

To use the configured store:

```bash
plakar at @mybackups create
plakar at @mybackups ls
```

## Default value for `at <path>`

The `plakar at <path>` parameter is optional.

By default, running:

```bash
plakar create
```

creates the repository in `~/.plakar`.

## More help

As with all other Plakar commands:

- Use `plakar create -h` for a quick list of flags.
- Use `plakar help create` for the full manual with examples.