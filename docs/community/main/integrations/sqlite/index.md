
# SQLite

The SQLite integration hosts a Kloset store inside a single SQLite database
file. Snapshot data, metadata and locks are all kept in that file, so the store
needs no server. This suits desktop, embedded, test and air-gapped environments
where running a remote backend is not practical.

The integration includes one connector:

| Connector type      | Description                                    |
| ------------------- | ---------------------------------------------- |
| **Store connector** | Host a Kloset store in a SQLite database file. |

**Requirements**

- Write access to the directory that holds the database file.

## Installation

The SQLite integration is distributed as a Plakar package.

{{< tabs >}}

{{< tab label="Pre-built package" >}}

Pre-compiled packages are available for common platforms and provide the
simplest installation method.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the SQLite package:

```bash
$ plakar pkg add sqlite
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
$ plakar pkg build sqlite
```

A package archive will be created in the current directory (e.g.,
`sqlite_v1.1.0_darwin_arm64.ptar`).

Install the package:

```bash
$ plakar pkg add -allow-unsigned ./sqlite_v1.1.0_darwin_arm64.ptar
```

Verify installation:

```bash
$ plakar pkg show
```

{{< /tab >}}

{{< /tabs >}}

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages/).

## Configuration

The store connector writes the Kloset store to a SQLite database file on the
local filesystem, addressed by a `sqlite://` URL.

#### Store flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

Source["Source data"]

Plakar["Plakar"]

Transform["Encrypt & deduplicate"]

Via["Store snapshot via<br/>SQLite store connector"]

subgraph Store["SQLite database file"]
  Kloset["Kloset Store"]
end

Source --> Plakar --> Transform --> Via --> Kloset
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Store configuration

| Option     | Required | Description                                                                                           |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `location` | Yes      | `sqlite://` followed by the path to the database file, for example `sqlite:///var/backups/kloset.db`. |

### File permissions

Creating the Kloset store creates the database file with mode `0600`, so only
the user who created it can read or write it. SQLite keeps two companion files
next to the database, `-wal` and `-shm`, and creates them with the same mode as
the database. Other local users therefore cannot read the store contents, even
when they can list the directory.

The mode is set only when the store is created. A database that already exists
keeps its permissions. To restrict an existing store, set the mode of the
database file and of any `-wal` or `-shm` file next to it:

```bash
$ chmod 600 /var/backups/kloset.db
```

> [!NOTE]+ Version requirement
>
> SQLite package v1.1.0 and later create the database with mode `0600`. Earlier
> versions create it with the default mode, usually `0644`, which lets other
> local users read it.

### Example

Create a Kloset store in a SQLite file and use it:

```bash
# Configure the Kloset store
$ plakar store add sqlite_store sqlite:///var/backups/kloset.db

# Initialize the Kloset store
$ plakar at "@sqlite_store" create

# Back up a local folder to the Kloset store
$ plakar at "@sqlite_store" backup /etc

# List snapshots in the Kloset store
$ plakar at "@sqlite_store" ls

# Restore a snapshot to a local directory
$ plakar at "@sqlite_store" restore -to /tmp/restore <snapshot_id>
```

## See also

- [SQLite documentation](https://www.sqlite.org/docs.html)
- [Plakar Architecture (Kloset Engine)](https://www.plakar.io/posts/2025-04-29/kloset-the-immutable-data-store/)

