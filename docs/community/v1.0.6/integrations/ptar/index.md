
# PTAR

PTAR (Plakar Tar) is the archive format of Plakar. A `.ptar` file holds a
complete Kloset store in a single self-contained file, with its snapshots
deduplicated and encrypted. Unlike a `.tar` or `.zip` archive, it can hold
several versions of a dataset, and can be copied, moved or kept offline as is.

> [!NOTE]
>
> The PTAR integration is built into Plakar and requires no package
> installation.

The integration includes one connector:

| Connector type      | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| **Store connector** | Read a PTAR archive as a Kloset store, locally or over HTTP. |

## Creating an archive

A PTAR archive is written once, by the
[`plakar ptar`](../../references/commands/plakar-ptar) command, and cannot be
modified afterwards. It can bundle filesystem paths, existing Kloset stores, or
both:

```bash
$ plakar ptar -o /var/archives/documents.ptar /home/user/documents
```

The archive is encrypted with the passphrase from `PLAKAR_PASSPHRASE`, or
prompted for, unless `-plaintext` is given.

## Configuration

| Option     | Required | Description                      |
| ---------- | -------- | -------------------------------- |
| `location` | Yes      | Path or URL of the PTAR archive. |

The protocol is selected by the URI scheme:

| URI                          | Description                    |
| ---------------------------- | ------------------------------ |
| `ptar://<path>`              | Archive on a local filesystem. |
| `ptar+http://<host>/<path>`  | Archive served over HTTP.      |
| `ptar+https://<host>/<path>` | Archive served over HTTPS.     |

A local path ending in `.ptar` is recognized without the `ptar://` prefix.

## Reading an archive

An archive is opened like any other Kloset store, in read-only mode. Backups
cannot be written to an existing archive.

```bash
# List the snapshots of a local archive
$ plakar at /var/archives/documents.ptar ls

# Restore a snapshot from the archive
$ plakar at /var/archives/documents.ptar restore -to /home/user/restored <snapshot_id>

# List the snapshots of an archive served over HTTPS
$ plakar at ptar+https://example.com/documents.ptar ls
```

To add data to an archive, create a new one that imports the snapshots of the
existing archive, along with the new files:

```bash
$ plakar ptar -o /var/archives/documents-v2.ptar -k /var/archives/documents.ptar /home/user/newfile
```

## See also

- [plakar ptar](../../references/commands/plakar-ptar)
- [Filesystem integration](../fs)
- [TAR integration](../tar)
- [PTAR format specification](https://github.com/PlakarKorp/kloset/blob/main/docs/ptar.md)

