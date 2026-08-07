---
title: "Infrastructure as Code"
date: "2026-07-15T00:00:00Z"
weight: 8
summary:
  "Ways to manage Plakar Control Plane declaratively, from code, instead of the
  web interface."
---

# Infrastructure as Code

Plakar Control Plane (PCP) can be configured either through the web interface or
declaratively using Infrastructure as Code (IaC) tools.

Instead of configuring resources manually, IaC lets you describe the desired
state in code, apply it, and keep your PCP configuration consistent and
repeatable. Resources such as sources, stores, destinations, and scheduled
backup, check, and sync tasks can all be managed this way.

The tools in this section connect to an existing Plakar Control Plane
deployment. They do not perform backups themselves or replace the PCP appliance,
which must already be installed and enrolled. If you haven't installed PCP yet,
see the [installation documentation](../intro/installation).

{{< children description="true" >}}
