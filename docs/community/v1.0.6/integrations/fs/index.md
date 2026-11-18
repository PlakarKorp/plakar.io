
# Filesystem

The Filesystem (FS) integration lets Plakar work directly with local or mounted
filesystems. Files and directories are backed up into a Kloset store and
restored back to a local or mounted directory. Any filesystem supported by the
operating system can be used.

> [!NOTE]
>
> The FS integration is built into Plakar and requires no package installation.

The integration includes three connectors:

| Connector type            | Description                                          |
| ------------------------- | ---------------------------------------------------- |
| **Store connector**       | Host a Kloset store in a local or mounted directory. |
| **Source connector**      | Back up files and directories into a Kloset store.   |
| **Destination connector** | Restore a snapshot to a local or mounted directory.  |

## Configuration

| Option     | Required | Description                                                     |
| ---------- | -------- | --------------------------------------------------------------- |
| `location` | Yes      | Path to the directory or mount point, for example `/home/user`. |

Paths can be given directly in commands, without the `fs://` prefix.

## Examples

```bash
# Create a Kloset store in a local directory
$ plakar at /var/backups create

# Back up a directory
$ plakar at /var/backups backup /home/user/documents

# Restore a snapshot to a local directory
$ plakar at /var/backups restore -to /home/user/restored <snapshot_id>
```

## See also

- [Your first backup](../../quickstart/first-backup)
- [Creating a Kloset Store](../../guides/create-kloset-repository)
- [Excluding files from a backup](../../guides/excluding-files-from-a-backup)
- [MySQL physical backups](../../guides/mysql/physical-backups)

