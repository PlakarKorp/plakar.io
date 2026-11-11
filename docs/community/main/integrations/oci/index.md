
# OCI Registry

The OCI Registry integration uses an OCI-compliant container registry as a
Kloset store backend. Store data is encoded as OCI artifacts and pushed to the
registry. Backups can then be hosted alongside container images and use the
distribution, replication and access controls of the registry.

Supported registries include Docker Hub, Amazon ECR, Google Artifact Registry,
Azure Container Registry, GitHub Container Registry, and self-hosted registries
such as Harbor.

The integration includes one connector:

| Connector type      | Description                                    |
| ------------------- | ---------------------------------------------- |
| **Store connector** | Use an OCI registry as a Kloset store backend. |

**Requirements**

- A registry implementing the OCI Distribution Specification, reachable from the
  machine running Plakar.

## Installation

The OCI Registry package can be installed using pre-built binaries or compiled
from source.

{{< tabs >}}

{{< tab label="Pre-built package" >}}

Pre-compiled packages are available for common platforms and provide the
simplest installation method.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the OCI Registry package:

```bash
$ plakar pkg add oci
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
$ plakar pkg build oci
```

A package archive will be created in the current directory (e.g.,
`oci_v1.0.0_darwin_arm64.ptar`).

Install the package:

```bash
$ plakar pkg add -allow-unsigned ./oci_v1.0.0_darwin_arm64.ptar
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

The store connector uses the `oci://` protocol and talks to the registry through
the OCI Distribution API. Packfiles, states, indexes and metadata are stored as
OCI artifacts under a dedicated repository namespace. Blobs map to OCI layers
using content-addressed storage.

#### Store flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Sources["Any Source"]
  FS["Data"]
end

subgraph Plakar["Plakar"]
  Transform["Encrypt & deduplicate"]
  Connector["Store via<br/>OCI Distribution API"]
  Transform --> Connector
end

Sources --> Transform

subgraph Storage["OCI Registry"]
  Store["Kloset Store"]
end

Connector --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Store configuration

| Option                     | Required | Description                                                                                                                         |
| -------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `location`                 | Yes      | OCI registry reference where the store lives, for example `oci://registry.example.com/my-org/plakar-store`.                         |
| `insecure`                 | No       | Set to `true` to connect to the registry over plaintext HTTP instead of TLS. Defaults to `false`.                                   |
| `tls_insecure_no_verify`   | No       | Skip TLS certificate verification. Defaults to `false`. Cannot be combined with `insecure=true`. See the warning below.             |
| `allow_cross_host_uploads` | No       | Set to `true` to allow uploads to a host other than the registry. Defaults to `false`. See [Uploads](#uploads).                     |

> [!NOTE]+ Authentication
>
> Authentication is not yet supported and will be added in an upcoming release.

#### TLS

The connector connects to the registry over TLS and verifies its certificate.
A registry that only serves plaintext HTTP, such as a default local `registry:2`
container, needs `insecure=true`.

> [!WARNING]+ Plaintext and unverified connections
>
> With `insecure=true`, all traffic to the registry is sent in cleartext. With
> `tls_insecure_no_verify=true`, the connection is open to man-in-the-middle
> attacks. Only use either option for testing or on trusted networks.

#### Uploads

When Plakar uploads data, the registry tells it where to send the data. By
default, Plakar only sends it to the registry host set in `location`. If the
registry points the upload to another host, the operation fails.

Some registries hand uploads off to a separate storage host. For those, set
`allow_cross_host_uploads=true`. Plakar never sends an upload over plaintext
HTTP when the store is configured for TLS, even with this option set.

### Example

Start a local test registry:

```bash
$ docker run -d --name oci-registry \
  -p 5000:5000 \
  -v $(pwd)/registry-data:/var/lib/registry \
  registry:2
```

This registry serves plaintext HTTP, so the store needs `insecure=true`:

```bash
$ plakar store add my-oci oci://localhost:5000/my-org/plakar-store insecure=true
```

Initialize the store and run a backup:

```bash
$ plakar at "@my-oci" create
$ plakar at "@my-oci" backup /var/www
```

List snapshots and restore:

```bash
$ plakar at "@my-oci" ls
$ plakar at "@my-oci" restore <snapshot_id>
```

## Limitations and scope

The integration targets the OCI Distribution Specification and works with any
compliant registry implementation.

Garbage collection behaviour is registry-specific and may affect stored data.
Some registries enforce rate limits on pushes and pulls, which can affect
performance with large repositories.

Use dedicated repository namespaces for backup data to avoid mixing it with
container images. Enable immutability and retention policies on the registry
when available.

## See also

- [Creating a Kloset Store](../../guides/create-kloset-repository)
- [Managing packages](../../guides/managing-packages)

