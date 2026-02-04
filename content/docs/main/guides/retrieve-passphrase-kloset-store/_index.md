---
date: "2025-08-21T00:00:00Z"
title: Retrieving passphrase via external command
summary: The passphrase for accessing an encrypted Kloset Store can be stored in the environment, a file, or in the configuration. It can also be retrieved via an external command, for example your password manager.
last_reviewed: "2026-01-29"
last_reviewed_version: "v1.1.0"
weight: 6
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

Plakar can retrieve a Kloset Store passphrase by executing an external command. The command must output the passphrase to standard output.

This allows you to use password managers or secret stores instead of keeping the passphrase in plain text in the Plakar configuration.

## Example

If your password manager prints the passphrase to stdout, you can configure the store like this.

For example, using `gopass`:

```bash
plakar store add test \
  location=/var/backups \
  passphrase_cmd='gopass show mystore/passphrase'
```

When you access the store:
```bash
plakar at "@test" ls
```
Plakar executes the command, reads its output, and uses it as the passphrase.

## Limitations

- The command must not require user interaction. If the command prompts for input (for example, a GPG key password), Plakar will fail.
- The command must only output the passphrase to `stdout`.

This mechanism is useful with tools such as gopass, 1Password, Vault, or any other system that can return secrets via a command.
