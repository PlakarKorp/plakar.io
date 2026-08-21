
# STDIO

The **STDIO integration** enables backup and restoration using standard Unix
streams. Data can be piped into Plakar from standard input and restored back to
standard output or standard error, making it easy to integrate Plakar into
scripts and Unix pipelines.

The STDIO integration is built into Plakar and requires no additional package
installation.

The STDIO integration provides two connectors:

| Connector type            | Description                                                                    |
| ------------------------- | ------------------------------------------------------------------------------ |
| **Source connector**      | Back up data from standard input (`stdin`) into a Kloset store.                |
| **Destination connector** | Restore a snapshot to standard output (`stdout`) or standard error (`stderr`). |

## Configuration

The stream is specified directly via the URI scheme in the command:

| URI         | Description                        |
| ----------- | ---------------------------------- |
| `stdio://`  | Read from standard input (`stdin`) |
| `stdout://` | Write to standard output           |
| `stderr://` | Write to standard error            |

## Source connector

The source connector reads from standard input and stores the data in a Kloset
store with encryption and deduplication.

```bash
$ cat myfile.txt | plakar at /var/backups backup stdio://
```

This works with any command that writes to stdout:

```bash
$ pg_dump mydb | plakar at /var/backups backup stdio://
```

## Destination connector

The destination connector restores a snapshot by writing its contents to
standard output or standard error.

```bash
# Restore to stdout
$ plakar at /var/backups restore -to stdout:// <snapshot_id>

# Restore to stderr
$ plakar at /var/backups restore -to stderr:// <snapshot_id>
```

