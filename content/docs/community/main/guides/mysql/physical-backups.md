---
title: "Physical backups"
date: "2026-03-18T00:00:00Z"
weight: 2
summary:
  "Perform physical backups of MySQL databases using Plakar's filesystem backup."
aliases:
  - /docs/main/guides/mysql/physical-backups/
---

# Physical backups

The MySQL / MariaDB integration only supports logical dumps. Physical backups
are done by stopping the server and backing up the data directory directly with
Plakar's built-in filesystem connector.

Physical backups are faster to restore than logical dumps and capture
everything: all databases, configuration files, and InnoDB redo logs. They are
version-locked: the backup must be restored with the same MySQL major version.

For logical dumps using `mysqldump` or `mariadb-dump`, see
[Logical backups with SQL dumps](./sqldump/).

## Before you begin

- Root or `mysql` system user access on the backup host.
- The MySQL data directory location (default `/var/lib/mysql`, check `datadir`
  in `my.cnf` if it differs).

## Back up with MySQL stopped

The safest method. Stop MySQL, back up the data directory, then restart:

```bash
$ sudo systemctl stop mysql.service
$ sudo plakar at /var/backups backup /var/lib/mysql
$ sudo systemctl start mysql.service
```

## Back up with a read lock

Minimize downtime using `FLUSH TABLES WITH READ LOCK`. All writes are blocked
for the duration:

```bash
$ mysql -u root -p << 'EOF'
FLUSH TABLES WITH READ LOCK;
SYSTEM sudo plakar at /var/backups backup /var/lib/mysql
UNLOCK TABLES;
EOF
```

## List snapshots

```bash
$ plakar at /var/backups ls
```

## Restore the data directory

Stop MySQL, move aside the existing data directory, restore, fix permissions,
and restart:

```bash
$ sudo systemctl stop mysql.service
$ sudo mv /var/lib/mysql /var/lib/mysql.old
$ sudo plakar at /var/backups restore -to /var/lib/mysql <snapshot_id>
$ sudo chown -R mysql:mysql /var/lib/mysql
$ sudo systemctl start mysql.service
```

## Restore and run with Docker

```bash
$ plakar at /var/backups restore -to ./mydb <snapshot_id>
$ sudo chown -R 999:999 ./mydb
$ docker run --rm -ti \
  -v ./mydb:/var/lib/mysql \
  mysql:<version>
```

Replace `<version>` with the same MySQL major version that was running when the
backup was taken.

## Considerations

### Version compatibility

Physical backups must be restored with the same MySQL major version. For
cross-version restores, use a [logical backup](./sqldump/) instead.

### InnoDB consistency

Ensure the backup includes all InnoDB files: `ibdata*`, `ib_logfile*` (or
`#ib_redo*` on MySQL 8.0.30+), and individual `.ibd` files. InnoDB performs
crash recovery automatically on startup.

### MEMORY tables

MEMORY tables are not stored on disk and will be empty after a physical restore.
Use a [logical backup](./sqldump/) if you need to preserve their contents.

### Kloset store

The examples above use `/var/backups` as the Kloset store. Any supported store
backend can be used instead. See
[Create a Kloset store](../../create-kloset-repository) for details.

## See also

- [Logical backups with SQL dumps](./sqldump/)
- [MySQL / MariaDB integration reference](../../integrations/mysql/)
- [MySQL backup methods](https://dev.mysql.com/doc/refman/8.0/en/backup-methods.html)
