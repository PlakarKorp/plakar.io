---
title: "AWS"
date: "2026-05-03T00:00:00Z"
weight: 1
summary: "How to connect and manage an AWS inventory to Plakar Control Plane."
---

# AWS Inventory

The AWS inventory allows Plakar Control Plane to connect to your AWS account and discover and classify your resources.

Once connected, Plakar Control Plane discovers all resources in your AWS account and makes them available for management directly within the Plakar Control Plane, without requiring per-resource configuration.

## Supported Resources

| Resource     | Source | Store | Destination |
| ------------ | ------ | ----- | ----------- |
| S3 Bucket    | Yes    | Yes   | Yes         |
| EC2 Instance | Yes    | No    | Yes         |
| PostgreSQL(RDS)| Yes  | No    | Yes         |

## Authentication

There are two ways to authenticate your AWS account, depending on where Plakar Control Plane is deployed:

* **On AWS infrastructure**: For Plakar Control Plane instances deployed on AWS using the AWS Marketplace AMI, use the **IAM** credential type. Plakar Control Plane will use the IAM role and permissions attached to the instance to discover and manage your resources. 
* **Outside AWS infrastructure**: If Plakar Control Plane is deployed on another cloud provider (such as Scaleway or OVHcloud) or on-premises, use the **Access Key** credential type. You will need to provide an AWS access key and secret key with sufficient permissions.

## Obtaining Access Keys

To use the **Access Key** credential type, you must create an AWS IAM identity (user or role) with the required permissions and generate an access key for that identity.

The IAM identity must have permissions that match the resources you intend to manage (see [Managing Permissions](#managing-permissions)).

Access keys consist of:
* Access key ID
* Secret access key

These credentials are used by Plakar Control Plane to authenticate against AWS and perform discovery and resource operations.

> [!WARNING]+ SECRET KEYS
> The secret access key is only displayed once by AWS. Make sure to store it securely or use a secret provider.

## Managing Permissions

When using the **Access Key** credential type, the required AWS permissions depend on the resources you want to manage.

At a minimum, a base set of permissions is required for **resource discovery** during AWS inventory setup. This allows Plakar Control Plane to discover, list, and classify resources in your AWS account.

Additional permissions are required to perform operations on specific resource types:
* **S3 permissions** for backing up, restoring from, and using S3 as a backup store
* **EC2 permissions** for backing up and restoring EC2 instances

### Recommended Approach

It is recommended to combine all required permissions (discovery, S3, and EC2) into a single IAM policy and generate one access key and secret key to use during inventory setup.

This approach:
* Simplifies setup
* Avoids managing multiple credentials
* Allows immediate management of all supported resources after inventory setup

### Alternative Approach

You can choose to separate permissions by resource type, but this requires additional manual configuration.

In this case:
* Use minimal permissions (discovering resources) during inventory setup
* Create separate access keys with the required permissions for each resource type
* Manually configure these credentials for each S3 bucket or EC2 instance in Plakar Control Plane

This approach requires additional configuration and more complex credential management.

### Discovering Resources

To discover resources, the following read-only AWS managed policies are required:
* `AWSResourceExplorerReadOnlyAccess` - see [AWS Documentation](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AWSResourceExplorerReadOnlyAccess.html)
* `ResourceGroupsandTagEditorReadOnlyAccess` - see [AWS Documentation](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/ResourceGroupsandTagEditorReadOnlyAccess.html)

### Managing S3

The following IAM policy defines the required permissions for managing S3 buckets as backup sources, backup stores, and destination targets.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PlakarS3Source",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:GetObjectVersion",
        "s3:GetObjectTagging",
        "s3:GetObjectVersionTagging",
        "s3:GetBucketLocation",
        "s3:GetBucketVersioning"
      ],
      "Resource": [
        "arn:aws:s3:::your-source-bucket",
        "arn:aws:s3:::your-source-bucket/*"
      ]
    },
    {
      "Sid": "PlakarS3Store",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:PutObject",
        "s3:PutObjectTagging",
        "s3:DeleteObject",
        "s3:GetBucketLocation",
        "s3:GetBucketVersioning"
      ],
      "Resource": [
        "arn:aws:s3:::your-store-bucket",
        "arn:aws:s3:::your-store-bucket/*"
      ]
    },
    {
      "Sid": "PlakarS3Restore",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:PutObject",
        "s3:PutObjectTagging",
        "s3:DeleteObject",
        "s3:GetBucketLocation",
        "s3:GetBucketVersioning",
        "s3:PutBucketVersioning"
      ],
      "Resource": [
        "arn:aws:s3:::your-restore-bucket",
        "arn:aws:s3:::your-restore-bucket/*"
      ]
    }
  ]
}
```

> [!TIP]+ TIPS
> Each permission group can target multiple buckets by listing additional ARNs in the `Resource` field.
>
> The `Sid` sections (`PlakarS3Source`, `PlakarS3Store`, `PlakarS3Restore`) are logical groupings for readability only. They do not enforce boundaries and can be adjusted or merged as needed.

#### Permission details

| Permission | Description |
| - | - |
| `s3:ListBucket` | Lists objects within a bucket |
| `s3:GetObject` | Reads object data |
| `s3:GetObjectVersion` | Reads a specific version of an object |
| `s3:GetObjectTagging` | Retrieves object tags |
| `s3:GetObjectVersionTagging` | Retrieves tags for a specific object version |
| `s3:GetBucketLocation` | Determines the bucket’s region |
| `s3:GetBucketVersioning` | Checks whether versioning is enabled |
| `s3:PutObject` | Writes backup data or restored objects |
| `s3:PutObjectTagging` | Applies tags (e.g., metadata, retention) |
| `s3:DeleteObject` | Removes objects (e.g., pruning or cleanup) |
| `s3:PutBucketVersioning` | Updates bucket versioning configuration during restore |

### Managing EC2

The following IAM policy defines the required permissions for discovering resources, creating backups, and restoring volumes from snapshots.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PlakarEC2Describe",
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:DescribeVolumes",
        "ec2:DescribeVolumeAttribute",
        "ec2:DescribeSnapshots"
      ],
      "Resource": "*"
    },
    {
      "Sid": "PlakarEC2Backup",
      "Effect": "Allow",
      "Action": [
        "ec2:CreateSnapshot",
        "ec2:CreateTags",
        "ec2:DeleteSnapshot",
        "ebs:ListSnapshotBlocks",
        "ebs:GetSnapshotBlock"
      ],
      "Resource": [
        "arn:aws:ec2:region:account-id:volume/*",
        "arn:aws:ec2:region:account-id:snapshot/*"
      ]
    },
    {
      "Sid": "PlakarEC2Restore",
      "Effect": "Allow",
      "Action": [
        "ebs:StartSnapshot",
        "ebs:PutSnapshotBlock",
        "ebs:CompleteSnapshot",
        "ec2:CreateVolume",
        "ec2:AttachVolume"
      ],
      "Resource": [
        "arn:aws:ec2:region:account-id:volume/*",
        "arn:aws:ec2:region:account-id:snapshot/*"
      ]
    }
  ]
}
```

> [!TIP]+ TIPS
> `Describe*` actions require `"Resource": "*"` as they are not resource-level restricted in AWS IAM.
>
> The `Resource` field can include one or multiple volumes and snapshots by adjusting the ARN patterns or specifying additional ARNs.

#### Permission details

| Permission | Description |
| - | - |
| `ec2:DescribeInstances` | Discovers EC2 instances and their attached volumes |
| `ec2:DescribeVolumes` | Lists EBS volumes available for backup |
| `ec2:DescribeVolumeAttribute` | Retrieves volume configuration (e.g., encryption) |
| `ec2:DescribeSnapshots` | Lists existing snapshots |
| `ec2:CreateSnapshot` | Creates a snapshot of a volume |
| `ec2:CreateTags` | Applies tags to snapshots for identification |
| `ec2:DeleteSnapshot` | Removes outdated snapshots |
| `ebs:ListSnapshotBlocks` | Lists snapshot block metadata |
| `ebs:GetSnapshotBlock` | Reads raw block data from a snapshot |
| `ebs:StartSnapshot` | Initiates a snapshot for restore operations |
| `ebs:PutSnapshotBlock` | Writes block data during restore |
| `ebs:CompleteSnapshot` | Finalizes the snapshot after writing |
| `ec2:CreateVolume` | Creates a volume from a snapshot |
| `ec2:AttachVolume` | Attaches the restored volume to an instance |

### Managing PostgreSQL

The following IAM policy defines the required permissions for connecting to PostgreSQL databases hosted on Amazon RDS using IAM authentication.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PlakarRDSConnect",
      "Effect": "Allow",
      "Action": "rds-db:connect",
      "Resource": "arn:aws:rds-db:REGION:ACCOUNT_ID:dbuser:DB_RESOURCE_ID/DB_USER"
    }
  ]
}
```

> [!TIP]+ TIPS
> The `Resource` value must match the RDS instance and database user you intend to connect to.

#### Permission details

| Permission | Description |
| - | - |
| `rds-db:connect` | Allows authentication to an RDS database using IAM |

## Adding the AWS Inventory

When creating a new AWS inventory, you must provide the following:
* **Name** for the inventory
* **Credential** type
  * **IAM** (use only when running on AWS)
  * **Access Key** (for all other deployments)
* **Access key and secret key** (for Access Key authentication). These can be provided directly or loaded via a secret provider (see [secret providers documentation](../secret-providers))
* **Region**

![](../images/create-aws-inventory.png)

After creating the inventory, you must trigger a **synchronization** to discover and load resources. You can run synchronization at any time to refresh the inventory, for example after adding new resources to your AWS account.

### Resource Visibility

By default, the inventory table displays only resources that Plakar Control Plane supports:
* Object storage resources (S3 buckets)
* Compute resources (EC2 instances)

All other discovered resources are marked as **unclassified** and are hidden from the table by default. To view all discovered resources, enable the **Include unclassified** toggle.

![](../images/aws-inventory.png)

All configuration details provided during inventory creation can be updated later in the **Settings** tab. The inventory can also be deleted entirely from this tab if no longer needed.

## Managing Resources

Resources in an AWS inventory are automatically discovered and synchronized. They are managed by the inventory and cannot be manually created or deleted.

You can select a resource to open its details in the side panel. The only configurable option is backup coverage, which can be enabled or disabled per resource.

Backup coverage tracks how many of your resources are protected by backups. If a resource does not need to be backed up (for example, a test database), you can exclude it from coverage. Excluded resources are omitted from protection status and coverage reporting.

![](../images/manage-aws-inventory-resource.png)
