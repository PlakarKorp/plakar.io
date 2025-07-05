---
title: S3
subtitle: S3 Storage Connector
description: The Plakar S3 storage connector enables creation of a plakar Kloset repository on any S3-compatible object storage buckets.
categories:
  - storage connectors
tags:
  - S3
  - Object Storage
  - AWS
  - Google Cloud Storage
  - MinIO
  - Ceph
  - Scality
  - Wasabi
  - Scaleway
  - Blackblaze
  - OVH
stage: stable
date: 2025-05-13
---

## What You Can Do

The S3 storage connector brings the power of cloud object storage to your backup workflow. You can create repositories on any S3-compatible bucket, back up your local filesystem to S3, restore from S3 to a local filesystem or other storage backends, and sync data between S3 and other Plakar repositories. The connector works with multiple S3 providers including **AWS**, **MinIO**, **Scaleway**, **Backblaze**, and **CleverCloud**.

All data transfers use TLS encryption for security, and your data gets encrypted before it even reaches S3 thanks to [Kloset repository encryption](/posts/2025-04-29/kloset-the-immutable-data-store/).

## Configuration

Since S3 uses API keys, which are sensitive information, you can only configure S3 repositories through the configuration system. This keeps your credentials secure and separate from your backup commands.

### Setting Up a Repository

The configuration process involves creating a repository entry and setting the required parameters. Let's walk through setting up a repository called `s3-krepository`:

```bash
$ plakar config repository create s3-krepository
$ plakar config repository set s3-krepository location s3://s3.fr-par.scw.cloud/mysuperbucket
$ plakar config repository set s3-krepository access_key <ACCESS_KEY>
$ plakar config repository set s3-krepository secret_access_key <SECRET_KEY>
```

After configuration, you can refer to your S3 repository using the shorthand syntax `@s3-krepository` in all your backup commands. For example, to backup your `/etc/` directory:

> Replace the `<ACCESS_KEY>` and `<SECRET_KEY>` variables in the commands with your actual S3 credentials.

```bash
$ plakar at @s3-krepository backup /etc/
```

### Configuration Parameters

When configuring your S3 repository, you'll need to set several parameters:

| Option              | Type    | Description                                                                                                                |
| ------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| `location` | String  | Full S3 URL. Format: `s3://<endpoint>/<bucket>/<optional_path>`. **See the provider-specific section below for examples.** |
| `access_key` | String  | Your provider's access key.                                                                                                |
| `secret_access_key` | String  | Your provider's secret key.                                                                                                |
| `use_tls` | Boolean | Enables TLS (default: true).                                                                                               |

The `location` parameter is crucial - it tells Plakar exactly where your S3 bucket is located. While some providers display the `s3://` URL in their web interfaces, most do not, so you'll need to construct it manually using the patterns shown in the provider-specific examples below.

## Provider-Specific Configuration

Different S3 providers use different endpoint formats. The S3 connector expects the location to be in the format `s3://<endpoint>/<bucket>/<optional_path>`. Here's how to configure it for various providers:

### AWS S3

For AWS S3, the endpoint format includes the region:

```bash
$ plakar config repository set mys3 location s3://s3.<region>.amazonaws.com/<bucket>
# Example
$ plakar config repository set mys3 location s3://s3.us-east-1.amazonaws.com/mybucket
```

### MinIO

MinIO typically runs on custom hostnames and ports:

```bash
$ plakar config repository set mys3 location s3://<minio-host>:<port>/<bucket>
# Example
$ plakar config repository set mys3 location s3://localhost:9000/mybucket

# If you are running MinIO locally, you may need to set the following configuration to turn off TLS verification:
$ plakar config repository set mys3 use_tls false
```

When running MinIO locally without TLS, you must explicitly turn off the `use_tls` setting, as the default setting requires encrypted connections.

### Scaleway

Scaleway uses region-specific endpoints:

```bash
$ plakar config repository set mys3 location s3://s3.<region>.scw.cloud/<bucket>
# Example
$ plakar config repository set mys3 location s3://s3.fr-par.scw.cloud/mybucket
```

### Backblaze

Backblaze B2 uses its domain pattern:

```bash
$ plakar config repository set mys3 location s3://s3.<region>.backblazeb2.com/<bucket>
# Example
$ plakar config repository set mys3 location s3://s3.eu-central-003.backblazeb2.com/mybucket
```

### CleverCloud

CleverCloud uses a single endpoint for all regions:

```bash
$ plakar config repository set mys3 location s3://cellar-c2.services.clever-cloud.com/<bucket>
# Example
$ plakar config repository set mys3 location s3://cellar-c2.services.clever-cloud.com/mybucket
```

If your provider isn't listed here, join our Discord and we'll assist you in configuring it and updating this guide.

## Working with Your Repository

Once configured, you can use your repository with any Plakar command using the `-at` option. Here's how to create the Kloset repository and start using it:

```bash
$ plakar at @s3-krepository create
$ plakar at @s3-krepository backup @mys3
```

After running backups, you can list your snapshots and browse their contents:

```bash
# List available backups
$ plakar at @s3-krepository ls

# Launch (locally) the UI server and open a browser pointing to it.
$ plakar at @s3-krepository ui
```

Refer to the **[Quick Start Guide](https://docs.plakar.io/en/quickstart/index.html)** for additional examples and advanced usage patterns.

## Security Considerations

Using S3 storage introduces some security considerations you should be aware of. Your S3 credentials are powerful; if someone gains access to your access key, they can potentially access or modify your backups. Keep your configuration files secure by setting appropriate permissions (such as `chmod 600`) and regularly rotating your keys.

Bucket misconfiguration is another common issue. Accidentally making your bucket public could expose your data to the internet. Always set up proper bucket policies and use the principle of least privilege when configuring access permissions.

## Getting Help

If you run into issues with the S3 storage connector, there are several ways to get help:
- Join our [Discord](https://discord.gg/uuegtnF2Q5) where we're active and can help you configure tricky S3 providers. 
- Check the [GitHub Issues](https://github.com/PlakarKorp/plakar/issues) for known bugs and feature requests. 
- Read the complete [documentation](https://docs.plakar.io) for comprehensive guides and examples.

If your S3 provider isn't listed in our examples, hop on Discord and we'll help you get it working. The community is friendly, and we're always happy to expand our provider support based on your feedbacks.
