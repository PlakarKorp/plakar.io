---
date: "2025-09-02T00:00:00Z"
title: Setup the scheduler to run backups every day
summary: "Learn how to configure and run the Plakar scheduler to automate daily backups. This tutorial covers configuration, task setup, and running the scheduler."
last_reviewed: "2025-09-02"
last_reviewed_version: "v1.0.4"
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

Plakar includes a scheduler that can run backups as well as tasks like restoring files, synchronizing Kloset stores, and verifying backup integrity.

In this tutorial, we will show how to set up the scheduler to run backups every day.

## Requirements

We assume you have an existing Kloset store at `/var/backups`. To create it, use:

```bash
plakar at /var/backups create
```

## Configuration

Create a configuration for your Kloset store. This ensures the scheduler can later retrieve the store passphrase:

```bash
plakar store add mybackups /var/backups passphrase=mysuperpassphrase
```

Create the configuration file `scheduler.yaml` for the scheduler in your current directory with the following content:

```yaml
agent:
  tasks:
    - name: backup Plakar source code
      repository: "@mybackups"

      backup:
        path: /Users/niluje/dev/plakar/plakar
        interval: 24h
        check: true
```

This configuration file defines a task for the Plakar scheduler, where:

* `name` is the task label, displayed in the UI.
* `repository` references the Kloset store. The syntax `@mystore` corresponds to the store previously configured with `plakar store add mystore`.
* `backup` is the task type. In this case, we back up the Plakar source code at the given path every 24 hours.
* `check` is to run a check after the backup is created to ensure the backup is valid.

## Running the scheduler

### Start the scheduler

```bash
plakar scheduler start -tasks ./scheduler.yaml
```

The scheduler is started in the background. To stop it, use:

```bash
plakar scheduler stop
```

