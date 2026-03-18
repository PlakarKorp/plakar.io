---
title: "Retrieving passphrase via external command"
date: "2026-03-16T00:00:00Z"
weight: 6
summary: "Retrieving the passphrase an encrypted Kloset Store via an external command, for example your password manager."
---

# Retrieving passphrase via external command

Plakar can retrieve a Kloset Store passphrase by executing an external command. The command must output the passphrase to standard output.

This allows you to use password managers or secret stores instead of keeping the passphrase in plain text in the Plakar configuration.

## Example

If your password manager prints the passphrase to stdout, you can configure the store like this.

For example, using `gopass`:

```bash
$ plakar store add test \
  location=/var/backups \
  passphrase_cmd='gopass show mystore/passphrase'
```

When you access the store:

```bash
$ plakar at "@test" ls
```

Plakar executes the command, reads its output, and uses it as the passphrase.

## Limitations

- The command must not require user interaction. If the command prompts for input (for example, a GPG key password), Plakar will fail.
- The command must only output the passphrase to `stdout`.

This mechanism is useful with tools such as gopass, 1Password, Vault, or any other system that can return secrets via a command.
