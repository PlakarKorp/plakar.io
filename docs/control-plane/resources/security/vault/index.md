
# HashiCorp Vault

HashiCorp Vault resources back up the unseal keys of a Vault server. Plakar
Control Plane connects to the Vault server, reads the unseal keys from its
snapshot backup, and stores them in the Kloset store. During restore, Plakar
Control Plane writes the unseal keys back to a Vault server.

This is the same Vault integration used to
[reference Vault as a secret provider](../../../infrastructure/secret-providers/vault),
used here with its importer and exporter capabilities instead of its secrets
manager capability. As a resource, it treats the Vault server itself as
something to back up and restore, rather than as a place to reference
credentials from.

## Inventory Management

Currently no
[managed inventory](../../infrastructure/inventories#managed-inventories) has
the capability of discovering HashiCorp Vault resources. You must configure a
[self-managed inventory](../../infrastructure/inventories/self-managed) before
adding a HashiCorp Vault resource.

### Adding HashiCorp Vault as a resource

When using a self-managed inventory, register the resource with no class or
subclass. For the endpoint, use the Vault server's URL, for example
`https://vault.example.com`. See [resources documentation](../../resources) for
more information on how to set up resources on a self-managed inventory.

A resource represents a single Vault cluster. Backing up multiple Vault clusters
requires registering a separate resource for each cluster.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Vault["HashiCorp Vault Server (source)"]
    Keys["Unseal Keys"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["HashiCorp Vault<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"read unseal keys"| Keys
  Keys --> Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  Store["Kloset Store"]

  subgraph Plakar["Plakar Control Plane"]
    Destination["HashiCorp Vault<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph Vault["HashiCorp Vault Server (destination)"]
    Keys["Unseal Keys"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"write unseal keys"| Keys
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Shared Configuration

The following settings are available when configuring source or destination
apps.

- **Port**: The TCP/UDP port number of the Vault server.
- **Token**: Required. The Vault access token used to authenticate with the
  Vault server.
- **Insecure**: Use insecure HTTP, rather than secure HTTPS, for communicating
  with the Vault server.

## Destination configuration

The following extra settings are available when configuring a destination app.

- **Force**: Overwrite existing unseal keys with those stored in the Vault
  snapshot backup.

Restoring a snapshot resets the destination Vault cluster to the state it was in
when the snapshot was taken, including its auto-unseal or Shamir unseal keys. By
default, restore only succeeds if these keys are already consistent with the
destination cluster, which is the case when restoring a Vault cluster to an
earlier state on itself.

Restoring into a freshly provisioned Vault cluster, whose auto-unseal or Shamir
keys differ from those in the snapshot, requires enabling **Force**.

> [!WARNING]
>
> Enabling **Force** overwrites the destination cluster's unseal keys with those
> from the snapshot.

