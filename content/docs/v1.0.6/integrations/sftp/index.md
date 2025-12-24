---
title: SFTP / SSH
summary: Back up and restore remote directories over SFTP/SSH, and host Kloset stores on remote SFTP servers.
date: "2025-12-23T00:00:00Z"
---

SFTP is a protocol for securely transferring files over SSH. The SFTP integration includes three connectors:

| Connector type               | Description
| ---------------------------- | -----------
| ✅ **Storage connector**     | Host a Kloset store on any SFTP-accessible server.
| ✅ **Source connector**      | Back up a remote directory reachable over SFTP into a Kloset store.
| ✅ **Destination connector** | Restore data from a Kloset store to an SFTP target.

**Requirements**

* An SFTP/SSH server with appropriate read and write permissions.

**Typical use cases**

* Encrypted backups of remote Linux/BSD/application servers over SSH.
* Offsite or air-gapped snapshot storage by hosting a Kloset store on an SFTP server.
* Data recovery workflows: restore server trees over SSH to warm or cold standby.
* Centralized archiving of distributed environments into one Kloset.

**Compatibility**

* Works with standard OpenSSH SFTP.
* On‑prem, cloud, and hybrid deployments supported.
* Legacy or proprietary SFTP variants that diverge from SSH/SFTP standards are not supported.

---

## Installation

The SFTP integration is distributed as a Plakar package. It can be installed either by downloading a pre-built package or by building it from source.

{{< tabs name="Installation Methods" >}}
{{% tab name="Pre-built package" %}}
Plakar provides pre-compiled packages for common platforms. This is the simplest installation method and is suitable for most users.

**Note:** Installing pre-built packages requires you to be authenticated with Plakar. See [Login to Plakar to unlock features](../../guides/what-is-plakar-login/).

Install the SFTP package:

```bash
$ plakar pkg add sftp
```

Verify the installation:

```bash
$ plakar pkg list
```
{{< /tab >}}

{{% tab name="Building from source" %}}
Building from source is useful if you cannot use pre-built packages.

**Prerequisites**

* A working Go toolchain compatible with your version of Plakar.

Build the SFTP package:

```bash
$ plakar pkg build sftp
```

On success, a package archive is generated in the current directory, for example `sftp_v1.0.7_darwin_arm64.ptar`.

Install the generated package:

```bash
$ plakar pkg add ./sftp_v1.0.7_darwin_arm64.ptar
```

Verify the installation:

```bash
$ plakar pkg list
```
{{< /tab >}}

{{% tab name="Reinstalling or upgrading" %}}
To check whether the SFTP package is already installed:

```bash
$ plakar pkg list
```

To upgrade to the latest available version, remove the existing package and reinstall it:

```bash
$ plakar pkg rm sftp
$ plakar pkg add sftp
```

This preserves existing store, source, and destination configurations.
{{< /tab >}}
{{< /tabs >}}

---

## Connectors

The SFTP package provides three connectors: a storage connector for hosting Kloset stores on SFTP servers, a source connector for backing up remote directories over SFTP, and a destination connector for restoring data over SFTP.

You can use any combination of these connectors together with other supported Plakar connectors.

### Storage connector

The Plakar SFTP package provides a storage connector to host Kloset stores on SFTP servers.

{{< mermaid >}}
flowchart LR

Source@{ shape: cloud, label: "Source data" }

Source --> Plakar[<b>Plakar</b>]

subgraph Store[<b>SFTP Server</b>]
  Kloset@{ shape: cyl, label: "Kloset Store" }
end

Plakar -- <small>Store snapshot via</small><br><b>SFTP storage connector</b> --> Store

%% Apply classes
class Source sourceBox
class Plakar brandBox
class Store storeBox

%% Classes definitions
classDef sourceBox fill:#ffe4e6,stroke:#cad5e2,stroke-width:1px
classDef brandBox fill:#524cff,color:#ffffff
classDef storeBox fill:#dbeafe,stroke:#cad5e2,stroke-width:1px

linkStyle default stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
{{< /mermaid >}}

#### Configure

```bash
# Configure a Kloset store
$ plakar store add sftp_store sftp://sftp-prod/backups

# Initialize the Kloset store
$ plakar at @sftp_store create
# List snapshots in the Kloset store
$ plakar at @sftp_store ls
```

#### Options

| Option     | Description                      |
| ---------- | -------------------------------- |
| `location` | `sftp://[user@]host[:port]/path` |


### Source connector

The Plakar SFTP package provides a source connector to back up remote directories reachable over SFTP. The Kloset store where data is stored can be hosted on any supported backend.

{{< mermaid >}}
flowchart LR

subgraph Source[<b>SFTP Server</b>]
  fs@{ shape: st-rect, label: "/srv/data" }
end

Source -- <small>Retrieve data via</small><br><b>SFTP source connector</b> --> Plakar

Store@{ shape: cyl, label: "Kloset Store" }

Plakar --> Store

%% Apply classes
class Source sourceBox
class Plakar brandBox
class Store storeBox

%% Classes definitions
classDef sourceBox fill:#ffe4e6,stroke:#cad5e2,stroke-width:1px
classDef brandBox fill:#524cff,color:#ffffff
classDef storeBox fill:#dbeafe,stroke:#cad5e2,stroke-width:1px

linkStyle default stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
{{< /mermaid >}}

#### Configure

```bash
# Configure a source pointing to the remote SFTP directory
$ plakar source add sftp_src sftp://sftp-prod:/srv/data

# Back up the remote directory to the Kloset store on the filesystem
$ plakar at /var/backups backup @sftp_src
# Or back up the remote directory to the Kloset store on SFTP created above
$ plakar at @sftp_store backup @sftp_src
```

#### Options

| Option     | Purpose                                                             |
| ---------- | ------------------------------------------------------------------- |
| `location` | `sftp://[user@]host[:port]/path` of the remote directory to back up |

---

### Destination connector

The Plakar SFTP package provides a destination connector to restore data over SFTP. The source Kloset store can be hosted on any supported backend.

{{< mermaid >}}
flowchart LR

Store@{ shape: cyl, label: "Kloset Store" }

Store --> Plakar

subgraph Destination[<b>SFTP Server</b>]
  fs@{ shape: st-rect, label: "/srv/data" }
end

Plakar -- <small>Push data via</small><br><b>SFTP destination connector</b> --> Destination

%% Apply classes
class Destination destinationBox
class Plakar brandBox
class Store storeBox

%% Classes definitions
classDef destinationBox fill:#d0fae5,stroke:#cad5e2,stroke-width:1px
classDef brandBox fill:#524cff,color:#ffffff
classDef storeBox fill:#dbeafe,stroke:#cad5e2,stroke-width:1px

linkStyle default stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
{{< /mermaid >}}

#### Configure

```bash
# Configure a destination pointing to the remote SFTP directory
$ plakar destination add sftp_dst sftp://sftp-prod:/srv/restore

# Restore a snapshot from a filesystem-hosted Kloset store to the remote SFTP directory
$ plakar at /var/backups restore -to @sftp_dst <snapshot_id>
# Or restore a snapshot from the Kloset store on SFTP created above to the remote SFTP directory
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
$ plakar source add sftp_src sftp://sftp-prod:/srv/data
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

## Limitations and scope

**What is captured during backup**

* Files and directories reachable under the specified SFTP path
* File metadata (timestamps, permissions, sizes)

**What is not captured**

* System configuration outside the backed‑up path (e.g., SSHD config, firewall rules)
* OS user and group database, running processes, or service state
* SSH server settings and `known_hosts`

**Snapshot consistency**

Changes during backup (creates, updates, deletes) may result in a snapshot that reflects different points in time for different files. For highly dynamic paths, consider quiescing the workload or backing up from a read‑only replica.

---

## Troubleshooting

**Authentication or permission errors**

* Validate the SSH key, username, and target path permissions.
* Ensure the SFTP subsystem is enabled on the server.

**Host key verification failed**

* Connect once interactively to record the host key in `~/.ssh/known_hosts`.
* Only use `insecure_ignore_host_key=true`-style options in disposable test environments.


**Chroot or path issues**

* If the server uses chrooted SFTP, verify the effective path inside the chroot matches your URL.

**Passphrase prompts**

* Use `ssh-agent` to cache the key, or deploy a dedicated non‑encrypted key restricted to the backup account.

---

## FAQ

**How do I set username, port, or identity file?**

Prefer SSH config (`~/.ssh/config`) with a host alias.

**Can I move snapshots between two SFTP‑hosted stores?**

Yes. Define two stores, then use `plakar at @store1 sync to @store2` to synchronize them.

---

## Appendix

* [Plakar Architecture (Kloset Engine)](https://www.plakar.io/posts/2025-04-29/kloset-the-immutable-data-store/)
* [OpenSSH / SFTP Documentation](https://man.openbsd.org/sftp.1)
