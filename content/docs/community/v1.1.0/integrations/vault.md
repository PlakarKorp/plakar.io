---
title: "HashiCorp Vault"
date: "2026-11-27T00:00:00Z"
weight: 42
summary: "Back up and restore a HashiCorp Vault cluster with Plakar."
---

# HashiCorp Vault

The Vault integration backs up a HashiCorp Vault cluster that uses integrated
storage. Each backup takes a Raft snapshot of the cluster, which holds all of
its data, and stores it in a Kloset store. A restore loads that snapshot back
into a Vault cluster.

The integration includes two connectors:

| Connector type            | Description                                   |
| ------------------------- | --------------------------------------------- |
| **Source connector**      | Back up a Vault cluster as a Raft snapshot.   |
| **Destination connector** | Restore a Raft snapshot into a Vault cluster. |

**Requirements**

- A Vault cluster using integrated storage (Raft), reachable from the machine
  running Plakar.
- A Vault token whose policy grants access to `sys/storage/raft/snapshot`, and
  to `sys/storage/raft/snapshot-force` when restoring with `force`.

**Typical use cases**

- Keeping versioned, off-cluster copies of a Vault cluster's secrets and
  configuration.
- Returning a Vault cluster to an earlier state.
- Rebuilding a Vault cluster on new infrastructure.

## Installation

The Vault integration is distributed as a pre-built package only. It has no
public source repository, so `plakar pkg build` cannot produce it. It remains
free to install with a Plakar account. See
[source availability](../../guides/managing-packages#source-availability) for
how this differs from the other integrations.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the Vault package:

```bash
$ plakar pkg add vault
```

Verify installation:

```bash
$ plakar pkg show
```

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages).

## How backup and restore work

A backup stores the Raft snapshot as a single file, `/vault-raft-snapshot`. One
source covers one cluster. Back up several clusters with one source each.

A restore resets the destination cluster to the state it was in when the
snapshot was taken. By default, Vault accepts the snapshot only if its unseal
keys, Shamir or auto-unseal, match those of the destination. This is the case
when restoring a cluster to an earlier state of itself.

Restoring into a different cluster, such as a freshly provisioned one, requires
`force=true`. After a forced restore, the destination cluster uses the unseal
keys of the cluster the snapshot came from.

> [!WARNING]+ Forced Restore
>
> A forced restore replaces all data and the unseal keys of the destination
> cluster. Check the destination before restoring with `force=true`.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Source["Vault cluster"]
  Data["Integrated storage"]
end

Via["Take a Raft snapshot"]

Plakar["Plakar"]

Store["Kloset Store"]

Data --> Via --> Plakar --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

Store["Kloset Store"]

Plakar["Plakar"]

Via["Restore the Raft snapshot"]

subgraph Destination["Vault cluster"]
  Data["Integrated storage"]
end

Store --> Plakar --> Via --> Data
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Configuration

The location is the address of the Vault server, such as
`vault://vault.example.com:8200`. Plakar connects over HTTPS unless `insecure`
is set to `true`.

### Shared configuration

| Option     | Required | Description                                                               |
| ---------- | -------- | ------------------------------------------------------------------------- |
| `location` | Yes      | Vault server address, such as `vault://vault.example.com:8200`.           |
| `token`    | Yes      | Vault access token.                                                       |
| `port`     | No       | Port of the Vault server. Overrides the port in `location`.               |
| `insecure` | No       | Set to `true` to connect over HTTP instead of HTTPS. Defaults to `false`. |

### Destination configuration

| Option  | Required | Description                                                                                               |
| ------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `force` | No       | Set to `true` to restore a snapshot whose unseal keys differ from the destination's. Defaults to `false`. |

> [!WARNING]+ Cleartext Connection
>
> With `insecure=true`, the token and the Raft snapshot, which holds every
> secret of the cluster, travel in cleartext. Only use it on a trusted network.

### Example

```bash
# Configure the cluster as a backup source
$ plakar source add myvault vault://vault.example.com:8200 token=<YOUR_TOKEN>

# Back up the cluster to a Kloset store
$ plakar at /var/backups backup "@myvault"

# Configure a new cluster as a restore destination
$ plakar destination add newvault vault://vault2.example.com:8200 \
  token=<YOUR_TOKEN> force=true

# Restore the snapshot into the new cluster
$ plakar at /var/backups restore -to "@newvault" <snapshot_id>
```

## See also

- [Managing packages](../../guides/managing-packages)
- [Vault integrated storage](https://developer.hashicorp.com/vault/docs/configuration/storage/raft)
