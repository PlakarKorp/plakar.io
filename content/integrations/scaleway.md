---
title: Scaleway

seo_title: Free, Agentless Scaleway Backup and Restore

subtitle: Free, agentless Scaleway backup

description: >
  Free, agentless Scaleway backup of Instances, Block Storage volumes and Secret
  Manager secrets, encrypted and restored as new resources in any zone or
  project.

technology_image: img/integrations/technology/scaleway.svg

technology_title: Scaleway snapshots, kept as an independent history

technology_description: >
  Scaleway gives every project Block Storage snapshots, QCOW2 export to Object
  Storage and versioned secrets in Secret Manager. They are the fastest way to
  roll back inside the project they belong to.

  Plakar builds on those same APIs to keep an encrypted, deduplicated history of
  Instances, volumes and secrets in a store you choose, and restores it as new
  resources in the same project, another project or another zone. Nothing runs
  inside your Instances.

categories:
  - source
  - destination
  - secrets-manager
  - inventory

seo_tags:
  - Scaleway backup
  - Scaleway instance backup
  - Scaleway Block Storage backup
  - Scaleway Secret Manager backup
  - agentless Scaleway backup
  - restore Scaleway instance in another zone
  - Scaleway snapshot export QCOW2

links:
  - type: community
    url: /docs/community/main/integrations/scaleway/
  - type: control-plane
    url: /docs/control-plane/resources/compute/scaleway/
  - type: custom
    label: Scaleway inventory
    url: /docs/control-plane/inventories/managed/scaleway/

related:
  - s3
  - ovhcloud

edition:
  - community
  - control-plane

stage: stable

binary: true

author:
  - type: official
    name: Plakar

date: 2026-08-26

resource: Scaleway

image: img/integrations/scaleway.svg
---

## What the Scaleway integration does {kicker="Overview"}

The Scaleway integration backs up Scaleway Instances, Block Storage volumes and
Secret Manager secrets into an encrypted, deduplicated Plakar store, without
installing anything inside the Instances. It restores them as new resources in
the same project, another project or another zone. It runs from the free
`plakar` CLI or from Plakar Control Plane, which also discovers the resources of
each Scaleway project. Everything goes through the Scaleway APIs and the Object
Storage endpoint over HTTPS, so Plakar runs inside Scaleway or on any other
infrastructure, at another cloud provider or on premises.

Three protocols cover the project. `scaleway-instance://` backs up an Instance
with every Block Storage volume attached to it. `scaleway-block://` backs up a
single volume. `scaleway-secret://` backs up every secret of a project and
region, with all their versions. Object Storage buckets and Managed Databases
for PostgreSQL and MySQL go into the same store through the
[S3](/integrations/s3/), [PostgreSQL](/integrations/postgres/) and
[MySQL](/integrations/mysql/) integrations.

```console {title="backup-host"}
$ plakar pkg add scaleway
$ plakar source add api-prod \
    scaleway-instance://5b0f3c3e-7a51-4d6e-9c47-1f2b8d0e6a91 \
    access_key=SCWEXAMPLE7KQ2 secret_key=$SCW_SECRET_KEY \
    project_id=$SCW_PROJECT_ID bucket=plakar-staging zone=fr-par-1
$ plakar at /var/backups backup "@api-prod"
c41e9b07: OK ✓ /.METADATA.json
c41e9b07: OK ✓ /block-storage/0c9d4e1a.api-prod-root/.METADATA.json
c41e9b07: OK ✓ /block-storage/0c9d4e1a.api-prod-root/0c9d4e1a.qcow2
c41e9b07: OK ✓ /block-storage/7e21b5f8.api-prod-data/.METADATA.json
c41e9b07: OK ✓ /block-storage/7e21b5f8.api-prod-data/7e21b5f8.qcow2
c41e9b07: OK ✓ /
c41e9b07: backup completed without errors in 6m48.112s
$ plakar at /var/backups ls
2026-11-13T01:00:03Z   7f3a20d1    40 GiB      6m31s /
2026-11-14T01:00:04Z   c41e9b07    40 GiB      6m48s /
$
```

## Why use Plakar for Scaleway backup {kicker="Agentless"}

{{< cards cols="2" style="ruled" >}}

{{< card label="0 agents" >}}

### Nothing to install in your Scaleway Instances

Plakar works through the Scaleway APIs only: it snapshots the volumes, exports
them as QCOW2 images and reads them from Object Storage. No package, no cron job
and no open port inside the Instance, and the same approach covers Linux and
Windows Instances alike.

{{< /card >}}

{{< card label="instances · volumes · secrets" >}}

### Instances, volumes and secrets in one store

One integration protects the compute, the data disks and the secrets the
applications read at startup. They land in the same encrypted store, with the
same retention and the same `plakar check`.

{{< /card >}}

{{< card label="new volume · new instance · new revision" >}}

### Restores that add, never overwrite

A volume comes back as a new volume, an Instance as a new Instance or as extra
disks on an existing one, a secret as new revisions. The resource you restore
next to stays exactly as it is.

{{< /card >}}

{{< card label="zone · project_id" >}}

### Another zone or another project

Each destination sets its own `zone` and `project_id`, so the same snapshot
restores in the original project, a recovery project, or another Scaleway zone.

{{< /card >}}

{{< /cards >}}

## Scaleway backup and recovery scenarios {kicker="Recovery scenarios"}

{{< cards cols="2" style="accent" >}}

{{< card label="scw instance server delete" >}}

### An infrastructure agent deletes a production Scaleway Instance

Asked to remove unused development servers, an AI agent with the operator's API
key deletes `api-prod-1` and its volumes. The volume snapshots of the project
are managed with that same key. Run `plakar backup` before handing the project
to the agent, and keep the store and its passphrase out of the agent's
environment. Restore with a `scaleway-instance://spawn` destination: Plakar
recreates the Instance with its name, commercial type, tags and boot layout, and
starts it.

{{< /card >}}

{{< card label="SCW_SECRET_KEY in a CI log" >}}

### A Scaleway API key leaks from a CI job

A full-access key for the production project is printed in a build log and used
to delete Instances and their snapshots. Keep the Plakar store in another
project with its own key, or at another provider, verify it with `plakar check`,
and restore the Instances into a clean project by setting `project_id` on the
destination.

{{< /card >}}

{{< card label="fr-par-1 → nl-ams-1" >}}

### Recovering Scaleway Instances in another zone

When an Availability Zone is unavailable, restore the latest snapshot as a new
Instance in another zone or region. Plakar exports and imports the QCOW2 images
for you, so the move takes one restore command. Attach a flexible IP or a
Private Network to the new Instance and switch traffic to it.

{{< /card >}}

{{< card label="7-day pending deletion" >}}

### A Scaleway secret deleted two weeks ago

A cleanup script deleted the secret holding the production database password.
Secret Manager keeps a deleted secret recoverable for 7 days, then removes it
with all its versions. A Plakar snapshot keeps every version for as long as your
retention policy says, and the restore adds them back as revisions, enabled or
disabled as they were.

{{< /card >}}

{{< card label="scaleway-block:// + instance ID" >}}

### One overwritten file on a Scaleway data volume

A deployment replaced `/etc/app/config.yaml` on the data volume yesterday.
Restore last night's volume snapshot as a new volume attached to the same
Instance, mount it read-only, copy the file back and detach the volume. The live
volume is never touched.

{{< /card >}}

{{< /cards >}}

## How Plakar backs up a Scaleway Instance without an agent {kicker="How it works"}

{{< columns ratio="5:7" sticky="right" >}}

{{< column >}}

Scaleway exposes the content of a volume by exporting a snapshot of it to Object
Storage as a QCOW2 image. Plakar drives that export through the API and streams
the image into the store. A dedicated bucket of the project serves as the
staging area, and Plakar removes what it created there.

Each snapshot holds the Instance description returned by the Scaleway API and,
for every Block Storage volume, its description and its QCOW2 image. Browse it
with `plakar ls`, read a description with `plakar cat`, or `plakar mount` the
snapshot to open the images with standard QEMU tools.

{{< /column >}}

{{< column >}}

{{< steps >}}

{{< step >}}

**Snapshot.** Plakar creates a Block Storage snapshot of each volume attached to
the Instance.

{{< /step >}}

{{< step >}}

**Export.** Scaleway exports each snapshot as a QCOW2 image into the staging
bucket, and Plakar deletes the temporary snapshot.

{{< /step >}}

{{< step >}}

**Store.** Plakar reads each image, encrypts and deduplicates it into the store,
then deletes the image from the bucket.

{{< /step >}}

{{< /steps >}}

```tree
c41e9b07:/
├── .METADATA.json              # the Instance: name, type, tags, zone
└── block-storage/
    ├── 0c9d4e1a.api-prod-root/
    │   ├── .METADATA.json      # the volume: name, size, IOPS, tags
    │   └── 0c9d4e1a.qcow2
    └── 7e21b5f8.api-prod-data/
        ├── .METADATA.json
        └── 7e21b5f8.qcow2
```

{{< /column >}}

{{< /columns >}}

## Scaleway snapshots and Plakar: what each one covers {kicker="Complementary"}

Scaleway's own features and Plakar work side by side. Keep the native ones for
fast rollback inside a project, and add Plakar for a history you hold elsewhere.

{{< pairs >}}

{{< pair lead="Block Storage snapshots for a quick rollback in the zone." >}}

Plakar adds a history of exported QCOW2 images, deduplicated from one night to
the next, in a store that does not depend on the project's snapshots.

{{< /pair >}}

{{< pair lead="Snapshot export and import to move a volume between regions." >}}

Plakar runs the export on every backup and the import on every restore, so a
move to another region is a destination with a different `zone`.

{{< /pair >}}

{{< pair lead="Object Storage with Object Lock for WORM retention." >}}

Plakar writes its store to a bucket like any S3 client, and Object Lock keeps
every object for the retention set on the bucket. The 3-2-1 layout below uses it
for the archive copy.

{{< /pair >}}

{{< pair lead="Secret Manager versions and a 7-day recovery window." >}}

Plakar keeps every version of every secret for the retention you set, and
restores them into any project and region.

{{< /pair >}}

{{< pair lead="Managed Database automated backups." >}}

Plakar connects to the database engine with a database user, from any host that
reaches it, with no staging bucket, and restores into the same Managed Database,
another one or a self-managed server.

{{< /pair >}}

{{< /pairs >}}

## A 3-2-1 Scaleway backup with Object Lock {kicker="3-2-1"}

Three copies, on two storage systems, one of them in another region and locked.

| Copy             | Where                                                                                                              | Role                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| 1. Production    | Instances, volumes, buckets, Managed Databases and secrets in `fr-par`                                             | The data the applications use           |
| 2. Primary store | An Object Storage bucket in `fr-par`                                                                               | Day-to-day restores                     |
| 3. Archive store | An Object Storage bucket in `nl-ams` with Object Lock in compliance mode, under its own IAM application or project | The off-site copy, fed by `plakar sync` |

```bash
$ plakar store add scw-prod location=s3://s3.fr-par.scw.cloud/plakar-prod \
    access_key=$SCW_PROD_ACCESS_KEY secret_access_key=$SCW_PROD_SECRET_KEY
$ plakar store add scw-archive location=s3://s3.nl-ams.scw.cloud/plakar-archive \
    access_key=$SCW_ARCHIVE_ACCESS_KEY secret_access_key=$SCW_ARCHIVE_SECRET_KEY
$ plakar at "@scw-prod" create
$ plakar at "@scw-archive" create

$ plakar at "@scw-prod" backup "@api-prod"
$ plakar at "@scw-prod" sync to "@scw-archive"
$ plakar at "@scw-archive" check
```

Each synced snapshot restores on its own from `nl-ams`, so losing `fr-par`
leaves every restore point of the archive available.

## Scaleway backup tools compared {kicker="Comparison"}

|                                                                   | Plakar                                              | Commercial backup suites      | Open-source backup tools in the Instance           | Scripts with the Scaleway CLI     |
| ----------------------------------------------------------------- | --------------------------------------------------- | ----------------------------- | -------------------------------------------------- | --------------------------------- |
| Nothing installed in the Instances                                | ✓ Scaleway APIs only                                | ✗ An agent in each Instance   | ✗ Installed in each Instance                       | ✓ Through the API                 |
| Copies kept outside the Scaleway project                          | ✓ Exported to a store you choose                    | ✓ In the product's repository | ✓ In the bucket you point them to                  | ◐ If your script exports them     |
| Instances with all their volumes                                  | ✓ One `scaleway-instance://` source                 | ◐ The files the agent sees    | ◐ The directories you list                         | ◐ Your script                     |
| Secret Manager secrets and versions                               | ✓ `scaleway-secret://`                              | ✗ No Secret Manager support   | ✗ No Secret Manager support                        | ✗ No ready-made script            |
| Encrypted, deduplicated history                                   | ✓ Verified with `plakar check`                      | ◐ Encryption as an option     | ✓ Encrypted, incremental                           | ✗ Your script                     |
| Restore into another zone or project                              | ✓ Set `zone` and `project_id`                       | ◐ Through the agent           | ◐ Files restored into an Instance you create first | ◐ Export, copy and import by hand |
| Managed Databases, buckets and Kapsule clusters in the same store | ✓ PostgreSQL, MySQL, S3 and Kubernetes integrations | ✗ Hosts with an agent only    | ✗ Files of the Instance only                       | ◐ Your script                     |
| Discovery of the project's resources                              | ✓ Scaleway inventory in Plakar Control Plane        | ✗ Hosts added one by one      | ✗ Set up on each Instance                          | ✗ Your own tooling                |
| Free CLI                                                          | ✓                                                   | ✗ Commercial licence          | ✓                                                  | ✓                                 |

## How to restore a Scaleway Instance in another zone or project {kicker="Restore"}

{{< columns ratio="5:7" >}}

{{< column >}}

A restore never touches the backed-up Instance. Pick a destination, point it at
the target zone and project, and restore any snapshot into it.

{{< steps >}}

{{< step >}}

**Find the snapshot.** List the snapshots of the Instance with `plakar ls` and
pick the last good one.

{{< /step >}}

{{< step >}}

**Prepare the target.** Create a staging bucket in the target region and an API
key with the same permissions in the target project.

{{< /step >}}

{{< step >}}

**Restore.** Add a `scaleway-instance://spawn` destination with the target
`zone` and `project_id`, then run `plakar restore`.

{{< /step >}}

{{< step >}}

**Reconnect.** Attach a flexible IP or a Private Network to the new Instance.

{{< /step >}}

{{< /steps >}}

{{< /column >}}

{{< column >}}

```bash
$ plakar at /var/backups ls

$ plakar destination add api-prod-ams scaleway-instance://spawn \
    access_key=SCWEXAMPLE7KQ2 secret_key=$SCW_SECRET_KEY \
    project_id=$SCW_RECOVERY_PROJECT_ID \
    bucket=plakar-staging-ams zone=nl-ams-1

$ plakar at /var/backups restore -to "@api-prod-ams" c41e9b07
```

To add the disks to an Instance that already exists, use
`scaleway-instance://<server-id>` as the destination: each volume of the
snapshot is attached to it as a new volume.

{{< /column >}}

{{< /columns >}}

## Scaleway Secret Manager backup {kicker="Secrets"}

{{< cards cols="3" style="boxed" >}}

{{< card label="scaleway-secret://" >}}

### Every secret, every version

A backup reads all the secrets of a project and region, with each version and
its enabled or disabled status.

{{< /card >}}

{{< card label="project_id · region" >}}

### Restore into any project and region

The destination sets its own project and region. A secret with the same name and
path is reused, a missing one is created, and every version is added as a new
revision.

{{< /card >}}

{{< card label="{secret_id}#{field}" >}}

### Scaleway Secret Manager as a secret provider

Plakar Control Plane can read the credentials it uses from Scaleway Secret
Manager at run time, for example
`c492b67c-f3a0-45b8-9ae5-87b640354fe5#access_key`.

{{< /card >}}

{{< /cards >}}

## How to back up Scaleway with the open-source Plakar CLI {kicker="Quickstart"}

{{< columns ratio="5:7" >}}

{{< column >}}

The Plakar CLI is free and open source. The Scaleway integration is a pre-built
package, free to install once you log in with a Plakar account. Create a store,
declare a source per Instance, volume or project of secrets, and run backups
from cron or a CI job.

The [Scaleway CLI documentation](/docs/community/main/integrations/scaleway/)
lists every option, the permissions of the API key for each protocol and the
volume restore.

{{< /column >}}

{{< column >}}

```bash
$ plakar login -email you@example.com
$ plakar pkg add scaleway
$ plakar at /var/backups create

$ plakar source add api-prod \
    scaleway-instance://5b0f3c3e-7a51-4d6e-9c47-1f2b8d0e6a91 \
    access_key=SCWEXAMPLE7KQ2 secret_key=$SCW_SECRET_KEY \
    project_id=$SCW_PROJECT_ID bucket=plakar-staging zone=fr-par-1
$ plakar at /var/backups backup "@api-prod"

$ plakar source add prod-secrets scaleway-secret:// \
    access_key=SCWEXAMPLE7KQ2 secret_key=$SCW_SECRET_KEY \
    project_id=$SCW_PROJECT_ID region=fr-par
$ plakar at /var/backups backup "@prod-secrets"
$ plakar at /var/backups check
```

{{< /column >}}

{{< /columns >}}

## Scaleway backups across projects with Plakar Control Plane {kicker="Control Plane"}

{{< columns ratio="5:7" sticky="left" >}}

{{< column >}}

With several projects and teams, Plakar Control Plane replaces per-host CLI
configuration. One Control Plane protects the Instances and volumes of several
projects through the Scaleway API, with no network peering. A Scaleway inventory
per project discovers its Instances, Instance volumes, Block Storage volumes,
Object Storage buckets, managed databases and Secret Manager, and keeps the list
current as resources come and go. Restores run from the same interface, as new
volumes, new Instances or new secret revisions.

[See how Plakar Control Plane works](/solutions/control-plane/), read the
[Control Plane Scaleway documentation](/docs/control-plane/resources/compute/scaleway/)
and the
[installation on Scaleway](/docs/control-plane/intro/installation/scaleway/), or
[contact us](/contact/) to plan a deployment.

{{< /column >}}

{{< column >}}

{{< steps >}}

{{< step >}}

**Connect a project.** Create a Scaleway inventory with a read-only API key
scoped to the project (`AllProductsReadOnly`). Keep separate IAM applications
for discovery, backup and secrets, so the full-access keys only serve the jobs
that need them.

{{< /step >}}

{{< step >}}

**Keep credentials in Secret Manager.** Reference the backup key as
`{secret_id}#{field}` so Plakar Control Plane resolves it at run time.

{{< /step >}}

{{< step >}}

**Let a policy schedule it.** Policies set how many backups each resource needs
per period, how long they are kept and which store receives them. Every
Instance, volume or secret project that matches is scheduled automatically,
including the ones created next week.

{{< /step >}}

{{< /steps >}}

{{< /column >}}

{{< /columns >}}

## Scaleway backup FAQ {kicker="FAQ"}

{{< columns >}}

{{< column >}}

### What does Plakar install inside Scaleway Instances?

Nothing. Plakar works through the Scaleway APIs: it snapshots the Block Storage
volumes, exports them to Object Storage as QCOW2 images and reads them from
there.

### How does Plakar back up a Scaleway Instance?

It snapshots every Block Storage volume of the Instance, exports each snapshot
to a staging bucket as a QCOW2 image, and stores the images with the Instance
and volume descriptions in an encrypted, deduplicated snapshot.

### What permissions does the Scaleway API key need?

For Instances and volumes, full access to Instances and Block Storage, and read
and write access to Object Storage buckets and objects. For secrets, Secret
Manager read, access, create, write and restore permissions.

### Can I restore a Scaleway Instance in another zone or project?

Yes. The destination sets its own `zone` and `project_id`, and
`scaleway-instance://spawn` creates the Instance there from the snapshot.

### How do I back up a single Scaleway Block Storage volume?

Declare it as a `scaleway-block://<volume-id>` source. A restore brings it back
as a new volume, detached with `scaleway-block://` or attached to an Instance
with `scaleway-block://<instance-id>`, with the name, tags and IOPS of the
original.

### What does a Scaleway restore create?

New resources only: a new volume, a new Instance, or new revisions of a secret.
The resource you restore next to is left as it is.

### What happens to the staging bucket?

Plakar deletes each QCOW2 image once it has been read, and each temporary Block
Storage snapshot once it has been exported.

{{< /column >}}

{{< column >}}

### How long does Scaleway keep a deleted secret?

Secret Manager keeps a deleted secret recoverable for 7 days, then deletes it
with all its versions. Plakar keeps backed-up versions for as long as your
retention policy sets.

### Can Scaleway secrets be restored into another project?

Yes. The destination sets its own `project_id` and `region`. Secrets with the
same name and path are reused, and every version is added as a new revision.

### Where should I store Scaleway backups?

In a store outside the project you protect: an Object Storage bucket in another
project or region, with Object Lock enabled, or a store at another provider.
`plakar sync` keeps a second copy.

### How do I back up Scaleway Managed Databases for PostgreSQL and MySQL?

With the PostgreSQL and MySQL integrations, which connect to the managed server
with a database user and store the dumps in the same Plakar store. A restore
goes to the same Managed Database, another one or a self-managed server.

### How do I back up Scaleway Object Storage buckets?

With the S3 integration, which reads the bucket over the Scaleway S3 endpoint,
for example `s3://s3.fr-par.scw.cloud/my-bucket`. A bucket can also host the
Plakar store or receive a restore.

### How do I back up Scaleway Kubernetes Kapsule clusters?

With the [Kubernetes integration](/integrations/kubernetes/), which connects
with the cluster's kubeconfig, backs up every resource as YAML, namespace by
namespace, and reads the data of PersistentVolumeClaims through a helper pod.

### Where can Plakar run to back up Scaleway?

Anywhere that reaches the Scaleway APIs and the Object Storage endpoint over
HTTPS: an Instance of the protected project, another Scaleway project, another
cloud provider or an on-premises server. The disks transit through a staging
bucket of the protected project wherever Plakar runs.

### How is the Scaleway integration distributed?

As a pre-built package, free to install with a Plakar account, with
`plakar pkg add scaleway`.

### Should I use the free CLI or Plakar Control Plane?

Start with the free CLI for a few Instances run from cron. Move to Plakar
Control Plane for discovery across projects, policies and one view of what is
protected.

{{< /column >}}

{{< /columns >}}
