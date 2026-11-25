# OVHcloud Public Cloud backup

Back up OVHcloud Public Cloud instances with their Cinder volumes into an encrypted store, restore them in any region and discover every project of the account.


## What the OVHcloud Public Cloud integration does
The OVHcloud integration backs up Public Cloud instances, with their boot disk
and every attached Cinder volume, into an encrypted, deduplicated Plakar store.
A restore recreates the instance, with its volumes, in the same region or
another one. It runs in Plakar Control Plane, which also discovers the
instances, volumes and Object Storage containers of every project of your
OVHcloud account.

Two connectors cover the compute side. `ovh-instance` snapshots the boot disk
through Nova and exports each attached volume to a temporary Glance image, then
streams every image into the store and deletes the temporary copies. `ovh-block`
does the same for a single Block Storage volume. Nothing is installed inside the
instances.

Each snapshot holds the server description returned by the OpenStack API, with
its flavor and networks, and one QCOW2 image per disk. A restore reads that
description to rebuild the instance.

```tree
9d2f61a8:/
├── .METADATA.json           # server, flavor, networks
└── block-storage/
    ├── glance-3c7e19b2/
    │   ├── .METADATA.json   # boot disk image
    │   └── disk.qcow2
    └── cinder-81f0a6d4/
        ├── .METADATA.json   # volume and its snapshot
        └── disk.qcow2
```

## Why use Plakar for OVHcloud Public Cloud backup
### A second copy of OVHcloud instances for the price of storage

OVHcloud includes outbound public traffic in instance prices in every region
except Asia-Pacific (Singapore, Sydney and Mumbai), and Object Storage traffic
is free. Plakar sends only new chunks, compressed and encrypted, to the store,
so a copy in another project, region or provider adds storage, not transfer
fees.

### OVHcloud instance disks you can read anywhere

Every snapshot is a Kloset, the open format of the open-source Plakar engine.
Restore it as a new OVHcloud instance, or restore its `disk.qcow2` files to any
machine with the free `plakar` CLI, inside or outside OVHcloud.

### New OVHcloud instances backed up without a ticket

A developer starts `api-gra-3` on Monday morning. The next inventory
synchronization finds it, and a configuration bundle scoped to the Compute
class, holding the application credential of the project, creates its
`ovh-instance` source on its own. Give the source its environment and data
class, and the matching policy schedules it.

### OVHcloud Object Storage backups driven by tags

Tag a container `plakar:env=production` and `plakar:class=documents` in
OVHcloud, and the inventory reads both tags when it lists the container. The
production policy for documents then backs it up with the
[S3 integration](/integrations/s3/), at its frequency and retention, without
anyone adding the container by hand.

## OVHcloud Public Cloud backup and recovery scenarios
### An AI agent deletes a production OVHcloud instance

An infrastructure agent working from the team's `openrc` file is asked to clean
up staging servers and deletes `shop-db-gra` instead. The instance snapshots of
the project are Glance images that the same credentials can delete. Take a
Plakar backup before the agent gets access, and keep the store credentials and
passphrase out of its environment. Restore with Recovery Network Mode
`preserve`: Plakar recreates `shop-db-gra` with its boot disk, its data volumes
and its original networks.

### An OpenStack application credential leaks

A `clouds.yaml` holding an application credential with compute and image rights
is pushed to a public repository. Anyone who finds it can delete the instances,
volumes and Glance images of that project. An application credential reaches one
project only, so keep the Plakar store in another project or at another
provider. Revoke the credential, check the store with `plakar check`, and
recreate the instances from their snapshots.

### Investigating a compromised OVHcloud instance

After an intrusion, restore last week's snapshot with Recovery Network Mode
`remove`. The copy boots with no network attached, so it cannot reach the
attacker or the rest of the project. Inspect its disks from the instance console
while the original instance stays as it is.

### A migration corrupts an OVHcloud data volume

A schema migration goes wrong and leaves the PostgreSQL data volume of
`shop-db-gra` unusable. Restore last night's volume snapshot with `ovh-block`
and the server ID as location: Plakar creates a new Cinder volume and attaches
it to the running instance. Mount it, copy the files back and detach it.

## How to restore an OVHcloud instance in another region
For every region where a project runs instances, the OVHcloud inventory exposes
a restore target named "Create instance on" followed by the region, for example
`SBG5` when `GRA11` is the source.

Plakar picks the flavor by ID, then by name, in the target region. With
`preserve`, networks are matched by ID, and by name when the IDs do not exist
there, so create the same private networks in the target region before you
restore.

**Pick the snapshot.** Open the instance in Plakar Control Plane and choose the
last good restore point.

**Pick the target region.** Select the "Create instance on SBG5" entry of the
inventory as destination.

**Set the credentials.** Give the destination an OpenStack application
credential ID and secret for the project, and `SBG5` as OpenStack Region.

**Choose the network mode.** `preserve` to reattach the networks by name,
`remove` to boot the instance with no network.

**Restore.** Plakar uploads the disk images to Glance in `SBG5`, creates the
instance with its original name and security groups, then creates the Cinder
volumes and attaches them.

## OVHcloud instance snapshots and Plakar: what each one covers
OVHcloud's own snapshots and Plakar work side by side. Keep the native ones for
a fast rollback in the region, and add Plakar for a history held elsewhere.

- **Automatic instance snapshots, the schedule the OVHcloud API calls workflow/backup, with Rotation 7 or Rotation 14 to keep the last 7 or 14 daily snapshots.** The schedule covers the instance and its primary volume. A Plakar snapshot
captures the boot disk with every attached volume, and a policy keeps hourly,
daily, weekly, monthly and yearly restore points for as long as you set.

- **Remote snapshots, a separately billed copy of a snapshot in a region you pick.** Plakar writes its copy to a store you choose, in another project or at another
provider, where the OpenStack users of the protected project have no access.

- **Restoring a snapshot onto an instance, which reinstalls it and drops the data written since.** Plakar restores next to the instance, as a new one, so you compare both and keep
what the original still holds.

- **Volume snapshots, kept in the same storage cluster as the volume, and volume backups, which need the volume detached.** Plakar backs up Block Storage volumes while they stay attached and in use, and
writes them to the store you choose, on another storage system than the volume.

- **Object Storage with Object Lock, set when the bucket is created, in Governance or Compliance mode.** Plakar writes its store to an S3 bucket like any S3 client, so the default
retention of the bucket locks every object of the store.

## OVHcloud Public Cloud backup tools compared
OVHcloud customers hold the roles of their Public Cloud projects. The cloud's
admin and hypervisor access stays with OVHcloud, which decides what a backup
tool can do there.

|                                                               | Plakar                                                                                                                         | OpenStack backup suites for private clouds                        | Scripts with the OpenStack CLI                        |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- | ----------------------------------------------------- |
| Runs with the roles of a Public Cloud project                 | ✓ `Compute Operator`, `Image Operator`, `Volume Operator`                                                                      | ✗ Deployed by the cloud operator, with admin or hypervisor access | ✓ Your `openrc` file                                  |
| Nothing installed in the instances                            | ✓ OpenStack APIs only                                                                                                          | ✓ OpenStack service APIs                                          | ✓ Through the API                                     |
| History kept outside the project                              | ✓ A store you choose                                                                                                           | ✓ The product's backup storage                                    | ◐ If your script downloads the images                 |
| Boot disk and attached volumes in one restore point           | ✓ One `ovh-instance` snapshot                                                                                                  | ✓ The instance with its volumes                                   | ✗ One image per disk, matched by hand                 |
| New instance in another region                                | ✓ A "Create instance on" target per region                                                                                     | ◐ Each region added to the product on its own                     | ◐ `openstack image save`, then `image create` by hand |
| Instances of every project listed                             | ✓ OVHcloud inventory                                                                                                           | ✓ For the cloud operator                                          | ✗ Your own tooling                                    |
| OVHcloud Public Cloud and the rest of the stack with one tool | ✓ [Kubernetes](/integrations/kubernetes/), [PostgreSQL](/integrations/postgres/) and [S3](/integrations/s3/) in the same store | ◐ Other hypervisors, depending on the product                     | ✗ One script per service                              |

## OVHcloud Managed Databases and Object Storage in the same store
### OVHcloud Managed Databases for PostgreSQL and MySQL

The [PostgreSQL](/integrations/postgres/) and [MySQL](/integrations/mysql/)
integrations connect to the managed server with a database user, dump it from an
edge and write the dumps to the same store as your instances. The
[OVHcloud Managed PostgreSQL guide](/docs/community/main/guides/ovhcloud/backup-ovhcloud-managed-postgres/)
walks through it.

### OVHcloud Object Storage containers

The [S3 integration](/integrations/s3/) backs up OVHcloud Object Storage
containers, restores into them, or uses one as the Plakar store, for example a
container in a dedicated backup project.

## OVHcloud Backup Center, built on Plakar
OVHcloud and Plakar
[announced their partnership](https://corporate.ovhcloud.com/en/newsroom/news/ovhcloud-and-plakar-integrate-backup-natively-public-cloud/)
on 3 September 2026, to make backup a native part of OVHcloud Public Cloud, with
keys held by the customer and copies kept in Europe.

### OVHcloud Backup Center

At the OVHcloud AI Summit on 19 November 2026, OVHcloud presented Backup Center:
one place in the OVHcloud Control Panel and API to set up, monitor and restore
backups of Public Cloud resources. It runs on the open-source Plakar engine,
operated by OVHcloud, and backups stay in OVHcloud regions. Managed Kubernetes
Service comes first, with a free beta from mid-December 2026, and instances
follow.
[Pre-register for the beta on OVHcloud Labs](https://labs.ovhcloud.com/en/backup-center/).

### Plakar Control Plane on the OVHcloud Marketplace

Plakar Control Plane, which runs the integration on this page, is listed on the
[OVHcloud Marketplace](https://marketplace.ovhcloud.com/fr/product/plakar-control-plane-plateforme-de-sauvegarde-et-de-r-silience-des-donn-es/d0iduxct490ld),
where you can request a demo or a quote. It protects Public Cloud instances and
volumes today, with the store, retention and schedule you choose, next to your
Managed Kubernetes clusters with the
[Kubernetes integration](/integrations/kubernetes/).

## OVHcloud backups across every project with Plakar Control Plane
A single inventory per OVHcloud account lists the resources of every Public
Cloud project: instances and Block Storage volumes, which the OVHcloud
integration backs up, S3 Object Storage containers, which the S3 integration
backs up, Swift containers, and one "Create instance on" restore target per
region. It refreshes every 15 minutes by default, a period you can lower to 30
seconds, so an instance created this morning is in the inventory before
tonight's backup window. Policies then schedule backups for every matching
resource, with the frequency, retention and store you set per tier.

The tasks of an inventory can run on an edge pool attached to it, for example
edges on instances of the same region, so backups also reach resources behind a
private network.

[See how Plakar Control Plane works](/solutions/control-plane/), read the
[Control Plane OVHcloud documentation](/docs/control-plane/inventories/managed/ovhcloud/),
or [contact us](/contact/) to plan a deployment.

**Connect the account.** Create an OVHcloud API application in the token
creation portal, and give its application key, application secret and consumer
key to a new OVHcloud inventory.

**Create the backup credential.** In Public Cloud, create a user with the
`Compute Operator`, `Image Operator` and `Volume Operator` roles, then generate
an application credential for it in Horizon.

**Keep it in OVHcloud Secret Manager.** Store the credential secret in OVHcloud
Secret Manager and reference it as `{path}#{key}`, for example
`prod/plakar/openstack#secret`. Plakar Control Plane reads it at run time.

**Let a policy schedule it.** Scope a policy to an environment, data classes
and, if you want, tags. It sets the frequency, retention and store of every
source it matches.

## OVHcloud Public Cloud backup FAQ
### How does Plakar back up an OVHcloud Public Cloud instance?

It asks Nova for a snapshot of the boot disk and Cinder for an image of each
attached volume, streams those images into an encrypted, deduplicated snapshot
with the server description, and deletes the temporary images.

### What does Plakar install inside OVHcloud instances?

Nothing. Plakar talks to the OpenStack APIs of OVHcloud Public Cloud, never to
the guest operating system.

### Which OpenStack roles does the OVHcloud backup user need?

`Compute Operator`, `Image Operator` and `Volume Operator`. Plakar Control Plane
authenticates with an application credential of that user, scoped to one
project.

### How do I back up a single OVHcloud Block Storage (Cinder) volume?

Back it up as an `ovh-block` resource. A restore creates a new Cinder volume,
detached or attached to the instance whose server ID you give as location.

### What does an OVHcloud restore create?

New resources: a new instance with new volumes, or a new volume. The instance or
volume you restore next to is left as it is.

### How is the flavor chosen when restoring in another OVHcloud region?

Plakar looks for the original flavor by ID in the target region, then by name.
Networks follow the Recovery Network Mode.

### Does the OVHcloud inventory cover one project or the whole account?

The whole account. It lists every Public Cloud project the API application can
read, with their instances, volumes and Object Storage containers.

### Which API rights does the OVHcloud inventory need?

`GET` on `/me` and on `/cloud/project*`. The inventory only reads, and the
credentials come from the OVHcloud token creation portal of your region.

### Can OVHcloud backups run inside my own network?

Yes. Attach an edge pool to the inventory, and its backup and restore tasks run
on an edge of that pool instead of on the Control Plane.

### How many automatic instance snapshots does OVHcloud keep?

The console schedule offers `Rotation 7` and `Rotation 14`, a daily snapshot
with the last 7 or 14 kept, or a custom cron in UTC. A Plakar policy sets its
own retention per tier, independent of that rotation.

### Where should OVHcloud backups be stored?

Outside the project you protect: an OVHcloud Object Storage bucket in a
dedicated backup project, created with Object Lock, or a store at another
provider. `plakar sync` keeps a second copy, for example in another OVHcloud
region.

### Can Plakar Control Plane use OVHcloud Secret Manager?

Yes. Add it as a secret provider with an OKMS access certificate, its private
key, the OKMS ID and the region, then reference secrets as `{path}#{key}` in any
credential field.

### What is OVHcloud Backup Center?

The OVHcloud service to set up, monitor and restore Public Cloud backups from
the Control Panel and the API, built on the open-source Plakar engine and
operated by OVHcloud. Its beta covers Managed Kubernetes Service from
mid-December 2026.

### Does copying OVHcloud backups to another region cost transfer fees?

Outbound instance traffic is included outside Asia-Pacific, and OVHcloud Object
Storage does not bill traffic. Plakar sends only new, compressed chunks, so the
copy costs the storage it uses.

### How do I back up OVHcloud Managed Databases?

With the PostgreSQL and MySQL integrations, which dump the managed server over
the network from an edge and store the dumps next to your instance snapshots.


