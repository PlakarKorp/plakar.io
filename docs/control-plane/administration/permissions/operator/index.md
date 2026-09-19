
# Operator

The **Operator** runs the backup chain and defines what that work needs, without
administering the organization or the people in it.

It holds full access to apps, inventories, and secret providers, which is the
chain a backup actually runs through. The remaining resource classes are held at
the configure level, so it can define and run the work but cannot delete those
resources or decide who else reaches them. The exception is
[organization settings](../../settings/organization), which the **Operator** can
view but not change.

In the organization family, the **Operator** has no access to the organization,
its members, or the audit log. It can configure data residency and both kinds of
legal hold, because those bear on where backed up data may live and how long it
must be kept. Like the roles above it, it holds nothing in the deployment
family.

## Organization

| Permission                      | Access    |
| ------------------------------- | --------- |
| Organization                    | No access |
| Members                         | No access |
| Audit log                       | No access |
| Data residency                  | Configure |
| Restore points legal holds      | Configure |
| Inventory resources legal holds | Configure |

## Resources

| Permission            | Access    |
| --------------------- | --------- |
| Inventories           | Full      |
| Apps                  | Full      |
| Restore point data    | Configure |
| Secret Providers      | Full      |
| Integrations          | Configure |
| Policies              | Configure |
| Settings              | View      |
| Edges                 | Configure |
| Configuration bundles | Configure |
| Data classes          | Configure |
| Environments          | Configure |
| Schedules             | Configure |

## Deployment

| Permission    | Access    |
| ------------- | --------- |
| Control plane | No access |
| License       | No access |

