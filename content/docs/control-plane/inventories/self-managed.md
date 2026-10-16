---
title: "Self-Managed Inventories"
date: "2026-05-06T00:00:00Z"
weight: 2
summary:
  "How to connect and manage a self-managed inventory in Plakar Control Plane."
aliases:
  - /control-plane-docs/infrastructure/inventories/self-managed/
  - /docs/control-plane/infrastructure/inventories/self-managed/
---

# Self-Managed Inventories

A self-managed inventory is a manually maintained inventory that acts as a
container for resources you define yourself. It is useful when your
infrastructure is not covered by a managed inventory, such as a local MinIO
instance, a self-hosted PostgreSQL database, or any other resource supported by
Plakar integrations.

## Creating a self-managed inventory

To create a self-managed inventory, you only need to provide a name. Once
created, you can start adding resources to it. The inventory name can be edited
later by clicking the settings icon in the top right of the inventory page,
which opens a settings popup.

![](../images/self-managed-inventory.png)

## Adding resources

Resources can be added individually or imported in bulk using a CSV file.

{{< tabs >}}

{{< tab label="Manually" >}}

When adding a resource manually, you need to provide:

- **Name** and **Resource URN**: Required. The name is a human-readable label to
  identify the resource in Plakar Control Plane. The URN is a unique and stable
  identifier for the resource, and cannot be changed later.
- **Class** and **Subclass**: Used to classify the resource, for example
  `Object Storage` as the class and `S3` as the subclass for an S3 bucket.
- **Tags**: tags used by [policies](../compliance/policies) and
  [configuration bundles](configuration-bundles#scope) to filter resources
- **Endpoint**: Required. The address used to reach the resource, such as a
  hostname or IP address. A resource can have several endpoints.
- **Exclude from backup coverage**: Omits the resource from protection status
  and coverage reporting.

![](../images/add-resource-to-self-managed-inventory.png)

{{< /tab >}}

{{< tab label="CSV import" >}}

To add multiple resources at once, you can import a CSV file. Each row should
represent one resource in the following format. If a resource has multiple
hostnames, they can be specified by separating them with commas.

```txt
Class;Name;URN;Hostname
```

![](../images/add-resources-to-self-managed-inventory-in-bulk.png)

> [!WARNING]+
>
> Importing a CSV file replaces all existing resources in the inventory. Make
> sure to include both existing and new resources in the file.

{{< /tab >}}

{{< /tabs >}}
