---
title: "Service"
date: "2026-09-02T00:00:00Z"
weight: 14
summary: "An overview of service resources in Plakar Control Plane."
aliases:
  - /docs/control-plane/resources/services/
---

# Service

Service resources represent running services and appliances that own their data
and expose it through a network protocol. What gets backed up is the state the
service itself holds, such as the messages in a mailbox or the configuration and
database of a Plakar Control Plane appliance, rather than files or volumes
sitting on a storage system.

Unlike a [database](../database) or a [file storage](../file-storage) resource,
where the data model is the point, a service resource is defined by the service
being protected. This category covers the services that do not belong to one of
the more specific categories.

Plakar Control Plane supports the following service resources:

{{% children description="true" %}}
