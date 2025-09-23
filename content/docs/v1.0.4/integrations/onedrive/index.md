---
title: OneDrive integration documentation
description: Back up and restore your OneDrive data, or store your Plakar backups on OneDrive, using the Rclone integration.
technology_description: This integration uses Rclone’s official OneDrive remote to connect Plakar to your OneDrive account securely and efficiently.
categories: integrations
tags:
  - google drive
  - backup
  - disaster recovery
  - encryption
  - deduplication
  - versioning
  - immutable storage
  - compliance
  - long-term archiving
  - airgapped backup
  - snapshot technology
  - portable format
stage: test
date: 2025-07-26
plakar_version: ">=1.0.4"
integration_version: 0.1.0
resource_type: object-storage
provides:
  - source connector
  - destination connector
  - storage connector
  - viewer
---

# Integration Package: OneDrive

## Introduction

This integration allows you to snapshot and restore OneDrive data using Plakar to store it in a Kloset store, while minimizing storage usage and ensuring strong data security.
It includes a Storage Connector that lets you persist snapshots to OneDrive itself, either from OneDrive or from other sources.
A Viewer is also provided to inspect, search, and restore snapshots without requiring full extraction.

**Use cases:**

* Cold backup of OneDrive folders
* Long-term archiving and disaster recovery
* Portable export and vendor escape to other platforms

**Target technologies:**

* Supported versions: All OneDrive accounts supported by Rclone
* Supported editions: Personal and Business OneDrive
* System compatibility: macOS, Linux, Windows via Rclone

**Requirements:**

* Plakar version: >=1.0.4
* Integration version: 0.1.0
* OneDrive API credentials configured in Rclone

## Architecture

```
                                Viewer (CLI/UI)
                                  ↑
OneDrive ← Source Connector → Kloset Store ←→ Storage Connector → OneDrive
                                  ↓
                   OneDrive ← Destination Connector → Other compatible resources
```

**Components provided:**

* Source Connector: extract data from OneDrive
* Destination Connector: restore snapshots to OneDrive
* Storage Connector: persist snapshots inside OneDrive as the backend
* Viewer: browse and search snapshots in UI/CLI

## Installation

### Prerequisites 

This integration is distributed as an Rclone-powered connector.
You only need Plakar and Rclone installed.

Install Rclone: [https://rclone.org/install/](https://rclone.org/install/)
Configure your OneDrive remote: [https://rclone.org/onedrive/](https://rclone.org/onedrive/)

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
rclone config show myonedrive | plakar source import -rclone
```

### Destination Connector

To import your rclone config as a destination connector (to restore backups), run:

```bash
rclone config show myonedrive | plakar destination import -rclone
```

### Storage Connector

To import your rclone config as a storage connector (to store backups in OneDrive), run:

```bash
rclone config show myonedrive | plakar store import -rclone
```

> Replace `myonedrive` with your Rclone remote name.

## Usage

For the following examples, we will use `@myonedrive` as the Rclone remote name configured in Plakar.

First over all, we need to create a Kloset store to hold our snapshots:

```bash
plakar at ./backup create
```

A folder named `backup` will be created in the current directory, which will hold the snapshots.

### Snapshot

To back up your OneDrive data in the recently created Kloset store, use the following command:

```bash
plakar at ./backup backup @myonedrive
```

The last line of the output will show the snapshot ID, which you can use to inspect or restore later.

### Inspection

With Plakar, you can inspect your snapshots without extracting them.
You can list or display the contents of the Kloset store:

```bash
plakar at ./backup ls
plakar at ./backup cat <snapshot-id>:/path/to/file
plakar at ./backup ui
```

### Restore

To restore a snapshot back to OneDrive, use the following command:

```bash
plakar at ./backup restore -to @myonedrive <snapshot-id>
```

This will restore the snapshot to your OneDrive account, making it available in the same structure as it was when backed up.

### Storage

To use OneDrive as a storage backend, you have to create a Kloset store that uses the OneDrive remote.

```bash
plakar at @myonedrive create
```

This will create a Kloset store in your OneDrive cloud. And he will be used like any other Kloset store.

## Integration-specific behaviors

### Limitations

* OneDrive API has rate limits, heavy usage may require throttling
* Only the latest version of files are snapshotted
* Shared links and permissions are not preserved in snapshots

## Appendix

* [Rclone OneDrive Docs](https://rclone.org/onedrive/)
* [Plakar CLI Reference](/docs/main)
