---
title: MinIO
summary: Back up and restore MinIO buckets using the S3-compatible API, and host Kloset stores in MinIO object storage.
date: "2025-12-23T00:00:00Z"
---

MinIO is an S3-compatible object storage system commonly used for on-prem, cloud, and hybrid deployments.

The S3 integration allows Plakar to interact with MinIO buckets through the standard S3 API. It provides three connectors:

| Connector type               | Description |
| ---------------------------- | ----------- |
| ✅ **Storage connector**     | Host a Kloset store inside a MinIO bucket. |
| ✅ **Source connector**      | Back up a MinIO bucket into a Kloset store. |
| ✅ **Destination connector** | Restore data from a Kloset store into a MinIO bucket. |

**Requirements**

* A running MinIO server.
* Network access to the MinIO endpoint.
* Credentials with sufficient permissions on the target bucket(s).

**Typical use cases**

* Backing up MinIO buckets to local, remote, or cloud-hosted Kloset stores.
* Hosting a Kloset store in MinIO for durable, object-storage-backed snapshots.
* Replicating data between MinIO environments using `plakar sync`.
* Migrating data between MinIO and other S3-compatible providers.

---

## Installation

To interact with MinIO, you need to install the S3 Plakar package. It can be installed either by downloading a pre-built package or by building it from source.

{{< tabs name="Installation Methods" >}}
{{% tab name="Pre-built package" %}}
Plakar provides pre-compiled packages for common platforms. This is the simplest installation method and is suitable for most users.

**Note:** Installing pre-built packages requires authentication with Plakar. See [Login to Plakar to unlock features](../../guides/what-is-plakar-login/).

Install the S3 package:

```bash
$ plakar pkg add s3
```

Verify the installation:

```bash
$ plakar pkg list
```
{{< /tab >}}

{{% tab name="Building from source" %}}
Building from source is useful if you cannot use pre-built packages.

**Prerequisites**

* A working Go toolchain compatible with your version of Plakar.

Build the S3 package:

```bash
$ plakar pkg build s3
```

On success, a package archive is generated in the current directory, for example `s3_v1.0.7_darwin_arm64.ptar`.

Install the generated package:

```bash
$ plakar pkg add ./s3_v1.0.7_darwin_arm64.ptar
```

Verify the installation:

```bash
$ plakar pkg list
```
{{< /tab >}}

{{% tab name="Reinstalling or upgrading" %}}
To check whether the S3 package is already installed:

```bash
$ plakar pkg list
```

To upgrade to the latest available version, remove the existing package and reinstall it:

```bash
$ plakar pkg rm s3
$ plakar pkg add s3
```

This preserves existing store, source, and destination configurations.
{{< /tab >}}
{{< /tabs >}}

---

## Connectors

The S3 package provides three connectors: a storage connector for hosting Kloset stores in buckets, a source connector for backing up S3 buckets, and a destination connector for restoring data over S3.

You can use any combination of these connectors together with other supported Plakar connectors.

### Storage connector

The Plakar S3 package provides a storage connector to host Kloset stores in S3-compatible buckets, including MinIO.

{{< mermaid >}}
flowchart LR

Source@{ shape: cloud, label: "Source data" }

Source --> Plakar[<b>Plakar</b>]

subgraph Store[<b>MinIO Bucket</b>]
  Kloset@{ shape: cyl, label: "Kloset Store" }
end

Plakar -- <small>Store snapshot via</small><br><b>S3 storage connector</b> --> Store
%% Apply classes
class Source sourceBox
class Plakar brandBox
class Store storeBox

%% Classes definitions
classDef sourceBox fill:#ffe4e6,stroke:#cad5e2,stroke-width:1px
classDef brandBox fill:#524cff,color:#ffffff
classDef storeBox fill:#dbeafe,stroke:#cad5e2,stroke-width:1px

linkStyle default stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
{{< /mermaid >}}

#### Configure

```bash
# Configure the Kloset store
$ plakar store add minio \
  s3://localhost:9000/plakar-kloset \
  access_key=minioadmin \
  secret_access_key=minioadmin \
  use_tls=false

# Initialize the Kloset store
$ plakar at @minio create

# List snapshots in the Kloset store
$ plakar at @minio ls

# Verify integrity of the Kloset store
$ plakar at @minio check

# Backup a local folder to the Kloset store
$ plakar at @minio backup /etc

# Backup a source configured in Plakar to the Kloset store
$ plakar at @minio backup @my_source
```

#### Options

These options can be set when configuring the storage connector with `plakar store add` or `plakar store set`:

| Option | Purpose |
|--------|-------------|
| `location` | Bucket location in the format `s3://<hostname[:port]>/<bucket-name>` |
| `access_key` | Access key for the MinIO instance |
| `secret_access_key` | Secret key for the MinIO instance |
| `use_tls` | Whether to use TLS for the connection (default: `true`) |
| `storage_class` | The storage class to use for objects in the bucket (default: `STANDARD`) |


### Source connector

The Plakar S3 package provides a source connector to back up S3-compatible buckets, including MinIO.

{{< mermaid >}}
flowchart LR

subgraph Source[<b>MinIO Bucket</b>]
  fs@{ shape: cloud, label: "Data" }
end

Source -- <small>Retrieve data via</small><br><b>S3 source connector</b> --> Plakar
Store@{ shape: cyl, label: "Kloset Store" }

Plakar --> Store

%% Apply classes
class Source sourceBox
class Plakar brandBox
class Store storeBox

%% Classes definitions
classDef sourceBox fill:#ffe4e6,stroke:#cad5e2,stroke-width:1px
classDef brandBox fill:#524cff,color:#ffffff
classDef storeBox fill:#dbeafe,stroke:#cad5e2,stroke-width:1px

linkStyle default stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
{{< /mermaid >}}

#### Configure

```bash
# Configure a source pointing to the remote MinIO bucket
$ plakar source add minio_src \
    s3://localhost:9000/mybucket \
    access_key=minioadmin \
    secret_access_key=minioadmin \
    use_tls=false

# Back up the remote directory to the Kloset store on the filesystem
$ plakar at /var/backups backup @minio_src

# Or back up the remote directory to the Kloset store on S3 created above
$ plakar at @minio backup @minio_src
```

#### Options

These options can be set when configuring the source connector with `plakar source add` or `plakar source set`:

| Option | Purpose |
|--------|-------------|
| `location` | Bucket location in the format `s3://<hostname[:port]>/<bucket-name>` |
| `access_key` | Access key for the MinIO instance |
| `secret_access_key` | Secret key for the MinIO instance |
| `use_tls` | Whether to use TLS for the connection (default: `true`) |

### Destination connector

The Plakar S3 package provides a destination connector to restore snapshots to remote S3-compatible buckets, including MinIO.

{{< mermaid >}}
flowchart LR

Store@{ shape: cyl, label: "Kloset Store" }

Store --> Plakar

subgraph Destination[<b>MinIO Bucket</b>]
  fs@{ shape: st-rect, label: "/srv/data" }
end

Plakar -- <small>Push data via</small><br><b>S3 destination connector</b> --> Destination

%% Apply classes
class Destination destinationBox
class Plakar brandBox
class Store storeBox

%% Classes definitions
classDef destinationBox fill:#d0fae5,stroke:#cad5e2,stroke-width:1px
classDef brandBox fill:#524cff,color:#ffffff
classDef storeBox fill:#dbeafe,stroke:#cad5e2,stroke-width:1px

linkStyle default stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
{{< /mermaid >}}

#### Configure

```bash
# Configure a destination pointing to the remote MinIO bucket
$ plakar destination add minio_dst \
    s3://localhost:9000/mybucket \
    access_key=minioadmin \
    secret_access_key=minioadmin \
    use_tls=false

# Restore a snapshot from a filesystem-hosted Kloset store to the remote MinIO bucket
$ plakar at /var/backups restore -to @minio_dst <snapshot_id>

# Or restore a snapshot from a MinIO-hosted Kloset store to the remote MinIO bucket
$ plakar at @minio restore -to @minio_dst <snapshot_id>
```

#### Options

These options can be set when configuring the destination connector with `plakar destination add` or `plakar destination set`:

| Option | Purpose |
|--------|-------------|
| `location` | Bucket location in the format `s3://<hostname[:port]>/<bucket-name>` |
| `access_key` | Access key for the MinIO instance |
| `secret_access_key` | Secret key for the MinIO instance |
| `use_tls` | Whether to use TLS for the connection (default: `true`) |

---

## Configure IAM permissions in MinIO

MinIO supports fine-grained access control using IAM-style policies. You can assign permissions to users or service accounts using one of the following methods:

***Option 1: Using the mc CLI (MinIO Client)***

This is the most common and scriptable method. You can:
- Create users with `mc admin user add`
- Define policies in JSON format
- Attach policies to users with `mc admin policy attach`

> Contents of policy.json — Remember to remove comments or the JSON will be invalid
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      // To allow restoring into the bucket, you need to add the PutObject action
      // "Action": ["s3:GetObject", "s3:ListBucket", "s3:PutObject"],
      // To allow using the bucket as a Kloset store, you also need to give permissions to create the bucket
      // "Action": ["s3:GetObject", "s3:ListBucket", "s3:PutObject", "s3:CreateBucket"],
      // plakar-kloset is the name of the bucket you want to backup, restore to or host a Kloset store in
      "Resource": ["arn:aws:s3:::plakar-kloset", "arn:aws:s3:::plakar-kloset/*"]
    },
    // To allow deleting locks created by Plakar, you need to add the DeleteObject action on the locks prefix
    // Those locks will be removed in future versions of Plakar
    {
      "Effect": "Allow",
      "Action": ["s3:DeleteObject"],
      "Resource": ["arn:aws:s3:::plakar-kloset/locks*"]
    }
  ]
}
```

> Create the user `plakar_user` with the password `mysecretpassword` and assign the policy `plakar-policy` to it
```bash
$ mc alias set myminio http://localhost:9000 minioadmin minioadmin
$ mc admin user add myminio plakar_user a-very-strong-secret
$ mc admin policy create myminio plakar-policy /tmp/minio_policy # /tmp/plakar_policy contains the JSON of your policy
$ mc admin policy attach myminio plakar-policy --user=plakar_user
```

***Option 2: Using the MinIO Console (Web UI)***

If you have enabled the admin console, you can:
- Create users via the `Identity` > `Users` panel
- Assign predefined or custom policies
- Review and manage access through the UI

#### Policy

The policy you should attach to the user depends on your use-case:
- **Read-only policy**: If you only need to back up a bucket, use a policy that allows `s3:GetObject` and `s3:ListBucket` actions. Write permissions are not needed.
- **Read-write policy**: If you need to restore a snapshot into a bucket or host a Kloset store in a bucket, use a policy that also includes `s3:PutObject`.

---

## Limitations and considerations

### Store MinIO configuration

The MinIO source connector makes a snapshot of a bucket by listing all objects in the bucket and downloading their contents. It **does not** store the bucket configuration itself, such as policies, lifecycle rules, or versioning settings.

Also, if your MinIO instance uses server-side encryption (SSE) for storage-level encryption, the SSE configuration is not part of the data captured by Plakar. However, **Plakar performs its own encryption** before storing any chunk, ensuring data-at-rest security even without relying on SSE.

### Snapshot consistency and limitations

Plakar relies on the MinIO (S3-compatible) API to scan and snapshot bucket contents. However, object storage systems do not provide snapshot isolation guarantees, meaning that:
- If objects are added, modified or deleted during the snapshot process, the resulting snapshot may be inconsistent.
- There is no atomic point-in-time capture across all objects.

As a result, the snapshot represents a consistent read of all objects at the time they were listed and fetched, but not a frozen image of the bucket at a single moment in time.

---

## Frequently asked questions

#### Why do I get 401/403 errors when Plakar tries to access my MinIO bucket?

Ensure that the access key and secret key are correct, and that the user has sufficient permissions on the target bucket.

Check `plakar store show`, `plakar source show`, or `plakar destination show` to verify the configured credentials.

Ensure that the `use_tls` option matches your MinIO server configuration.

#### Does Plakar back up all object versions?

No. Plakar only includes the latest visible version of each object in the bucket at snapshot time.

If versioning is enabled in MinIO, older versions are not backed up.

#### Can I synchronize a Kloset store hosted in MinIO to another MinIO bucket?

Yes.

Declare two Kloset stores pointing to your source and target MinIO buckets (e.g. `@minio_prod` and `@minio_backup`), then run a sync command.

Transfer a single snapshot from a Kloset store in MinIO to another one:
```bash
$ plakar at @minio_prod sync <snapshot-id> to @minio_backup
```

Transfer all the snapshots of a Kloset store to another one:
```bash
$ plakar at @minio_prod sync to @minio_backup
```

Note that this is not specific to MinIO: two Kloset stores can be synchronized regardless of their underlying storage backend, even if they are different (e.g., one on MinIO and the other on a local filesystem).

#### How to enable or disable TLS?

Update the configuration option `use_tls` to `true` or `false` depending on whether your MinIO instance uses TLS. For local development, you probably want to disable TLS.

```bash
# Disable TLS for the Kloset store
$ plakar store set minio_store use_tls=false
# Disable TLS for the Source or Destination connector
$ plakar source set minio_src use_tls=false
$ plakar destination set minio_dst use_tls=false
```

#### Can I restore data from MinIO to another provider (e.g., AWS, Azure, GCP, Wasabi, Scaleway, OVH)?

Yes. Configure the storage connector to point to the MinIO bucket, and set the destination connector to point to the target provider.

#### How to generate a flat `.ptar` file from a MinIO store?

Like any other Kloset store, you can use `plakar ptar` to export a Kloset store into a portable `.ptar` file.

```bash
$ plakar ptar -o ./export.ptar -k @minio_store
```

#### How to restore a flat `.ptar` file to a MinIO bucket?

Run the following command to restore a `.ptar` file into a MinIO bucket configured in the destination connector `@minio_dst`.

```bash
$ plakar at ./export.ptar restore -to @minio_dst
```

---

## See also

- [Plakar Architecture (Kloset Engine)](https://www.plakar.io/posts/2025-04-29/kloset-the-immutable-data-store/)
- [MinIO Documentation](https://min.io/docs/minio/linux/index.html)
