---
date: "2025-08-21T00:00:00Z"
title: Create a Kloset Store
summary: "Learn how to create a Kloset Store on the filesystem using Plakar. In Plakar terms, the Kloset Store is the place where all your backup data is stored."
last_reviewed: "2025-12-23"
last_reviewed_version: "v1.0.6"
weight: 21
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

A **Kloset store** is Plakar’s immutable storage backend where all your data lives. You can learn more in the [Kloset deep dive article](https://www.plakar.io/posts/2025-04-29/kloset-the-immutable-data-store/).

This tutorial explains how to create a Kloset store on the filesystem.

## Option 1: Using a simple path

Run the following command:

```bash
plakar at /var/backups create
```

When you create a store this way, Plakar will **prompt you interactively for an encryption passphrase**.

To avoid the prompt, you can set the passphrase via the `PLAKAR_PASSPHRASE`environment variable:

```bash
export PLAKAR_PASSPHRASE="my-secret-passphrase"
```

## Option 2: Using an alias to refer to a store configuration

Plakar offers a more flexible way to configure stores by defining an alias. This works in two steps:

1. **Configure the store once** with `plakar store`.
2. **Refer to it later** in all Plakar commands using the `@name` alias.

Using an alias is especially useful for integrations that require parameters (e.g. credentials in S3).

### Example: configuring and using a filesystem store

```bash
plakar store add mybackups /var/backups passphrase=xxx
```

To edit the configuration and later update the passphrase of an existing store:

```bash
plakar store set mybackups passphrase=yyy
```

*Note: In this example, changing the passphrase only updates the configuration. Accessing existing data created with the old passphrase will fail unless the passphrase is set back to its original value.”

To use the configured store:

```bash
plakar at @mybackups create
plakar at @mybackups ls
```

## Default behavior for `at <path>`

The `plakar at <path>` parameter is optional.

By default, running:

```bash
plakar create
```

creates the Kloset Store in `~/.plakar`.

## More help

As with all other Plakar commands:

- Use `plakar create -h` for a quick list of flags.
- Use `plakar help create` for the full manual with examples.