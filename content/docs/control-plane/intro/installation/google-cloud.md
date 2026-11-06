---
title: "Google Cloud"
date: "2026-07-14T00:00:00Z"
weight: 5
summary: "How to install Plakar Control Plane on Google Cloud Platform"
---

# Google Cloud Platform Installation

Plakar Control Plane is distributed on Google Cloud Platform as a custom image
hosted under the (`plakar-images`) project. Because the image lives outside your
own project, GCP requires explicit authorization before it can be used, and this
authorization works differently depending on whether you deploy through the
Console or the `gcloud` CLI.

## Getting access to the image

GCP images can only be shared with projects, domains, or individual accounts
that the image owner has explicitly authorized. The Console's instance-creation
flow relies on this authorization to browse and select an image, so it only
works for accounts Plakar has whitelisted, either by domain or by an email
address.

- **`gcloud` CLI:** works without any whitelisting, because referencing an image
  by name and project doesn't require the browsing permissions the Console UI
  needs. This is the recommended path for most users, since it doesn't depend on
  Plakar granting access first.
- **Console (UI):** [contact us](/contact) to have your Google account or
  Workspace domain added to the `plakar-images` project's IAM policy. Once
  whitelisted, the project appears when browsing custom images, and the rest of
  the deployment can be done by clicking through the Console.

{{< tabs >}}

{{< tab label="gcloud CLI" >}}

The `gcloud` CLI can reference the `plakar-images` project directly, without
requiring the domain-whitelisting the Console needs:

```bash
gcloud compute instances create <INSTANCE_NAME> \
  --project=<YOUR_PROJECT> \
  --zone=<ZONE> \
  --machine-type=n2-standard-4 \
  --image=control-plane-v-0-0-3 \
  --image-project=plakar-images \
  --boot-disk-size=10GB \
  --boot-disk-type=pd-balanced \
  --create-disk=name=<INSTANCE_NAME>-data,size=1024GB,type=pd-balanced \
  --tags=http-server \
  --service-account=<SERVICE_ACCOUNT_EMAIL> \
  --scopes=cloud-platform
```

- `--machine-type=n2-standard-4` matches the S tier of
  [Appliance Sizing](../../appliance/sizing).
- `--image` and `--image-project` reference the Plakar Control Plane image by
  name, which works regardless of whitelisting.
- `--create-disk` provisions the data disk that holds the database, logs, and
  all Plakar state, separate from wherever you configure backups themselves to
  be stored. Set its size to the data disk size given in
  [Appliance Sizing](../../appliance/sizing).
- `--service-account` and `--scopes` attach a service account to the instance,
  which lets Plakar Control Plane authenticate to Google Cloud services such as
  inventories and secret providers without a service account key. Both flags are
  optional if you plan to use service account keys instead. When attaching a
  service account, `--scopes=cloud-platform` is required: without it, the
  instance uses the default access scopes, which block some APIs regardless of
  the service account's IAM roles. See
  [Attaching the Service Account to an Instance](../../../guides/google-cloud/iam-roles-and-service-accounts#attaching-the-service-account-to-an-instance).
- `--tags=http-server` applies the tag GCP's default network firewall rule uses
  to allow inbound HTTP traffic. If your project doesn't have that default rule,
  create one explicitly:

  ```bash
  gcloud compute firewall-rules create allow-http \
    --network=<NETWORK> \
    --allow=tcp:80 \
    --target-tags=http-server \
    --source-ranges=0.0.0.0/0
  ```

  > [!WARNING]+
  >
  > Restrict `--source-ranges` to trusted IP ranges, your organization's
  > gateway, or a VPN in production. `0.0.0.0/0` allows access from any address
  > and should only be used for testing or temporary deployments.

- To use Spot provisioning instead of Standard, add `--provisioning-model=SPOT`.
  Spot instances run until preempted by GCP, which makes them a fit for
  fault-tolerant workloads but not for a Control Plane instance, which needs to
  run continuously.

Once the instance is created, it can be viewed and managed from **Compute Engine
→ VM instances** in the Console like any other instance.

{{< /tab >}}

{{< tab label="Console (UI)" >}}

> [!NOTE]+
>
> This path requires your Google account or domain to already be whitelisted on
> the `plakar-images` project. If it isn't, use the CLI tab instead, or
> [contact us](/contact) to request access.

Compute instances can be created from **Compute Engine → VM instances** then
click on **Create Instance** to create a new instance.

### Machine configuration

Provide the instance a name, and choose the region and zone where it should run.
You then need to select an instance type for running control plane on.

{{< figure src="../images/gcp-1.png" alt="" class="mx-auto max-w-120" >}}

Size the instance according to [Appliance Sizing](../../appliance/sizing), which
gives the CPU, memory and disks for each size of deployment. For the S tier, a
preset such as `n2-standard-4` is suitable.

Under **Provisioning model**, choose **Standard** for a persistent deployment.
**Spot VMs** run until preempted by GCP, which makes them a fit for
fault-tolerant workloads but not for a Control Plane instance, which needs to
run continuously.

{{< figure src="../images/gcp-2.png" alt="" class="mx-auto max-w-120" >}}

### OS and storage

By default, GCP proposes a generic Debian image. This needs to be replaced with
the Plakar Control Plane image:

{{< figure src="../images/gcp-3.png" alt="" class="mx-auto max-w-120" >}}

1. Under **Boot disk**, click **Change**.
2. Select the **Custom images** tab.
3. Under **Source project for image**, click **Change**, and select
   `plakar-images` from the list of projects your account has been granted
   access to. If the project doesn't appear here, your account hasn't been
   whitelisted yet. See
   [getting access to the image](#getting-access-to-the-image) above.
4. Select the latest available image (currently `control-plane-v-0-0-3`).

For the boot disk itself, any of the available persistent disk types (Balanced,
SSD, Extreme, or Standard) will work. It only needs the system disk size given
in [Appliance Sizing](../../appliance/sizing), since the appliance's state is
stored on a separate data disk.

{{< figure src="../images/gcp-4.png" alt="" class="mx-auto max-w-120" >}}

### Additional disk

The database, logs, and all Plakar state are stored on a dedicated data disk,
separate from wherever you configure backups to be stored:

1. Under **Additional disks**, click **Add new disk**.
2. Leave the disk source blank so GCP creates a new, empty disk.
3. Set the size to the data disk size given in
   [Appliance Sizing](../../appliance/sizing).
4. Choose a disk type. Balanced, SSD, Extreme, Standard, and Hyperdisk are all
   supported; pick whichever matches your performance and cost requirements.

The remaining disk settings (snapshot schedule and deletion behavior) can be
left at their defaults.

{{< figure src="../images/gcp-5.png" alt="" class="mx-auto max-w-120" >}}

### Data protection

Choose the snapshot or backup schedule that matches your organization's data
protection requirements for this instance.

### Networking

Plakar Control Plane is served through a web UI over HTTP. For HTTPS, place a
load balancer in front of the instance to handle TLS termination. Configure
firewall rules, network tags, and IP settings according to your organization's
network policy. At minimum, **Allow HTTP traffic** needs to be enabled for the
web UI to be reachable once the instance is running.

### Security

To let Plakar Control Plane authenticate to Google Cloud services without a
service account key, select the service account under **Identity and API
access**, and set access scopes to allow full access to all Cloud APIs. The
default access scopes block some APIs regardless of the service account's IAM
roles. See
[Attaching the Service Account to an Instance](../../../guides/google-cloud/iam-roles-and-service-accounts#attaching-the-service-account-to-an-instance).
This is optional if you plan to use service account keys instead.

> [!NOTE]
>
> Full access only allows the instance to reach Google Cloud APIs. It does not
> grant any permissions: what the instance can actually do is still determined
> by the IAM roles assigned to its service account.

{{< figure src="../images/gcp-7.png" alt="" class="mx-auto max-w-120" >}}

The **Observability** and **Advanced** tabs can be configured according to your
organization's standards, as neither is required for a working deployment.

Click **Create** once the configuration is complete.

{{< /tab >}}

{{< /tabs >}}

## Configuring the Appliance

An instance with direct internet access needs no configuration. For anything
else, such as a proxy or registry mirrors, the appliance reads its settings from
the `user-data` key of the instance metadata, set when the instance is created.
The keys of the document are described in
[Appliance Configuration](../../appliance/configuration).

With the `gcloud` CLI, save the document to a file and add it to the
`gcloud compute instances create` command:

```bash
--metadata-from-file=user-data=user-data.yaml
```

In the Console, open **Advanced** while creating the instance, then add a
metadata item under **Metadata** with the key `user-data` and the document as
its value.

If the appliance goes through a proxy or firewall, the hosts it has to reach are
listed in
[required outbound access](../../appliance/configuration#required-outbound-access).

The document below sets every key except `ssh_authorized_keys`, which the Google
Cloud image ignores. Remove the ones your environment does not need, each key is
optional.

```yaml
#cloud-config
proxy:
  http: http://proxy.corp.example:3128
  https: http://proxy.corp.example:3128
  no_proxy: .corp.example

registry:
  mirrors:
    docker.io: harbor.corp.example/dockerhub-proxy
    ghcr.io: harbor.corp.example/ghcr-proxy
  insecure: false

releases:
  url: https://dist.corp.example/plakar/enterprise
  version: v1.1.2

ntp:
  servers:
    - 10.20.0.1
    - ntp.corp.example

network:
  ethernets:
    eth0:
      addresses: [10.0.1.5/24]
      gateway4: 10.0.1.1
      nameservers:
        addresses: [10.0.1.53]
```

## Accessing Plakar Control Plane

Once the instance is running, Plakar Control Plane is reached from a browser at
`http://<external-ip>`, the external IP address of the instance.

![](../images/gcp-6.png)

For first-time installations, you will be guided through the enrollment process
to:

- Register the instance with Plakar services for licensing and billing
- Create the initial administrator account

See the [enrollment](../../enrollment) documentation for more details.

## Limitations

The Google Cloud image does not accept SSH connections, and it ignores SSH keys,
whether they come from the instance metadata or from `ssh_authorized_keys` in
the user data. The appliance is administered entirely through the web interface.
