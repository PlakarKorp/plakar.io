
# Google Drive

Google Drive is Google's cloud storage service for storing, sharing and
collaborating on files.

The Google Drive integration backs up Google Drive folders into a Kloset store,
restores snapshots to Google Drive, and hosts Kloset stores in Google Drive. It
is provided by the Rclone package and reaches Google Drive through
[Rclone](https://rclone.org/), a command-line program that manages files on
cloud storage and supports Google Drive as one of its backends.

The integration includes three connectors:

| Connector type            | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| **Source connector**      | Back up a Rclone remote into a Kloset store.           |
| **Destination connector** | Restore data from a Kloset store into a Rclone remote. |
| **Store connector**       | Host a Kloset store inside a Rclone remote.            |

**Requirements**

- Rclone installed, with at least one Google Drive remote configured.

**Typical use cases**

- Cold backup of Google Drive folders.
- Long-term archiving and disaster recovery.
- Portable export and vendor escape to other platforms.

## Installation

The Google Drive integration is provided by the Rclone Plakar package.

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

## Configuring a Google Drive remote

The connectors reach Google Drive through a Rclone remote. The remote is created
with Rclone and then imported into Plakar as a source, destination or store
configuration.

Install Rclone by following the instructions at
[https://rclone.org/install/](https://rclone.org/install/), then start the
interactive configuration:

```bash
$ rclone config
```

The command prompts for the settings of a new Google Drive remote. For Rclone
v1.72.1, the configuration flow is as follows:

1. Choose `n` to create a new remote.
2. Name the remote (e.g., `mydrive`).
3. Enter the number corresponding to "Google Drive" from the list of supported
   storage providers.
4. Leave `client_id` and `client_secret` empty to use Rclone's defaults, or
   provide your own if you have them.
5. Select the number corresponding to "Full access all files, excluding
   Application Data Folder.", or to "Read-only access to file metadata and file
   contents." if you only need read access.
6. Leave the service account file empty unless you have one.
7. When prompted about advanced config, choose to edit it and set
   `root_folder_id` to a specific subfolder (recommended, see note below). This
   keeps all Plakar data in one place and avoids cluttering the root of your
   drive. If you don't want to use a subfolder, skip to step 8 and stay with the
   current settings.
8. Choose to open the browser for authentication.
9. Set whether to use a shared drive or not depending on your needs.
10. Validate the remote configuration.

> [!NOTE]+ Using a subfolder (recommended)
>
> Restricting Rclone to a dedicated subfolder keeps your Google Drive organised
> and makes it easy to identify Plakar data at a glance.
>
> 1. Create a folder in the Google Drive web UI.
> 2. Open the folder. The URL will contain the folder ID, e.g.
>    `https://drive.google.com/drive/folders/<FOLDER_ID>`.
> 3. When prompted at step 7, choose to edit advanced config and set
>    `root_folder_id` to that ID.
>
> Rclone will then treat that folder as its root, and all Plakar data will be
> written there instead of at the top level of your drive.

Verify that the remote is configured:

```bash
$ rclone config show mydrive
```

Verify access to your Google Drive files:

```bash
$ rclone ls mydrive:
```

The output lists the files and folders in your Google Drive.

## Configuration

Each connector is configured by importing the Rclone remote with
`rclone config show | plakar <source|destination|store> import -rclone <remote>`.
The imported configuration takes the name of the remote, so a remote named
`mydrive` is referenced as `@mydrive`. The connectors can be combined with any
other Plakar connector.

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

### Source configuration

The source connector has no options beyond the imported Rclone remote.

### Destination configuration

The destination connector has no options beyond the imported Rclone remote.

### Store configuration

The following option can be set on the store connector with `plakar store add`
or `plakar store set`.

| Option       | Required | Description                  |
| ------------ | -------- | ---------------------------- |
| `passphrase` | No       | The Kloset store passphrase. |

### Example

Back up the remote:

```bash
# Import the rclone configuration as a source configuration.
# Replace "mydrive" with your Rclone remote name.
$ rclone config show | plakar source import -rclone mydrive

# Back up the remote directory to the Kloset store on the filesystem
$ plakar at /var/backups backup "@mydrive"

# Or back up the remote directory to a Kloset store configured with "plakar store add"
$ plakar at "@store" backup "@mydrive"
```

Restore a snapshot to the remote:

```bash
# Import the rclone configuration as a destination configuration.
# Replace "mydrive" with your Rclone remote name.
$ rclone config show | plakar destination import -rclone mydrive

# Restore a snapshot from a filesystem-hosted Kloset store to the Rclone remote
$ plakar at /var/backups restore -to "@mydrive" <snapshot_id>

# Or restore a snapshot from the Kloset store configured with "plakar store add store …"
$ plakar at "@store" restore -to "@mydrive" <snapshot_id>
```

Host a Kloset store in the remote:

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

## Limitations and scope

The Google Drive API applies rate limits, and heavy usage may require
throttling. File version history is not preserved. Only the current version of
each file is snapshotted. Shared links and permissions are not preserved in
snapshots.

## See also

- [Rclone documentation for Google Drive](https://rclone.org/drive/)
- [Managing packages](../../guides/managing-packages/)

