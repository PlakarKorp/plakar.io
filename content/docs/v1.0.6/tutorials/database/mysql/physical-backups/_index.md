---
title: Physical backups
description: >
    How to perform physical backups of MySQL databases using file copy or Percona XtraBackup, and store them with Plakar.
last_reviewed: "2026-01-25"
last_reviewed_version: "v1.0.6"
weight: 2
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

# Overview

Physical backups consist of raw copies of the directories and files that store database contents. This type of backup involves exact copies of database directories and files, typically all or part of the MySQL data directory.

Unlike logical backups, physical backups are faster because they involve only file copying without conversion, and the output is more compact. However, they are less portable and require the MySQL server to be stopped or properly locked during the backup process. 

For a deeper understanding of physical backups and backup methods, refer to the [official MySQL documentation on backup methods](https://dev.mysql.com/doc/refman/8.0/en/backup-methods.html).

## Requirements

This guide assumes that you have:

- A running MySQL server with the data directory accessible.
- Sufficient permissions to read the MySQL data directory (typically requires root or mysql user privileges).
- The MySQL server stopped, or the ability to perform appropriate locking to prevent data changes during backup.

{{% notice style="warning" title="Data Consistency Warning" expanded="true" %}}
Copying the data directory while MySQL is running without proper locking can result in an inconsistent backup.
{{% /notice %}}

## Performing the backup

### Directory-based backup with MySQL stopped

The safest and most straightforward way to perform a physical backup is to stop the MySQL server, copy the data directory, and then restart MySQL.

```bash
# Stop MySQL
sudo systemctl stop mysql.service

# Back up the data directory
sudo plakar at /var/backups backup /var/lib/mysql

# Start MySQL
sudo systemctl start mysql.service
```

{{% notice style="info" title="Data Directory Location" expanded="true" %}}
The MySQL data directory location may vary depending on your installation. Check the `datadir` variable in your MySQL configuration file (`/etc/mysql/my.cnf` or `/etc/my.cnf`).
{{% /notice %}}

### Directory-based backup with read lock

To minimize downtime, you can use `FLUSH TABLES WITH READ LOCK` to obtain a consistent state without fully stopping MySQL. This method requires maintaining a persistent connection that holds the lock throughout the backup:

```bash
mysql -u root -p << EOF
FLUSH TABLES WITH READ LOCK;
SYSTEM sudo plakar at /var/backups backup /var/lib/mysql
UNLOCK TABLES;
EOF
```

This executes the backup command from within the MySQL session using the `SYSTEM` command, ensuring the lock is held for the entire duration of the backup.

{{% notice style="warning" title="Write Operations Blocked" expanded="true" %}}
This method blocks all write operations during the backup. For large databases, the backup time may be significant. The lock is automatically released if the connection is lost, so ensure a stable connection throughout the backup process.
{{% /notice %}}

### Backup specific databases

To back up only specific databases, you can copy their individual directories:

```bash
# Stop MySQL
sudo systemctl stop mysql.service

# Back up specific database directories
sudo plakar at /var/backups backup /var/lib/mysql/<dbname>

# Start MySQL
sudo systemctl start mysql.service
```

Replace `<dbname>` with the name of the database you want to back up.

## Restoring a physical backup

To restore a physical backup, use the `plakar restore` command to extract the backup to the MySQL data directory.

{{% notice style="warning" title="Before Restoring" expanded="true" %}}
Before restoring, ensure MySQL is stopped and the current data directory is backed up or moved.
{{% /notice %}}

First, list available snapshots to identify the one you want to restore:

```bash
plakar at /var/backups ls
```

Then restore the selected snapshot:

```bash
# Stop MySQL
sudo systemctl stop mysql.service

# Backup or remove the current data directory
sudo mv /var/lib/mysql /var/lib/mysql.old

# Restore from Plakar
sudo plakar at /var/backups restore -to /var/lib/mysql <SNAPSHOT_ID>

# Fix permissions
sudo chown -R mysql:mysql /var/lib/mysql

# Start MySQL
sudo systemctl start mysql.service
```

Replace `<SNAPSHOT_ID>` with the actual snapshot ID from the `plakar ls` output.

### Restoring specific databases

If you backed up specific database directories, restore them individually:

```bash
# Stop MySQL
sudo systemctl stop mysql.service

# Remove the target database directory
sudo rm -rf /var/lib/mysql/<dbname>

# Restore the database
sudo plakar at /var/backups restore -to /var/lib/mysql/<dbname> <SNAPSHOT_ID>

# Fix permissions
sudo chown -R mysql:mysql /var/lib/mysql/<dbname>

# Start MySQL
sudo systemctl start mysql.service
```

## Running MySQL with Docker from a physical backup

With a physical backup, you can easily run a MySQL instance using Docker, provided the MySQL version matches the one used to create the backup.

```bash
# Restore the backup to a local directory
plakar at /var/backups restore -to ./mydb <SNAPSHOT_ID>

# Fix permissions (MySQL container typically runs as UID 999)
sudo chown -R 999:999 ./mydb

# Run MySQL container
docker run --rm -ti --name mysql \
  -v ./mydb:/var/lib/mysql \
  mysql:8.0
```

Replace `mysql:8.0` with the appropriate MySQL version matching your backup.

To connect to the running MySQL instance:

```bash
docker exec -ti mysql mysql -u root -p -e 'SHOW DATABASES;'
```

## Considerations

### Physical vs logical backups

- Logical backups (`mysqldump`) are machine-independent and highly portable across MySQL versions and architectures.
- Physical backups are faster to backup and restore, and the output is more compact. However, they are only portable to machines with identical or similar hardware characteristics and the same MySQL version.
- Choose the method that best fits your recovery time objectives and portability requirements.

### InnoDB consistency

MySQL's InnoDB storage engine maintains its own transaction logs and tablespace files. When performing a physical backup, ensure that:

- The backup includes all InnoDB files: `ibdata*`, `ib_logfile*` (or `#ib_redo*` in MySQL 8.0.30+), and individual `.ibd` files.
- The backup is consistent (either MySQL is stopped, or a proper lock mechanism is used).
- InnoDB will automatically perform crash recovery on startup if the backup was taken consistently.

### MEMORY tables

Data from MEMORY tables is not stored on disk and cannot be backed up using file copy methods. MEMORY tables will be empty after restoring a physical backup. If you need to back up MEMORY tables, use logical backups with `mysqldump` instead.

## Further reading

- [MySQL Backup and Recovery Documentation](https://dev.mysql.com/doc/refman/8.0/en/backup-and-recovery.html)
- [MySQL Backup Methods](https://dev.mysql.com/doc/refman/8.0/en/backup-methods.html)
- [MySQL FLUSH Statement](https://dev.mysql.com/doc/refman/8.0/en/flush.html)
- [MySQL InnoDB Storage Engine](https://dev.mysql.com/doc/refman/8.0/en/innodb-storage-engine.html)
