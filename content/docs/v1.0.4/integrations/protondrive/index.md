---
title: Proton Drive integration documentation
description: Back up and restore your Proton Drive data, or store your Plakar backups on Proton Drive, using the Rclone integration.
technology_description: This integration uses Rclone’s official Proton Drive remote to connect Plakar to your Proton Drive account securely and efficiently.
categories:
  - integrations
provides:
  - source-connector
  - destination-connector
  - storage-connector
tags:
  - proton drive
  - backup
  - storage
  - encryption
  - privacy
stage: test
date: 2025-07-29
---

# Integration Package: Proton Drive

## Introduction

This integration allows you to snapshot and restore Proton Drive data using Plakar to store it in a Kloset store, while minimizing storage usage and ensuring strong data security.
It includes a Storage Connector that lets you persist snapshots to Proton Drive itself, either from Proton Drive or from other sources.
A Viewer is also provided to inspect, search, and restore snapshots without requiring full extraction.

**Use cases:**

* Cold backup of Proton Drive folders
* Long-term archiving and disaster recovery
* Portable export and vendor escape to other platforms

**Target technologies:**

* Supported versions: All Proton Drive accounts supported by Rclone
* Supported editions: Personal and Business Proton Drive
* System compatibility: macOS, Linux, Windows via Rclone

**Requirements:**

* Plakar version: >=1.0.4
* Integration version: 0.1.0
* Proton Drive API credentials configured in Rclone

## Architecture

```
                                Viewer (CLI/UI)
                                  ↑
Proton Drive ← Source Connector → Kloset Store ←→ Storage Connector → Proton Drive
                                  ↓
                   Proton Drive ← Destination Connector → Other compatible resources
```

**Components provided:**

* Source Connector: extract data from Proton Drive
* Destination Connector: restore snapshots to Proton Drive
* Storage Connector: persist snapshots inside Proton Drive as the backend
* Viewer: browse and search snapshots in UI/CLI

## Installation

### Prerequisites 

This integration is distributed as an Rclone-powered connector.
You only need Plakar and Rclone installed.

Install Rclone: [https://rclone.org/install/](https://rclone.org/install/)
Configure your Proton Drive remote: [https://rclone.org/protondrive/](https://rclone.org/protondrive/)

```bash
rclone config
```

After you can install it in a few seconds using Plakar’s built-in tooling.

**Install the package:**

Run the following command to install the integration:

```bash
plakar pkg add rclone
```

This will generate a portable .ptar archive and install it in your Plakar environment.

**Verify installation:**

Check that the integration appears in your available connectors:

```bash
plakar pkg
```

You should now see the rclone.

## Configuration

Once Rclone is configured, import it into Plakar.

### Source Connector

To import your rclone config as a source connector (to make backups), run:

```bash
rclone config show myprotondrive | plakar source import -rclone
```

### Destination Connector

To import your rclone config as a destination connector (to restore backups), run:

```bash
rclone config show myprotondrive | plakar destination import -rclone
```

### Storage Connector

To import your rclone config as a storage connector (to store backups in Dropbox), run:

```bash
rclone config show myprotondrive | plakar store import -rclone
```

> Replace `myprotondrive` with your Rclone remote name.

## Usage

For the following examples, we will use `@myprotondrive` as the Rclone remote name configured in Plakar.

First, create a Kloset store to hold your snapshots:

```bash
plakar at ./backup create
```

A folder named `backup` will be created in the current directory, which will hold the snapshots.

### Snapshot

To back up your Proton Drive data in the recently created Kloset store, use:

```bash
plakar at ./backup backup @myprotondrive
```

The last line of the output will show the snapshot ID, which you can use to inspect or restore later.

### Inspection

You can inspect your snapshots without extracting them. List or display the contents of the Kloset store:

```bash
plakar at ./backup ls
plakar at ./backup cat <snapshot-id>:/path/to/file
plakar at ./backup ui
```

### Restore

To restore a snapshot back to Proton Drive, use:

```bash
plakar at ./backup restore -to @myprotondrive <snapshot-id>
```

This will restore the snapshot to your Proton Drive account, preserving its original structure.

### Storage

To use Proton Drive as a storage backend, create a Kloset store that uses the Proton Drive remote:

```bash
plakar at @myprotondrive create
```

This will create a Kloset store in your Proton Drive cloud, usable like any other Kloset store.

## Integration-specific behaviors

### Limitations

* Proton Drive API has rate limits, heavy usage may require throttling
* Only the latest version of files are snapshotted
* Shared links and permissions are not preserved in snapshots

### Automation

* Schedule snapshots using cron or systemd timers
* Use `.ptar` archives for export/transport

### Restore Notes

* Can restore into Proton Drive or export to S3, filesystem, or other Plakar-compatible destinations

## Troubleshooting

* Use `plakar log` and Rclone logs for diagnosis
* Ensure Proton Drive remote is authorized

## Backup strategy

Follow 3-2-1 best practice:

* 3 copies (original + 2 backups)
* 2 different storage backends
* 1 offsite (Proton Drive, filesystem, or S3)

## Appendix

* [Rclone Proton Drive Docs](https://rclone.org/protondrive/)
* [Plakar CLI Reference](/docs/main)

