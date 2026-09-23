
# Compliance / Legal Hold Officer

The **Compliance Officer** places and releases
[legal holds](../../../compliance/legal-hold). Both hold permissions are held in
full, on restore points and on inventory resources, and they are the only things
this role can change. A held restore point is excluded from pruning, which is
how this role sets a retention floor that an
[SLA policy](../../../compliance/policies) cannot take away.

The rest of its access is read-only and deliberately wide. The audit log, data
residency, inventories, apps, restore point data, policies, settings, and
schedules can all be inspected, which is what reporting on the compliance state
of an organization requires. Secret providers, integrations, edges,
configuration bundles, data classes, and environments are out of reach, as are
the organization itself and its members.

## Organization

| Permission                      | Access    |
| ------------------------------- | --------- |
| Organization                    | No access |
| Members                         | No access |
| Audit log                       | View      |
| Data residency                  | View      |
| Restore points legal holds      | Full      |
| Inventory resources legal holds | Full      |

## Resources

| Permission            | Access    |
| --------------------- | --------- |
| Inventories           | View      |
| Apps                  | View      |
| Restore point data    | View      |
| Secret Providers      | No access |
| Integrations          | No access |
| Policies              | View      |
| Settings              | View      |
| Edges                 | No access |
| Configuration bundles | No access |
| Data classes          | No access |
| Environments          | No access |
| Schedules             | View      |

## Deployment

| Permission    | Access    |
| ------------- | --------- |
| Control plane | No access |
| License       | No access |

