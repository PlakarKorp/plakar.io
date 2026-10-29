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

Set the disk size to the data disk size given in
[Appliance Sizing](../../../appliance/sizing). The disk stores the database,
logs, and all Plakar state, separate from wherever you configure backups
themselves to be stored. Leave the format (qcow2) and storage selection on
default, or pick a specific storage if your node has more than one available.

![](../images/proxmox-ve-4.png)

### CPU

Set **Cores** to the number of vCPUs given in
[Appliance Sizing](../../../appliance/sizing), and **Sockets** to **1**. Leave
**Type** on its default (`x86-64-v2-AES`).

![](../images/proxmox-ve-5.png)

### Memory

Set memory to the amount given in [Appliance Sizing](../../../appliance/sizing),
in MiB.

![](../images/proxmox-ve-6.png)

### Network

Select the network bridge the appliance should attach to. Leave the model on
**VirtIO**.

![](../images/proxmox-ve-7.png)

> [!NOTE]+
>
> By default the appliance receives its network configuration via DHCP, so a
> DHCP server must be running and reachable on the selected bridge. For a static
> IP instead, see the **Advanced** tab in
> [Configuring the Appliance](#configuring-the-appliance) below.

### Confirm

Review the summary of your selections, then click **Finish** to create the
virtual machine.

![](../images/proxmox-ve-8.png)

## Configuring the Appliance

By default the appliance boots with DHCP networking and no SSH access. If that's
enough for you, skip ahead to
[Accessing Plakar Control Plane](#accessing-plakar-control-plane). Otherwise,
the appliance reads its settings from a cloud-init user data document, whose
keys are described in
[Appliance Configuration](../../../appliance/configuration). This section covers
how to deliver that document on Proxmox.

Pick one of the two tabs below, not both. A Proxmox VM only takes a single
cloud-init user-data source, so if you use the Advanced tab's snippet, set the
SSH key there too, alongside any proxy, registry, or network settings, instead
of from the UI.

{{< tabs >}}

{{< tab label="Basic (UI)" >}}

If SSH access is all you need (no proxy, no registry mirror, no static IP), set
the key from the Proxmox UI, no YAML required.

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

{{< /tab >}}

{{< tab label="Advanced (CLI)" >}}

The Proxmox UI can only set an SSH key. It has no fields for a proxy, registry
mirrors, a release server, NTP servers or a static IP. For any of those, write a
cloud-init YAML snippet on the Proxmox node instead. A single snippet carries
all of these settings.

If the appliance goes through a proxy or firewall, the hosts it has to reach are
listed in
[Required outbound access](../../../appliance/configuration#required-outbound-access).

### Write the user-data snippet

Write the cloud-init document to a snippet on the Proxmox node. The document
below sets every key. Remove the ones your environment does not need, each key
is optional.

```bash
mkdir -p /var/lib/vz/snippets
cat > /var/lib/vz/snippets/plakar-appliance.yaml << 'EOF'
#cloud-config
ssh_authorized_keys:
  - ssh-ed25519 AAAA...

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
EOF
```

Each key, including the network options and their rules, is described in
[Appliance Configuration](../../../appliance/configuration).

> [!NOTE]+
>
> The IP configuration fields of the Proxmox **Cloud-Init** tab, such as
> `ipconfig0`, are not read by the appliance. Static addressing has to go
> through the `network:` key of the snippet instead.

The Proxmox web interface only lists existing snippets under **Storage ->
Snippets**. It has no option to create or upload one. Snippets have to be placed
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

The appliance reads the snippet once, when it boots, so a change to it takes
effect after the next reboot. To check the result, connect over SSH and run
[doktor](../../../appliance/troubleshooting#running-doktor).

{{< /tab >}}

{{< /tabs >}}

### Connect over SSH

If you configured an SSH key, connect to the booted appliance with the `plakar`
user:

```sh
ssh plakar@<assigned-ip>
```

Replace `<assigned-ip>` with the appliance's configured or DHCP-assigned IP
address.

## Accessing Plakar Control Plane

Power on the virtual machine. Once the appliance has booted, Plakar Control
Plane is reached from a browser at `http://<assigned-ip>`, the IP address
configured for the appliance or assigned by DHCP.

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
