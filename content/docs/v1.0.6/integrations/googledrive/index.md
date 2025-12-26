---
title: Google Drive
summary: Back up and restore your Google Drive with Plakar, and host Kloset stores in Google Drive.
date: "2025-12-24T00:00:00Z"
---

Google Drive is a widely used cloud storage service provided by Google, offering users the ability to store files, share documents, and collaborate in real time.

[Rclone](https://rclone.org/) is a command-line program to manage files on cloud storage, and supports Google Drive as one of its many backends.

The Rclone integration package for Plakar provides three connectors:

| Connector type               | Description |
| ---------------------------- | ----------- |
| ✅ **Storage connector**     | Host a Kloset store inside a Rclone remote. |
| ✅ **Source connector**      | Back up a Rclone remote into a Kloset store. |
| ✅ **Destination connector** | Restore data from a Kloset store into a Rclone remote. |

**Requirements**

* Rclone must be installed, and at least one Google Drive remote must be configured.

**Typical use cases**

* Cold backup of Google Drive folders
* Long-term archiving and disaster recovery
* Portable export and vendor escape to other platforms

---

## Installation

To interact with Google Drive, you need to install the Rclone Plakar package. It can be installed either by downloading a pre-built package or by building it from source.

{{< tabs name="Installation Methods" >}}
{{% tab name="Pre-built package" %}}
Plakar provides pre-compiled packages for common platforms. This is the simplest installation method and is suitable for most users.

**Note:** Installing pre-built packages requires authentication with Plakar. See [Login to Plakar to unlock features](../../guides/what-is-plakar-login/).

Install the Rclone package:
```bash
$ plakar pkg add rclone
```

Verify the installation:

```bash
$ plakar pkg list
```
{{< /tab >}}

{{% tab name="Building from source" %}}
Building from source is useful if you cannot use pre-built packages.

**Prerequisites**

* A working Go toolchain compatible with your version of Plakar.

Build the Rclone package:

```bash
$ plakar pkg build rclone
```

On success, a package archive is generated in the current directory, for example `rclone_v1.0.0_darwin_arm64.ptar`.

Install the generated package:

```bash
$ plakar pkg add ./rclone_v1.0.0_darwin_arm64.ptar
```

Verify the installation:

```bash
$ plakar pkg list
```
{{< /tab >}}

{{% tab name="Reinstalling or upgrading" %}}
To check whether the Rclone package is already installed:

```bash
$ plakar pkg list
```

To upgrade to the latest available version, remove the existing package and reinstall it:

```bash
$ plakar pkg rm rclone
$ plakar pkg add rclone
```

This preserves existing store, source, and destination configurations.
{{< /tab >}}
{{< /tabs >}}

---

## Generate Rclone configuration

Install Rclone on your system by following the instructions at [https://rclone.org/install/](https://rclone.org/install/).

Then, run the following command to configure Rclone with Google Drive:

```bash
$ rclone config
```

You will be guided through a series of prompts to set up a new remote for Google Drive.

For Rclone v1.72.1, the configuration flow is as follows:
1. Choose `n` to create a new remote.
2. Name the remote (e.g., `mydrive`).
3. Enter the number corresponding to "Google Drive" from the list of supported storage providers.
4. Leave client_id and client_secret empty to use Rclone's defaults, or provide your own if you have them.
5. Select the number corresponding to "Full access all files, excluding Application Data Folder.", or to "Read-only access to file metadata and file contents." if you only need read access.
6. Leave the service account file empty unless you have one.
7. Stay with the current settings, and do not edit advanced config.
8. Choose to open the browser for authentication.
9. Set whether to use a shared drive or not depending on your needs.
10. Validate the remote configuration.

To verify that the remote is configured, run:

```bash
$ rclone config show mydrive
```

And to verify you have access to your Google Drive files, run:

```bash
$ rclone ls mydrive:
```

The output should list the files and folders in your Google Drive.

---

## Connectors

The Rclone package provides storage, source, and destination connectors to interact with Google Drive via Rclone.

You can use any combination of these connectors together with other supported Plakar connectors.

### Storage connector

The Plakar Rclone package provides a storage connector to host Kloset stores on Rclone remotes.

{{< mermaid >}}
flowchart LR

Source@{ shape: cloud, label: "Source data" }

Source --> Plakar[<b>Plakar</b>]

subgraph Store[<b>Rclone Remote</b>]
  Kloset@{ shape: cyl, label: "Kloset Store" }
end

Plakar -- <small>Store snapshot via</small><br><b>Rclone storage connector</b> --> Store

%% Apply classes
class Source sourceBox
class Plakar brandBox
class Store storeBox

%% Classes definitions
classDef sourceBox fill:#ffe4e6,stroke:#cad5e2,stroke-width:1px
classDef brandBox fill:#524cff,color:#ffffff
classDef storeBox fill:#dbeafe,stroke:#cad5e2,stroke-width:1px

linkStyle default stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
{{< /mermaid >}}

#### Configure

```bash
# Import the rclone configuration as a storage configuration.
# Replace "mydrive" with your Rclone remote name.
rclone config show mydrive | plakar store import -rclone

# Initialize the Kloset store
$ plakar at @mydrive create

# List snapshots in the Kloset store
$ plakar at @mydrive ls

# Verify integrity of the Kloset store
$ plakar at @mydrive check

# Back up a local folder to the Kloset store
$ plakar at @mydrive backup /etc

# Back up a source configured in Plakar to the Kloset store
$ plakar at @mydrive backup @my_source
```

#### Options

The Rclone storage connector doesn't support any specific options.

### Source connector

The Plakar Rclone package provides a source connector to back up remote directories accessible via Rclone.

{{< mermaid >}}
flowchart LR

subgraph Source[<b>Rclone Remote</b>]
  fs@{ shape: cloud, label: "data" }
end

Source -- <small>Retrieve data via</small><br><b>Rclone source connector</b> --> Plakar

Store@{ shape: cyl, label: "Kloset Store" }

Plakar --> Store

%% Apply classes
class Source sourceBox
class Plakar brandBox
class Store storeBox

%% Classes definitions
classDef sourceBox fill:#ffe4e6,stroke:#cad5e2,stroke-width:1px
classDef brandBox fill:#524cff,color:#ffffff
classDef storeBox fill:#dbeafe,stroke:#cad5e2,stroke-width:1px

linkStyle default stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
{{< /mermaid >}}

#### Configure

```bash
# Import the rclone configuration as a source configuration.
# Replace "mydrive" with your Rclone remote name.
rclone config show mydrive | plakar source import -rclone

# Back up the remote directory to the Kloset store on the filesystem
$ plakar at /var/backups backup @mydrive

# Or back up the remote directory to a Kloset store configure with "plakar store add"
$ plakar at @store backup @mydrive
```

#### Options

The Rclone source connector doesn't support any specific options.

### Destination connector

The Rclone package provides a destination connector to restore snapshots to remote directories reachable over Rclone.

{{< mermaid >}}
flowchart LR

Store@{ shape: cyl, label: "Kloset Store" }

Store --> Plakar

subgraph Destination[<b>Rclone Remote</b>]
  fs@{ shape: cloud, label: "data" }
end

Plakar -- <small>Push data via</small><br><b>Rclone destination connector</b> --> Destination

%% Apply classes
class Destination destinationBox
class Plakar brandBox
class Store storeBox

%% Classes definitions
classDef destinationBox fill:#d0fae5,stroke:#cad5e2,stroke-width:1px
classDef brandBox fill:#524cff,color:#ffffff
classDef storeBox fill:#dbeafe,stroke:#cad5e2,stroke-width:1px

linkStyle default stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
{{< /mermaid >}}

#### Configure

```bash
# Import the rclone configuration as a destination configuration.
# Replace "mydrive" with your Rclone remote name.
rclone config show mydrive | plakar destination import -rclone

# Restore a snapshot from a filesystem-hosted Kloset store to the Rclone remote
$ plakar at /var/backups restore -to @mydrive <snapshot_id>

# Or restore a snapshot from the Kloset store configured with "plakar store add store …"
$ plakar at @store restore -to @mydrive <snapshot_id>
```

#### Options

The Rclone destination connector doesn't support any specific options.

---

## Limitations and considerations

* Google Drive API has rate limits, heavy usage may require throttling.
* File version history is not preserved. Only the current version of each file is snapshotted.
* Shared links and permissions are not preserved in snapshots.

---

## See also

* [Rclone documentation for Google Drive](https://rclone.org/drive/)