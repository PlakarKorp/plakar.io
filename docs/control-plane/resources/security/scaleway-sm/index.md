
# Scaleway Secret Manager

Scaleway Secret Manager resources represent secrets stored in a Scaleway
project. Plakar Control Plane backs up secrets using the Scaleway Secret Manager
API and stores their values in the Kloset store. During restore, Plakar Control
Plane writes the secrets back to a Scaleway Secret Manager project. The
destination project can be different from the source project, which makes it
possible to copy secrets across projects or regions.

## Inventory Management

[Managed inventories](../../infrastructure/inventories#managed-inventories) can
discover Scaleway Secret Manager resources automatically once connected to your
Scaleway project. Scaleway Secret Manager resources are only discovered by the
[Scaleway inventory](../../infrastructure/inventories/scaleway) and cannot be
setup by a self-managed inventory.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Scaleway["Scaleway Project (source)"]
    Secrets["Secrets"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["Scaleway Secret Manager<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"read secrets"| Secrets
  Secrets --> Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  Store["Kloset Store"]

  subgraph Plakar["Plakar Control Plane"]
    Destination["Scaleway Secret Manager<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph Scaleway["Scaleway Project (destination)"]
    Secrets["Secrets"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"write secrets"| Secrets
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Shared Configuration

The following settings are available when configuring source or destination
apps.

- **Access Key**: Required. The access key used to authenticate with Scaleway.
  See the documentation on
  [Managing IAM Policies and API Keys on Scaleway](../../../guides/scaleway/iam-and-api-keys)
  for instructions on how to set up the permissions and generate an access key
  and secret key.
- **Secret Key**: Required. The secret key used to authenticate with Scaleway.
- **Region**: The Scaleway region where the secrets are stored, for example
  `fr-par`.

## Permissions

Plakar Control Plane requires a set of IAM permissions on your Scaleway project
to read and write secrets. These permissions should be attached to an IAM
application that Plakar Control Plane will use to authenticate. See the
documentation on
[Managing IAM Policies and API Keys on Scaleway](../../../guides/scaleway/iam-and-api-keys)
for instructions on how to set up the permissions and generate an access key and
secret key.

### Source

| Permission                   | Description                            |
| ---------------------------- | -------------------------------------- |
| `SecretManagerReadOnly`      | Read access to secret metadata         |
| `SecretManagerSecretAccess`  | Read access to secret values           |
| `SecretManagerSecretCreate`  | Create new secrets                     |
| `SecretManagerSecretWrite`   | Write new secret versions              |
| `SecretManagerSecretRestore` | Recover secrets or versions on restore |

