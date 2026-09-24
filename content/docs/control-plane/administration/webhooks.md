---
title: "Webhook Setup"
date: "2026-08-05T00:00:00Z"
weight: 8
summary:
  "Configure webhooks to receive event notifications from Plakar Control Plane."
---

# Webhook Setup

A webhook delivers Plakar Control Plane events to an external HTTP endpoint.
Each event is sent as an HTTP request to a target URL, so an external system can
react to activity in the organization without polling Plakar Control Plane.
Webhooks are configured per organization, from the
[organization settings](../settings/organization#webhook).

{{< figure src="../images/webhook-settings.png" class="max-w-100 mx-auto" alt="Webhook configuration" >}}

## Delivery

The **Enabled** switch controls whether webhook requests are sent. While it is
off, Plakar Control Plane sends no webhook requests, regardless of the rest of
the configuration.

The **Target URL** is the endpoint that receives the requests. It must be
reachable from the Plakar Control Plane instance.

## Authentication

The authentication method determines how the receiving service verifies that a
request comes from Plakar Control Plane.

- **None**: Requests are sent without authentication.
- **Shared Key**: The secret is included in the `Authorization` header of every
  webhook request.
- **HMAC (SHA-256)**: The secret is used to sign the request body. The signature
  is included in the `X-Plakman-Signature` header using the format `sha256=...`,
  so the receiving service can verify the integrity and authenticity of the
  request.

## Event selection

Events are grouped into domains that follow the areas of Plakar Control Plane.
Only events of the selected types are delivered to the target URL.

Each domain exposes its own event types. Most domains have a **Request** and a
**Response** type. The **Alerts** domain has a single **Quota** type. For each
domain, either select specific event types or select **All** to receive every
event type in that domain.

The available domains are:

- **Access**: Groups, Invitations, Organizations, Permissions, Users.
- **Infrastructure**: Edges, Environments, Integrations, Inventories, Mounts,
  Network interfaces, Resources, Secret providers.
- **Backup operations**: Apps, Configuration bundles, Restore points, Runs,
  Schedules.
- **Governance**: Alerts, Data classes, Policies, Settings.
