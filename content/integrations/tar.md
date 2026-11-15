---
title: Tar

seo_title: Free, Open-Source Tar and tar.gz Archive Import

subtitle: Free, open-source Tar archive import

description: >
  Free, open-source import of tar and tar.gz archives into encrypted,
  deduplicated snapshots, read in place without extraction, compared and
  exported as tar.

technology_title: Tar archives, kept as one deduplicated history

technology_description: >
  A tar archive records a directory tree with its paths, permissions, owners and
  modification times. A nightly `tar czf` is one of the oldest backup routines
  there is, and every archive it produces is a full copy. Gzip compresses each
  archive as one stream, so two archives that differ by a single file share
  almost no bytes on disk.

  Plakar opens the archive, decompresses it as it reads, and stores each entry
  as a file. Each archive becomes a dated, encrypted snapshot you can browse,
  compare, restore or export as a tarball again.

categories:
  - source

seo_tags:
  - import tar archive backup
  - tar.gz backup deduplication
  - compare two tar archives
  - import old tarballs into a backup repository
  - export snapshot as tar.gz
  - encrypted tar backup

links:
  - type: community
    url: /docs/community/main/integrations/tar/

related:
  - stdio
  - fs
  - sqlite

edition:
  - community

stage: stable

author:
  - type: official
    name: Plakar

date: 2026-03-23

resource: Tar

image: img/integrations/tar.png
---

## What the tar integration does {kicker="Overview"}

{{< columns ratio="7:5" sticky="right" >}}

{{< column >}}

The tar integration imports a tar or tar.gz archive into an encrypted,
deduplicated Plakar snapshot without extracting it to disk. Plakar reads the
archive file on the machine where it runs and records every entry with its path,
permissions, owner and modification time. It is built into the free, open-source
`plakar` CLI, with `tar://` for plain archives and `tgz://` for gzip-compressed
ones.

A path inside the archive keeps its place in the snapshot: `srv/app/config.yml`
becomes `/srv/app/config.yml`. From there the snapshot behaves like any other
Plakar snapshot. You list it, search it, compare it with the archive of the
previous night, restore one directory from it, or turn it back into a tar file
with `plakar archive`.

{{< /column >}}

{{< column >}}

```console {title="backup-host"}
$ plakar at /var/backups create
$ plakar at /var/backups backup \
    -force-timestamp 2025-03-14T02:00:00Z \
    tgz:///mnt/nas/backup-20250314.tar.gz
a1f61c48: OK ✓ /srv
a1f61c48: OK ✓ /srv/app
a1f61c48: OK ✓ /srv/app/etc
a1f61c48: OK ✓ /srv/app/etc/nginx
a1f61c48: OK ✓ /srv/app/etc/nginx/nginx.conf
a1f61c48: OK ✓ /srv/app/uploads
a1f61c48: backup completed without errors in 41.3s
$ plakar at /var/backups ls
2025-03-14T02:00:00Z   a1f61c48    12 GiB       41s /
2025-03-13T02:00:00Z   c396e52a    12 GiB       39s /
$
```

{{< /column >}}

{{< /columns >}}

## Why import tar archives into Plakar {kicker="Inside the archive"}

{{< cards cols="2" style="ruled" >}}

{{< card label="tgz://" >}}

### Gzip-compressed tarballs that still deduplicate

Plakar decompresses the archive while it reads it and splits each file into
content-defined chunks. Two `.tar.gz` files of the same tree, compressed on
different nights, share most of their files, and those files are stored once in
the store.

{{< /card >}}

{{< card label="0 bytes extracted" >}}

### No extraction and no staging disk

The archive is read from start to end, one entry after the other, and each entry
goes straight into the snapshot. A 200 GB tarball needs no 200 GB of scratch
space to be imported.

{{< /card >}}

{{< card label="mode · uid · gid · mtime" >}}

### Tar entry metadata recorded with each file

Every entry keeps its mode, numeric owner and group, user and group names and
modification time. Directories, symbolic links, device nodes and named pipes
keep their type.

{{< /card >}}

{{< card label="built in" >}}

### Part of the plakar binary

The tar importer ships with the CLI. There is no package to add, and the same
store can hold the imported archives next to the backups of servers, databases
and buckets.

{{< /card >}}

{{< /cards >}}

## How to import old tar.gz backups into a deduplicated repository {kicker="Migration"}

{{< columns ratio="5:7" sticky="right" >}}

{{< column >}}

A NAS holds three years of `backup-YYYYMMDD.tar.gz` files, one per night, each a
full copy of the same server. A short loop turns them into one snapshot per
night, each dated to the night its archive was made.

{{< steps >}}

{{< step >}}

**Create the store.** It can sit on a local disk, an SFTP server or an object
storage bucket, and it is encrypted with the passphrase you choose.

{{< /step >}}

{{< step >}}

**Import each archive with its own date.** `-force-timestamp` sets the snapshot
date from the file name. `-tag` marks the imported snapshots so you can list
them apart.

{{< /step >}}

{{< step >}}

**Verify the store.** `plakar check` reads every snapshot back and verifies its
content.

{{< /step >}}

{{< step >}}

**Retire the old copies.** Once `plakar ls -tag nas-import` shows one snapshot
per night, the archives on the NAS can go.

{{< /step >}}

{{< /steps >}}

{{< /column >}}

{{< column >}}

```bash
$ plakar at /var/backups create

$ for f in /mnt/nas/backup-*.tar.gz; do
    d=$(basename "$f" .tar.gz | cut -d- -f2)
    plakar at /var/backups backup -tag nas-import \
      -force-timestamp "${d:0:4}-${d:4:2}-${d:6:2}T02:00:00Z" \
      "tgz://$f"
  done

$ plakar at /var/backups check
$ plakar at /var/backups ls -tag nas-import
```

{{< dedup-chart title="New data stored per imported archive" caption="Illustrative values: the first archive is stored in full, each later one adds only the files that changed that night." values="100,3,2,4,2,3,5,2" >}}

{{< /column >}}

{{< /columns >}}

## Tar archive scenarios {kicker="Scenarios"}

{{< cards cols="2" style="accent" >}}

{{< card label="plakar diff nginx.conf" >}}

### Finding when a file changed between two tar archives

An auditor asks when TLS 1.2 was dropped from the web servers.
`plakar locate nginx.conf` lists every snapshot that holds the file, and
`plakar diff c396e52a:/srv/app/etc/nginx/nginx.conf a1f61c48:/srv/app/etc/nginx/nginx.conf`
prints the change. Neither archive is unpacked.

{{< /card >}}

{{< card label="docker export" >}}

### Tracking drift in a container filesystem

`docker export -o /srv/exports/web-01.tar web-01` writes the filesystem of the
container as a tar file each night, and `tar:///srv/exports/web-01.tar` imports
it. `plakar diff -recursive` between two nights lists the files that appeared
and the lines that changed in every modified file.

{{< /card >}}

{{< card label="plakar restore -to" >}}

### Restoring one directory from a 2023 tarball

The archive you need is now a snapshot, so there is nothing to download and
unpack. `plakar restore -to /srv/restore/uploads c396e52a:/srv/app/uploads`
writes the contents of `uploads` into the target folder.

{{< /card >}}

{{< card label="plakar archive -output -" >}}

### Sending a snapshot to a host without Plakar

A vendor needs the configuration of one release as a plain tarball.
`plakar archive -output - a1f61c48:/srv/app/etc | ssh vendor-host tar xzf -`
streams it as tar.gz to the other side, where `tar` is the only tool needed.

{{< /card >}}

{{< /cards >}}

## Tar formats Plakar reads and writes {kicker="Formats"}

{{< cards cols="3" style="boxed" >}}

{{< card label="tar://" >}}

### Plain tar archives

Uncompressed `.tar` files, read from a local path such as
`tar:///mnt/exports/app-export.tar`.

{{< /card >}}

{{< card label="tgz://" >}}

### Gzip-compressed tar archives

`.tar.gz` and `.tgz` files, decompressed during the import. `tar+gz://` and
`tar+gzip://` are accepted as the same protocol.

{{< /card >}}

{{< card label="plakar archive -format" >}}

### Tar, tar.gz or zip on export

`plakar archive` writes a snapshot or one of its paths as `tarball` (tar.gz, the
default), `tar` or `zip`. `-rebase` drops the leading path inside the export.

{{< /card >}}

{{< /cards >}}

## How to import a tar archive with the open-source Plakar CLI {kicker="Quickstart"}

{{< columns ratio="5:7" >}}

{{< column >}}

The Plakar CLI is free and open source, and tar support is part of it. Create a
store, then point `plakar backup` at the archive file with the protocol that
matches its compression.

The [tar integration documentation](/docs/community/main/integrations/tar/)
describes the protocols and the `location` option.

{{< /column >}}

{{< column >}}

```bash
$ plakar at /var/backups create

$ plakar at /var/backups backup tar:///mnt/exports/app-export.tar

$ plakar at /var/backups backup \
    -force-timestamp 2025-03-14T02:00:00Z \
    tgz:///mnt/nas/backup-20250314.tar.gz

$ plakar at /var/backups ls
```

{{< /column >}}

{{< /columns >}}

## Tar archive backup FAQ {kicker="FAQ"}

{{< columns >}}

{{< column >}}

### Which tar formats can Plakar import?

Plain tar archives with `tar://` and gzip-compressed archives (`.tar.gz`,
`.tgz`) with `tgz://`, also accepted as `tar+gz://` and `tar+gzip://`. The
archive is a file on the machine running Plakar.

### How does Plakar read a tar archive?

It reads the entries in order, decompressing gzip on the fly, and writes each
one into the snapshot as it goes. Nothing is unpacked to a temporary directory.

### Do tar.gz archives deduplicate in Plakar?

Yes. Deduplication works on the files inside the archive, not on the compressed
stream, so unchanged files are stored once across all the archives you import.

### Does Plakar keep the permissions and dates of tar entries?

Yes. Mode, owner, group and modification time are recorded for each entry. A
restore to a directory applies modes and times, and owners when it runs as root.

{{< /column >}}

{{< column >}}

### How do I keep the original date of an old tarball?

Pass `-force-timestamp` to `plakar backup`, for example
`-force-timestamp 2025-03-14T02:00:00Z`. The snapshot is then listed under that
date.

### How do I compare two tar archives?

Import both, then run `plakar diff` on the two snapshots, with a file path for a
single file or `-recursive` for the whole tree. Changed files show as a unified
diff.

### How do I turn a Plakar snapshot back into a tar.gz file?

Run `plakar archive -output export.tar.gz` followed by the snapshot ID. Add a
path after the ID to export one directory, and `-format tar` for an uncompressed
file.

### Where can I restore an imported tar archive?

To any directory with `plakar restore -to`, or to any destination Plakar
supports, such as an SFTP server or an object storage bucket.

{{< /column >}}

{{< /columns >}}
