---
title: Google Photos
summary: Back up and restore your Google Photos with Plakar.
date: "2025-12-26T00:00:00Z"
---

The Plakar integration for Google Photos allows you to back up and restore your Google Photos library, using Rclone as the underlying technology.

[Rclone](https://rclone.org/) is a command-line program to manage files on cloud storage, and supports Google Photos as one of its many backends.

With this integration, you can use the following connectors:

| Connector type               | Description |
| ---------------------------- | ----------- |
| ✅ **Source connector**      | Back up a Rclone remote into a Kloset store. |
| ✅ **Destination connector** | Restore data from a Kloset store into a Rclone remote. |

**Requirements**

* Rclone must be installed, and a Google Photos remote must be configured.

**Typical use cases**

* Cold backup of Google Photos library
* Long-term archiving and disaster recovery
* Portable export and vendor escape to other platforms

---

## Installation

To interact with Google Photos, you need to install the Rclone Plakar package. It can be installed either by downloading a pre-built package or by building it from source.

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

Then, run the following command to configure Rclone with Google Photos:

```bash
$ rclone config
```

You will be guided through a series of prompts to set up a new remote for Google Photos.

For Rclone v1.72.1, the configuration flow is as follows:
1. Choose `n` to create a new remote.
2. Name the remote (e.g., `myphotos`).
3. Enter the number corresponding to "Google Photos" from the list of supported storage providers.
4. Leave client_id and client_secret empty to use Rclone's defaults, or provide your own if you have them.
5. Select whether to mark the backend read-only ("true") or not ("false"). For restoring data, choose "false".
6. Stay with the current settings, and do not edit advanced config.
7. Choose to open the browser for authentication.
8. Validate the information message, indicating that uploads will count towards storage in your Google Account.

To verify that the remote is configured, run:

```bash
$ rclone config show myphotos
```

And to verify you have access to your Google Photos files, run:

```bash
$ rclone ls myphotos:
```

The output should list the files and folders in your Google Photos.

---

## Connectors

The Rclone package provides the source and destination connectors to interact with Google Photos via Rclone.

### Source connector

The Plakar Rclone package provides a source connector to back up Google Photos via Rclone.

{{< mermaid >}}
flowchart LR

subgraph Source[<b>Rclone Remote</b>]
  fs@{ shape: cloud, label: "Google Photos library" }
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
# Replace "myphotos" with your Rclone remote name.
rclone config show myphotos | plakar source import -rclone

# Back up the Google Photos to the Kloset store on the filesystem
$ plakar at /var/backups backup @myphotos

# Or back up the Google Photos to a Kloset store configure with "plakar store add"
$ plakar at @store backup @myphotos
```

#### Options

The Rclone source connector doesn't support any specific options.

### Destination connector

The Rclone package provides a destination connector to restore snapshots to Google Photos via Rclone.

{{< mermaid >}}
flowchart LR

Store@{ shape: cyl, label: "Kloset Store" }

Store --> Plakar

subgraph Destination[<b>Rclone Remote</b>]
  fs@{ shape: cloud, label: "Google Photos library" }
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
# Replace "myphotos" with your Rclone remote name.
rclone config show myphotos | plakar destination import -rclone

# Restore a snapshot from a filesystem-hosted Kloset store to the Rclone remote
$ plakar at /var/backups restore -to @myphotos <snapshot_id>

# Or restore a snapshot from the Kloset store configured with "plakar store add store …"
$ plakar at @store restore -to @myphotos <snapshot_id>
```

#### Options

The Rclone destination connector doesn't support any specific options.

---

## Limitations and considerations

From March 31, 2025 rclone can only download photos it uploaded. This limitation is due to policy changes at Google.

See [this issue](https://issuetracker.google.com/issues/368779600?pli=1) for more information.

---

## See also

* [Rclone documentation for Google Photos](https://rclone.org/googlephotos/)