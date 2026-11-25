---
title: "OVHcloud"
date: "2026-11-25T00:00:00Z"
weight: 40
summary:
  "Back up and restore OVHcloud Public Cloud instances and Block Storage volumes
  with the OpenStack integration."
---

# OVHcloud

OVHcloud Public Cloud runs on OpenStack. Plakar backs up its instances and Block
Storage volumes, and restores them to OVHcloud, with the
[OpenStack integration](../openstack). This page covers what is specific to
OVHcloud. See the OpenStack integration for how backups work, the restore
behaviour and every option.

The OpenStack integration supports two protocols:

| Protocol             | What it backs up                                            |
| -------------------- | ----------------------------------------------------------- |
| `openstack-instance` | An instance, its root disk and every volume attached to it. |
| `openstack-block`    | A single Block Storage volume.                              |

**Requirements**

- An OVHcloud Public Cloud project.
- An OpenStack application credential for the project, created as described in
  [Credentials](#credentials).

## Installation

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the OpenStack package:

```bash
$ plakar pkg add openstack
```

Verify installation:

```bash
$ plakar pkg show
```

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages).

## Credentials

Plakar authenticates with an OpenStack application credential, not with your
OVHcloud account. On OVHcloud, you create a Public Cloud user with the
`Compute Operator`, `Image Operator` and `Volume Operator` roles. These roles
grant the user the OpenStack roles that backups and restores need. You then
create an application credential for that user in Horizon. See
[Managing OpenStack Application Credentials](/docs/control-plane/guides/ovhcloud/openstack-application-credentials)
for the steps.

## OVHcloud values

Both protocols take the same options on OVHcloud as on any OpenStack cloud. Set
`openstack_auth_url` to `https://auth.cloud.ovh.net/v3`, and `openstack_region`
to the OVHcloud region the instance or volume lives in, such as `SBG5`. For a
destination, the region is the one to restore into, and can differ from the
region of the backup.

## 1. `openstack-instance` protocol

See the
[`openstack-instance` protocol](../openstack#1-openstack-instance-protocol) for
the backup and restore flows and every option.

### Example

Back up an instance:

```bash
$ plakar source add myinstance openstack-instance://<instance-id> \
  openstack_auth_url=https://auth.cloud.ovh.net/v3 \
  openstack_application_credential_id=<id> \
  openstack_application_credential_secret=<secret> \
  openstack_region=SBG5

$ plakar at /var/backups backup "@myinstance"
```

Restore a snapshot as a new instance:

```bash
$ plakar destination add myinstance-restore openstack-instance://spawn \
  openstack_auth_url=https://auth.cloud.ovh.net/v3 \
  openstack_application_credential_id=<id> \
  openstack_application_credential_secret=<secret> \
  openstack_region=SBG5

$ plakar at /var/backups restore -to "@myinstance-restore" <snapshot_id>
```

## 2. `openstack-block` protocol

See the [`openstack-block` protocol](../openstack#2-openstack-block-protocol)
for the backup and restore flows and every option.

### Example

Back up a volume:

```bash
$ plakar source add myvolume openstack-block://<volume-id> \
  openstack_auth_url=https://auth.cloud.ovh.net/v3 \
  openstack_application_credential_id=<id> \
  openstack_application_credential_secret=<secret> \
  openstack_region=SBG5

$ plakar at /var/backups backup "@myvolume"
```

Restore a snapshot as a new volume:

```bash
$ plakar destination add myvolume-restore openstack-block:// \
  openstack_auth_url=https://auth.cloud.ovh.net/v3 \
  openstack_application_credential_id=<id> \
  openstack_application_credential_secret=<secret> \
  openstack_region=SBG5

$ plakar at /var/backups restore -to "@myvolume-restore" <snapshot_id>
```

## See also

- [OpenStack integration](../openstack)
- [Managing OpenStack Application Credentials on OVHcloud](/docs/control-plane/guides/ovhcloud/openstack-application-credentials)
- [OVHcloud inventory in Plakar Control Plane](/docs/control-plane/inventories/managed/ovhcloud)
- [Managing packages](../../guides/managing-packages)
