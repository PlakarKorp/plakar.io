---
title: SQLite

subtitle: Host an encrypted, deduplicated Kloset store in a single SQLite file

description: >
  Store Plakar backups inside a single SQLite database file. No server to run,
  no remote backend to manage, with encrypted and deduplicated snapshots from
  any source.

technology_title: A backup store with nothing to run

technology_description: >
  SQLite is an embedded database engine that keeps its data in a single file on
  the local filesystem. It needs no server process, no network service and no
  administration.

  Plakar can use a SQLite database file as a Kloset store. Snapshots from any
  source are encrypted and deduplicated, then kept in that file. This suits test
  and demo environments. SQLite stores are not recommended for production
  workloads.

categories:
  - storage

seo_tags:
  - SQLite backup storage
  - embedded backup store
  - local backup
  - encrypted backup
  - deduplication
  - self-contained backup

links:
  - type: community
    url: /docs/community/main/integrations/sqlite/

related:
  - fs
  - sftp
  - s3

edition:
  - community

stage: stable

author:
  - type: official
    name: Plakar

date: 2026-11-11

resource: SQLite

image: img/integrations/sqlite.png
---

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
