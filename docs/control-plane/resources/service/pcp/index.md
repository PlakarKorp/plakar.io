
# Plakar Control Plane

The PCP integration lets Plakar Control Plane back up its own configuration and
internal database, treating the appliance itself as a resource like any other.
This makes it possible to recover from hardware failure, accidental
misconfiguration, or a full appliance replacement.

For a full walkthrough of using this resource, see
[Backing Up Plakar Control Plane](../../../administration/backup-and-restore/backup)
and
[Restoring Plakar Control Plane](../../../administration/backup-and-restore/restore).

## Inventory Management

The PCP resource always represents the local appliance, so no
[managed inventory](../../infrastructure/inventories#managed-inventories) can
discover it. You must configure a
[self-managed inventory](../../infrastructure/inventories/self-managed) before
adding it.

### Adding PCP as a resource

Register the resource with no class or subclass, using `localhost` as the
hostname. See
[Register the Plakar Control Plane resource](../../../administration/backup-and-restore/backup#register-the-plakar-control-plane-resource)
and [resources documentation](../../resources) for more information on how to
set up resources on a self-managed inventory.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Appliance["Plakar Control Plane Appliance"]
    Config["Configuration files"]
    DB["Internal database"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["PCP<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"reads"| Config
  Source -->|"dumps"| DB
  Config --> Backup
  DB --> Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Restoring from a PCP backup

> [!WARNING]
>
> Restoring a PCP backup is currently a manual process performed on a fresh
> appliance and does not use a destination app. Automated restore support is
> under active development. See
> [Restoring Plakar Control Plane](../../../administration/backup-and-restore/restore)
> for the current procedure.

