---
title: Dropbox
description: Backup and restore your Dropbox with Plakar secure, portable, and deduplicated.
technology_description: This integration uses the official Dropbox remote via Rclone to extract and restore data into a Kloset store.
categories: integrations
tags:
  - dropbox
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
plakar_version: ">=1.0.3"
integration_version: 0.1.0
resource_type: object-storage
provides:
  - source connector
  - destination connector
  - storage connector
  - viewer
---

# Integration Package: Dropbox

## Introduction

This integration allows you to snapshot and restore Dropbox data using Plakar, storing it in a Kloset store while minimizing storage usage and ensuring strong data security.
It includes a Storage Connector that lets you persist snapshots to Dropbox itself, either from Dropbox or other sources.
A Viewer is also provided to inspect, search, and restore snapshots without requiring full extraction.

**Use cases:**

* Cold backup of Dropbox folders
* Long-term archiving and disaster recovery
* Portable export and vendor migration to other platforms

**Target technologies:**

* Supported versions: All Dropbox accounts supported by Rclone
* Supported editions: Personal and Business Dropbox
* System compatibility: macOS, Linux, Windows via Rclone

**Requirements:**

* Plakar version: >=1.0.3
* Integration version: 0.1.0
* Dropbox API credentials configured in Rclone

## Architecture

```
                                Viewer (CLI/UI)
                                  ↑
Dropbox ← Source Connector → Kloset Store ←→ Storage Connector → Dropbox
                                  ↓
                   Dropbox ← Destination Connector → Other compatible resources
```

**Components provided:**

* Source Connector: extract data from Dropbox
* Destination Connector: restore snapshots to Dropbox
* Storage Connector: persist snapshots inside Dropbox as the backend
* Viewer: browse and search snapshots in UI/CLI

## Installation

### Prerequisites 

This integration is distributed as an Rclone-powered connector.
You only need Plakar and Rclone installed.

Install Rclone: [https://rclone.org/install/](https://rclone.org/install/)
Configure your Dropbox remote: [https://rclone.org/dropbox/](https://rclone.org/dropbox/)

```bash
rclone config
```

Afterwards, you can install it in a few seconds using Plakar’s built-in tooling.

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

## Setup Dropbox with Rclone

This integration provides three types of connectors to interact with your {resource type}:

- Source Connector to extract data from the resource
- Destination Connector to restore data into the resource
- Storage Connector to persist snapshots inside the resource itself, turning it into a Kloset backend

The configuration is done using plakar config commands. Each parameter is set explicitly and separately.

Depending on the type of usage, you can configure Dropbox as a source, destination, or storage connector.

Once Rclone is configured, import it into Plakar.

### Source Connector

To import your rclone config as a source connector (to make backups), run:

```bash
rclone config show | plakar source import -rclone mydropbox
```

### Destination Connector

To import your rclone config as a destination connector (to restore backups), run:

```bash
rclone config show | plakar destination import -rclone mydropbox
```

### Storage Connector

To import your rclone config as a storage connector (to store backups in Dropbox), run:

```bash
rclone config show | plakar store import -rclone mydropbox
```

> Replace `mydropbox` with your Rclone remote name.

## Usage

For the following examples, we will use `@mydropbox` as the Rclone remote name configured in Plakar.

First, to be able to backup and restore, you need to create a Kloset store to hold your snapshots:

```bash
plakar at ./save create
```

A folder named `save` will be created in the current directory, which will hold the snapshots.

### Backup a Snapshot

To back up your Dropbox data in the newly created Kloset store, use the following command:

```bash
plakar at ./save backup @mydropbox
```

The last line of the output will show the snapshot ID, which you can use to inspect or restore later.

### Restore a Snapshot

To restore a snapshot back to Dropbox, use the following command:

```bash
plakar at ./save restore -to @mydropbox <snapshot-id>
```

This will restore the snapshot to your Dropbox account, making it available in the same structure as it was when backed up.

### Kloset Creation 

To use Dropbox as storage, you have to create a Kloset store that uses the Dropbox remote.

```bash
plakar at @mydropbox create
```

This will create a Kloset store in your Dropbox cloud. It will be used like any other Kloset store.

#### Kloset Inspection

Test your Kloset store is functional.

List available snapshots with:

```bash
plakar at @mystore ls
```

Inspect file content without full restore:

```bash
plakar at @mystore cat <snapshot-id>:/path/to/file
```

Launch the UI viewer:

```bash
plakar at @mystore ui
```

## Integration-specific behaviors

### Limitations

* Dropbox API has rate limits; heavy usage may require throttling
* Only the latest version of files is snapshotted
* Shared links and permissions are not preserved in snapshots

## Appendix

* [Rclone Dropbox Docs](https://rclone.org/dropbox/)
* [Plakar CLI Reference](/docs/main)
