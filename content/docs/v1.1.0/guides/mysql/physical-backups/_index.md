---
title: Physical backups
description: >
    Perform physical backups of MySQL databases using file copy or Percona XtraBackup with Plakar.
last_reviewed: "2026-02-11"
last_reviewed_version: "v1.1.0"
weight: 2
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

## Overview

Physical backups copy raw database directories and files directly from the MySQL data directory. This approach is faster than logical backups and produces more compact output, but requires MySQL to be stopped or locked during backup.

For a deeper understanding of physical backups and backup methods, refer to the [official MySQL documentation on backup methods](https://dev.mysql.com/doc/refman/8.0/en/backup-methods.html).

## Prerequisites

- Running MySQL server with accessible data directory
- Root or mysql user privileges
- MySQL server stopped or ability to apply read locks

{{% notice style="warning" title="Data Consistency" expanded="true" %}}
Copying the data directory while MySQL is running without proper locking produces inconsistent backups.
{{% /notice %}}

## Back Up with MySQL Stopped

Stop MySQL, back up the data directory, then restart:

```bash
sudo systemctl stop mysql.service
sudo plakar at /var/backups backup /var/lib/mysql
sudo systemctl start mysql.service
```

{{% notice style="info" title="Data Directory Location" expanded="true" %}}
Check `datadir` in `/etc/mysql/my.cnf` or `/etc/my.cnf` if your data directory differs.
{{% /notice %}}

## Back Up with Read Lock

Minimize downtime using `FLUSH TABLES WITH READ LOCK`:

```bash
mysql -u root -p << EOF
FLUSH TABLES WITH READ LOCK;
SYSTEM sudo plakar at /var/backups backup /var/lib/mysql
UNLOCK TABLES;
EOF
```

{{% notice style="warning" title="Write Operations Blocked" expanded="true" %}}
All write operations are blocked during backup. Lock releases automatically if connection drops.
{{% /notice %}}

## Back Up Specific Databases

Back up individual database directories:

```bash
sudo systemctl stop mysql.service
sudo plakar at /var/backups backup /var/lib/mysql/<dbname>
sudo systemctl start mysql.service
```

Replace `<dbname>` with the target database name.

## Restore Physical Backup

{{% notice style="warning" title="Before Restoring" %}}
Stop MySQL and back up or move the current data directory.
{{% /notice %}}

List snapshots:
```bash
plakar at /var/backups ls
```

Restore:
```bash
sudo systemctl stop mysql.service
sudo mv /var/lib/mysql /var/lib/mysql.old
sudo plakar at /var/backups restore -to /var/lib/mysql <SNAPSHOT_ID>
sudo chown -R mysql:mysql /var/lib/mysql
sudo systemctl start mysql.service
```

## Restore Specific Databases

Restore individual database directories:

```bash
sudo systemctl stop mysql.service
sudo rm -rf /var/lib/mysql/<dbname>
sudo plakar at /var/backups restore -to /var/lib/mysql/<dbname> <SNAPSHOT_ID>
sudo chown -R mysql:mysql /var/lib/mysql/<dbname>
sudo systemctl start mysql.service
```

## Run MySQL in Docker from Backup

Restore backup and run MySQL in Docker (requires matching MySQL version):

```bash
plakar at /var/backups restore -to ./mydb <SNAPSHOT_ID>
sudo chown -R 999:999 ./mydb
docker run --rm -ti --name mysql \
  -v ./mydb:/var/lib/mysql \
  mysql:8.0
```

Connect:
```bash
docker exec -ti mysql mysql -u root -p -e 'SHOW DATABASES;'
```

## Considerations

### Physical vs Logical Backups

- **Logical backups** (`mysqldump`): Machine-independent, portable across MySQL versions and architectures
- **Physical backups**: Faster backup/restore, more compact, but require identical hardware and MySQL version

### InnoDB Consistency

Ensure backups include all InnoDB files:
- `ibdata*`
- `ib_logfile*` (or `#ib_redo*` in MySQL 8.0.30+)
- Individual `.ibd` files

InnoDB performs automatic crash recovery on startup if backup was consistent.

### MEMORY Tables

MEMORY tables are not stored on disk and will be empty after physical backup restoration. Use `mysqldump` for MEMORY tables.

## References

- [MySQL Backup and Recovery](https://dev.mysql.com/doc/refman/8.0/en/backup-and-recovery.html)
- [MySQL Backup Methods](https://dev.mysql.com/doc/refman/8.0/en/backup-methods.html)
- [MySQL FLUSH Statement](https://dev.mysql.com/doc/refman/8.0/en/flush.html)
- [MySQL InnoDB Storage Engine](https://dev.mysql.com/doc/refman/8.0/en/innodb-storage-engine.html)
