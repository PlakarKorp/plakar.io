---
title: "Configuration Bundles"
date: "2026-06-29T00:00:00Z"
weight: 6
summary:
  "How to use configuration bundles to share credentials and settings across
  resources in an inventory."
---

# Configuration Bundles

> [!NOTE]
>
> This documentation is currently being worked on. If you need assistance in the
> meantime, you can reach out in the Plakar Discord community.
>
> [Join the Discord server](https://discord.gg/uuegtnF2Q5)

<!--Configuration bundles let you define shared credentials and settings at the
inventory level and apply them automatically to matching resources. Instead of
configuring the same credentials on each resource individually, you define them
once in a bundle and Plakar Control Plane distributes them across your
inventory.

## Why configuration bundles

When an inventory discovers resources, each resource typically requires the same
credentials or settings before it can be used in a backup workflow. For example,
if an AWS inventory discovers 20 S3 buckets that all use the same IAM access key
and secret key, you would otherwise need to enter those credentials manually on
every bucket.

Configuration bundles solve this by letting you define those credentials once.
Control Plane applies the bundle to all matching resources in that inventory
automatically.

## Creating a configuration bundle

Configuration bundles are scoped to a specific inventory. To add one, open an
inventory and go to the **Configuration Bundles** tab, then click
**Add bundle**.

Each bundle requires a **name** to identify it and one or more **fields**,
which are key-value pairs containing the credentials or settings to apply. Field
values can be entered directly or sourced from a
[secret provider](../../secret-providers) if you prefer not to store credentials
as plain text.

### Filtering resources

By default, a bundle applies to all resources in the inventory. You can narrow
the scope using optional filters:

- **Environment** - restricts the bundle to resources in a specific environment
- **Resource classes** - restricts the bundle to resources of specific classes,
  such as Object Storage or Compute. Multiple classes can be selected.
- **Resource subclasses** - further narrows by subclass within the selected
  classes, for example S3 within Object Storage. Multiple subclasses can be
  selected.
- **Tags** - restricts the bundle to resources that have specific tags set on
  them in the cloud provider. Plakar Control Plane discovers resource tags
  automatically from supported providers.

Filters are cumulative: only resources matching all specified conditions receive
the bundle.

## Example

An AWS inventory has discovered 20 S3 buckets. All of them use the same IAM
access key and secret key. To avoid configuring credentials on each bucket
individually:

1. Open the AWS inventory and go to **Configuration Bundles**
2. Click **Add bundle** and give it a name
3. Set the resource class filter to `Object Storage` and the subclass filter
   to `S3`
4. Add two fields: `Access Key` with the key value, and `Secret Key` with the
   secret value
5. Save the bundle

Control Plane applies these credentials to all S3 buckets discovered in that
inventory. If only a subset of buckets should receive the bundle, use the
environment, subclass, or tag filters to narrow the scope.-->
