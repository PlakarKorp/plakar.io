# Restore from a Plakar Snapshot

Restore files from a Plakar snapshot to a target location, or mount the
snapshot as a read-only filesystem for partial recovery.

## Requirements

- Plakar CLI installed
- Read access to the Kloset repository holding the snapshot
- (Mount-only) FUSE on Linux/macOS, or WinFsp on Windows

## Steps — full restore

1. List snapshots and pick one:
   ```sh
   plakar at s3://plakar-backups/prod ls
   ```
2. Restore by snapshot ID (prefix is enough):
   ```sh
   plakar at s3://plakar-backups/prod restore <snapshot-id> \
     --to /var/restore/2026-05-09
   ```

## Steps — mount and browse without restoring

```sh
plakar at s3://plakar-backups/prod mount /mnt/plakar-snap <snapshot-id>
ls /mnt/plakar-snap
plakar at s3://plakar-backups/prod umount /mnt/plakar-snap
```

## Validate

Restored files match the original tree (`diff -r`), or the mount is
browsable and reads succeed without errors in the Plakar log.

## References

- Documentation: https://docs.plakar.io/
- Mount guide: https://www.plakar.io/docs
