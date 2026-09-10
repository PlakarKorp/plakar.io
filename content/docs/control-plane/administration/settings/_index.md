---
title: "Managing Settings"
date: "2026-09-08T00:00:00Z"
weight: 6
summary: "Instance-wide and per-organization settings in Plakar Control Plane."
---

# Managing Settings

Settings in Plakar Control Plane are divided into two scopes.

- **Control Plane settings:** apply to the appliance itself and therefore to
  every organization it hosts. They cover the instance identity, license, and
  version, appliance networking, diagnostics, and early-access features.

- **Organization settings:** apply to a single organization. Each organization
  carries its own settings, and changing them affects only that organization and
  the resources that belong to it.

The distinction matters because most objects in Plakar Control Plane are owned
by an organization. See [Managing Organizations](../organizations) for more
information about how organizations isolate configuration and operational data.

{{< children description="true" >}}
