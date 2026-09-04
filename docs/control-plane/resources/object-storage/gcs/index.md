
# Google Cloud Storage

Google Cloud Storage resources represent bucket-based object storage hosted on
Google Cloud.

## Inventory Management

[Managed inventories](../../infrastructure/inventories#managed-inventories) can
discover GCS buckets automatically for
[Google Cloud](../../../infrastructure/inventories/google-cloud). For buckets
not covered by managed discovery, you can instead set up a
[self-managed inventory](../../infrastructure/inventories/self-managed) and add
the resource manually.

### Adding Google Cloud Storage as a resource

When using a self-managed inventory, register the resource with `Object Storage`
as the class and `GCS` as the subclass. For the endpoint, use the bucket name.
See [resources documentation](../../resources) for more information on how to
set up resources on a self-managed inventory.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph GCS["GCS Bucket (source)"]
    Objects["Objects"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["GCS Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"read objects"| Objects
  Objects --> Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  Store["Kloset Store"]

  subgraph Plakar["Plakar Control Plane"]
    Destination["GCS Destination app"]
    Restore["Restore process"]
  end

  subgraph GCS["GCS Bucket (destination)"]
    Objects["Objects"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"write objects"| Objects
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Shared Configuration

The following settings are available when configuring source, store, or
destination apps.

- **Credentials JSON**: Upload a Google Cloud service account JSON key file or
  paste its contents directly.
- **Endpoint**: Overrides the default Google Cloud Storage API endpoint. Only
  needed when connecting to a non-standard endpoint such as a local GCS emulator
  for development and testing.
- **No Auth**: Disables authentication entirely. Only useful when connecting to
  a local emulator that does not require credentials. Should never be enabled in
  production.

## Store configuration

The following extra settings are available when configuring a store app.

- **Kloset Passphrase**: The passphrase Plakar Control Plane uses to encrypt the
  store. This passphrase is required to access the store and must be kept safe.

## Permissions

Plakar Control Plane requires a set of IAM permissions to access your GCS
bucket. These permissions should be granted to the service account that Plakar
Control Plane will use to authenticate. See the documentation on
[Managing IAM Roles and Service Accounts on Google Cloud](../../../guides/google-cloud/iam-roles-and-service-accounts)
for instructions on how to create a custom role with these permissions and
generate a service account key.

| Permission               | Description                               |
| ------------------------ | ----------------------------------------- |
| `storage.buckets.get`    | Read bucket metadata and configuration    |
| `storage.objects.create` | Write backup data or restored objects     |
| `storage.objects.delete` | Prune old backups or clean before restore |
| `storage.objects.get`    | Read object content and metadata          |
| `storage.objects.list`   | List objects in a bucket                  |

