---
title: "etcd"
date: "2026-04-02T00:00:00Z"
weight: 13
summary: "Back up etcd clusters with Plakar."
---

# etcd

The etcd integration takes snapshots of an etcd cluster and stores them in a Kloset store with encryption and deduplication.

| Connector type          | Description |
| ----------------------- | ----------- |
| **Source connector** | Back up an etcd cluster into a Kloset store. |

**Requirements**

* Plakar v1.1.0-beta or later.
* Network access to at least one etcd node.

**Typical use cases**

* Disaster recovery for etcd clusters.
* Point-in-time snapshots of Kubernetes cluster state (for clusters using etcd as their backing store).

## Installation


{{< tabs >}}
  {{< tab label="Pre-built package" >}}
  
  Pre-compiled packages are available for common platforms and provide the simplest installation method.
  
  > [!NOTE]+ Logging In
  > Pre-built packages require Plakar authentication. See [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.
  
  Install the etcd package:
  
  ```bash
  $ plakar pkg add etcd
  ```

  Verify installation:
  
  ```bash
  $ plakar pkg list
  ```
  
  {{< /tab >}}
  {{< tab label="Building from source" >}}
  
  Source builds are useful when pre-built packages are unavailable or when customization is required.

  **Prerequisites:**
  - Go toolchain compatible with your **Plakar** version
  
  Build the package:
  
  ```bash
  $ plakar pkg build etcd
  ```
  
  A package archive will be created in the current directory (e.g., `etcd_v1.1.0-rc.1_darwin_arm64.ptar`).
  
  Install the package:
  
  ```bash
  $ plakar pkg add ./etcd_v1.0.0_darwin_arm64.ptar
  ```
  
  Verify installation:
  ```bash
  $ plakar pkg list
  ```
  
  {{< /tab >}}
{{< /tabs >}}

To list, upgrade, or remove the package, see [managing packages guide](../../guides/managing-packages/).

## Source connector

The source connector connects to an etcd node, takes a snapshot of the cluster, and ingests it into a Kloset store.

{{< mermaid >}}
flowchart LR

subgraph Source["etcd Cluster"]
  DB["Cluster state"]
end

Plakar["Plakar"]

Via["Retrieve snapshot via<br/>etcd API"]

Transform["Encrypt & deduplicate"]

Store["Kloset Store"]

DB --> Via --> Plakar --> Transform --> Store
{{< /mermaid >}}

### Back up a cluster

Back up by connecting to a node over HTTP:

```bash
$ plakar backup etcd://node1:2379
```

Back up using HTTPS with authentication:

```bash
$ plakar backup -o username=myuser -o password=secret etcd+https://node1:2379
```

Back up by specifying multiple nodes:

```bash
$ plakar backup -o endpoints=http://node1:2379,http://node2:2379 etcd://
```

### Options

| Option      | Required | Description |
| ----------- | -------- | ----------- |
| `location`  | Yes      | etcd node address. Use `etcd://`, `etcd+http://`, or `etcd+https://` followed by the hostname and optional port. |
| `endpoints` | No       | Comma-separated list of node endpoints. Takes priority over `location` when set. |
| `username`  | No       | etcd username. |
| `password`  | No       | etcd password. |

## Restoring

The etcd API does not support restoring a snapshot directly. To restore, first retrieve the snapshot from the Kloset store to disk, then use `etcdutl` to provision a new etcd data directory from it.

```bash
$ plakar at /var/backups restore -to ./etcd-snapshot <snapshot_id>
```

Then follow the upstream etcd recovery procedure to bring the cluster back up.

Refer to the [etcd recovery documentation](https://etcd.io/docs/latest/op-guide/recovery/) for full restore instructions.

## See also

* [etcd documentation](https://etcd.io/docs/)
* [Kubernetes integration](/docs/main/integrations/kubernetes/)
