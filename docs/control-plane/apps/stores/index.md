
# Store App

A store app defines where Plakar Control Plane stores backup data.

## Creating a store app

To create a store app, open the **Inventories** page and click on the inventory
that contains the resource you want to use as a store. From the inventory
details page, click **Add Store** and select the resource to use as the store.
Provide a name for the app. The name is used to distinguish this app when
multiple apps of the same type are configured for the same resource.

![](../images/inventory-details.png)

Plakar Control Plane checks the resource `class` and `sub-class` to find
compatible integrations. If only one integration is compatible, it is selected
automatically, which is the most common case. If multiple integrations are
compatible, you will need to select the integration manually.

Some integrations support multiple protocols. For example, the Scaleway
integration supports three protocols, that is `scaleway-instance`,
`scaleway-block`, and `scaleway-secrets` and you will need to select the
appropriate one after choosing the integration.

Next, select a **Storage Type**:

- **Standard** - the store is available at all times
- **Cold** - the store uses archival storage where data must be retrieved before
  it can be accessed, such as Amazon S3 Glacier

The storage type is used by the policies engine to infer the nature of the
store. It does not affect the underlying storage itself. For S3 stores, archival
storage is configured separately through the resource's Storage Class setting.
See
[Cold Storage on Amazon S3 Glacier](../../resources/object-storage/s3#cold-storage-on-amazon-s3-glacier)
for details.

Finally, provide the configuration and credentials required for the selected
resource. See the [resources documentation](../../resources) for the required
fields. If a [configuration bundle](../../administration/configuration-bundles)
matches this resource, matching fields are filled in automatically.

![](../images/create-store.png)

## Testing and initializing

A store app only describes where backup data should go. The Kloset store itself
is a structure that must exist at that location before anything can be written
to it. The **Dashboard** tab of the store app is where you confirm the location
is reachable and, when needed, create that structure.

### Testing the connection

**Test Connection** verifies that Plakar Control Plane can reach the location
using the configured credentials, and reports whether a Kloset store is already
present there. A location that has been used before is recognized automatically
and needs no further preparation.

A failing test points at the app configuration or the credentials rather than at
the store itself. Correct them and run the test again.

![](../images/store-connector-1.png)

### Initializing the store

A location that has never held a Kloset store, such as a newly created S3
bucket, must be initialized before it can receive backups. Initializing writes
the store configuration to the location, leaving an empty store ready to receive
backup data.

Initialization happens once per location and is not destructive. Running it
against a location that already holds a Kloset store fails and leaves the
existing store untouched, so re-running it when you are unsure of a location's
state carries no risk to the data already there.

![](../images/store-connector-2.png)

Backup data is compressed as it is written into the store, and the algorithm is
chosen when the store is initialized. LZ4 is used by default. GZIP or ZSTD can
be selected instead from the advanced settings of the initialization dialog.

{{< figure src="../images/kloset-store-initialization.png" alt="" class="mx-auto max-w-100" >}}

### Available actions

Once the store is initialized, the dashboard offers the operations that act on
it:

- **Check Store** - create an integrity check task for the Kloset store
- **Create Backup** - create a backup task to the store
- **Sync Store** - create a synchronization task to another store
- **Restore Data** - create a restore task from the store

## Browsing Restore Points

You can view all backup restore points stored on a store from the **Browse**
tab.

![](../images/view-snapshots.png)

From there, you can view the files contained in each restore point and download
individual files without performing a full restore.

![](../images/browse-snapshots.png)

## Tasks and Schedules

Tasks can be created directly from the store app dashboard or from the
**Operations > Scheduling** section. See the
[scheduling documentation](../../operations/scheduling) for details on creating
and managing tasks and schedules.

