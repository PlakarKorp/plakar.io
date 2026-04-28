---
title: "Retrieving secrets via external command"
date: "2026-03-16T00:00:00Z"
weight: 6
summary: "The passphrase for accessing an encrypted Kloset Store can be stored in the environment, a file, or in the configuration. It can also be retrieved via an external command, for example your password manager."
---

# Retrieving secrets via external command

Plakar can retrieve a Kloset Store passphrase by executing an external command. The command must write the passphrase to standard output. This lets you integrate password managers or secret stores instead of keeping the passphrase in plain text in the Plakar configuration.

## Setting the command

Pass `passphrase_cmd` when adding the store:

```bash
$ plakar store add mystore \
  location=/var/backups \
  passphrase_cmd='gopass show mystore/passphrase'
```

Or update an existing store:

```bash
$ plakar store set mystore passphrase_cmd='gopass show mystore/passphrase'
```

When you access the store, Plakar executes the command, reads its stdout, and uses the result as the passphrase:

```bash
$ plakar at "@mystore" ls
```

## Examples

### gopass

```bash
$ passphrase_cmd='gopass show mystore/passphrase'
```

### 1Password CLI

```bash
$ passphrase_cmd='op read "op://Personal/mystore/password"'
```

### HashiCorp Vault

```bash
$ passphrase_cmd='vault kv get -field=password secret/mystore'
```

## Limitation

The only hard requirement is that **the command must not read from stdin**. Plakar does not connect a terminal to the command's stdin, so anything that attempts to read from it will fail. System-level prompts (biometrics, OS dialogs, GUI windows) are fine as long as they do not need input typed into the terminal.

The command must write only the passphrase to stdout. Any extra output will be treated as part of the passphrase.

## What's coming

External command resolution is currently limited to the passphrase. Work is underway to extend this to other configuration fields such as storage credentials and tokens.
