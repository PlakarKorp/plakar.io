---
title: S3
subtitle: Marketing sub title with main strength of the integration or the storage connector #  Example:  Protect your S3 data against, rogue deletion, ransomware and other threats.
description: Use the S3, object storage integration with any compatible S3 backend to back up, restore or duplicate it.
technology_description: S3 is a scalable object storage service commonly used for data archiving, backup, analytics, and cloud-native applications. It is accessible via a RESTful API and widely supported across public cloud providers and self-hosted solutions.
categories:
    - integration
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
date: 2025-04-16
---

# S3 storage connector

The **Plakar S3 storage connector** enables creation of a plakar [Kloset
repository](/posts/2025-04-29/kloset-the-immutable-data-store/) on any
**S3-compatible object storage buckets**

## Configuration

Since S3 uses API keys, sensitive piece of information, you can only address it
through the usage of a configuration entry.

### Setting up a repository

You can configure a repository aptly called `s3-krepository` to point to your
S3-compatible bucket like this :


```bash
$ plakar config repository create s3-krepository
$ plakar config repository set s3-krepository  s3://s3.fr-par.scw.cloud/mysuperbucket
$ plakar config repository set s3-krepository access_key <ACCESS_KEY>
$ plakar config repository set s3-krepository secret_access_key <SECRET_KEY>
```

From now on you can refer to your S3 repository through the short-hand syntax `@s3-krepository.`

For example to backup some local folder:

```bash
$ plakar at @s3-krepository backup /etc/
```

#### Remote Configuration Options

- **`location`**: Full S3 URL. Format: `s3://<endpoint>/<bucket>/<optional_path>`. **See the provider-specific section below for examples.**
- **`access_key`**: Your provider's access key.
- **`secret_access_key`**: Your provider's secret key.
- `use_tls`: Enables TLS (default: true).

### Provider-Specific Examples

The S3 integration expects the location to be in the format `s3://<endpoint>/<bucket>/<optional_path>`.
While some providers display the `s3://` URL in their web UI, most do not, and you will need to construct it manually.

> ℹ️ If your provider isn’t listed here, join our [Discord](https://discord.gg/uuegtnF2Q5) — we’ll help you configure it and update this guide.

#### [AWS S3](https://aws.amazon.com/s3/)

```bash
$ plakar config repository set mys3 location s3://s3.<region>.amazonaws.com/<bucket>
# Example
$ plakar config repository set mys3 location s3://s3.us-east-1.amazonaws.com/mybucket
```

#### [MinIO](https://min.io/)

```bash
$ plakar config repository set mys3 location s3://<minio-host>:<port>/<bucket>
# Example
$ plakar config repository set mys3 location s3://localhost:9000/mybucket

# If you are running MinIO locally, you may need to set the following configuration to disable TLS verification:
$ plakar config repository set mys3 use_tls false
```
When running MinIO locally without TLS, explicitly disable `use_tls`.

#### [Scaleway](https://www.scaleway.com/en/object-storage/)

```bash
$ plakar config repository set mys3 location s3://s3.<region>.scw.cloud/<bucket>
# Example
$ plakar config repository set mys3 location s3://s3.fr-par.scw.cloud/mybucket
```

#### [Backblaze](https://www.backblaze.com/cloud-storage)

```bash
$ plakar config repository set mys3 location s3://<minio-host>:<port>/<bucket>
# Example
$ plakar config repository set mys3 location s3://localhost:9000/mybucket
```

#### [CleverCloud](https://www.clever-cloud.com/developers/doc/addons/cellar/)

```bash
$ plakar config repository set mys3 location s3://cellar-c2.services.clever-cloud.com/<bucket>
# Example
$ plakar config repository set mys3 location s3://cellar-c2.services.clever-cloud.com/mybucket
```

## Example Usage

Once configured, you can now use your repository with any command using the plakar(1) -at option.

To create the Kloset repository at `/var/backups` and back up the S3 bucket previously configured as `mys3`, run the following command:

```bash
$ plakar at @s3-krepository create
$ plakar at @s3-krepository backup @mys3
```

You can then list snapshots and open the UI to browse content of snapshots

```bash
# List available backups
$ plakar at @s3-krepository ls

# Launch (locally) the UI server and open a browser pointing to it.
$ plakar at @s3-krepository ui
```

See the [QuickStart guide](https://docs.plakar.io/en/quickstart/index.html) for more examples.

## Questions, Feedback, and Support
## Supported features

## Limitation

## Future improvements

## Screenshots

## Threats
- List the main threats related to the technology
- 



