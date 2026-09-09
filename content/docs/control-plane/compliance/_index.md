---
title: "Compliance"
date: "2026-09-09T00:00:00Z"
weight: 6
summary:
  "Enforce backup requirements, data location, and retention obligations in
  Plakar Control Plane."
---

# Compliance

Compliance features let you state the obligations your backups are subject to
and have Plakar Control Plane enforce them, rather than relying on operators to
apply them consistently.

Three mechanisms cover different obligations:

- **SLA policies:** define how often sources must be backed up and how long
  their restore points are kept. Policies are scoped to environments and data
  classes, so every matching source is covered automatically.
- **Data residency:** constrains where backup data is allowed to live, so data
  stays within a given country.
- **Legal hold:** protects an individual restore point from deletion. Pruning
  skips a held restore point instead of deleting it, even once it falls outside
  the retention its policy defines.

Policies and residency describe requirements the system applies going forward. A
legal hold applies to restore points that already exist.

Compliance settings belong to a single organization. You work only with those of
the organization you signed in to, and what you can do with them is determined
by the [permissions](../administration/permissions) you hold there.

{{< children description="true" >}}
