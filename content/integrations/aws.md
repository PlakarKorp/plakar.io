---
title: Amazon Web Services (AWS)

seo_title: AWS Backup for S3 and RDS with Automatic Discovery

subtitle: AWS backup that finds new resources

description: >
  Plakar Control Plane finds the S3 buckets and RDS databases of an AWS account,
  schedules their backups from AWS tags and reads credentials from Secrets
  Manager.

technology_title: AWS resources appear faster than backup plans

technology_description: >
  An AWS account changes every day. Buckets are created from the console, RDS
  instances from Terraform or from a coding agent. A bucket or database nobody
  tagged for backup stays outside every plan, and RDS automated backups last 35
  days at most and leave with the instance unless they are retained.

  Plakar Control Plane reads the account every 15 minutes, matches AWS tags to
  backup policies, and keeps the credentials its backups use in AWS Secrets
  Manager, read through the IAM role of its EC2 instance.
technology_image: img/integrations/technology/aws.svg

categories:
  - secrets-manager
  - inventory

seo_tags:
  - AWS backup
  - AWS backup inventory
  - back up new S3 buckets automatically
  - Amazon RDS backup with IAM authentication
  - AWS tag-based backup policy
  - AWS Secrets Manager backup credentials
  - backup without AWS access keys

links:
  - type: control-plane
    url: /docs/control-plane/inventories/managed/aws/
  - type: custom
    label: AWS Secrets Manager secret provider
    url: /docs/control-plane/secret-providers/aws/
    icon: ri/book-open-line

related:
  - s3
  - postgres
  - mysql

edition:
  - control-plane

stage: stable

author:
  - type: official
    name: Plakar

date: 2026-08-26

resource: AWS

image: img/integrations/aws.png
---

## What the AWS integration does {kicker="Overview"}

The AWS integration connects Plakar Control Plane to an AWS account, whether
Control Plane runs on EC2, at another cloud provider or in a data center. Its
inventory lists every resource of the account that AWS Resource Explorer returns
in Control Plane, with its ARN, Region, service, type and AWS tags, and
refreshes the list every 15 minutes. A new bucket or RDS database then enters a
backup policy without a ticket. Its secret provider reads the passwords and keys
those backups use from AWS Secrets Manager.

The backups run through the integration that matches each resource. The
[S3](/integrations/s3/) integration backs up a bucket and can also hold the
store. The [PostgreSQL](/integrations/postgres/) and
[MySQL](/integrations/mysql/) integrations back up the databases of an RDS
instance or cluster with `pg_dump` or `mysqldump`, and restore them to any
server they can reach. Plakar encrypts and deduplicates every snapshot before it
reaches the store.

Five resource types also get a class and their endpoints:

| AWS resource          | Class in Plakar Control Plane | Endpoints discovered                  |
| --------------------- | ----------------------------- | ------------------------------------- |
| S3 bucket             | Object Storage, subclass S3   | `<bucket>.s3.<region>.amazonaws.com`  |
| RDS DB instance       | Database                      | Instance address                      |
| RDS or Aurora cluster | Database                      | Writer and reader endpoints           |
| RDS Proxy             | Database                      | Proxy endpoint                        |
| EC2 instance          | Compute                       | Public IP address and public DNS name |

## Why use Plakar for AWS backup {kicker="Why Plakar"}

{{< cards cols="3" style="ruled" >}}

{{< card label="egress" >}}

### AWS backups kept outside AWS for the cost of what changed

An edge in the region of the bucket or the database reads the data there. Only
chunks the store lacks leave AWS, so a nightly copy at another provider costs
the changes, not the whole account.

{{< /card >}}

{{< card label="separate credentials" >}}

### AWS backups under credentials of their own

RDS automated backups, manual snapshots and S3 object versions are managed by
the same IAM identities as the data. A Plakar store can sit in another AWS
account or at another provider, opened with its own passphrase.

{{< /card >}}

{{< card label="one tool" >}}

### AWS and the rest of the stack with one tool

One set of policies and stores covers the buckets and databases of the AWS
account, the [Kubernetes](/integrations/kubernetes/) clusters and the
[MongoDB](/integrations/mongodb/) replica sets that run elsewhere. A policy for
the `production` environment and its data classes schedules all of them.

{{< /card >}}

{{< /cards >}}

## AWS backup scenarios {kicker="Scenarios"}

{{< cards cols="2" style="accent" >}}

{{< card label="rds:db orders-preview" >}}

### A coding agent creates the RDS database that becomes production

A coding agent working with a developer's AWS profile creates an RDS PostgreSQL
instance, `orders-preview`, for a feature branch. The branch ships, and the
instance now holds real orders. No backup plan names it. The deployment pipeline
tags it `plakar:env=production`, `plakar:class=database` and
`db-engine=postgres`, as it does for every database it promotes. The inventory
lists it at the next synchronization, the PostgreSQL bundle gives it a source,
and the `production` policy schedules it like any database created by hand.

{{< /card >}}

{{< card label="--delete-automated-backups" >}}

### An AI agent deletes an Amazon RDS instance and its automated backups

An ops agent told to remove unused databases, working with a developer's AWS
profile, runs `aws rds delete-db-instance` on `orders` with
`--skip-final-snapshot` and `--delete-automated-backups`. The instance goes, its
automated backups with it, and no final snapshot is taken. Last night's Plakar
snapshot sits in a store under other credentials, and its passphrase was never
in the agent's environment. Create a new instance and restore the dump into it
with the PostgreSQL integration.

{{< /card >}}

{{< card label="AKIA key in a public repository" >}}

### An AWS access key for backups pushed to a public repository

A script holding the S3 access key of the archive bucket lands in a public
GitHub repository. The S3 source in Plakar Control Plane points to
`prod/plakar/s3-archive#secret_key`, so the key is rotated once in AWS Secrets
Manager, and the next backup reads the new value with no source to edit.

{{< /card >}}

{{< card label="private subnet" >}}

### Amazon RDS databases with no public endpoint

The production RDS cluster sits in a private subnet of another VPC. The AWS
inventory names an edge pool whose edges run in that VPC. Those edges
synchronize the inventory and run the backup tasks of its resources, so each
database is reached from inside its own network.

{{< /card >}}

{{< /cards >}}

## How to discover S3 buckets and RDS databases and back them up automatically {kicker="How-to"}

{{< columns ratio="5:7" sticky="right" >}}

{{< column >}}

A bucket a data scientist creates from the S3 console, such as
`acme-ml-features-eu`, gets its backup from its AWS tags. A resource tagged
`plakar:env=production` and `plakar:class=database` gets `production` as the
environment and `database` as the data class of its source, and every policy
scoped to that pair schedules it.

1. Create an AWS inventory in Plakar Control Plane with the **IAM** credential
   type and a region.
2. Tag the resources at AWS with `plakar:env` and `plakar:class`, using the
   environments and data classes defined in your classification settings.
   Terraform, CloudFormation and the AWS CLI all set them.
3. Add a configuration bundle to the inventory for each integration, with
   **Auto-create connectors** enabled. Scope the S3 bundle to the Object Storage
   class. RDS databases all share the Database class, so also scope the
   PostgreSQL and MySQL bundles to a tag your teams set, such as
   `db-engine=postgres`.
4. Create a policy for the environment and data classes, with its frequency,
   retention and store.
5. Click **Sync now**, or wait for the next synchronization. New resources then
   enter the policy on their own.

{{< /column >}}

{{< column >}}

```console {title="workstation"}
# Tag an RDS instance and an S3 bucket for the production policies
$ aws resourcegroupstaggingapi tag-resources \
    --resource-arn-list arn:aws:rds:eu-west-3:123456789012:db:orders-preview \
    --tags plakar:env=production,plakar:class=database
$ aws resourcegroupstaggingapi tag-resources \
    --resource-arn-list arn:aws:s3:::acme-ml-features-eu \
    --tags plakar:env=production,plakar:class=analytics
```

{{< /column >}}

{{< /columns >}}

Tags discovered from AWS are read-only in Plakar Control Plane: they change at
AWS, and the next synchronization picks them up.

## How to read backup credentials from AWS Secrets Manager {kicker="Secrets"}

{{< columns ratio="5:7" sticky="right" >}}

{{< column >}}

Plakar Control Plane stores a path to the secret, never its value, and resolves
it each time a task needs the credential. Every app and inventory that uses the
path reads the current value.

1. Create a key/value secret ("Other type of secret" in the console), encrypted
   with `aws/secretsmanager` or your own KMS key.
2. Add an AWS Secrets Manager provider in Plakar Control Plane with the region
   of the secret. It reads with the IAM role of the instance.
3. In any credential field of an app or an inventory, switch from a direct value
   to the provider and enter `secret_name#key`.

Plakar reads the version labelled `AWSCURRENT`, parses it as a JSON object and
returns the key named after the `#`.

{{< /column >}}

{{< column >}}

```console {title="workstation"}
# A secret holding the credentials of an RDS backup user
$ aws secretsmanager create-secret --name prod/plakar/rds-orders \
    --secret-string '{"username":"plakar_backup","password":"s3cr3t-Example"}'
# Path entered in the password field of the source:
# prod/plakar/rds-orders#password
```

{{< /column >}}

{{< /columns >}}

## How to reduce AWS egress costs for backups stored outside AWS {kicker="Egress"}

A backup at another provider survives the loss of the AWS account, but a full
copy of every bucket and database each night is billed as data transfer out of
AWS. Plakar keeps that transfer to the changes, on one condition: the edge that
runs the task sits in the AWS region of the resource.

{{< pairs >}}

{{< pair lead="Reading stays in the region." >}}

The edge lists and reads the bucket, or runs `pg_dump` and `mysqldump` against
the RDS endpoint, inside AWS. Name an edge pool on the inventory to pin its
tasks to edges running in that region.

{{< /pair >}}

{{< pair lead="Unchanged chunks never leave AWS." >}}

Each object and each dump is cut into content-defined chunks, and a chunk
crosses to the store only when the store does not hold it. An RDS dump in which
only recent rows changed sends those rows' chunks, not the whole dump.

{{< /pair >}}

{{< pair lead="What leaves is compressed, then encrypted." >}}

The edge compresses each new chunk with LZ4 and encrypts it before upload. Text,
logs and SQL dumps shrink, and the other provider receives only encrypted data.

{{< /pair >}}

{{< /pairs >}}

## AWS backups without long-lived access keys {kicker="IAM roles"}

{{< cards cols="3" style="boxed" >}}

{{< card label="credentials_type=iam" >}}

### AWS inventory and Secrets Manager through the EC2 instance role

When Plakar Control Plane runs on EC2, the inventory and the secret provider use
the IAM role attached to the instance, through the standard AWS credential
chain. A Control Plane outside AWS gives the inventory an access key, which can
itself come from a secret provider.

{{< /card >}}

{{< card label="postgres+aws://" >}}

### RDS PostgreSQL with IAM database authentication

The `postgres+aws://` protocol generates an IAM authentication token for an
IAM-enabled database user, from the AWS credentials of the edge that runs the
task. The source stores a user, a host and a region, and no password.

{{< /card >}}

{{< card label="ambient credentials" >}}

### Amazon S3 sources with no stored access key

An S3 source created from the inventory can leave both key fields empty. The
task then signs its requests with the IAM role of the edge that runs it, as the
[Amazon S3 section of the S3 page](/integrations/s3/#amazon-s3-backup-iam-roles-s3-glacier-and-sse-c)
describes.

{{< /card >}}

{{< /cards >}}

## IAM permissions for AWS discovery and Secrets Manager {kicker="IAM policy"}

{{< columns ratio="5:7" >}}

{{< column >}}

The inventory needs read-only permissions. It lists resources through AWS
Resource Explorer, then describes each EC2 instance, RDS instance, cluster and
proxy to read its endpoints. `rds:DescribeDBProxies` covers accounts that run an
RDS Proxy.

The secret provider adds two Secrets Manager actions. Scope their `Resource` to
the ARNs of the secrets Plakar reads, for example everything under a
`prod/plakar/` prefix.

Backups use their own credentials, set on each source: an IAM database user for
`postgres+aws`, a role or key with `s3:ListBucket` and `s3:GetObject` for a
bucket.

{{< /column >}}

{{< column >}}

```json {title="IAM policy for the AWS inventory and Secrets Manager"}
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PlakarInventory",
      "Effect": "Allow",
      "Action": [
        "resource-explorer-2:Search",
        "resource-explorer-2:List*",
        "resource-explorer-2:Get*",
        "ec2:DescribeInstances",
        "s3:ListAllMyBuckets",
        "rds:DescribeDBInstances",
        "rds:DescribeDBClusters",
        "rds:DescribeDBProxies"
      ],
      "Resource": "*"
    },
    {
      "Sid": "PlakarSecrets",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ],
      "Resource": "arn:aws:secretsmanager:eu-west-3:123456789012:secret:prod/plakar/*"
    }
  ]
}
```

{{< /column >}}

{{< /columns >}}

## Plakar Control Plane for AWS accounts {kicker="Control Plane"}

The AWS integration is part of Plakar Control Plane. Policies schedule every
discovered source whose environment and data class they match, and a residency
on the inventory keeps the backups of its resources in stores of the same
residency. The S3, PostgreSQL and MySQL integrations it hands resources to are
free and open source in the `plakar` CLI as well.

[See how Plakar Control Plane works](/solutions/control-plane/), read the
[AWS inventory documentation](/docs/control-plane/inventories/managed/aws/), or
[contact us](/contact/).

## AWS backup FAQ {kicker="FAQ"}

{{< columns ratio="1:1" >}}

{{< column >}}

### Which AWS resources does Plakar discover?

Every resource AWS Resource Explorer returns for the account, with its ARN,
Region, service, type and AWS tags. S3 buckets, EC2 instances, and RDS
instances, clusters and proxies, Aurora included, also get a class, their
endpoints and a name taken from their `Name` tag or their ARN.

### How does Plakar back up an Amazon RDS database?

With the PostgreSQL or MySQL integration, on an edge that has the client tools.
They dump each database with `pg_dump` or `mysqldump`, and `postgres+aws://`
signs in with an IAM token. The dump restores to the same instance, a new one,
or any server outside AWS.

### How do I make sure new AWS resources get a backup?

Let a configuration bundle cover them. The AWS inventory lists the S3 buckets
and RDS databases it discovers, a bundle with **Auto-create connectors** gives
each one in its scope a source, and the policies schedule every source that
matches them.

### How often does the AWS inventory refresh?

Every 900 seconds (15 minutes) by default. The interval goes down to 30 seconds
in the inventory's synchronization settings, and **Sync now** refreshes it at
any time.

### Which AWS credentials does Plakar Control Plane use?

The IAM role of its EC2 instance, for both the inventory and the Secrets Manager
provider. A Control Plane running outside AWS reads the account with the access
key of an IAM user that holds the read-only policy.

{{< /column >}}

{{< column >}}

### How long does AWS keep RDS automated backups?

35 days at most. The backup retention period of an RDS DB instance ranges from 0
to 35 days, 7 by default in the console, and automated backups are deleted with
the instance unless **Retain automated backups** is chosen. Plakar snapshots
follow the retention of the policy that schedules them.

### How does Plakar back up an S3 bucket found on AWS?

With the S3 integration, which reads the current version of every object of the
bucket, or of one prefix, into an encrypted snapshot. A restore writes the
objects to the same bucket, another bucket or another S3 provider.

### How does Plakar cut AWS egress for backups at another provider?

It reads each resource from an edge in the resource's AWS region and uploads
only the chunks the store does not hold yet, compressed with LZ4 and encrypted.
After the first backup, data transfer out of AWS follows what changed.

### Can I use AWS Secrets Manager without the AWS inventory?

Yes. The secret provider and the inventory are configured separately, and either
one works alone.

### Which IAM permissions does the Secrets Manager provider need?

`secretsmanager:GetSecretValue` and `secretsmanager:DescribeSecret` on the
secrets it reads, granted to the IAM role of the EC2 instance that runs Plakar
Control Plane, next to the inventory permissions.

### How do I cover several AWS accounts?

Create one AWS inventory per account, each with its own credentials. The access
key of another account can itself come from Secrets Manager. Each inventory can
use its own edge pool and residency.

### Where should AWS backups be stored?

Away from the account that holds the data. A store can be an S3 bucket in
another AWS account, where Object Lock applies once you enable it, or a bucket
at another provider. A sync between two stores keeps a second copy under other
credentials.

{{< /column >}}

{{< /columns >}}
