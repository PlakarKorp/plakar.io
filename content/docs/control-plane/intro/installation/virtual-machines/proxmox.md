---
title: "Proxmox VE"
date: "2026-07-17T00:00:00Z"
weight: 2
summary: "How to install Plakar Control Plane on Proxmox VE"
---

# Proxmox VE Installation

Plakar Control Plane can be deployed on Proxmox VE by creating a virtual machine
manually and booting it from the Plakar Control Plane ISO image. The official
ISO image can be downloaded from the
[Plakar Control Plane Downloads Page](https://www.plakar.io/download).

## Uploading the ISO

Before creating the virtual machine, the ISO needs to be added to a storage
location on your Proxmox node so it can be attached as installation media.

In the Proxmox web interface, select the storage you want to hold the ISO from
the left-hand tree, then open its **ISO Images** section. From here you can
either upload the file directly from your computer, or provide a publicly
accessible URL and have Proxmox download it for you. Either way, you can
optionally supply a checksum and select the hashing algorithm used, so Proxmox
verifies the file's integrity once it's added.

![Uploading ISO image to Proxmox VE](../images/uploading-iso-to-proxmox.png)

> [!NOTE]+
>
> Prefer a shared storage location if your Proxmox node is part of a cluster. An
> ISO or disk kept on node-local storage won't be reachable if the virtual
> machine ever needs to run on a different node.

## Creating the Virtual Machine

Click **Create VM** in the top-right of the Proxmox interface to open the
creation wizard.

### General

Give the virtual machine a name. The VM ID can be left at its pre-assigned value
unless you need a specific one for your environment.

![](../images/proxmox-ve-1.png)

### OS

Set **Use CD/DVD disc image file (iso)**, choose the storage where you uploaded
the ISO, and select the Plakar Control Plane image from the list. For **Guest
OS**, set the type to **Linux** and the version to **7.x - 2.6 Kernel**.

![](../images/proxmox-ve-2.png)

### System

Set **BIOS** to **OVMF (UEFI)** and check **Add EFI Disk**, selecting any
storage available to hold it. Leave the EFI disk format on the default (qcow2).

![](../images/proxmox-ve-3.png)

> [!WARNING]+
>
> Leave **Pre-Enroll keys** unchecked. This option enrolls Microsoft's default
> Secure Boot keys, and the appliance will fail to boot if it's enabled.

Everything else on this tab can be left at its default.

### Disks

Set the disk size to **1 TB**. This is the recommended size for a production
deployment. The disk stores the database, logs, and all Plakar state, separate
from wherever you configure backups themselves to be stored. For evaluation or
testing, a smaller disk is fine. Leave the format (qcow2) and storage selection
on default, or pick a specific storage if your node has more than one available.

![](../images/proxmox-ve-4.png)

### CPU

Set **Cores** to **4** and **Sockets** to **1**. This is the recommended sizing
for production use. Leave **Type** on its default (`x86-64-v2-AES`). For
evaluation or testing, a smaller number of cores is fine.

![](../images/proxmox-ve-5.png)

### Memory

Set memory to **16384 MiB** (16 GB), the recommended amount for production use.
For evaluation or testing, a smaller memory size is fine.

![](../images/proxmox-ve-6.png)

### Network

Select the network bridge the appliance should attach to. Leave the model on
**VirtIO**.

![](../images/proxmox-ve-7.png)

> [!NOTE]+
>
> The appliance receives its network configuration via DHCP. A DHCP server must
> be running and reachable on the selected bridge.

### Confirm

Review the summary of your selections, then click **Finish** to create the
virtual machine.

![](../images/proxmox-ve-8.png)

## Proxy and Harbor Configuration

If the appliance's network doesn't have direct access to the internet, it needs
an HTTP proxy, a local Harbor registry mirror, or both, configured before the
first boot.

### What needs to be reachable

Plakar Control Plane needs HTTPS access to `api.plakar.io` for runtime
configuration, license validation, and plugin downloads. If your proxy uses a
whitelist rather than allowing all traffic, `*.plakar.io` must be on it.

The appliance also needs to pull Docker images from `docker.io` and `ghcr.io`.
There are two supported approaches:

1. **Route image pulls through the same HTTP proxy.** If you take this route,
   the proxy must allow:
   - `*.docker.io`
   - `*.docker.com`
   - `*.ghcr.io`
   - `*.githubusercontent.com`
2. **Configure a Harbor registry mirror.** This is the preferred option for
   production, since it gives you a local cache of the images instead of pulling
   them over the internet on every deployment. If you use Harbor, you don't need
   to whitelist the domains above on your proxy.

### Write the user-data snippet

The user-data is a plain YAML document with `proxy:` and/or `registry:` keys.
You'll need to supply either or both, depending on what you need.

```bash
mkdir -p /var/lib/vz/snippets
cat > /var/lib/vz/snippets/plakar-appliance.yaml << 'EOF'
#cloud-config
proxy:
  http:  http://<proxy-ip>:<proxy-port>
  https: http://<proxy-ip>:<proxy-port>
  no_proxy: .corp.example,10.0.0.0/8       # optional

registry:
  mirrors:
    docker.io: <harbor-host>/dockerhub-proxy
    ghcr.io:   <harbor-host>/ghcr-proxy
  insecure: false     # true: skip TLS verification for the mirror hosts
EOF
```

The Proxmox web interface only lists existing snippets under **Storage →
Snippets** it has no option to create or upload one. Snippets have to be placed
directly on disk, e.g. via the node's shell. On the default `local` storage,
that path is `/var/lib/vz/snippets/`.

![](../images/proxmox-ve-9.png)

### Attach the user-data to the VM

Add a cloud-init drive so Proxmox can generate the cidata image, and point it at
your snippet. The cloud-init drive must always be attached at `ide3`:

```bash
qm set <vmid> --ide3 local:cloudinit
qm set <vmid> --cicustom "user=local:snippets/plakar-appliance.yaml"
qm cloudinit update <vmid>
```

### Apply and reboot

```bash
qm reboot <vmid>
```

### Verify

Watch the console during boot for a line prefixed `proxy-collect:`. It reports
either the proxy configuration that was applied, or why none was found:

```txt
proxy-collect: proxy configured: http=http://<proxy-ip>:<proxy-port> https=... no_proxy=...
```

## SSH Keys Configuration

There are two ways to set an SSH authorized key, and which one applies depends
on whether you also need proxy and/or registry configuration.

If you don't need proxy or Harbor configuration you can skip the YAML entirely
and set the key from the Proxmox UI instead.

![](../images/proxmox-ve-10.png)

1. On the VM, go to **Hardware**, click **Add**, and select **CloudInit Drive**.
2. Set **Bus/Device** to **IDE**, and change the index from the default `0` to
   `3`, so the drive lands on `ide3`.
3. Choose a **Storage** location.
4. Leave **Format** on the default (QEMU image format, qcow2).
5. Click **Add**.

{{< figure src="../images/proxmox-ve-11.png" alt="Adding a CloudInit Drive" class="mx-auto max-w-100" >}}

6. Open the **Cloud-Init** tab, click **SSH public key**, and paste in your
   public key, or upload the key file directly.

   ![Cloud-Init tab with SSH public key field](../images/proxmox-ve-12.png)

If you need both the proxy and/or registry configuration as well, the UI on
Proxmox dashboard isn't enough, since it can't set `proxy:` and/or `registry:`.
You'll need to add `ssh_authorized_keys` as an extra top-level key in the same
YAML snippet described [above](#proxy-and-harbor-configuration) instead,
alongside `proxy:` and/or `registry:`:

```yaml
#cloud-config
proxy:
  http: http://<proxy-ip>:<proxy-port>
  https: http://<proxy-ip>:<proxy-port>
  no_proxy: .corp.example,10.0.0.0/8 # optional

registry:
  mirrors:
    docker.io: <harbor-host>/dockerhub-proxy
    ghcr.io: <harbor-host>/ghcr-proxy
  insecure: false # true: skip TLS verification for the mirror hosts

ssh_authorized_keys:
  - ssh-ed25519 AAAA...
```

## Start the appliance and complete enrollment

Power on the virtual machine. Once the appliance has booted and is reachable on
the network, open it from a browser using its assigned IP address.

```txt
http://<ASSIGNED-IP>
```

> [!NOTE]+
>
> If the appliance is on a private or NAT'd bridge that isn't directly reachable
> from your browser, you can forward a port on the Proxmox host's public
> interface to the appliance instead:
>
> ```bash
> iptables -t nat -A PREROUTING -i <public-bridge> -p tcp --dport <public-port> -j DNAT --to-destination <appliance-ip>:80
> iptables -t nat -A POSTROUTING -o <private-bridge> -p tcp -d <appliance-ip> --dport 80 -j MASQUERADE
> ```
>
> Then browse to `http://<proxmox-host-public-ip>:<public-port>`.

For production environments, restrict access to trusted IP ranges, private
networking, a VPN, or a reverse proxy or load balancer with TLS.

For first-time installations, you will be guided through the enrollment process
to:

- Register the instance with Plakar services for licensing and billing
- Create the initial administrator account

See the [enrollment](../../enrollment) documentation for more details.
