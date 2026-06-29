
# OCI Registry

The **OCI Registry integration** enables Plakar to use any OCI-compliant
container registry as a native Kloset store backend. Repository data is encoded
as OCI artifacts and pushed to the registry, making it easy to host backups
alongside container images while benefiting from cloud-native distribution,
replication, and access controls.

Popular supported registries include Docker Hub, Amazon ECR, Google Artifact
Registry, Azure Container Registry, GitHub Container Registry, and self-hosted
registries such as Harbor.

The OCI Registry integration provides one connector:

| Connector type        | Description                                    |
| --------------------- | ---------------------------------------------- |
| **Storage connector** | Use an OCI registry as a Kloset store backend. |

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
$ plakar pkg list
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
$ plakar pkg add ./oci_v1.0.0_darwin_arm64.ptar
```

Verify installation:

```bash
$ plakar pkg list
```

{{< /tab >}}

{{< /tabs >}}

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages/).

## Configuration

### Configuration options

| Option     | Required | Description                                                                                           |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `location` | Yes      | OCI registry reference where the store lives, for example `oci://localhost:5000/my-org/plakar-store`. |

> [!NOTE]+
>
> Authentication is not yet supported and will be added in an upcoming release.

## Storage connector

The storage connector uses an OCI registry as the backend for a Kloset store.
Packfiles, states, indexes, and metadata are stored as OCI artifacts under a
dedicated repository namespace. Blobs map to OCI layers using content-addressed
storage, enabling strong integrity guarantees and efficient deduplication.

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

Start a local test registry:

```bash
$ docker run -d --name oci-registry \
  -p 5000:5000 \
  -v $(pwd)/registry-data:/var/lib/registry \
  registry:2
```

Initialize the store and run a backup:

```bash
$ plakar at oci://localhost:5000/my-org/plakar-store create
$ plakar at oci://localhost:5000/my-org/plakar-store backup /var/www
```

List snapshots and restore:

```bash
$ plakar at oci://localhost:5000/my-org/plakar-store ls
$ plakar at oci://localhost:5000/my-org/plakar-store restore <snapshot_id>
```

## Notes

- Use dedicated repository namespaces for backup data to avoid mixing with
  container images.
- Enable immutability and retention policies on the registry when available.
- Garbage collection behaviour is registry-specific and may affect stored data.
- Some registries enforce rate limits on pushes and pulls that can affect
  performance with large repositories.
- The integration targets the OCI Distribution Specification and works with any
  compliant registry implementation.

