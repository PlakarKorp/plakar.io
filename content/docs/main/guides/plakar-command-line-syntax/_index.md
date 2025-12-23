---
date: "2025-09-04T06:20:40Z"
title: Plakar command line syntax
last_reviewed: "2025-12-23"
last_reviewed_version: "v1.0.6"
summary: "This guide explains the basics of the Plakar command line syntax: how to specify stores, sources, destinations, argument order, and how to get help."
weight: 30
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

Plakar exposes several types of commands, depending on the resources they operate on (stores, sources, and/or destinations).

## Commands operating on a Kloset store

Many commands operate directly on a Kloset store, such as `backup`, `restore`, `ls`, `create`, `check`, and `locate`.

To specify the Kloset store, use the `at` keyword followed by the path to the store:

```bash
# Using a store located on the filesystem
plakar at /path/to/kloset store-command [options]

# Using a store located on a SFTP server (requires the sftp package)
plakar at sftp://myserver/path/to/kloset store-command [options]
```

*If no `at` is provided, Plakar uses the default Kloset store located at `~/.plakar`.*

Instead of a path, you can also reference a store using an alias configured with `plakar store add`:

```bash
# Configure the store using the S3 integration (requires the s3 package)
plakar store add mystore s3://localhost:9000/mybucket passphrase='S3cR3tP4sSwPhr@53' access_key=minioadmin secret_access_key=minioadmin use_tls=false

# Use the configured store via its alias
plakar at @mystore store-command [options]
```

Using an alias is required for stores that need additional parameters (for example, credentials), but aliases may also be used for stores that do not require them.

## Commands operating on sources and destinations

Some commands operate on a source (for example, `backup`) or on a destination (for example, `restore`). In these cases, the source or destination is provided as a command argument.

To specify a source or destination, provide its path as an argument to the command:

```bash
# Referencing a source located on the filesystem
plakar at @mystore backup /path/to/directory

# Or on a SFTP server (requires the sftp package)
plakar at @mystore backup sftp://myserver/path/to/directory
```

```bash
# Referencing a destination located on the filesystem
plakar at @mystore restore -to /path/to/directory snapshot-id

# Or on a SFTP server (requires the sftp package)
plakar at @mystore restore -to sftp://myserver/path/to/directory snapshot-id
```

As with stores, sources and destinations can also be referenced using aliases configured with `plakar source add` and `plakar destination add`:

```bash
# Configure the source using the S3 integration (requires the s3 package)
plakar source add mybucket s3://localhost:9000/mybucket access_key=minioadmin secret_access_key=minioadmin use_tls=false

# Back up the configured source using its alias
plakar at @mystore backup @mybucket
```

```bash
# Configure the destination using the S3 integration (requires the s3 package)
plakar destination add mybucket s3://localhost:9000/mybucket access_key=minioadmin secret_access_key=minioadmin use_tls=false

# Restore to the configured destination using its alias
plakar at @mystore restore -to @mybucket snapshot-id
```

## Argument order

Argument order is important in Plakar commands. The general command syntax is:

```
plakar [at <store>] <command> [command options] [source/destination]
```

For example, the `backup` command accepts a `-check` option to perform a full check after a successful backup. This option must appear before the path to back up:

```bash
# ❌ Incorrect order
plakar at /path/to/kloset backup /path/to/directory -check

# ✅ Correct order
plakar at /path/to/kloset backup -check /path/to/directory
```

## Getting help

Plakar offers two levels of help.

To display the list of parameters for a specific command, use `-h` or `--help` after the command name, for example:

```bash
$ plakar backup -h
Usage: backup [OPTIONS] path
       backup [OPTIONS] @LOCATION

OPTIONS:
[…]
```

For more detailed documentation, including explanations and examples, use `plakar help <command>` to display the manual page for a command.

At the bottom of each manual page, the *SEE ALSO* section lists related commands that may be useful.

For example, `plakar help backup` references `plakar-source(1)`, which you can view with `plakar help source` to learn more about configuring sources.