
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

## Step 2 — Verify SSH access

Confirm that you can connect to the new appliance over SSH using the `plakar`
user:

```bash
ssh plakar@<appliance-address>
```

## Step 3 — Install Plakar OSS and configure the store

On the new appliance, install the Plakar OSS client. Refer to the
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

## Step 5 — Copy the data into the running container

> [!NOTE]+ This section is in progress and will be updated soon.

<!-- Once the snapshot is extracted locally, copy its contents into the appropriate container using `ctr`. The containerd namespace for Plakar Control Plane services is `services.linuxkit`.

```bash
ssh user@host \
  'ctr -n services.linuxkit tasks exec --exec-id copy <container-id> tar cf - -C /target/path .' \
  | tar xf - -C ./local-dir
``` -->

<!-- Replace `<container-id>` with the ID of the Plakar Control Plane container, `/target/path` with the path inside the container where the data should land, and `./local-dir` with the local directory containing the restored snapshot data. -->

## Step 6 — Run the restore commands

> [!NOTE]+
>
> This section is in progress and will be updated soon.

## Step 7 — Reboot

Reboot the appliance to apply all changes and start Plakar Control Plane with
the restored configuration:

```bash
sudo reboot
```

