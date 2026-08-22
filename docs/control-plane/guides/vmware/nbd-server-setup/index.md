
# Setting up an NBD Server for VMware Backups

To back up and restore VMware compute instances, Plakar Control Plane does not
talk to vCenter or ESXi directly for disk I/O. Instead, a separate NBD server
running `nbdkit` with the VDDK plugin sits between vCenter/ESXi and Plakar
Control Plane. It reads and writes VM disks using VMware's Virtual Disk
Development Kit (VDDK) and streams the data over NBD. Plakar Control Plane
connects to it purely as a client; it does not run any VMware-specific component
itself.

The NBD server can run anywhere, as a VM managed by the same vCenter (required
for HotAdd) or as any other compute instance, as long as it has network access
to both sides:

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph PCP["Plakar Control Plane"]
    Consumer["NBD client<br/>(orchestration over SSH,<br/>disk data over TLS)"]
  end

  subgraph NBDServer["NBD Server (compute instance)"]
    Nbdkit["nbdkit + VDDK plugin"]
  end

  subgraph VMware["VMware Environment"]
    VCenter["vCenter / ESXi"]
  end

  Consumer -->|"SSH: orchestration"| Nbdkit
  Consumer -->|"NBD over TLS: disk bytes"| Nbdkit
  Nbdkit -->|"VDDK API"| VCenter
{{< /mermaid >}}
<!-- prettier-ignore-end -->

This guide walks through:

1. Installing `nbdkit` and the VDDK plugin
2. Installing the VMware VDDK libraries
3. Generating TLS certificates for the NBD server
4. Setting up SSH access for consumers
5. Configuring the Plakar connector to use the NBD server

## Prerequisites

- The account that runs `nbdkit` (the same account configured in Plakar Control
  Plane's `nbd_ssh_url`) determines which transports are available. A regular,
  non-root account is sufficient for NBD/NBDSSL transport. Root access is
  required if the NBD server will be used for HotAdd, see
  [HotAdd and root access](#hotadd-and-root-access) below.
- Network access from the NBD server to your vCenter/ESXi environment. Some
  vCenter deployments including OVHcloud Managed vSphere sit behind a firewall,
  so the NBD server's IP address must be added to the allow list before it can
  reach vCenter.
- Network access from Plakar Control Plane to the NBD server, both for SSH
  (orchestration) and for the TLS-secured NBD port (disk data).

## HotAdd and root access

HotAdd can be used when the NBD server itself is a VM managed by the same
vCenter as the VM being backed up, and has access to the same datastores. When
HotAdd is in use, VDDK temporarily attaches the source VM's disks directly to
the NBD server VM. Make sure the NBD server has free SCSI controller/device
slots available, and that nothing (snapshot automation, provisioning scripts,
etc.) removes these temporary disks while a backup or restore is running.

To let VDDK attach and open HotAdded devices, install and run `nbdkit` as
`root`:

```bash
sudo su -
user='root'
```

The SSH public key from
[Set up SSH access for consumers](#set-up-ssh-access-for-consumers) must be
installed in `/root/.ssh/authorized_keys`, and the connector's `nbd_ssh_url`
must use `ssh://root@<nbd_ip>`. Running the installation commands with `sudo`
while still configuring the connector for `ssh://ubuntu@...` does **not** make
the remotely launched `nbdkit` process run as root.

Root SSH access should remain key-only. On Ubuntu, verify that the effective SSH
configuration permits public-key login for root (for example,
`PermitRootLogin prohibit-password`) rather than enabling password login for
root.

{{< steps >}}

{{< step >}}

## Install nbdkit and the VDDK plugin

On the NBD server instance, install `nbdkit` along with the NBD client tools and
the VDDK plugin:

```bash
sudo apt update
sudo apt install -y nbdkit libnbd-bin nbd-client qemu-utils nbdkit-plugin-vddk
```

Confirm both `nbdkit` and the VDDK plugin installed correctly:

```bash
nbdkit vddk --dump-plugin
```

This should print a list of plugin parameters. If instead you get a
`cannot open plugin` error, the plugin was not installed correctly.

{{< /step >}}

{{< step >}}

## Install the VDDK libraries from Broadcom

`nbdkit-vddk` needs the actual VMware VDDK libraries, which are distributed
separately from Broadcom.

Download the VMware Virtual Disk Development Kit (VDDK) tarball from the
[Broadcom support portal](https://developer.broadcom.com/sdks/vmware-virtual-disk-development-kit-vddk/latest)
for example, `VMware-vix-disklib-8.x.x-xxxxxxx.x86_64.tar.gz`. Transfer it to
the NBD server (for example with `scp`), then extract and install it:

```bash
tar xzf VMware-vix-disklib-*.tar.gz
sudo mkdir -p /usr/lib/vmware-vix-disklib
sudo cp -r vmware-vix-disklib-distrib/* /usr/lib/vmware-vix-disklib/
```

The VDDK libraries must be installed at this exact path,
`/usr/lib/vmware-vix-disklib`, for the `nbdkit-vddk` plugin to find them.

Verify the installation:

```bash
ls /usr/lib/vmware-vix-disklib/lib64/libvixDiskLib.so*
nbdkit vddk libdir=/usr/lib/vmware-vix-disklib --dump-plugin   # should show VDDK version
```

A successful install shows a line similar to
`vddk_dll=/usr/lib/vmware-vix-disklib/lib64/libvixDiskLib.so.9.1.0.0` in the
`--dump-plugin` output.

{{< /step >}}

{{< step >}}

## Generate TLS certificates

Disk data flows over plain TCP between the consumer (Plakar Control Plane) and
`nbdkit`, so TLS is required (`--tls=require`). The recommended approach is to
run your own private CA and issue a single server certificate for the NBD
server.

Set these two variables first, you'll reuse them throughout this step:

```bash
user='ubuntu'   # use 'root' if the NBD server will be used for HotAdd
nbd_ip=''
org_name=''
```

Install `certtool` and create a dedicated group for TLS material access:

```bash
sudo apt install -y gnutls-bin
sudo groupadd --system nbdtls 2>/dev/null || true
```

Generate the CA and server certificate in a private scratch directory, so key
material is never briefly world-readable:

```bash
umask 077
tmpdir=$(mktemp -d)
cd "$tmpdir"

# CA - do this once; keep ca-key.pem in your secret provider, never on disk here longer than needed
certtool --generate-privkey > ca-key.pem
cat > ca.info < server-key.pem

# Server certificate, bound to the NBD server's IP address
cat > server.info <<EOF
organization = ${org_name}
cn = ${nbd_ip}
ip_address = ${nbd_ip}
tls_www_server
encryption_key
signing_key
expiration_days = 3650
EOF

certtool --generate-certificate \
  --load-ca-certificate ca-cert.pem \
  --load-ca-privkey ca-key.pem \
  --load-privkey server-key.pem \
  --template server.info \
  --outfile server-cert.pem
```

Install the certificates into `/etc/nbdkit/certs` with group-based access, and
add the executing user to the `nbdtls` group:

```bash
sudo install -d -o root -g nbdtls -m 0750 /etc/nbdkit /etc/nbdkit/certs
sudo install -o root -g nbdtls -m 0640 server-key.pem  /etc/nbdkit/certs/server-key.pem
sudo install -o root -g nbdtls -m 0644 server-cert.pem /etc/nbdkit/certs/server-cert.pem
sudo install -o root -g nbdtls -m 0644 ca-cert.pem     /etc/nbdkit/certs/ca-cert.pem

sudo usermod -aG nbdtls "$user"
```

Then clean up the scratch directory. `ca-key.pem` should go to your secret
provider. It does not belong on the NBD server itself:

```bash
# (upload ca-key.pem to your secret provider before this step)
cd /
shred -u "$tmpdir"/*.pem "$tmpdir"/*.info 2>/dev/null
rmdir "$tmpdir"
```

> [!NOTE]+
>
> If you are connected to the NBD server over SSH as the executing user (e.g.
> `ubuntu`), reconnect before running the sanity check below. Group membership
> changes require a fresh login to take effect.

Sanity check that the certificate's **Subject Alternative Name** matches the NBD
server's IP:

```bash
certtool --certificate-info --infile /etc/nbdkit/certs/server-cert.pem | grep -A2 "Subject Alternative Name"
# expect: IPAddress:
```

Keep a copy of `ca-cert.pem`. You'll need it later when configuring the VMware
Compute resource in Plakar Control Plane.

{{< /step >}}

{{< step >}}

## Set up SSH access for consumers

SSH is used for orchestration only. Disk bytes never travel over SSH, only over
the TLS-secured NBD connection set up in
[Generate TLS certificates](#generate-tls-certificates).

Generate a keypair. This can be done on any machine since only the private key
contents are needed later as the `nbd_ssh_private_key` value:

```bash
ssh-keygen -t ed25519 -N "" -f <key-name>
```

Keep the private key secure. You'll need it later when configuring the VMware
Compute resource in Plakar Control Plane.

On the NBD server, add the corresponding public key to the executing user's
authorized keys:

```bash
install -d -m 0700 ~/.ssh
echo "" >> ~/.ssh/authorized_keys
chmod 0600 ~/.ssh/authorized_keys
```

If the NBD server will be used for HotAdd, run these commands from a root shell
instead, so the key lands in `/root/.ssh/authorized_keys` (see
[HotAdd and root access](#hotadd-and-root-access)).

{{< /step >}}

{{< /steps >}}

## Next Steps

Your NBD server is now ready to be used by Plakar Control Plane.

Continue with the [VMware Compute](../../resources/compute/vmware/)
documentation to configure a VMware source or destination app and connect it to
this NBD server.

