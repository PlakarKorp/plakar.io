---
date: "2025-08-21T00:00:00Z"
title: Retrieve passphrase via external command
summary: The passphrase for accessing an encrypted Kloset Store can be stored in the environment, a file, or in the configuration. It can also be retrieved via an external command, for example your password manager.
last_reviewed: "2025-12-08"
last_reviewed_version: "v1.0.6"
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

To access an encrypted Kloset store, a passphrase is required. There are several ways to provide this passphrase when using the `plakar` command:
* Entered interactively when prompted.
* Set in the environment variable `PLAKAR_PASSPHRASE` before running the command.
* Given in a file with the option `-keyfile`, for example:
  ```bash
  plakar -keyfile /path/to/keyfile at /var/backups ls
  ```
* Stored in the configuration as plain text, with:
  ```bash
  plakar store add mystore location=/var/backups passphrase=mypassphrase
  ```
  Then use the syntax:
  ```bash
  plakar at @mystore ls
  ```
  to list the files in the Kloset store.

The last option is to configure an external command that will be called to retrieve the passphrase. This command could, for example, fetch the passphrase from a vault service or a password manager.

## Setup a Kloset store

To set up the command, you first need to configure a Kloset store in the configuration:

```bash
plakar store add mystore location=/var/backups passphrase_cmd='echo mypassphrase'
```

## Use the configuration

To use the configuration, use the `@` syntax to refer to the Kloset store:

```bash
plakar at @mystore ls
```

When you run this command, the `plakar` command will call the `passphrase_cmd` command to retrieve the passphrase, and then use it to access the Kloset store.