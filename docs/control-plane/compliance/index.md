

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
- **Legal hold:** preserves restore points or resources that must not be deleted
  or used respectively. A held restore point is excluded from pruning even after
  it passes its policy retention period, while a held resource cannot be used by
  [tasks](../scheduling/tasks) that would otherwise access it.

Policies and residency describe requirements the system applies going forward. A
legal hold applies to restore points that already exist.

Compliance settings belong to a single organization. You work only with those of
the organization you signed in to, and what you can do with them is determined
by the [permissions](../administration/permissions) you hold there.






## [SLA Policies](https://www.plakar.io/docs/control-plane/compliance/policies/index.md)



## [Data Residency](https://www.plakar.io/docs/control-plane/compliance/residency/index.md)



## [Legal Hold](https://www.plakar.io/docs/control-plane/compliance/legal-hold/index.md)




