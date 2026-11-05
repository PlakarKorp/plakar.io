---
title: "Troubleshooting"
date: "2026-10-28T00:00:00Z"
weight: 2
summary:
  "Diagnose an appliance that does not start or cannot reach the services it
  depends on, with doktor and the outbound access it requires."
---

# Troubleshooting

The appliance downloads its components from plakar.io and from container
registries when it starts, so it needs outbound access to those hosts. Most
appliances that fail to start are on a network where a firewall or forward proxy
blocks one of them. The appliance includes a diagnostic tool, `doktor`, that
checks this access and reports what is blocked.

## Running doktor

`doktor` is a command on the appliance. Connect over SSH as the `plakar` user,
with the key supplied when the appliance was deployed, and run it:

```sh
ssh plakar@<appliance-ip-address>
doktor
```

The report checks the appliance clock, its network configuration, DNS, the proxy
and registry mirror settings, and whether every required host is reachable. It
ends with a summary that names each failing host and what to change. Proxy
credentials are redacted, so the report can be attached as is when
[contacting support](/contact).

The Google Cloud image does not accept SSH connections, so `doktor` is not
available there. See the
[Google Cloud limitations](../../intro/installation/google-cloud#limitations).

## Required outbound access

The appliance needs outbound HTTPS, on TCP port 443, to the following domains. A
proxy or firewall in front of it has to allow each of them:

| Domain                    | Purpose                                                         |
| ------------------------- | --------------------------------------------------------------- |
| `*.plakar.io`             | Runtime configuration, license validation and plugin downloads. |
| `*.docker.io`             | Docker Hub images.                                              |
| `*.docker.com`            | Image layers for Docker Hub.                                    |
| `*.ghcr.io`               | Component images.                                               |
| `*.githubusercontent.com` | Image layers for `ghcr.io`.                                     |

When a Harbor registry mirror is configured, as described in the proxy and
Harbor configuration section of each [installation](../../intro/installation)
guide, images are pulled from the mirror and the Docker and GitHub domains do
not need to be allowed.

The appliance also synchronizes its clock with `pool.ntp.org` over UDP port 123,
which does not go through a forward proxy. An appliance that cannot reach an NTP
server lets its clock drift, and once it is off by more than a few minutes,
HTTPS connections fail with certificate errors.

## Appliance without a data disk

The database, logs and all Control Plane state live on a second disk, which the
appliance formats on first boot, as described in [Appliance Sizing](../sizing).
An appliance created without it keeps that state in memory. Everything appears
to work until the appliance powers off, and then all of it is lost. When Plakar
Control Plane detects no data disk, it shows a warning in the web interface.

{{< figure src="../images/disk-missing.png" alt="" class="mx-auto max-w-120" >}}

To fix it, attach a blank disk of the size given in
[Appliance Sizing](../sizing) and reboot. The appliance detects, formats and
uses it automatically. Nothing from the previous boot can be recovered.
