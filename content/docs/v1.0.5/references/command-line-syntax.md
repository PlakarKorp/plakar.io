---
title: "Command line syntax"
date: "2026-03-19T00:00:00Z"
weight: 1
summary: "How Plakar commands are structured, why flag order matters, and how to get help from the CLI."
aliases:
  - /docs/v1.0.5/guides/plakar-command-line-syntax
---

# Command line syntax

Every Plakar invocation follows this pattern:

```bash
$ plakar [OPTIONS] [at REPOSITORY] COMMAND [COMMAND_OPTIONS]...
```

| Component | Required | Description |
|-----------|----------|-------------|
| `OPTIONS` | No | Global options that apply to all commands (see below) |
| `at REPOSITORY` | No | Target repository; defaults to `$PLAKAR_REPOSITORY` or `~/.plakar` if omitted |
| `COMMAND` | Yes | The operation to perform (e.g. `backup`, `restore`, `check`) |
| `COMMAND_OPTIONS` | No | Options and arguments specific to the command (documented under each [command reference](../commands)) |

A few examples to make the structure concrete:

```bash
# Simplest form: just a command
$ plakar version

# Operating on a repository
$ plakar at /backup ls

# Global option + repository + command + command options
$ plakar -time at /backup ls -tag daily-backups
```

## Global options

Global options appear before the `at` clause and apply to every command. Options that come after the command are command-specific and are documented in each [command reference page](../commands).

| Option | Description |
|--------|-------------|
| `-concurrency int` | Limit the number of concurrent operations (default: -1) |
| `-config string` | Configuration directory (default: `~/.config/plakar`) |
| `-cpu int` | Limit the number of usable CPU cores |
| `-disable-security-check` | Disable update check |
| `-enable-security-check` | Enable update check |
| `-keyfile string` | Use passphrase from key file when prompted |
| `-profile-cpu string` | Profile CPU usage |
| `-profile-mem string` | Profile memory usage |
| `-quiet` | No output except errors |
| `-silent` | No output at all |
| `-stdio` | Use stdio user interface |
| `-time` | Display command execution time |
| `-trace string` | Display trace logs, comma-separated (`all`, `trace`, `repository`, `snapshot`, `server`) |

## Option order matters

Options must appear in the correct position. Global options go before `at`, command options go after the command.

```bash
# Correct: -tag is a command option for ls
$ plakar -time at /backup ls -tag daily-backups

# Wrong: -tag is placed before the command, plakar sees it as the command name
$ plakar -time at /backup -tag daily-backups ls
# command not found: -tag
```

A misplaced option will either be ignored or cause an error. When something doesn't work as expected, check option placement first.

## Getting help

Plakar has built-in help at every level.

```bash
# Show global usage, all options and available commands
$ plakar -h
$ plakar help

# Show the manual page for a specific command
$ plakar help <command>
```

The built-in help is always in sync with the version of Plakar you have installed, making it the most reliable reference for available options and commands.

## Environment variables

| Variable | Description |
|----------|-------------|
| `PLAKAR_PASSPHRASE` | Supply the encryption passphrase non-interactively |
| `PLAKAR_REPOSITORY` | Set the default repository path |

### `PLAKAR_PASSPHRASE`

When creating or opening an encrypted repository, Plakar prompts for a passphrase. Setting `PLAKAR_PASSPHRASE` provides it automatically, which is useful in scripts, CI pipelines, or any non-interactive context where a terminal prompt isn't available.

### `PLAKAR_REPOSITORY`

Sets the default repository location so you don't need to specify `at REPOSITORY` on every command. When omitted and no `at` clause is provided, Plakar falls back to `~/.plakar`.
