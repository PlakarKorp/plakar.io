---
title: "Store App"
date: "2026-05-11T00:00:00Z"
weight: 1
summary: "How store apps work in Plakar Control Plane."
aliases:
  - /control-plane-docs/connectors/stores/
  - /docs/control-plane/connectors/stores/
---

# Store App

A store app is where backups are kept. Its resource, such as an S3 bucket or an
SFTP server, holds a Kloset store, an encrypted and deduplicated repository of
restore points. Backups write new restore points to the store, restores and
syncs read them back, and checks verify their integrity.

## Creating a store app

Store apps are created with **Add Store**, from the **Stores** tab of an
inventory or from **Infrastructure > Stores**, which lists the store apps of
every inventory. Creating one takes three steps.

{{< steps >}}

{{< step >}}

### General

Select the inventory and the resource that holds the store, such as an S3
bucket, and provide a name for the store app. Then choose its storage type:

- **Standard**: the store is available at all times.
- **Cold**: the store uses archival storage, such as Amazon S3 Glacier, where
  data must be retrieved before it can be read.
- **Offline**: the storage is not connected, such as removed media.

The storage type tells the policies engine how the store behaves. It does not
change the underlying storage. For S3, archival storage is configured through
the storage class of the store, as described in
[Cold Storage on Amazon S3 Glacier](../../resources/object-storage/s3#cold-storage-on-amazon-s3-glacier).

Integrity checks are on by default for a new store. See
[integrity checks](#integrity-checks) for the interval and the advanced settings
on integrity checks.

![](../images/setup-store-1.png)

{{< /step >}}

{{< step >}}

### Configuration

Select the integration, then fill in the passphrase of the Kloset store,
followed by the fields of the integration. The way fields are filled works as
for every app, as described in [setting up an app](../apps#setting-up-an-app).

{{< /step >}}

{{< step >}}

### Review

Check the settings of the store app before adding it. A store that does not
exist yet at the location can be initialized right away, with the compression
algorithm chosen in the advanced settings. It can also be initialized later from
the store page, as described in
[testing and initializing](#testing-and-initializing).

![](../images/setup-store-2.png)

{{< /step >}}

{{< /steps >}}

### Changing the resource

Changing the resource of a store app, while creating or editing it, can change
the configuration that applies to it. Plakar Control Plane shows what the new
resource changes and asks whether to keep the current configuration or to start
again from the configuration bundle of the new resource. The passphrase is kept
in both cases.

## Testing and initializing

A store app only describes where backups go. The Kloset store itself is a
structure that must exist at that location before anything can be written to it.

**Test Connection**, on the **Dashboard** tab of the app, checks that Plakar
Control Plane can reach the location and reports whether a Kloset store is
already there. A location that has held a store before is recognized and needs
no further preparation.

![](../images/store-app.png)

A location that has never held a Kloset store, such as a new S3 bucket, must be
initialized before it can receive backups. Initializing writes the store
configuration to the location and leaves an empty store. It happens once per
location and is not destructive. Initializing a location that already holds a
store fails and leaves that store untouched.

Backups are compressed as they are written to the store, with an algorithm
chosen at initialization. `LZ4` is the default. `GZIP`, `ZSTD` or `SNAPPY` can
be selected in the advanced settings, when creating the store app or in the
initialization dialog.

> [!TIP]+ Choosing an algorithm
>
> The algorithm is a tradeoff between storage space, compression speed and
> decompression speed. `LZ4` performs well on all three for most data, which is
> why it is the default. `SNAPPY` can be faster on large, highly compressible
> files. Keep the default unless a test on your own data shows another algorithm
> performs better.

{{< figure src="../images/kloset-store-initialization.png" alt="" class="mx-auto max-w-100" >}}

Once the store is initialized, the **Operations** card of its dashboard creates
the tasks that act on it:

- **Check**: checks the restore points of the store.
- **Backup**: backs up a source to the store.
- **Sync**: synchronizes the store with another store.
- **Restore**: restores from the store to a destination.

The same card shows the last job, the success rate and the next planned run of
the store, with its recent jobs.

## Integrity checks

Plakar Control Plane can regularly download the objects of a store, its
packfiles and states, and verify each one against its HMAC. A damaged object is
found when it is checked, before a restore needs it.

Object names cannot be verified without decrypting the store. An object replaced
by another under the same name is caught instead by comparing its HMAC with the
one recorded at the previous check.

Integrity checks do not replace a
[check task](../../scheduling/tasks#check-task). An integrity check works at a
lower level. It verifies that each packfile and state matches its own HMAC. A
check task verifies the restore points themselves: their checksums, their
indexes and that their file tree can be walked.

Checks are set per store app, in the **Integrity checks** card of its settings
or in the [General step](#general) when it is created:

- **Interval**: how often each object is checked. A new store is checked every
  day. Stores that existed before integrity checks were introduced have them
  turned off until they are turned on.
- **Checked objects**: every object, or a share of the objects at each interval,
  picked at random.
- **Daily read limit**: caps how much the checks download per day. A store
  larger than the limit is checked over several days. There is no limit by
  default.

Checks start after the first scan of the store. Checks only run on **Standard**
stores, and are paused on **Cold** and **Offline** ones.

The **Integrity** card on the dashboard of the store app shows the status of the
checks, the current interval, how long a full cycle takes and the share of the
store checked over a chosen period.

![](../images/store-integrity.png)

When an object fails its check or has been replaced, Plakar Control Plane raises
a store integrity alert. It is sent by [email](../../operations/email-and-smtp)
and to [webhooks](../../operations/webhooks) subscribed to the **Store
integrity** event.

## Store structure

The **Structure** tab lists the objects the store holds, its states and
packfiles, with the size of each and the result of its last integrity check. It
can be filtered by object type and by check result, to find the objects that
failed.

![](../images/store-structure.png)

## Browsing restore points

The **Browse** tab lists the restore points held in the store. A restore point
can be opened to view its files and download individual files without a full
restore. It can also be downloaded whole,
[checked](../../scheduling/tasks/#check-task), or placed under a
[legal hold](../compliance/legal-hold).

![](../images/browse-store.png)
