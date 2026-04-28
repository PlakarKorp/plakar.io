---
title: "iCloud Drive"
date: "2026-03-20T00:00:00Z"
weight: 5
summary: "Back up and restore your iCloud Drive with Plakar, and host Kloset stores in iCloud Drive."
---

# iCloud Drive

The Plakar iCloud Drive integration allows you to interact with iCloud Drive, Apple's cloud storage service, using Rclone.

[Rclone](https://rclone.org/) is a command-line program to manage files on cloud storage, and supports iCloud Drive as one of its many backends.

The Rclone integration package for Plakar provides three connectors:

| Connector type               | Description |
| ---------------------------- | ----------- |
| **Storage connector**        | Host a Kloset store inside a Rclone remote. |
| **Source connector**         | Back up a Rclone remote into a Kloset store. |
| **Destination connector**    | Restore data from a Kloset store into a Rclone remote. |

**Requirements**

- Rclone must be installed, and at least one iCloud Drive remote must be configured.

**Typical use cases**

- Cold backup of iCloud Drive folders
- Long-term archiving and disaster recovery
- Portable export and vendor escape to other platforms

## Installation

To interact with iCloud Drive, you need to install the Rclone Plakar package.

{{< tabs >}}
  {{< tab label="Pre-built package" >}}
  
  Pre-compiled packages are available for common platforms and provide the simplest installation method.
  
  > [!NOTE]+ Logging In
  > Pre-built packages require Plakar authentication. See [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.
  
  Install the Rclone package:
  
  ```bash
  $ plakar pkg add rclone
  ```

  Verify installation:
  ```bash
  $ plakar pkg list
  ```
  
  {{< /tab >}}
  {{< tab label="Building from source" >}}
  
  Source builds are useful when pre-built packages are unavailable or when customization is required.

  **Prerequisites:**
  - Go toolchain compatible with your **Plakar** version
  
  Build the package:
  
  ```bash
  $ plakar pkg build rclone
  ```
  
  A package archive will be created in the current directory (e.g., `rclone_v1.0.0_darwin_arm64.ptar`).
  
  Install the package:
  
  ```bash
  $ plakar pkg add ./rclone_v1.0.0_darwin_arm64.ptar
  ```
  
  Verify installation:
  
  ```bash
  $ plakar pkg list
  ```
  
  {{< /tab >}}
{{< /tabs >}}

To list, upgrade, or remove the package, see [managing packages guide](../../guides/managing-packages/).

## Generate Rclone configuration

> [!WARNING] iCloud Drive login
> Due to current limitations in Rclone, logging in to iCloud Drive is not possible at the time of writing. The steps below are provided for reference and future compatibility.

Install Rclone on your system by following the instructions at [https://rclone.org/install/](https://rclone.org/install/).

Then, run the following command to configure Rclone with iCloud Drive:

```bash
$ rclone config
```

You will be guided through a series of prompts to set up a new remote for iCloud Drive.

For Rclone v1.72.1, the configuration flow is as follows:
1. Choose `n` to create a new remote.
2. Name the remote (e.g., `mydrive`).
3. Enter the number corresponding to "iCloud Drive" from the list of supported storage providers.
4. Enter your Apple ID
5. Enter your password
6. Validate the remote configuration.

To verify that the remote is configured, run:

```bash
$ rclone config show mydrive
```

To verify that you have access to your iCloud Drive files, run:

```bash
$ rclone ls mydrive:
```

The output should list the files and folders in your iCloud Drive.

## Connectors

The Rclone package provides storage, source, and destination connectors to interact with iCloud Drive via Rclone.

You can use any combination of these connectors together with other supported Plakar connectors.

### Storage connector

The Plakar Rclone package provides a storage connector to host Kloset stores on Rclone remotes.

{{< mermaid >}}
flowchart LR

Source["Source data"]

Plakar["Plakar"]

Via["Store snapshot via<br/>Rclone storage connector"]

subgraph Store["Rclone Remote"]
  Kloset["Kloset Store"]
end

Source --> Plakar --> Via --> Kloset
{{< /mermaid >}}

#### Configure

```bash
# Import the rclone configuration as a storage configuration.
# Replace "mydrive" with your Rclone remote name.
$ rclone config show | plakar store import -rclone mydrive

# Initialize the Kloset store
$ plakar at "@mydrive" create

# List snapshots in the Kloset store
$ plakar at "@mydrive" ls

# Verify integrity of the Kloset store
$ plakar at "@mydrive" check

# Back up a local folder to the Kloset store
$ plakar at "@mydrive" backup /etc

# Back up a source configured in Plakar to the Kloset store
$ plakar at "@mydrive" backup "@my_source"
```

#### Options

These options can be set when configuring the storage connector with `plakar store add` or `plakar store set`:

| Option     | Purpose                                                             |
| ---------- | ------------------------------------------------------------------- |
| `passphrase` | The Kloset store passphrase |

### Source connector

The Plakar Rclone package provides a source connector to back up remote directories accessible via Rclone.

{{< mermaid >}}
flowchart LR

subgraph Source["Rclone Remote"]
  FS["Data"]
end

Plakar["Plakar"]

Via["Retrieve data via<br/>Rclone source connector"]

Store["Kloset Store"]

FS --> Via --> Plakar --> Store
{{< /mermaid >}}

#### Configure

```bash
# Import the rclone configuration as a source configuration.
# Replace "mydrive" with your Rclone remote name.
$ rclone config show | plakar source import -rclone mydrive

# Back up the remote directory to the Kloset store on the filesystem
$ plakar at /var/backups backup "@mydrive"

# Or back up the remote directory to a Kloset store configured with "plakar store add"
$ plakar at "@store" backup "@mydrive"
```

#### Options

The Rclone source connector doesn't support any specific options.

### Destination connector

The Rclone package provides a destination connector to restore snapshots to remote directories reachable over Rclone.

{{< mermaid >}}
flowchart LR

Store["Kloset Store"]

Plakar["Plakar"]

Via["Push data via<br/>Rclone destination connector"]

subgraph Destination["Rclone Remote"]
  FS["Data"]
end

Store --> Plakar --> Via --> FS
{{< /mermaid >}}

#### Configure

```bash
# Import the rclone configuration as a destination configuration.
# Replace "mydrive" with your Rclone remote name.
$ rclone config show | plakar destination import -rclone mydrive

# Restore a snapshot from a filesystem-hosted Kloset store to the Rclone remote
$ plakar at /var/backups restore -to "@mydrive" <snapshot_id>

# Or restore a snapshot from the Kloset store configured with "plakar store add store …"
$ plakar at "@store" restore -to "@mydrive" <snapshot_id>
```

#### Options

The Rclone destination connector doesn't support any specific options.

## Limitations and considerations

At the time of writing and according to this [GitHub issue](https://github.com/rclone/rclone/issues/8587#issuecomment-3240025307), it is currently impossible to log in to iCloud Drive using Rclone.

## See also

- [Rclone documentation for iCloud Drive](https://rclone.org/iclouddrive/)
