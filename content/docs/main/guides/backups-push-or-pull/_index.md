---
date: "2025-08-21T00:00:00Z"
title: Push or pull backups?
summary: What is the difference between push and pull models for managing backups with Plakar? Learn the pros and cons of each approach.
last_reviewed: "2025-12-08"
last_reviewed_version: "v1.0.6"
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

Let's say you want to store your Kloset repository on `backup.tld.com` to back up your infrastructure consisting of three servers: `server1.tld.com`, `server2.tld.com`, `server3.tld.com`.

## The push model

With the push model, you would configure Plakar on each server and set the remote repository to `backup.tld.com` over SFTP.

```bash
plakar store add mybackup sftp://backup.tld.com/var/backups
```

Then you would run the following command on each server:

```bash
plakar at "@mybackup" backup /home
```

## The pull model

With the pull model, you would configure Plakar on `backup.tld.com` to pull the data from each server.

```bash
plakar store add server1 sftp://server1.tld.com
plakar store add server2 sftp://server2.tld.com
plakar store add server3 sftp://server3.tld.com
```

Then you would run the following command on `backup.tld.com`:

```bash
plakar at /var/backups backup "@server1"
plakar at /var/backups backup "@server2"
plakar at /var/backups backup "@server3"
```

## Pros and cons

Plakar is different from other backup solutions because it allows you to choose where you want to run the backup command. You can run it on the remote server or on the backup server. This gives you flexibility in how you want to manage your backups.

Whether you choose the push or pull model depends on your use case:

- **Push model**: Useful if you want the backup process initiated from the servers themselves. It can be simpler to set up if you have a small number of servers and want each server to manage its own backups.
- **Pull model**: Useful if you want to centralize the backup process on the backup server. It can be easier if you have many servers, as you can manage backups, retention policies, and monitoring all from a single location. Another benefit is that the store encryption passphrase only resides on one server.
