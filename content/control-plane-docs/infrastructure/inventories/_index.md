---
title: "Inventories"
date: "2026-05-03T00:00:00Z"
weight: 2
summary: "How inventories work in Plakar Control Plane and how to use them."
---

# Inventories

An inventory connects Plakar Control Plane to a provider and exposes a list of resources available to manage. Resources are the individual things you can back up, use as a store or restore to for example EC2 instances, S3 buckets, and their equivalents across other supported cloud providers.

Once an inventory is connected, you can attach connectors to each resource. Plakar Control Plane has three connector types:
* **Source** - the resource being backed up
* **Store** - where backups are kept
* **Destination** - where data gets restored to

## Managed inventories

Managed inventories are connected to a provider using credentials. Plakar Control Plane reads the resources from your account and classifies them automatically. For example, an AWS inventory will list EC2 instances as compute resources and S3 buckets as storage resources.

Managed inventories support AWS, OVHcloud, Scaleway, and Google Cloud. When new resources are added to your provider, use the sync button in the UI to pull the latest list of resources into Plakar Control Plane.

## Self-managed inventories

Self-managed inventories lets you add resources manually, one by one or in bulk. This is useful for infrastructure that does not have a managed inventory, such as a local MinIO instance or any other resource that Plakar supports through its integrations. It's also useful when you need full control over your resources.

## Provider-specific instructions

* [AWS](./aws)
* [OVHcloud](#)
* [Scaleway](#)
* [Google Cloud](#)
* [Self-managed](#)
