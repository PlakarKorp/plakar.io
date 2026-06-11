---
title: "Restoring Plakar Control Plane"
date: "2026-06-11T00:00:00Z"
weight: 2
summary:
  "How to restore Plakar Control Plane from a backup snapshot to a new
  appliance."
---

# Restoring Plakar Control Plane

> [!WARNING]+
>
> The restore process is currently manual. Automated restore support is under
> active development and will be available very soon.

This guide walks through restoring a Plakar Control Plane backup to a fresh
appliance.

## Step 1 — Start a new virtual appliance in bootstrap mode

Deploy a new Plakar Control Plane virtual appliance and leave it in **bootstrap
mode** without completing the initial setup wizard. Refer to the
[installation guide](../../../intro/installation) for platform-specific
instructions on deploying the appliance.

> [!NOTE]+
>
> The virtual appliance image must be the same version as the one that was
> running at the time the backup was taken. Once the restore is complete, you
> can [upgrade the appliance](../../updating-control-plane) to a newer version.

## Step 2 — Verify SSH access

Confirm that you can connect to the new appliance over SSH using the `plakar`
user:

```bash
export APPLIANCE_ADDRESS=<appliance-address>

ssh plakar@$APPLIANCE_ADDRESS
```

## Step 3 — Install Plakar OSS and configure the store

On your local machine, install the Plakar OSS client. Refer to the
[installation guide](/docs/community/main/quickstart/installation) for
instructions.

Once installed, configure the store where your backup snapshot is hosted. Refer
to the [quickstart guide](/docs/community/main/quickstart/first-backup) for
store configuration instructions.

## Step 4 — Archive the snapshot to a local file

Use the `plakar` CLI to export the backup snapshot as a compressed archive:

```bash
plakar -stdio at <store> archive -output pcp.tar.gz <snapshot_id>
```

Replace `<store>` with the store URI and `<snapshot_id>` with the identifier of
the snapshot you want to restore. This produces a `pcp.tar.gz` file in the
current directory.

## Step 5 — Upload the archive to the appliance

Pipe the archive directly into the `orkestrator` container using the `$APPLIANCE_ADDRESS` set in step 2:

```bash
cat pcp.tar.gz | ssh plakar@$APPLIANCE_ADDRESS sudo ctr -n services.linuxkit task exec --exec-id upload-pcp orkestrator sh -c '"mkdir -p /data/tmp-restore-pcp && cat > /data/tmp-restore-pcp/pcp.tar.gz"'
```

This places the archive at `/data/tmp-restore-pcp/pcp.tar.gz` inside the container.

## Step 6 — Run the restore commands

Connect to the `orkestrator` container and run the restore commands:

```bash
ssh -t plakar@${APPLIANCE_ADDRESS} sudo ctr -n services.linuxkit task exec -t --exec-id restore-pcp orkestrator bash
```

From the container shell, run the following commands:

```bash
# Extract the archive in a docker container because busybox tar is limited and cannot handle the archive produced by plakar
docker run --rm -i -v /data/tmp-restore-pcp:/app -w /app ubuntu tar -zxvf ./pcp.tar.gz

# Remove the current database to prepare for the restore
docker-compose -f /data/plakman/run/database.yaml kill postgres
rm -rf /data/database_runtime/*

# Create a temporary database container to run the restore commands
docker network create restore-net
docker run -d --rm -ti -v /data/database_runtime:/var/lib/postgresql/data -e POSTGRES_PASSWORD=postgres --name restore-db --network restore-net postgres:16

sleep 5 # wait for the database to start

# Restore the database dumps in the correct order
## Globals
docker run --rm -i -e PGPASSWORD=postgres --network restore-net postgres:17 psql -h restore-db -U postgres -d postgres < /data/tmp-restore-pcp/db/00000-globals.sql
## Postgres database
docker run --rm -i -e PGPASSWORD=postgres --network restore-net postgres:17 pg_restore -h restore-db -U postgres --clean -d postgres < /data/tmp-restore-pcp/db/00002-postgres.dump
## Plakar Control Plane database
docker run --rm -i -e PGPASSWORD=postgres --network restore-net postgres:17 dropdb --if-exists -h restore-db -U postgres plakman-db
docker run --rm -i -e PGPASSWORD=postgres --network restore-net postgres:17 createdb -h restore-db -U postgres plakman-db
docker run --rm -i -e PGPASSWORD=postgres --network restore-net postgres:17 pg_restore -h restore-db -U postgres -f - < /data/tmp-restore-pcp/db/00001-plakman-db.dump | sed "s/SELECT pg_catalog.set_config('search_path', '', false);/SELECT pg_catalog.set_config('search_path', 'public', false);/" | docker run --rm -i -e PGPASSWORD=postgres --network restore-net postgres:17 psql -h restore-db -U postgres -d plakman-db

# Clean up database restore artifacts
docker rm -f restore-db
docker network rm restore-net

# Restore files
rm -rf /data/secrets/* && cp -r /data/tmp-restore-pcp/fs/appliance_data/secrets/* /data/secrets/
rm -rf /data/ssh/* && cp -r /data/tmp-restore-pcp/fs/appliance_data/ssh/* /data/ssh/
rm -rf /data/plakman_runtime/* && cp -r /data/tmp-restore-pcp/fs/appliance_data/plakman_runtime/* /data/plakman_runtime/
rm -rf /data/plakman/* && cp -r /data/tmp-restore-pcp/fs/appliance_data/plakman/* /data/plakman/

# Clean up
rm -rf /data/tmp-restore-pcp
```

## Step 7 — Reboot

Reboot the appliance from your provider's management console. For example on AWS, select the instance and click **Reboot**.

## Post-restore: verify provider-side configuration

Once the appliance is back online, the instance is fully restored. However, depending on your deployment environment, you may also need to verify that the new instance has the same provider-side configuration as the original.

For example, on AWS, ensure that the new EC2 instance has:
- The same IAM role and permissions attached
- The same security group rules and network restrictions
- The same VPC and subnet placement if applicable

Refer to the [installation guide](../../../intro/installation) for your platform for details on the required provider-side configuration.