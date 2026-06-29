---
title: "Inventories"
date: "2026-05-03T00:00:00Z"
weight: 2
summary:
  "Understand how inventories work in Plakar Control Plane and how to use them."
aliases:
  - /control-plane-docs/infrastructure/inventories/
---

# Inventories

An inventory connects Plakar Control Plane to a provider and exposes a list of
resources available for management. Resources are the individual entities you
can back up, use as storage, or restore to, for example, EC2 instances, S3
buckets, and their equivalents across other supported cloud providers.

Once an inventory is connected, you can attach apps to each resource. Plakar
Control Plane supports three app types:

- **Source** - the resource being backed up
- **Store** - where backups are stored
- **Destination** - where data is restored to

## Managed inventories

Managed inventories connect to a provider using credentials. Plakar Control
Plane then automatically discovers and classifies resources in your account.

For example, in an AWS inventory:

- EC2 instances are classified as compute resources
- S3 buckets are classified as storage resources

Managed inventories are supported for:

- AWS
- OVHcloud
- Scaleway
- Google Cloud
- VMware

## Self-managed inventories

Self-managed inventories allow you to add resources manually, either
individually or in bulk. This approach is useful when:

- The infrastructure is not supported by managed inventories (e.g., a local
  MinIO instance)
- You require full control over how resources are defined and managed

## Provider-specific instructions

{{< children description="true" >}}
