---
title: SFTP / SSH
description: Securely back up and restore remote directories over SFTP with Plakar — encrypted, verifiable, and portable.
technology_description: This integration leverages the SFTP protocol over SSH to securely transfer and verify remote directories into a Plakar Kloset for backup and restoration.
categories:
  - integrations
tags:
  - sftp
  - ssh
  - secure file transfer
  - remote directories
  - backup
  - disaster recovery
  - encryption
  - deduplication
  - versioning
  - immutable storage
  - compliance
  - long-term archiving
  - airgapped backup
  - snapshot technology
  - portable format
stage: beta
date: 2025-07-30
plakar_version: '>=1.0.4'
integration_version: '1.0.4'
resource_type: filesystem
provides:
  - source connector
  - destination connector
  - storage connector
---

> **Requirements**
>
> * Plakar `v1.0.4` or later
> * SFTP connector `v1.0.4`
> * An SFTP/SSH server reachable from the Plakar agent, with appropriate read/write permissions

## Introduction

Plakar's SFTP integration includes three connectors:

* **Storage connector** — host a Kloset store on any SFTP-accessible server.
* **Source connector** — back up a remote directory reachable over SFTP into a Kloset store.
* **Destination connector** — restore data from a Kloset store to an SFTP target.

**Typical use cases**

* Encrypted backups of remote Linux/BSD/application servers over SSH.
* Offsite or air-gapped snapshot storage by hosting a Kloset store on an SFTP server.
* DR workflows: restore server trees over SSH to warm or cold standby.
* Centralized archiving of distributed environments into one Kloset.

**Compatibility**

* Works with standard OpenSSH SFTP.
* On‑prem, cloud, and hybrid deployments supported.
* Legacy or proprietary SFTP variants that diverge from SSH/SFTP standards are not supported.

---

## Installation

Starting with Plakar `v1.0.4`, connectors are installed on demand.

Check if the SFTP package is installed:

```bash
$ plakar pkg list
sftp@v1.0.4
```

If it is missing, install it:

```bash
# Authenticate to the precompiled package repository
$ plakar login -email <Your Email Address>
# Confirm the link sent to your email, then:
$ plakar pkg add sftp
```

---

## Quick start

> **Prerequisites**
> - Have an ssh key loaded with access to the target SFTP server.

### Option A — Direct SFTP URLs (ad‑hoc)

```bash
# Create a Kloset store on a remote SFTP server
$ plakar at sftp://sftpuser@host.example.com/backups create
# Create a Kloset store in the user's home directory on a remote server
$ plakar at sftp://sftpuser@host.example.com/home/sftp-test/backups create

# Back up a local folder into that SFTP‑hosted store
$ plakar at sftp://sftpuser@host.example.com/backups backup /var/www

# Restore a file from a snapshot in that store
$ plakar at sftp://sftpuser@host.example.com/backups restore <snapshot_id>:/var/www/index.html
```

Direct URLs are self‑contained and require no prior configuration. Ideal for trials or one‑off operations.

### Option B — Named connectors (reusable)

Define reusable names for store/source/destination:

```bash
# Storage connector: host a Kloset store on SFTP
$ plakar store add sftp_store sftp://host.example.com/backups

# Source connector: back up a remote directory
$ plakar source add sftp_src sftp://host.example.com:/srv/data

# Destination connector: restore to an SFTP target
$ plakar destination add sftp_dst sftp://host.example.com:/srv/restore
```

Use them in commands:

```bash
# Initialize the store and back up the source
$ plakar at @sftp_store create
$ plakar at @sftp_store backup @sftp_src

# Restore a snapshot into the destination path
$ plakar at @sftp_store restore -to @sftp_dst <snapshot_id>
```

---

## SSH best practices for reliability

### Create a host alias (recommended)

Define an alias in `~/.ssh/config` so Plakar commands stay concise and stable:

```sshconfig
Host sftp-prod
    HostName host.example.com
    User sftpuser
    Port 22
    IdentityFile ~/.ssh/id_ed25519_plakar
```

Test the alias:

```bash
$ sftp sftp-prod
```

Then reference it in Plakar URLs:

```bash
$ plakar store add sftp_store sftp://sftp-prod/backups
$ plakar source add sftp_src  sftp://sftp-prod:/srv/data
$ plakar destination add sftp_dst sftp://sftp-prod:/srv/restore
```

### Use key‑based, passwordless SSH

Unattended jobs must not prompt for passwords.

```bash
$ ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_plakar -C plakar@backup
$ ssh-copy-id -i ~/.ssh/id_ed25519_plakar.pub sftpuser@host.example.com
$ sftp -i ~/.ssh/id_ed25519_plakar sftpuser@host.example.com
```

If your private key is encrypted, run an agent:

```bash
$ eval "$(ssh-agent -s)"
$ ssh-add ~/.ssh/id_ed25519_plakar
```

### Host keys and trust

For production, keep strict host key checking enabled and manage `~/.ssh/known_hosts` normally. Avoid disabling host key checks except in isolated test environments.

---

## Storage connector

Host a Kloset store on any SFTP server.

## {{< mermaid >}}
---
title: Hosting a Remote Kloset Store over SFTP
---

flowchart LR
    subgraph Sources[Source Connectors]
        direction LR
        DB[(Databases)]
        FS@{ shape: docs, label: "Filesystem/NAS" }
        SAAS[SAAS]
        RCLONE@{ shape: st-rect, label: "Rclone" }
        S3[S3‑compatible]
        IMAP[IMAP]
    end
    Sources e1@--> Plakar[Plakar Agent]
    Plakar e2@-->|SFTP| Kloset(((Kloset Store)))
    classDef animate stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
    class e1 animate
    class e2 animate
{{< /mermaid >}}

**Configure**

```bash
$ plakar store add sftp_store sftp://sftp-prod/backups
$ plakar at @sftp_store create
$ plakar at @sftp_store ls
```

**Common options**

| Option     | Purpose                                                            |
| ---------- | ------------------------------------------------------------------ |
| `location` | `sftp://[user@]host[:port]/path` where the Kloset store will live  |
| SSH config | Username, port, and identity are typically set via `~/.ssh/config` |

---

## Source connector

Back up a remote directory over SFTP into any Kloset store.

{{< mermaid >}}
---
title: Back up a remote SFTP directory
---

flowchart LR
    DIR@{ shape: docs, label: "/srv/data" }
    DIR e1@-- SFTP --> Plakar[Plakar Agent]
    Plakar e2@-->|SFTP| SFTP_Target(((Kloset Store)))
    Plakar e3@-->|Rclone| Rclone_Target(((Kloset Store)))
    Plakar e4@-->|S3-Compatible| S3_Target(((Kloset Store)))
    Plakar e5@-->|Filesystem| FS_Target(((Kloset Store)))
    Plakar e6@-->|...| All_Target(((Kloset Store)))
    classDef animate stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
    class e1 animate
    class e2 animate
    class e3 animate
    class e4 animate
    class e5 animate
    class e6 animate
{{< /mermaid >}}

**Configure and run**

```bash
$ plakar source add sftp_src sftp://sftp-prod:/srv/data
$ plakar at @sftp_store backup @sftp_src
```

---

## Destination connector

Restore data from a Kloset store to an SFTP target.

## {{< mermaid >}}
---
title: Restore a snapshot to SFTP
---
flowchart LR
    Kloset(((Kloset Store)))
    Kloset e1@--> Plakar[Plakar Agent]
    DIR@{ shape: docs, label: "/srv/data" }
    Plakar e2@-- SFTP --> DIR
    classDef animate stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
    class e1 animate
    class e2 animate
{{< /mermaid >}}

**Configure and run**

```bash
$ plakar destination add sftp_dst sftp://sftp-prod:/srv/restore
$ plakar at @sftp_store restore -to @sftp_dst <snapshot_id>
```

---

## Limitations and scope

**What is captured**

* Files and directories reachable under the specified SFTP path
* File metadata (timestamps, permissions, sizes)

**What is not captured**

* System configuration outside the backed‑up path (e.g., SSHD config, firewall rules)
* OS user and group database, running processes, or service state
* SSH server settings and `known_hosts`

**Snapshot consistency**

Object changes during backup (creates/updates/deletes) may lead to a snapshot that reflects different points in time for different files. For highly dynamic paths, consider quiescing the workload or backing up from a read‑only replica.

---

## Troubleshooting

**Authentication or permission errors**

* Validate the SSH key, username, and target path permissions.
* Ensure the SFTP subsystem is enabled on the server.

**Host key verification failed**

* Connect once interactively to record the host key in `~/.ssh/known_hosts`.
* Only use any `insecure_ignore_host_key=true`‑style option in throw‑away test setups.

**Chroot or path issues**

* If the server uses chrooted SFTP, verify the effective path inside the chroot matches your URL.

**Passphrase prompts**

* Use `ssh-agent` to cache the key, or deploy a dedicated non‑encrypted key restricted to the backup account.

---

## Backup strategy

* Schedule recurring snapshots (daily or weekly) based on data volatility and recovery objectives.
* Keep multiple generations for rollbacks and audits.
* Follow a 3‑2‑1 approach (3 copies, 2 media, 1 offsite) when feasible.
* Periodically verify with `plakar verify` and perform restore drills.

---

## FAQ

**How do I set username, port, or identity file?**

Prefer SSH config (`~/.ssh/config`) with a host alias.

**Can I move snapshots between two SFTP‑hosted stores?**

Yes. Define two stores, then use `plakar ... sync` between them.

---

## Appendix

* [Plakar Architecture (Kloset Engine)](https://www.plakar.io/posts/2025-04-29/kloset-the-immutable-data-store/)
* [OpenSSH / SFTP Documentation](https://man.openbsd.org/sftp.1)
