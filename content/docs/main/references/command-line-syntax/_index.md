---
date: "2025-09-04T06:20:40Z"
title: Command line syntax
last_reviewed: "2026-02-23"
last_reviewed_version: "v1.1.0"
summary: "How Plakar commands are structured, why flag order matters, and how to get help from the CLI."
weight: 2
aliases:
  - /docs/v1.1.0/guides/plakar-command-line-syntax
---
*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

## General syntax

Every Plakar invocation follows this pattern:

```bash
plakar [OPTIONS] [at REPOSITORY] COMMAND [COMMAND_OPTIONS]...
```

| Component | Required | Description |
|-----------|----------|-------------|
| `OPTIONS` | No | Global options that apply to all commands (see below) |
| `at REPOSITORY` | No | Target repository; defaults to `$PLAKAR_REPOSITORY` or `~/.plakar` if omitted |
| `COMMAND` | Yes | The operation to perform (e.g. `backup`, `restore`, `check`) |
| `COMMAND_OPTIONS` | No | Options and arguments specific to the command (documented under each [command reference](/docs/v1.1.0/references/commands/)) |

A few examples to make the structure concrete:

```bash
# Simplest form: just a command
plakar version

# Operating on a repository
plakar at /backup ls

# Global option + repository + command + command options
plakar -time at /backup ls -tag daily-backups
```

## Global options

Global options appear before the `at` clause and apply to every command. Options that come after the command are command-specific and are documented in each [command reference page](/docs/v1.1.0/references/commands/).

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
plakar -time at /backup ls -tag daily-backups

# Wrong: -tag is placed before the command — plakar sees it as the command name
plakar -time at /backup -tag daily-backups ls
# → command not found: -tag
```

A misplaced option will either be ignored or cause an error. When something doesn't work as expected, check option placement first.

## Getting help

Plakar has built-in help at every level.

```bash
# Show global usage, all options and available commands
plakar -h
plakar help

# Show the manual page for a specific command
plakar help <command>
```

The built-in help is always in sync with the version of Plakar you have installed, making it the most reliable reference for available options and commands.

## Environment variables

| Variable | Description |
|----------|-------------|
| `PLAKAR_PASSPHRASE` | Supply the encryption passphrase non-interactively |
| `PLAKAR_REPOSITORY` | Set the default repository path |
| `PLAKAR_TOKEN` | Token-based authentication for non-interactive environments |
| `PLAKAR_UI_TOKEN` | Set a custom access token for the web UI |

### `PLAKAR_PASSPHRASE`

When creating or opening an encrypted repository, Plakar prompts for a passphrase. Setting `PLAKAR_PASSPHRASE` provides it automatically, which is useful in scripts, CI pipelines, or any non-interactive context where a terminal prompt isn't available.

### `PLAKAR_REPOSITORY`

Sets the default repository location so you don't need to specify `at REPOSITORY` on every command. When omitted and no `at` clause is provided, Plakar falls back to `~/.plakar`.

### `PLAKAR_TOKEN`

Used for authentication in CI pipelines, remote servers, or automated jobs where interactive login isn't possible. Generate a token on a machine where you can run `plakar login` followed by `plakar token create`, then set `PLAKAR_TOKEN` to the resulting value on the target system. Plakar automatically picks it up for authentication. You can also run `plakar login -env` to persist the token from the environment into Plakar's local configuration file.

### `PLAKAR_UI_TOKEN`

By default, the web UI generates a random access token on each start, which you must retrieve from the service logs. Setting `PLAKAR_UI_TOKEN` lets you define a stable, known token so you can bookmark the UI URL or script access without inspecting logs every time the service restarts.
