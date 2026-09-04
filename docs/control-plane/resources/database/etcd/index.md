
# etcd

etcd resources represent a distributed key-value store, commonly used to hold
cluster state and configuration. Plakar Control Plane connects to a node of the
cluster and captures a snapshot of the whole key-value store. etcd integration
supports multiple protocols.

All etcd protocols are backup only. A snapshot is captured into a Kloset store,
but Plakar Control Plane never writes back to a cluster, so etcd resources have
no destination app. See [Recovering a cluster](#recovering-a-cluster) for how a
snapshot is put back into service.

## Inventory Management

No [managed inventory](../../infrastructure/inventories#managed-inventories) can
discover etcd clusters, so you need to set up a
[self-managed inventory](../../infrastructure/inventories/self-managed) and add
the resource manually.

### Adding etcd as a resource

Register the resource with no class or subclass. For the endpoint, use the
hostname of a node in the cluster with its port. See
[resources documentation](../../resources) for more information on how to set up
resources on a self-managed inventory.

## 1. `etcd` protocol

The `etcd` protocol connects to the cluster over plain HTTP. It is the default
form and behaves the same as `etcd+http`.

#### Backup flow

A backup captures a single file, `dump`, produced by the etcd snapshot API. It
holds the entire key-value store as of the moment the snapshot was taken, and is
the format `etcdutl` expects during recovery.

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Cluster["etcd Cluster"]
    Node["Cluster node"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["etcd<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"snapshot request over HTTP"| Node
  Node -->|"dump"| Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Source configuration

The following settings are available when configuring a source app using the
`etcd` protocol.

- **Endpoints**: Comma-separated list of node endpoints to connect to. Takes
  priority over the endpoint registered on the resource, which lets a backup
  reach several nodes of the same cluster rather than depending on a single one.
- **Password**: The password used to authenticate with the cluster.
- **Username**: The username used to authenticate with the cluster.

## 2. `etcd+http` protocol

The `etcd+http` protocol connects to the cluster over plain HTTP, stated
explicitly rather than relying on the default.

#### Backup flow

A backup captures a single file, `dump`, produced by the etcd snapshot API. It
holds the entire key-value store as of the moment the snapshot was taken, and is
the format `etcdutl` expects during recovery.

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Cluster["etcd Cluster"]
    Node["Cluster node"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["etcd<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"snapshot request over HTTP"| Node
  Node -->|"dump"| Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Source configuration

The following settings are available when configuring a source app using the
`etcd+http` protocol.

- **Endpoints**: Comma-separated list of node endpoints to connect to. Takes
  priority over the endpoint registered on the resource, which lets a backup
  reach several nodes of the same cluster rather than depending on a single one.
- **Password**: The password used to authenticate with the cluster.
- **Username**: The username used to authenticate with the cluster.

## 3. `etcd+https` protocol

The `etcd+https` protocol connects to the cluster over TLS. Use it whenever the
cluster is reached over an untrusted network, so credentials and cluster state
are not transmitted in clear text.

#### Backup flow

A backup captures a single file, `dump`, produced by the etcd snapshot API. It
holds the entire key-value store as of the moment the snapshot was taken, and is
the format `etcdutl` expects during recovery.

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Cluster["etcd Cluster"]
    Node["Cluster node"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["etcd<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"snapshot request over TLS"| Node
  Node -->|"dump"| Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Source configuration

The following settings are available when configuring a source app using the
`etcd+https` protocol.

- **Endpoints**: Comma-separated list of node endpoints to connect to. Takes
  priority over the endpoint registered on the resource, which lets a backup
  reach several nodes of the same cluster rather than depending on a single one.
- **Password**: The password used to authenticate with the cluster.
- **Username**: The username used to authenticate with the cluster.

## Recovering a cluster

etcd does not expose a way to restore a snapshot through its API, so Plakar
Control Plane cannot write one back into a running cluster. Recovery is a
two-step process: restore the `dump` file from the snapshot to disk, then use
`etcdutl` to provision a new etcd data directory from it.

See the
[etcd disaster recovery documentation](https://etcd.io/docs/latest/op-guide/recovery/)
for the upstream procedure.

