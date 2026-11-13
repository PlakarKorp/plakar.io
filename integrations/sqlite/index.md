
## Why use SQLite as a Kloset store

A SQLite store is a quick way to try or demonstrate Plakar, with no storage
backend to set up. It is not recommended for production workloads.

A SQLite Kloset store keeps everything in one database file on local disk:

- **No server**: There is no daemon to install, expose or keep running.
- **No network dependency**: Backups and restores work on machines with no
  network access at all.
- **Simple to manage**: The store lives at one path that you choose.

## Security and integrity

Every snapshot written to the SQLite store is encrypted and deduplicated by
Plakar before it reaches the file. Anyone who reads the database file without
the passphrase sees only encrypted data.

Plakar creates the database file readable and writable only by the user who
created the store, so other local users cannot read it.

Snapshots can be browsed, searched and verified with the CLI or the UI without
running a full restore.

## How Plakar uses SQLite

The SQLite integration provides a store connector:

- **Store Connector**: Host a Kloset store in a SQLite database file. Back up
  any source Plakar supports into it, from local directories to databases and
  cloud services, and restore from it to any destination.

