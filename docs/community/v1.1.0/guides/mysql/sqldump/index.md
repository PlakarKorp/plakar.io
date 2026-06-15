
# Logical backups with SQL dumps

This guide shows how to back up and restore MySQL and MariaDB databases using
the `mysql://` and `mysql+mariadb://` connectors. Backups produce standard SQL
files via `mysqldump` or `mariadb-dump` that are portable and can be restored
without Plakar if needed.

For full reference on all options, snapshot layout, Google Cloud SQL, and
MySQL-specific considerations, see the
[MySQL / MariaDB integration reference](../../integrations/mysql/).

## Before you begin

- A running MySQL or MariaDB server.
- A database user with sufficient privileges (see
  [Required privileges](../../integrations/mysql/#prerequisites) in the
  integration reference).
- `mysqldump` and `mysql` in `$PATH` for MySQL, or `mariadb-dump` and `mariadb`
  for MariaDB.

Install the MySQL package:

```bash
$ plakar pkg add mysql
```

## Back up a single database

```bash
# MySQL
$ plakar source add mydb mysql://dbuser:secret@db.example.com/mydb
$ plakar at /var/backups backup @mydb

# MariaDB
$ plakar source add mydb mysql+mariadb://dbuser:secret@db.example.com/mydb
$ plakar at /var/backups backup @mydb
```

## Back up all databases

Omit the database name from the URI to use `--all-databases`:

```bash
# MySQL
$ plakar source add alldb mysql://root:secret@db.example.com
$ plakar at /var/backups backup @alldb

# MariaDB
$ plakar source add alldb mysql+mariadb://root:secret@db.example.com
$ plakar at /var/backups backup @alldb
```

## List snapshots

```bash
$ plakar at /var/backups ls
```

## Restore a single database

The target database must already exist:

```bash
$ plakar destination add mydbdst mysql://dbuser:secret@target.example.com/mydb
$ plakar at /var/backups restore -to @mydbdst <snapshot_id>
```

To have Plakar create the database automatically:

```bash
$ plakar destination add mydbdst mysql://dbuser:secret@target.example.com/mydb \
  create_db=true
$ plakar at /var/backups restore -to @mydbdst <snapshot_id>
```

## Restore all databases

```bash
$ plakar destination add mydbdst mysql://root:secret@target.example.com
$ plakar at /var/backups restore -to @mydbdst <snapshot_id>
```

## Considerations

### MySQL vs MariaDB binaries

Always use binaries that match your server. On Debian and Ubuntu,
`apt install default-mysql-client` installs MariaDB's `mysqldump` by default,
which is not compatible with MySQL 8 for all-databases backups. Verify you have
the correct binary:

```bash
$ mysqldump --version
# MySQL:   mysqldump  Ver 8.x Distrib 8.x, for Linux (x86_64)
# MariaDB: mysqldump from 11.x.x-MariaDB ...
```

Use `mysql_bin_dir` to point to the correct binary directory if both are
installed.

### Kloset store

The examples above use `/var/backups` as the Kloset store. Any supported store
backend can be used instead. See
[Create a Kloset store](../../create-kloset-repository) for details.

## See also

- [MySQL / MariaDB integration reference](../../integrations/mysql/)
- [MySQL integration GitHub](https://github.com/PlakarKorp/integrations/tree/main/mysql)
- [mysqldump documentation](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html)

