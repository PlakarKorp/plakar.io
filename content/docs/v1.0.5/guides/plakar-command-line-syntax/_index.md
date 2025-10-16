---
date: "2025-09-04T06:20:40Z"
title: Plakar command line syntax
last_reviewed: "2025-09-04"
last_reviewed_version: "v1.0.4"
summary: "This tutorial explains the syntax of Plakar's command line interface, covering both simple and rich syntaxes. It includes examples for managing backups, restoring data, and configuring integrations such as S3 and SFTP."
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

Plakar intends to provide a simple and intuitive command line interface for managing your backups.

There are two syntaxes available: the simple syntax and the rich syntax.

## Simple Syntax

With the simple syntax, you can directly use the path to the resource. For example:

```bash
# List the contents of the Kloset store located at /var/backups
plakar at /var/backups ls

# Back up the directory /etc into the default Kloset store, stored at ~/.plakar
plakar backup /etc

# Back up the directory /etc into a specific Kloset store
plakar at /var/backups backup /etc

# Restore the contents of the snapshot dc60f09a located in the default Kloset store at ~/.plakar into ./restore-dir
plakar restore -to ./restore-dir dc60f09a

# Restore the contents of the snapshot dc60f09a located in the Kloset store at /var/backups into ./restore-dir
plakar at /var/backups restore -to ./restore-dir dc60f09a
```

The simple syntax is not limited to the filesystem. You can, for example, specify a store exposed by `plakar server` (requires the package `http`):

```bash
plakar at http://127.0.0.1:9876/ ls
```

Or back up using the SFTP integration (requires the `sftp` package):

```bash
plakar at /var/backups backup sftp://myserver/etc/resolv.conf
```

You can also use the `sftp` package to access a Kloset store hosted on an SFTP server:

```bash
plakar at sftp://myserver/var/backups backup ./myfolder
```

Or even back up an SFTP server to a store hosted on another SFTP server:

```bash
plakar at sftp://myserver/var/backups backup sftp://anotherserver/etc
```

## Rich syntax

Some integrations require additional parameters. For example, the S3 integration requires an access key and a secret key. In this case, Plakar provides a rich syntax to reference resources configured with `plakar store`, `plakar source` and `plakar destination`.

Let's look at some examples by creating a configuration for a Kloset store on a local MinIO instance:

```bash
plakar store add myminio s3://localhost:9000/mybackups access_key=minioadmin secret_access_key=minioadmin use_tls=false passphrase=mysecretpassphrase
```

To reference the store in Plakar commands, use the `@` syntax:

```bash
plakar at @myminio create
plakar at @myminio backup /etc
```

The syntax works exactly the same to reference a source to back up:

```bash
# Configure the source
plakar source add mybucket s3://localhost:9000/mybucket access_key=minioadmin secret_access_key=minioadmin use_tls=false

# Back up mybucket into the default Kloset store, located at ~/.plakar
plakar backup @mybucket
```

Or destinations:

```bash
# Configure the destination
plakar destination add mybucket s3://localhost:9000/mybucket access_key=minioadmin secret_access_key=minioadmin use_tls=false

# Restore the path /etc/resolv.conf of the snapshot dc60f09a located in the default Kloset store at ~/.plakar into the bucket
plakar restore -to @mybucket dc60f09a:/etc/resolv.conf
```

You can also mix these parameters to back up a source specified in the configuration to a Kloset store specified in the configuration:

```bash
plakar at @myminio backup @mybucket
```
