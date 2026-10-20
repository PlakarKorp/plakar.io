---
title: "Resource Apps"
date: "2026-05-07T00:00:00Z"
weight: 5
summary: "How apps work in Plakar Control Plane and how to configure them."
aliases:
  - /control-plane-docs/connectors/
  - /docs/control-plane/connectors/
---

# Resource Apps

An app is what Plakar Control Plane uses to work with a resource of an
[inventory](../inventories). It holds the integration and the configuration,
such as credentials, needed to reach the resource, and its type defines what the
resource is used for:

- **Source**: the resource is backed up.
- **Store**: the resource holds a Kloset store that backups are written to.
- **Destination**: data is restored to the resource.

A backup reads from a source app and writes to a store app. A restore reads from
a store app and writes to a destination app.

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR
  Resource["Resource"] -->|"Source App"| PCP["Plakar Control Plane"]
  PCP -->|"Store App"| Store["Kloset Store"]
{{< /mermaid >}}
<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR
  Store["Kloset Store"] -->|"Store App"| PCP["Plakar Control Plane"]
  PCP -->|"Destination App"| Resource["Resource"]
{{< /mermaid >}}
<!-- prettier-ignore-end -->

A resource can have any number of apps, of any type. Each app has a name, which
tells apart the apps of the same type on one resource. Apps belong to the
organization of their inventory, and what can be done with them depends on the
[permissions](../access-control/permissions) held in that organization.

## Setting up an app

Source and destination apps are set up on a resource, from the **Apps** tab of
the resource in its inventory, with **Assign App**. Store apps are created from
the **Stores** tab of the inventory instead. See more on [store app](stores)
documentation.

An app uses an [integration](../integrations) to reach its resource. The class
and subclass of the resource narrow the installed integrations down to those
that support it. When only one matches, it is selected automatically. When
several match, one has to manually chosen from the list.

The same applies to the protocol of the integration. An integration with a
single protocol uses it without asking. An integration with several protocols,
such as `k8s+pvc` and `k8s+csi` for the Kubernetes integration, requires one to
be chosen.

The integration then defines the configuration fields of the app. They are
filled from three places, in order of precedence:

1. **Resource endpoints and attributes.** A managed inventory discovers the
   endpoints and attributes of the resource. Attributes fill the matching
   fields, which are then not shown, since the inventory already knows their
   value.
2. **Configuration bundles.** A
   [configuration bundle](../inventories/configuration-bundles) that matches the
   resource fills the fields it declares. These values can be overridden for the
   app.
3. **Values entered for the app.** The remaining fields are entered when the app
   is set up. The [resource pages](../resources) describe the fields of each
   integration.

When a bundle has **Auto-create connectors** enabled and, together with the
resource attributes, supplies every required field, its apps are created
automatically, without being set up by hand.

## Testing the connection

Each app has a **Dashboard** tab with a **Test Connection** action. It checks
that Plakar Control Plane can reach the resource with the configuration of the
app. A failing test points at the configuration or the credentials of the app.

## Tasks

Backups, restores and the other operations run as tasks that use apps. Tasks can
be created from the dashboard of an app or from [scheduling](../scheduling).

## Residency

Apps can only be used together when their resources have the same
[residency](../compliance/residency). A source can only be backed up to a store
with the same residency, a restore can only write to a destination with the
residency of its store, and a sync can only run between stores with the same
residency. The residency belongs to the resource, so an app takes on the
residency of its resource.

## Infrastructure as Code

Apps can also be managed declaratively with the
[Kubernetes operator](../infrastructure-as-code/kubernetes-operator), the
[Terraform provider](../infrastructure-as-code/terraform) and the
[Ansible collection](../infrastructure-as-code/ansible).

## App types

{{% children description="true" %}}
