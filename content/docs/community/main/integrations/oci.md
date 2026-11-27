---
title: "OCI Registry"
date: "2026-06-18T00:00:00Z"
weight: 19
summary: "Use an OCI registry as a Kloset store backend with Plakar."
---

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

| Option                     | Required | Description                                                                                                             |
| -------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| `location`                 | Yes      | OCI registry reference where the store lives, for example `oci://registry.example.com/my-org/plakar-store`.             |
| `username`                 | No       | Registry user. Also used to obtain tokens from the token service of the registry.                                       |
| `password`                 | No       | Password or personal access token of the user. Requires `username`.                                                     |
| `token`                    | No       | Bearer token sent as is to the registry. Cannot be combined with `username`.                                            |
| `token_realm`              | No       | Host of the token service of the registry, when it is not the registry itself. See [Authentication](#authentication).   |
| `insecure`                 | No       | Set to `true` to connect to the registry over plaintext HTTP instead of TLS. Defaults to `false`.                       |
| `tls_insecure_no_verify`   | No       | Skip TLS certificate verification. Defaults to `false`. Cannot be combined with `insecure=true`. See the warning below. |
| `allow_cross_host_uploads` | No       | Set to `true` to allow uploads to a host other than the registry. Defaults to `false`. See [Uploads](#uploads).         |

#### Authentication

The connector authenticates in one of three ways:

- **Username and password**: set `username` and `password`. The password is
  often a personal access token. The password is only sent once the registry
  asks for basic authentication.
- **Token service**: registries such as Docker Hub, GitHub Container Registry,
  Amazon ECR and Harbor ask for a token instead. With `username` and `password`
  set, the connector obtains a token scoped to the repository from the token
  service of the registry, and reuses it until it expires.
- **Static token**: set `token` to send a bearer token as is, instead of a
  username and password.

Most registries run their token service on the registry host, and Docker Hub's
is known, so nothing else is needed. For a registry whose token service is on
another host, set `token_realm` to that host.

Credentials are only sent to the registry host and its token service, over TLS
unless `insecure=true`. Credentials never go in `location`.

#### TLS

The connector connects to the registry over TLS and verifies its certificate. A
registry that only serves plaintext HTTP, such as a default local `registry:2`
container, needs `insecure=true`.

> [!WARNING]+ Plaintext and unverified connections
>
> With `insecure=true`, all traffic to the registry is sent in cleartext. With
> `tls_insecure_no_verify=true`, the connection is open to man-in-the-middle
> attacks. Only use either option for testing or on trusted networks.

#### Downloads

Registries often redirect downloads to a CDN or an object store. Plakar follows
these redirects, but never from TLS to plaintext HTTP, and does not send
credentials to the other host.

#### Uploads

When Plakar uploads data, the registry tells it where to send the data. By
default, Plakar only sends it to the registry host set in `location`. If the
registry points the upload to another host, the operation fails.

Some registries hand uploads off to a separate storage host. For those, set
`allow_cross_host_uploads=true`. Plakar never sends an upload over plaintext
HTTP when the store is configured for TLS, even with this option set.

#### Deleting data

Plakar deletes its locks, and maintenance deletes packfiles, so the registry
must allow deletes. Deleting an object removes only its own tag. On registries
that cannot remove a tag, Plakar deletes the manifest of the object instead,
which no other object shares. The registry keeps the underlying data until its
garbage collection runs, so run it regularly to reclaim space.

### Example

Start a local test registry with deletes enabled:

```bash
$ docker run -d --name oci-registry \
  -p 5000:5000 \
  -e REGISTRY_STORAGE_DELETE_ENABLED=true \
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

On a hosted registry, such as GitHub Container Registry, authenticate with a
personal access token:

```bash
$ plakar store add ghcr oci://ghcr.io/my-org/plakar-store username=my-user password=<token>
$ plakar at "@ghcr" create
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
