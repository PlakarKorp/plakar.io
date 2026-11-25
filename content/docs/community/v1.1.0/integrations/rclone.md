---
title: "Rclone"
date: "2026-11-25T00:00:00Z"
weight: 4
summary:
  "Back up and restore cloud storage reached through Rclone, and host Kloset
  stores in it."
---

# Rclone

The Rclone integration backs up cloud storage into a Kloset store, restores
snapshots to it, and hosts Kloset stores in it. It reaches each provider through
a remote of [Rclone](https://rclone.org/), a command-line program that manages
files on cloud storage.

The following providers have their own dedicated documentation, with the steps
to create their Rclone remote:

- [Dropbox](../dropbox)
- [Google Drive](../googledrive)
- [iCloud Drive](../iclouddrive)
- [Koofr](../koofr)
- [OneDrive](../onedrive)
- [OpenDrive](../opendrive)
- [Proton Drive](../protondrive)

The integration includes three connectors:

| Connector type            | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| **Source connector**      | Back up a Rclone remote into a Kloset store.           |
| **Destination connector** | Restore data from a Kloset store into a Rclone remote. |
| **Store connector**       | Host a Kloset store inside a Rclone remote.            |

**Requirements**

- Rclone installed, with at least one remote configured.

## Installation

{{< tabs >}}

{{< tab label="Pre-built package" >}}

Pre-compiled packages are available for common platforms and provide the
simplest installation method.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the Rclone package:

```bash
$ plakar pkg add rclone
```

Verify installation:

```bash
$ plakar pkg show
```

{{< /tab >}}

{{< tab label="Building from source" >}}

Source builds are useful when pre-built packages are unavailable or when
customization is required.

**Prerequisites:**

- Go toolchain compatible with your **Plakar** version

Build the package:

```bash
$ plakar pkg build rclone
```

A package archive will be created in the current directory (e.g.,
`rclone_v1.0.0_darwin_arm64.ptar`).

Install the package:

```bash
$ plakar pkg add -allow-unsigned ./rclone_v1.0.0_darwin_arm64.ptar
```

Verify installation:

```bash
$ plakar pkg show
```

{{< /tab >}}

{{< /tabs >}}

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages/).

## Importing a Rclone remote

You create a remote with `rclone config`, then import it into Plakar as a
source, destination or store configuration:

```bash
$ rclone config show | plakar source import -rclone mydrive
```

The `-rclone` flag turns each setting of the remote into an option prefixed with
`rclone_`, so the remote `type` becomes `rclone_type`. It also sets `location`
to `rclone://`, the root of the remote. The configuration takes the name of the
remote, so a remote named `mydrive` is referenced as `@mydrive`.

To work in a folder of the remote instead of its root, set `location` to the
path of that folder:

```bash
$ plakar source set mydrive location=rclone://Documents
```

## Configuration

#### Backup flow

<!-- prettier-ignore-start -->
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
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
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
<!-- prettier-ignore-end -->

#### Store flow

<!-- prettier-ignore-start -->
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
<!-- prettier-ignore-end -->

### Shared configuration

The following options apply to the source, destination and store connectors.
Importing a remote with `-rclone` sets them.

| Option            | Required | Description                                                                                               |
| ----------------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `location`        | Yes      | `rclone://`, followed by the path of a folder in the remote. `rclone://` alone is the root of the remote. |
| `rclone_type`     | Yes      | The Rclone backend of the remote, such as `drive`, `onedrive` or `dropbox`.                               |
| `rclone_<option>` | No       | A setting of the remote, passed to Rclone without the `rclone_` prefix, such as `rclone_token`.           |

### Store configuration

The following option can be set on the store connector with `plakar store add`
or `plakar store set`.

| Option       | Required | Description                  |
| ------------ | -------- | ---------------------------- |
| `passphrase` | No       | The Kloset store passphrase. |

### Example

Back up the remote:

```bash
$ rclone config show | plakar source import -rclone mydrive

$ plakar at /var/backups backup "@mydrive"
```

Restore a snapshot to the remote:

```bash
$ rclone config show | plakar destination import -rclone mydrive

$ plakar at /var/backups restore -to "@mydrive" <snapshot_id>
```

Host a Kloset store in the remote:

```bash
$ rclone config show | plakar store import -rclone mydrive

$ plakar at "@mydrive" create

$ plakar at "@mydrive" backup /etc
```

## See also

- [Rclone documentation](https://rclone.org/docs/)
- [Managing packages](../../guides/managing-packages/)
