
# S3

S3 resources represent bucket-based object storage exposed via the S3 protocol.
This includes AWS S3, Scaleway Object Storage, MinIO, and any other
S3-compatible storage system.

## Inventory Management

[Managed inventories](../../infrastructure/inventories#managed-inventories) can
discover S3 buckets automatically for AWS, Scaleway and OVHcloud once the
[required IAM permissions](#permissions) are configured. For S3-compatible
endpoints not covered by managed discovery, such as MinIO, you can instead set
up a [self-managed inventory](../../infrastructure/inventories/self-managed) and
add the S3 resource manually.

### Adding S3 as a resource

When using a self-managed inventory, register the resource with `Object Storage`
as the class and `S3` as the subclass. For the endpoint, use the bucket's
hostname or URL, for example `xxxx.s3.eu-west-3.amazonaws.com` on AWS and
`https://s3.fr-par.scw.cloud` on Scaleway. OVHcloud offers both a virtual host
style URL `https://xxxx.s3.eu-west-par.io.cloud.ovh.net` and a normal URL
`https://s3.eu-west-par.io.cloud.ovh.net`. See
[resources documentation](../../resources) for more information on how to set up
resources on a self-managed inventory.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph S3["S3 Bucket (source)"]
    Objects["Objects"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["S3 Source app"]
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
    Destination["S3 Destination app"]
    Restore["Restore process"]
  end

  subgraph S3["S3 Bucket (destination)"]
    Objects["Objects"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"write objects"| Objects
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Shared Configuration

The following settings are available when configuring source, store or
destination apps.

> [!NOTE]
>
> For S3 resources discovered by
> [managed inventories](../../infrastructure/inventories#managed-inventories),
> most of these fields are already pre-filled and do not need to be set
> manually.

- **Access Key**: Required. The access key used to authenticate with the S3
  endpoint.
- **Secret Access Key**: Required. The secret access key used to authenticate
  with the S3 endpoint.
- **Root**: The bucket path prefix Plakar Control Plane uses when reading and
  writing objects. When the bucket name is not part of the hostname, the bucket
  name needs to be provided here as a path prefix, for example `/bucket-name`
  for Scaleway. When the bucket name is already in the hostname for example on
  AWS, this can be left as `/`.
- **Endpoint**: The S3 service URL. Only needed when the bucket name contains a
  dot, which breaks virtual host-style URL resolution. For example, for an AWS
  S3 bucket named `eu.mybucket`, set this to `https://s3.amazonaws.com` and
  enable Virtual Host. This is not needed for Scaleway Object Storage.
- **Port**: The TCP port to connect on. Only needed when the endpoint runs on a
  non-standard port, for example `9000` for a local MinIO instance. AWS S3 and
  Scaleway Object Storage use the standard HTTPS port and do not require this to
  be set.
- **SSE Customer Key**: A Base64-encoded 256-bit (32-byte) customer-provided
  AES-256 key for SSE-C server-side encryption. Only needed if the bucket is
  configured to require customer-provided encryption keys.
- **Virtual Host**: Tells Plakar Control Plane whether the bucket name is part
  of the hostname. For AWS S3, the bucket name is included in the hostname by
  default e.g `xxxx.s3.eu-west-3.amazonaws.com` so this should be enabled. For
  Scaleway Object Storage, the hostname is just the endpoint e.g
  `s3.fr-par.scw.cloud` so this should be disabled.
- **Use TLS**: Enables TLS when connecting to the S3 endpoint. Should be enabled
  whenever communicating over the internet, such as with AWS S3 or Scaleway
  Object Storage. For local endpoints like MinIO on `localhost:9000` this is not
  needed.
- **TLS Insecure No Verify**: Disables TLS certificate verification. This should
  only ever be used for testing, enabling it in production means Plakar Control
  Plane will not verify the identity of the endpoint it is connecting to.

## Store configuration

The following extra settings are available when configuring a store app.

- **Kloset Passphrase**: The passphrase Plakar Control Plane uses to encrypt the
  store. This passphrase is required to access the store and must be kept safe.

## Permissions

### AWS

Plakar Control Plane requires a set of IAM permissions to access your S3
bucket(s). These permissions should be attached to an IAM user or role that
Plakar will use to authenticate. See the documentation on
[Managing IAM Roles, Users, and Access Keys on AWS](../../../guides/aws/iam-users-roles-and-access-keys)
for instructions on how to set up the permissions and generate an access key and
secret access key.

| Permission                   | Description                                 |
| ---------------------------- | ------------------------------------------- |
| `s3:ListBucket`              | List objects in a bucket                    |
| `s3:GetObject`               | Read object content                         |
| `s3:GetObjectVersion`        | Read a specific version of an object        |
| `s3:GetObjectTagging`        | Read object tags                            |
| `s3:GetObjectVersionTagging` | Read tags on a specific object version      |
| `s3:GetBucketLocation`       | Know which region the bucket is in          |
| `s3:GetBucketVersioning`     | Know if versioning is enabled               |
| `s3:PutObject`               | Write backup data or restored objects       |
| `s3:PutObjectTagging`        | Write tags on objects (metadata, retention) |
| `s3:DeleteObject`            | Prune old backups or clean before restore   |
| `s3:PutBucketVersioning`     | Restore versioning config to match original |

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:GetObjectVersion",
        "s3:GetObjectTagging",
        "s3:GetObjectVersionTagging",
        "s3:GetBucketLocation",
        "s3:GetBucketVersioning",
        "s3:PutObject",
        "s3:PutObjectTagging",
        "s3:DeleteObject",
        "s3:PutBucketVersioning"
      ],
      "Resource": ["arn:aws:s3:::your-bucket", "arn:aws:s3:::your-bucket/*"]
    }
  ]
}
```

### Scaleway

Plakar Control Plane requires a set of IAM permissions on your Scaleway project
to access Object Storage. These permissions should be attached to an IAM
application that Plakar Control Plane will use to authenticate. See the
documentation on
[Managing IAM Policies and API Keys on Scaleway](../../../guides/scaleway/iam-and-api-keys)
for instructions on how to set up the permissions and generate an access key and
secret access key.

| Permission                   | Description                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------- |
| `ObjectStorageBucketsRead`   | Read access to buckets and bucket configuration including lifecycle rules         |
| `ObjectStorageBucketsWrite`  | Access to create and edit buckets, bucket configuration including lifecycle rules |
| `ObjectStorageObjectsRead`   | Read access to objects, tags, metadata and storage class                          |
| `ObjectStorageObjectsWrite`  | Access to create and edit objects, tags, metadata and storage class               |
| `ObjectStorageObjectsDelete` | Access to delete objects                                                          |

