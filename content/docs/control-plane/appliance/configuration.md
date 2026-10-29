---
title: "Appliance Configuration"
date: "2026-10-29T00:00:00Z"
weight: 2
summary:
  "The user data settings the appliance reads at boot: SSH access, proxy,
  registry mirrors, release server, NTP servers and network, and the platforms
  each one works on."
---

# Appliance Configuration

The appliance takes its boot-time settings from a cloud-init user data document.
It covers SSH access, the forward proxy, registry mirrors, the release server,
NTP servers and the network configuration. Every key is optional. An appliance
with direct internet access and a DHCP network needs none of them. On cloud
platforms, SSH keys can also come from the platform itself, as described in
[SSH access](#ssh-access).

The appliance reads the user data once, when it boots. A change to the user data
takes effect after the next reboot.

How the user data reaches the appliance depends on the platform, such as the
**User data** field of an EC2 instance or a cloud-init snippet on Proxmox. Each
[installation](../../intro/installation) guide describes how to deliver it on
that platform. This page describes what the document contains. Every key works
on every platform unless its section says otherwise.

On vSphere, the same settings can also be given as individual
`guestinfo.plakar.*` parameters instead of a document. See the
[vSphere installation](../../intro/installation/virtual-machines/vsphere#configuring-the-appliance)
guide.

## Document structure

Each top-level key of the document configures one setting. The document below
sets all of them, and each key is described in its own section.

```yaml
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
```

## SSH access

`ssh_authorized_keys` lists the public keys allowed to connect to the appliance
as the `plakar` user. SSH is only needed for diagnostics, such as running
[doktor](../troubleshooting#running-doktor). Plakar Control Plane itself is
managed through its web interface or with
[infrastructure as code](../../infrastructure-as-code).

The appliance also accepts the SSH keys a cloud platform attaches to the
instance when it is created, such as an EC2 key pair on AWS or the SSH keys of a
Scaleway project. On those platforms, either way of providing a key works.

SSH keys in the user data are supported on every platform except Google Cloud,
where the appliance does not accept SSH connections.

```yaml
ssh_authorized_keys:
  - ssh-ed25519 AAAA...
```

## Forward proxy

`proxy` sends the outbound traffic of the appliance through a forward HTTP
proxy. This covers the downloads of Plakar Control Plane components and
container images, and the connections made by the tasks the appliance runs, such
as backups.

```yaml
proxy:
  http: http://proxy.corp.example:3128
  https: http://proxy.corp.example:3128 # defaults to http when omitted
  no_proxy: .corp.example,10.0.0.0/8 # optional
```

If the proxy requires authentication, include the credentials in the URL, for
example `http://user:password@proxy.corp.example:3128`.

Loopback addresses and the private ranges `10.0.0.0/8`, `172.16.0.0/12` and
`192.168.0.0/16` always bypass the proxy. A range in `no_proxy` only matches
connections made to an IP address, though. A backup source reached by hostname
goes through the proxy even when its address is in a bypassed range. To keep
internal sources off the proxy, add their domain suffix to `no_proxy`, such as
`.corp.example`, or address them by IP.

The hosts the proxy has to allow are listed in
[required outbound access](../troubleshooting#required-outbound-access).

## Registry mirrors

`registry` redirects the container image pulls of the appliance, from Docker Hub
and `ghcr.io`, to a pull-through registry such as a
[Harbor](https://goharbor.io/) proxy cache. Each upstream registry maps to one
project on the mirror:

```yaml
registry:
  mirrors:
    docker.io: harbor.corp.example/dockerhub-proxy
    ghcr.io: harbor.corp.example/ghcr-proxy
  insecure: false # true skips TLS verification for the mirror hosts
```

Once a registry is mapped, every pull from it goes to the mirror, including for
components that were already installed. When a forward proxy is also configured,
the mirror hosts bypass it automatically.

The mirror has the following limitations:

- The mirror projects must allow anonymous pulls. Registry credentials are not
  supported.
- The mirror must present a publicly trusted certificate. Certificates from a
  private CA are not supported. `insecure: true` disables verification entirely.
- There is no fallback to the upstream registry. An image missing from the
  mirror fails the pull.

## Release server

`releases` points the appliance at an internal server that hosts the Plakar
Control Plane component definitions, instead of `plakar.io`. It can also pin the
version that a new appliance installs. Together with registry mirrors, it lets
the appliance
[run without internet access](../../intro/enrollment#air-gapped-instances).

```yaml
releases:
  url: https://dist.corp.example/plakar/enterprise
  version: v1.1.2 # optional
```

`version` only applies to the first installation. An appliance that is already
running keeps its version until it is [updated](../../operations/updating). How
to mirror the releases and serve them is described in
[hosting a aackage repository](../../guides/self-hosted-package-repository#releases-repository)
documentation.

## NTP servers

The appliance keeps its clock synchronized with `pool.ntp.org` by default. `ntp`
replaces it with your own servers:

```yaml
ntp:
  servers:
    - 10.20.0.1
    - ntp.corp.example
```

Each entry of `servers` is a hostname or an IP address, and an entry that is
neither is ignored. NTP uses UDP port 123 and does not go through the forward
proxy, so an appliance without internet access needs internal servers. Without
them its clock drifts, and HTTPS connections eventually fail with certificate
errors.

## Network

Every network interface uses DHCP by default. `network` configures static
addresses, routes and several interfaces, using a subset of the
[netplan](https://netplan.readthedocs.io/) format.

```yaml
network:
  ethernets:
    eth0:
      addresses: [10.0.1.5/24] # the CIDR suffix is required
      gateway4: 10.0.1.1
      nameservers:
        addresses: [10.0.1.53, 10.0.1.54]
    eth1:
      addresses: [10.20.0.5/24]
      routes: # reach sources behind a router on this segment
        - to: 10.50.0.0/16
          via: 10.20.0.1
    eth2:
      dhcp4: true
```

Each interface supports the following keys:

| Key                     | Description                                                        |
| ----------------------- | ------------------------------------------------------------------ |
| `addresses`             | The interface address, with its CIDR suffix. Only the first entry. |
| `gateway4`              | The default gateway.                                               |
| `routes`                | A list of `to` and `via` routes. `to: default` sets the gateway.   |
| `nameservers.addresses` | The DNS servers.                                                   |
| `dhcp4: true`           | Configures the interface with DHCP.                                |
| `match.macaddress`      | Selects the interface by MAC address instead of by name.           |

Other netplan settings, such as bonds, VLANs, bridges, IPv6 and MTU, are not
supported and are ignored.

Interfaces are named `eth0`, `eth1` and so on, in the order of the network
adapters of the virtual machine. Matching an interface by its MAC address keeps
the configuration attached to the right adapter even if the adapters are
reordered, which makes it the safer choice with several interfaces:

```yaml
network:
  ethernets:
    backup-a:
      match:
        macaddress: "00:50:56:aa:bb:cc"
      addresses: [10.20.0.5/24]
```

The network configuration follows a few rules:

- **One default gateway.** Set `gateway4`, or a default route, on one interface
  only, the management interface. When several interfaces set one, only the
  first is used.
- **One set of DNS servers.** Set `nameservers` on the interface that has the
  gateway. When several interfaces set them, only the first is used.
- **Interfaces without settings use DHCP.** An interface that is not listed, or
  whose settings are invalid, falls back to DHCP. An interface on a network
  without a DHCP server stays unconfigured.
- **The appliance waits for `eth0`.** When `eth0` uses DHCP, the appliance waits
  for its lease before it finishes booting. Leases on other interfaces never
  delay the boot.
- **Services listen on every interface.** The web interface and SSH are
  reachable on all configured interfaces. Restrict access to them with your
  network policy.
