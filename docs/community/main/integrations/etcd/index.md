
# etcd

The etcd integration takes snapshots of an etcd cluster and stores them in a
Kloset store with encryption and deduplication.

| Connector type       | Description                                  |
| -------------------- | -------------------------------------------- |
| **Source connector** | Back up an etcd cluster into a Kloset store. |

The source connector accepts three URI schemes, which differ only in how Plakar
reaches the etcd node:

| Protocol     | Transport |
| ------------ | --------- |
| `etcd`       | HTTPS     |
| `etcd+http`  | HTTP      |
| `etcd+https` | HTTPS     |

`etcd` uses HTTP instead when `plaintext` is set to `true`.

> [!NOTE]+ Version requirement
>
> Before etcd package v1.1.1, `etcd://` connected over HTTP. To keep reaching a
> node over HTTP, set `plaintext=true` or use `etcd+http://`.

**Requirements**

- Plakar v1.1.0-beta or later.
- Network access to at least one etcd node.

**Typical use cases**

- Disaster recovery for etcd clusters.
- Point-in-time snapshots of Kubernetes cluster state (for clusters using etcd
  as their backing store).

## Installation

{{< tabs >}}

{{< tab label="Pre-built package" >}}

Pre-compiled packages are available for common platforms and provide the
simplest installation method.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the etcd package:

```bash
$ plakar pkg add etcd
```

Verify installation:

```bash
$ plakar pkg show
```

{{< /tab >}}

{{< tab label="Building from source" >}}

Source builds are useful when pre-built packages are unavailable or when
customization is required.

**Prerequisites:**

- Go toolchain compatible with your **Plakar** version

Build the package:

```bash
$ plakar pkg build etcd
```

A package archive will be created in the current directory (e.g.,
`etcd_v1.1.0-rc.1_darwin_arm64.ptar`).

Install the package:

```bash
$ plakar pkg add -allow-unsigned ./etcd_v1.0.0_darwin_arm64.ptar
```

Verify installation:

```bash
$ plakar pkg show
```

{{< /tab >}}

{{< /tabs >}}

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages/).

## Configuration

The source connector connects to an etcd node, takes a snapshot of the cluster
through the etcd API, and ingests it into a Kloset store.

#### Backup flow

<!-- prettier-ignore-start -->
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
<!-- prettier-ignore-end -->

### Source configuration

| Option                   | Required | Description                                                                                                                |
| ------------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `location`               | Yes      | etcd node address. Use `etcd://`, `etcd+http://`, or `etcd+https://` followed by the hostname and optional port.           |
| `endpoints`              | No       | Comma-separated list of node endpoints. Takes priority over `location` when set.                                           |
| `username`               | No       | etcd username.                                                                                                             |
| `password`               | No       | etcd password.                                                                                                             |
| `plaintext`              | No       | Connect over plain HTTP for an `etcd://` location. The username and password are then sent in clear text. Default `false`. |
| `tls_insecure_no_verify` | No       | Disable TLS certificate verification. Anyone on the network path can then impersonate the server. Default `false`.         |
| `ca_file`                | No       | Path to the CA certificate used to verify the server, in PEM format. Defaults to the system roots.                         |
| `cert_file`              | No       | Path to the client certificate, in PEM format, for servers that require one.                                               |
| `key_file`               | No       | Path to the private key of `cert_file`, in PEM format.                                                                     |

> [!WARNING]+ TLS Certificate Verification
>
> Setting `tls_insecure_no_verify=true` disables TLS certificate verification,
> so anyone on the network path can impersonate the cluster. Only use it in
> controlled environments with self-signed certificates on trusted networks.

### Example

Back up by connecting to a node over HTTP:

```bash
$ plakar backup etcd+http://node1:2379
```

Back up using HTTPS with authentication:

```bash
$ plakar backup -o username=myuser -o password=secret etcd://node1:2379
```

Back up by specifying multiple nodes:

```bash
$ plakar backup -o endpoints=http://node1:2379,http://node2:2379 etcd://
```

## Restoring a snapshot

The etcd API does not support restoring a snapshot directly, so the integration
has no destination connector. To restore, first retrieve the snapshot from the
Kloset store to disk, then use `etcdutl` to provision a new etcd data directory
from it.

```bash
$ plakar at /var/backups restore -to ./etcd-snapshot <snapshot_id>
```

Then follow the upstream etcd recovery procedure to bring the cluster back up.
Refer to the
[etcd recovery documentation](https://etcd.io/docs/latest/op-guide/recovery/)
for full restore instructions.

## See also

- [etcd documentation](https://etcd.io/docs/)
- [Kubernetes integration](/docs/community/main/integrations/kubernetes/)

