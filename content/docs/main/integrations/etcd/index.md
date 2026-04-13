---
title: etcd
summary: Back up etcd clusters with Plakar.
date: "2026-04-13T00:00:00Z"
---

The etcd integration takes snapshots of an etcd cluster and stores them in a Kloset store with encryption and deduplication.

| Connector type          | Description |
| ----------------------- | ----------- |
| ✅ **Source connector** | Back up an etcd cluster into a Kloset store. |

**Requirements**

* Plakar v1.1.0-beta or later.
* Network access to at least one etcd node.

**Typical use cases**

* Disaster recovery for etcd clusters.
* Point-in-time snapshots of Kubernetes cluster state (for clusters using etcd as their backing store).

## Installation

{{< tabs name="Installation Methods" >}}
{{% tab name="Pre-built package" %}}
**Note:** Installing pre-built packages requires authentication with Plakar. See [Login to Plakar to unlock features](../../guides/what-is-plakar-login/).

Install the etcd package:

```bash
$ plakar pkg add etcd
```

Verify the installation:

```bash
$ plakar pkg list
```
{{% /tab %}}

{{% tab name="Building from source" %}}
**Prerequisites**

* A working Go toolchain compatible with your version of Plakar.

Build and install the etcd package:

```bash
$ plakar pkg build etcd
$ plakar pkg add ./etcd_v1.1.0-beta_linux_amd64.ptar
```

Verify the installation:

```bash
$ plakar pkg list
```
{{% /tab %}}
{{< /tabs >}}

To list, upgrade, or remove the package, see [managing packages guide](../../guides/managing-packages/).

## Source connector

The source connector connects to an etcd node, takes a snapshot of the cluster, and ingests it into a Kloset store.

{{< mermaid >}}
flowchart LR

subgraph Source[<b>etcd Cluster</b>]
  db@{ shape: cyl, label: "Cluster state" }
end

subgraph Plakar[<b>Plakar</b>]
  Connector@{ shape: rect, label: "<small>Retrieve snapshot via</small><br><b>etcd API</b>" }
  Transform@{ shape: rect, label: "<small>Encrypt & deduplicate</small>" }
  Connector --> Transform
end

Source --> Connector
Store@{ shape: cyl, label: "Kloset Store" }
Transform --> Store

classDef sourceBox fill:#ffe4e6,stroke:#cad5e2,stroke-width:1px
classDef brandBox fill:#524cff,color:#ffffff
classDef storeBox fill:#dbeafe,stroke:#cad5e2,stroke-width:1px
class Source sourceBox
class Plakar brandBox
class Store storeBox
linkStyle default stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
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
