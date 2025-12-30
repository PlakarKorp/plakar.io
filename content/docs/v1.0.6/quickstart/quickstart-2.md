---
title: "Synchronize multiple copies"
date: "2025-12-15T00:00:00Z"
weight: 3
summary: "Create a second copy of your Kloset Store to improve the durability of your backups."
---

In this guide, we will create a second copy of the Kloset Store created in [Part 1 of the Quickstart](./quickstart.md).

This second copy will be stored on a S3-compatible storage service, but the same logic applies to any other storage location supported by **plakar**.

## Requirements

This guide assumes that:
* **plakar** is installed on your system (see the [Installation guide](./installation.md)).
* A Kloset Store exists on your local filesystem at `$HOME/backups` with at least one snapshot (see [Part 1 of the Quickstart](./quickstart.md)).

## Why create multiple copies?

Keeping multiple backup copies dramatically reduces the risk of total data loss by **turning a realistic single-site failure into an extremely unlikely event when data is replicated across independent locations** (see the [Why should you keep several copies of your backups?](../guides/why-several-copies/_index.md) guide).

Plakar is designed to make it easy to synchronize a Kloset Store to another location.

## Login to install pre-built integrations

By default, **plakar** works without requiring you to create an account or log in. You can back up and restore your data with just a few commands, with no external services involved.

However, logging in unlocks optional features that improve usability and monitoring. Among these features, it adds the ability to install the pre-built integrations hosted on our infrastructure.

In this quickstart, we will use the S3 integration, which requires the integration to be installed first. Therefore, we need to log in.

*If you don't want to log in, it is instead possible to build and install the integration manually. See the [Installing Integrations guide](../guides/installing-integrations/_index.md) for details.*

To log in using the CLI:

{{< tabs name="To log in using the CLI" >}}
{{% tab name="With email" %}}
```bash
plakar login -email <youremailaddress@example.com>
```

Substitute in your own email address and follow the prompt. You can then check your email and follow the link sent from plakar.io.
{{< /tab >}}
{{% tab name="With GitHub" %}}
```bash
plakar login -github
```

Your default browser will open a new tab where you can authorize plakar to use your GitHub account for authentication. Follow the prompts to complete the login.
{{< /tab >}}
{{< /tabs >}}

To check that you are now logged in, you can run:

```
plakar login -status
```

## Install the S3 integration

To install the S3 integration, run the following command:

```bash
plakar pkg add s3
```

If you already had the S3 integration installed and just wanted to update it, you can instead remove the existing version and install the latest one with:

```bash
plakar pkg rm s3
plakar pkg add s3
```

## Set up S3-compatible storage

For this quickstart, we will use a local MinIO instance as our S3-compatible storage service. If you have access to an actual S3-compatible service (such as AWS S3, Wasabi, Backblaze B2, etc.), you can skip this step and use the credentials provided by your service provider instead.

Run the following command to start a MinIO instance using Docker:

```bash
docker run -d --name minio -p 9000:9000 -p 9001:9001 quay.io/minio/minio server /data --console-address ":9001"
```

This command starts a MinIO server on `http://localhost:9000`, and a web interface available at `http://localhost:9001`. The default access key is `minioadmin` and the secret key is also `minioadmin`.

## Configure Plakar

To let **plakar** know about the S3 storage, we need to configure a new store. We will call this store `s3-backups`.

Run the following command to create the new store:

```bash
plakar store add s3-backups \
    location=s3://localhost:9000/mybucket \
    access_key=minioadmin \
    secret_access_key=minioadmin \
    use_tls=false
```

This command creates a new store named `s3-backups` that points to the `mybucket` bucket on the MinIO server running at `localhost:9000`. It uses the access key and secret key provided above. The `use_tls=false` option is specified because we are connecting to a local server without TLS.

*`use_tls` should be omitted or set to `true` when connecting to production S3-compatible services that use TLS.*

## Initialize the Kloset Store

For now, the Kloset Store points to a bucket that does not exist yet. We need to create it by initializing the store:

```bash
plakar at "@s3-backups" create
```

This command initializes the Kloset Store at the S3 location, creating the necessary bucket and structure to hold the backups.

Note the `@` symbol before the store name. This is an alias, which indicates that we are referencing a Kloset Store from the configuration. Without the `@`, **plakar** would interpret `s3-backups` as a filesystem path.

{{% notice style="info" title="Escaping on Windows" expanded="true" %}}
On Windows, make sure to use double quotes (`"`) around the store name to avoid issues with the `@` symbol being interpreted by the shell. On Unix-like systems, quotes are often unnecessary.
{{% /notice %}}

The passphrase prompt will appear: **you do not have to enter the same passphrase** as the local Kloset Store, but you can if you want to.

Plakar will automatically create the bucket if it does not already exist.

## List snapshots

If you list the snapshots in this new store, you will see that it is currently empty:

```bash
plakar at "@s3-backups" ls
```

## Synchronize the local Kloset Store to S3

Now, let's synchronize the local Kloset Store at `$HOME/backups` to the S3 Kloset Store we just created.

Run the following command:

```bash
$ plakar at $HOME/backups sync to "@s3-backups"
info: Synchronizing snapshot 772fba5f575272ba8742e63c6ec1878623900d158c5de4b20b854a0aa15a7b47 from fs:///Users/niluje/backups to s3://localhost:9000/mybucket
info: Synchronization of 772fba5f575272ba8742e63c6ec1878623900d158c5de4b20b854a0aa15a7b47 finished
info: sync: synchronization from fs:///Users/niluje/backups to s3://localhost:9000/mybucket completed: 1 snapshots synchronized
```

The command transfers all the snapshots from the local Kloset Store to the S3 Kloset Store.

To verify that the synchronization was successful, you can list the snapshots in the S3 Kloset Store again:

```bash
$ plakar at "@s3-backups" ls
2025-12-15T21:09:32Z   772fba5f   2.9 MiB        0s /private/etc
```

Notice that the snapshot ID is the same as the one in the local Kloset Store, confirming that the data has been successfully copied.

If you run the sync command again, you will see that no data is transferred because the destination store already contains all the snapshots from the source store.

```bash
$ plakar at $HOME/backups sync to "@s3-backups"
destination store passphrase:
info: sync: synchronization from fs:///Users/niluje/backups to s3://localhost:9000/mybucket completed: 0 snapshots synchronized
```

In production, you would typically run this command periodically to ensure that the S3 Kloset Store remains up-to-date with the local Kloset Store. If there are no new snapshots to transfer, the command will complete quickly without transferring any data.

## A remote Kloset Store works just like a local one

As a side note, you can use the remote Kloset Store just as you would use the local one:

* to run the UI, `plakar at "@s3-backups" ui`
* to verify integrity, `plakar at "@s3-backups" check`
* to restore files, `plakar at "@s3-backups" restore -to /tmp/restore <snapshot-id>`

Check `plakar help` to see all the available commands.


## Congratulations!

You have successfully created a second copy of your Kloset Store on S3-compatible storage. Your backups are now stored in two independent locations.

In this example, we used a local MinIO instance for demonstration purposes. In a real-world scenario, you would use a reliable S3-compatible service to have your backups stored offsite.

With **plakar**, hosting your backups on S3 is as easy as hosting them locally. In addition, many more [store integrations](/categories/storage-connector/#categories/) are available for hosting your backups in other locations.

## Next steps

Modern infrastructure involves more than just filesystems. In the next part of this Quickstart, we will see how to back up an S3 bucket using **plakar**.

- Continue to [Part 3 of the Quickstart](./quickstart-3.md) to create a backup for your non-filesystem data.