---
title: Google Cloud (GCP)

seo_title: Google Cloud Backup for Cloud SQL and Cloud Storage

subtitle: GCP backup outside the project

description: >
  Plakar Control Plane lists the Cloud SQL instances and buckets of a GCP
  project, backs them up to a store outside it and reads credentials from Secret
  Manager.

technology_title: Cloud SQL backups live in the GCP project they protect

technology_description: >
  Cloud SQL keeps its standard backups in the project of the instance. Deleting
  the instance removes them unless someone set retained backups or asked for a
  final backup, and deleting the project removes them all. Deletion protection
  stops neither the project deletion nor a backup deletion.

  New instances and buckets keep appearing, created from the console, from
  Terraform or by a coding agent, and nothing in the project says which ones
  have a copy anywhere else.

  With Plakar Control Plane, a new Cloud SQL instance shows up in the inventory
  within 15 minutes. Its databases are dumped to a store in another project or
  at another provider, and a lost database comes back as a MySQL dump you load
  into a new instance or any MySQL server.
technology_image: img/integrations/technology/gcp.svg

categories:
  - secrets-manager
  - inventory

seo_tags:
  - Google Cloud backup
  - GCP backup
  - Cloud SQL MySQL backup
  - back up Cloud SQL to another cloud
  - Cloud SQL backup deleted instance
  - GCP Secret Manager backup credentials
  - Google Cloud inventory

links:
  - type: control-plane
    url: /docs/control-plane/inventories/managed/google-cloud/
  - type: custom
    label: GCP Secret Manager secret provider
    url: /docs/control-plane/secret-providers/gcp/
    icon: ri/book-open-line

related:
  - gcs
  - mysql
  - aws

edition:
  - control-plane

stage: stable

author:
  - type: official
    name: Plakar

date: 2026-09-02

resource: GCP

image: img/integrations/gcp.png
---

## What the Google Cloud integration does {kicker="Overview"}

The Google Cloud integration connects Plakar Control Plane to a GCP project,
whether Control Plane runs on Compute Engine, at another cloud provider or in a
data center. Its inventory lists the Cloud Storage buckets, Cloud SQL instances
and Compute Engine VMs of the project every 15 minutes. Plakar backs up the
buckets and the Cloud SQL for MySQL databases into encrypted snapshots in a
store outside the project, and restores them to Google Cloud or anywhere else.
Its secret provider reads the passwords and keys of those backups from Secret
Manager.

The backups run through the integration that matches each resource. The
[Google Cloud Storage](/integrations/gcs/) integration backs up a bucket, or one
prefix of it, and can also hold the store. The [MySQL](/integrations/mysql/)
integration dumps the databases of a Cloud SQL for MySQL instance with
`mysqldump`, through `mysql+gcsql://`. Each snapshot is deduplicated against the
store before upload.

Each discovered resource gets a class and its endpoints. Cloud SQL instances are
classified by engine, so MySQL and PostgreSQL instances are told apart without a
label:

| Google Cloud resource    | Class in Plakar Control Plane    | Endpoints discovered                           |
| ------------------------ | -------------------------------- | ---------------------------------------------- |
| Cloud Storage bucket     | Object Storage, subclass GCS     | Bucket name                                    |
| Cloud SQL for MySQL      | Database, subclass MySQL         | Connection name `project:region:instance`, IPs |
| Cloud SQL for PostgreSQL | Database, subclass PostgreSQL    | Connection name `project:region:instance`, IPs |
| Compute Engine VM        | Compute, with its zone as region | Internal and external IPv4 and IPv6 addresses  |

## Why use Plakar for Google Cloud backup {kicker="Why Plakar"}

{{< cards cols="3" style="ruled" >}}

{{< card label="egress" >}}

### Google Cloud backups at another provider for the cost of what changed

An edge in the region of the bucket or the instance reads the data inside Google
Cloud. Only the chunks the store does not hold yet cross the network, so a
nightly copy at another provider is billed for the day's changes.

{{< /card >}}

{{< card label="outside the project" >}}

### Cloud SQL backups that survive the project

Standard Cloud SQL backups and bucket soft delete belong to the project and to
the admins who manage it. A Plakar store sits in another project or at another
provider, opened with a passphrase no project role grants.

{{< /card >}}

{{< card label="one tool" >}}

### Google Cloud and the rest of the stack with one tool

The same policies and stores cover the Cloud SQL instances and buckets of each
project, the [AWS](/integrations/aws/) accounts and the
[Kubernetes](/integrations/kubernetes/) clusters next to them. One retention
rule then applies to every production database, wherever it runs.

{{< /card >}}

{{< /cards >}}

## Google Cloud backup scenarios {kicker="Scenarios"}

{{< cards cols="3" style="accent" >}}

{{< card label="gcloud sql instances delete" >}}

### An AI agent deletes a Cloud SQL instance and its backups

An ops agent asked to remove idle databases, working with a developer's `gcloud`
session, runs `gcloud sql instances delete orders-eu`. The command has no
`--enable-final-backup` and the instance kept no backups after deletion, so its
standard backups go with it. Last night's Plakar snapshot sits in a store the
agent had no credentials for. Create a new instance and restore the dump into it
with `mysql+gcsql://`.

{{< /card >}}

{{< card label="service account key in a repository" >}}

### A Google Cloud service account key pushed to a repository

A JSON key with read access to the production project lands in a shared
repository. When Plakar Control Plane runs on Compute Engine, the inventory and
the secret provider use the service account attached to the instance, so no key
file exists to leak. The MySQL password of each source is a path such as
`acme-prod#orders-backup-password`, and a new secret version is read at the next
backup.

{{< /card >}}

{{< card label="gcp_location=europe-west1" >}}

### Backup credentials that stay in one Google Cloud region

Database passwords for EU workloads must stay in the EU. A Secret Manager
provider with **GCP Location** set to `europe-west1` reads regional secrets
through `secretmanager.europe-west1.rep.googleapis.com`, with the same
`project#secret` path as global secrets.

{{< /card >}}

{{< /cards >}}

## How to back up Cloud SQL for MySQL to another cloud {kicker="How-to"}

{{< columns ratio="5:7" sticky="right" >}}

{{< column >}}

The MySQL integration reaches a Cloud SQL instance by its connection name,
through the Cloud SQL Go connector. Plakar opens the encrypted connection
itself, so there is no Auth Proxy to run and no authorized network to open. The
dump is a plain `mysqldump` file, stored wherever the store lives.

1. Create a MySQL user for backups on the instance, with the privileges listed
   in the [MySQL documentation](/docs/community/main/integrations/mysql/).
2. Grant `roles/cloudsql.client` to the service account of the edge that runs
   the backup. The Cloud SQL Go connector signs in with Application Default
   Credentials.
3. Add a source with the `mysql+gcsql` protocol. `host` holds the connection
   name shown on the discovered resource, and the password can come from Secret
   Manager.
4. Point a policy at a store outside Google Cloud, such as an S3-compatible
   bucket at another provider.
5. To restore, write the dump to a new Cloud SQL instance with the same
   protocol, or to any MySQL server with `mysql://`.

{{< /column >}}

{{< column >}}

```console {title="edge"}
# Cloud SQL for MySQL, reached by its connection name
$ plakar source add orders-eu mysql+gcsql://plakar_backup@localhost/orders \
    host=acme-prod:europe-west1:orders-eu password=s3cr3t-Example
$ plakar at /var/backups backup "@orders-eu"
# Load the dump into a MySQL server outside Google Cloud
$ plakar destination add orders-dr mysql://admin@db.dr.example.net/orders \
    password=s3cr3t-Example
$ plakar at /var/backups restore -to "@orders-dr" <snapshot_id>
```

{{< /column >}}

{{< /columns >}}

The same commands run in the free, open-source `plakar` CLI, where the MySQL
integration is available too.

## How to find Google Cloud resources with no backup {kicker="Discovery"}

{{< steps >}}

{{< step >}}

**Create a Google Cloud inventory.** Give it the project ID. Leave the service
account key empty when Plakar Control Plane runs on Compute Engine with an
attached service account, or paste a JSON key otherwise. Create one inventory
per project.

{{< /step >}}

{{< step >}}

**Share the credentials with a configuration bundle.** A bundle scoped to the
Database class and the MySQL subclass holds the backup user and its Secret
Manager path. Every MySQL source set up on an instance of the project receives
them, and PostgreSQL instances stay out of its scope.

{{< /step >}}

{{< step >}}

**Filter on Not protected.** The resource list shows which buckets and Cloud SQL
instances have no backup task yet. Set up a source on each one, with its
environment and data class.

{{< /step >}}

{{< step >}}

**Let a policy schedule them.** A policy scoped to that environment and data
class schedules every matching source, including the ones added after it.

{{< /step >}}

{{< /steps >}}

## How to read backup credentials from GCP Secret Manager {kicker="Secrets"}

{{< columns ratio="5:7" sticky="right" >}}

{{< column >}}

Plakar Control Plane stores the path of a secret, never its value, and reads the
`latest` version each time a task needs it. Plakar checks the CRC32C checksum
Secret Manager returns with every value before using it.

1. Create one secret per credential. A secret holds a single value, such as the
   password of the MySQL backup user.
2. Add a GCP Secret Manager provider in Plakar Control Plane. Leave **GCP
   Location** empty for global secrets, or set it for regional ones. The
   **Endpoint** field takes a Private Service Connect address.
3. In any credential field of an app or an inventory, switch to the provider and
   enter `project_id#secret_name`.

{{< /column >}}

{{< column >}}

```console {title="workstation"}
# A regional secret for the password of the MySQL backup user
$ gcloud secrets create orders-backup-password \
    --project=acme-prod --location=europe-west1
$ gcloud secrets versions add orders-backup-password \
    --project=acme-prod --location=europe-west1 --data-file=password.txt
# Path entered in the password field of the source:
# acme-prod#orders-backup-password
```

{{< /column >}}

{{< /columns >}}

## How to reduce Google Cloud egress costs for backups stored elsewhere {kicker="Egress"}

A copy at another provider survives a deleted project, a suspended billing
account or a leaked owner key. Teams often skip it because of its cost: a full
export of every database each night is billed as data leaving Google Cloud, then
stored again on the other side. Plakar keeps both to what changed, on one
condition: the edge that runs the task sits in the Google Cloud region of the
resource.

{{< pairs >}}

{{< pair lead="Reading stays in the region." >}}

The edge lists and reads the bucket, or runs `mysqldump` against the Cloud SQL
instance, from inside Google Cloud. An edge pool on the inventory, or on a
single resource, keeps its tasks on edges in that region.

{{< /pair >}}

{{< pair lead="Unchanged chunks stay in Google Cloud." >}}

Objects and dumps are cut into content-defined chunks, and a chunk goes to the
store only when the store lacks it. A dump in which only this week's orders
changed sends the chunks holding those rows.

{{< /pair >}}

{{< pair lead="New chunks leave compressed and encrypted." >}}

Each new chunk is compressed with LZ4, then encrypted on the edge. SQL dumps and
logs shrink before they cross the network, and the other provider stores only
ciphertext.

{{< /pair >}}

{{< pair lead="Thirty restore points, one copy." >}}

Every snapshot restores in full, and the store keeps each chunk once. A month of
nightly snapshots costs the first copy plus the changes, in the storage class
you pick.

{{< /pair >}}

{{< /pairs >}}

## IAM permissions for Google Cloud discovery and Secret Manager {kicker="IAM role"}

{{< columns ratio="5:7" >}}

{{< column >}}

The inventory reads the project and changes nothing in it. Give its service
account a custom role with the permissions on the right.
`compute.instances.list` lets it list the Compute Engine VMs of every zone.

The secret provider needs `secretmanager.versions.access` on the secrets it
reads, which the Secret Manager Secret Accessor role grants. Grant it on each
secret rather than on the whole project.

Backups use credentials of their own: `roles/cloudsql.client` and a MySQL user
for `mysql+gcsql`, `storage.buckets.get`, `storage.objects.list` and
`storage.objects.get` for a bucket.

{{< /column >}}

{{< column >}}

```console {title="workstation"}
# Custom role for the Google Cloud inventory
$ gcloud iam roles create plakarInventory --project=acme-prod \
    --title="Plakar inventory" \
    --permissions=cloudasset.assets.searchAllResources,cloudsql.instances.get,cloudsql.instances.list,storage.buckets.get,storage.buckets.list,compute.instances.list
# Read access to one secret for the Control Plane service account
$ gcloud secrets add-iam-policy-binding orders-backup-password \
    --project=acme-prod --location=europe-west1 \
    --member=serviceAccount:plakar@acme-prod.iam.gserviceaccount.com \
    --role=roles/secretmanager.secretAccessor
```

{{< /column >}}

{{< /columns >}}

## Plakar Control Plane for Google Cloud projects {kicker="Control Plane"}

The Google Cloud integration is part of Plakar Control Plane. A residency on the
inventory keeps the backups of its resources in stores of the same residency,
and an edge pool runs its tasks on edges inside the right network. The GCS and
MySQL integrations it hands resources to are free and open source in the
`plakar` CLI as well.

[See how Plakar Control Plane works](/solutions/control-plane/), read the
[Google Cloud inventory documentation](/docs/control-plane/inventories/managed/google-cloud/),
or [contact us](/contact/).

## Google Cloud backup FAQ {kicker="FAQ"}

{{< columns ratio="1:1" >}}

{{< column >}}

### Which Google Cloud resources does Plakar discover?

Cloud Storage buckets, Cloud SQL instances and Compute Engine VMs, one GCP
project per inventory. Cloud SQL instances are classified MySQL or PostgreSQL
and come with their connection name and IP addresses. VMs come with their zone
and their IPv4 and IPv6 addresses.

### How does Plakar back up Cloud SQL for MySQL?

With the MySQL integration and its `mysql+gcsql://` protocol. It connects by
instance connection name through the Cloud SQL Go connector, runs `mysqldump`
and stores the dump as an encrypted snapshot. No Auth Proxy runs next to it.

### How long does Cloud SQL keep automated backups?

7 automated backups by default on Enterprise edition and 15 on Enterprise Plus,
set with `--retained-backups-count` between 1 and 365. They stay in the project
of the instance. Plakar snapshots follow the retention of the policy that
schedules them.

### What happens to Cloud SQL backups when the instance is deleted?

Standard backups are deleted with the instance unless retained backups
(`--retain-backups-on-delete`) or a final backup (`--enable-final-backup`, kept
30 days by default) were set. Retained automated backups then expire one per
day. A Plakar snapshot follows its own retention, in its own store.

### How do I restore a Cloud SQL database outside Google Cloud?

Add a `mysql://` destination for the target server and restore the snapshot to
it. The dump loads into any MySQL server, self-hosted or at another provider. A
`mysql+gcsql://` destination loads it into a new Cloud SQL instance instead.

{{< /column >}}

{{< column >}}

### How does Plakar back up a Cloud Storage bucket?

With the Google Cloud Storage integration, which reads the current version of
every object of a bucket, or of one prefix, into an encrypted snapshot. GCS soft
delete keeps deleted objects 7 days by default, and a snapshot keeps them as
long as its policy says.

### How does Plakar cut Google Cloud egress for backups at another provider?

It reads each resource from an edge in the resource's region and sends only the
chunks the store does not hold, compressed with LZ4 and encrypted. After the
first backup, data leaving Google Cloud follows what changed.

### Which credentials does Plakar Control Plane use for Google Cloud?

The service account attached to its Compute Engine instance, for both the
inventory and Secret Manager. A Control Plane running elsewhere uses a service
account JSON key, pasted in the inventory or provider settings.

### How does Plakar read a secret from GCP Secret Manager?

By path, `project_id#secret_name`. It reads the `latest` version, global or from
the location set on the provider, and checks its CRC32C checksum. A rotated
secret is picked up at the next task, with no app to edit.

### How do I cover several GCP projects?

Create one Google Cloud inventory per project ID. Each can use its own service
account, edge pool and residency, and one Secret Manager provider reads secrets
from any project its service account can access.

### How often does the Google Cloud inventory refresh?

Every 15 minutes by default. The interval goes down to 30 seconds, and **Sync
now** refreshes the inventory at any time.

{{< /column >}}

{{< /columns >}}
