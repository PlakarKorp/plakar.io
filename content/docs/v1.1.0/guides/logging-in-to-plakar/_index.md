---
date: "2025-09-02T00:00:00Z"
title: Logging In to Plakar
summary: Log in to unlock optional features like pre-built package installation and alerting.
last_reviewed: "2026-02-05"
last_reviewed_version: "v1.1.0"
weight: 8
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

Plakar works without an account by default. Logging in is optional and unlocks additional features such as pre-built package installation and alerting.

## Logging In

### Using GitHub

```bash
plakar login -github
```

### Using Email

```bash
plakar login -email myemail@domain.com
```

## Enabling Alerting

After logging in, enable alerting to send backup metadata to Plakar's servers for reporting:

```bash
plakar service enable alerting
```

Enable email notifications:

```bash
plakar service set alerting report.email=true
```

Alerting sends non-sensitive metadata (backup status, timestamps, sizes) to power the reporting dashboard and email notifications. Your backup data never leaves your system.

## Non-Interactive Login

For CI pipelines, remote servers, or automated jobs where interactive login isn't possible, use token-based authentication.

### Generate a Token

On a machine where you can log in interactively:

```bash
plakar login
plakar token create
```

This outputs a token:
```
eyJhbGc......
```

### Use the Token

On the non-interactive system, set the environment variable:

```bash
export PLAKAR_TOKEN=eyJhbGc......
```

Plakar automatically uses this token for authentication.

### Persist the Token

To save the token in the local configuration:

```bash
plakar login -env
```

This reads `PLAKAR_TOKEN` from the environment and stores it in Plakar's configuration file.

## Installing Pre-Built Packages

Once logged in, you install pre-built integration packages hosted on Plakar's servers:

```bash
plakar pkg add s3
plakar pkg add sftp
plakar pkg add rclone
```

Without logging in, you can still build these integrations from source.

## Verify Login Status

Check if you're logged in:

```bash
plakar login --status
```

This displays your login status.
