---
title: "Managing OpenStack Application Credentials"
date: "2026-11-25T00:00:00Z"
weight: 2
summary:
  "How to create an OpenStack application credential on OVHcloud Public Cloud
  for the OpenStack Compute and Block Storage apps."
---

# Managing OpenStack Application Credentials

OVHcloud Public Cloud runs on OpenStack. Plakar Control Plane backs up its
instances and volumes with the
[OpenStack Compute](../../../resources/compute/openstack) and
[OpenStack Block Storage](../../../resources/block-storage/openstack) apps.
These apps authenticate with an OpenStack application credential, not with your
OVHcloud account. An application credential belongs to a single project, and
carries only the roles of the user that created it.

This guide walks through creating a dedicated user for PCP, then an application
credential under that user.

{{< steps >}}

{{< step >}}

## Creating a Dedicated User

In the OVHcloud Control Panel, go to **Public Cloud > Settings > Users & Roles**
and create a user for PCP. Assign it the following roles, which cover
snapshotting instances, exporting volumes to images, and recreating instances
and volumes during a restore:

- `Compute Operator`
- `Image Operator`
- `Volume Operator`

These OVHcloud roles grant the user a set of OpenStack roles on the project.
OVHcloud also generates a username and password for the user. You use them in
the next step to sign in to Horizon.

![](../images/openstack-user.png)

{{< /step >}}

{{< step >}}

## Generating an Application Credential

OVHcloud manages application credentials in the OpenStack Horizon dashboard, not
in the OVHcloud Control Panel. Sign in to
[horizon.cloud.ovh.net](https://horizon.cloud.ovh.net) with the username and
password of the dedicated user. Go to **Identity > Application Credentials** and
create a credential with a name and an expiration date. By default, the
credential carries every OpenStack role the three OVHcloud roles granted.

![](../images/openstack-application-credential.png)

> [!WARNING]+
>
> Once the credential expires, Plakar Control Plane can no longer authenticate
> with OVHcloud, and backups and restores of your instances and volumes fail.
> Replace the credential in PCP before it expires.

Horizon then displays the **ID** and **Secret** of the credential. Enter them as
the **Openstack Application Credential Id** and **Openstack Application
Credential Secret** of the app, with `https://auth.cloud.ovh.net/v3` as its
**Openstack Auth Url**.

> [!WARNING]+
>
> Horizon shows the secret only once. If you close the dialog without copying
> it, you must generate a new application credential.

{{< /step >}}

{{< /steps >}}
