---
title: "Compliance"
date: "2026-09-09T00:00:00Z"
weight: 10
summary:
  "Enforce backup requirements, data location, and retention obligations, and
  review activity in Plakar Control Plane."
---

# Compliance

Compliance features let you state the obligations your backups are subject to
and have Plakar Control Plane enforce them, rather than relying on operators to
apply them consistently.

Three mechanisms enforce different obligations:

- **SLA policies:** define how often sources must be backed up and how long
  their restore points are kept. Policies are scoped to environments and data
  classes, so every matching source is covered automatically.
- **Data residency:** constrains where backup data is allowed to live, so data
  stays within a given country.
- **Legal hold:** preserves restore points or resources that must not be deleted
  or used respectively. A held restore point is excluded from pruning even after
  it passes its policy retention period, while a held resource cannot be used by
  [tasks](../scheduling/tasks) that would otherwise access it.

Policies and residency describe requirements the system applies going forward. A
legal hold applies to restore points that already exist.

The **audit log** complements them by recording what was done. It keeps a
chronological record of the administrative and configuration changes made in an
organization, with who made each change and when, so that it can be reviewed
later.

Compliance settings and the audit log belong to a single organization. Only
those of the organization selected in the sidebar are shown, and what can be
done with them is determined by the [permissions](../access-control/permissions)
held there.

{{< children description="true" >}}
