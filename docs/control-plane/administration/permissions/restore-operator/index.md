
# Restore Operator

The **Restore Operator** triggers restores within its perimeter, onto authorised
targets only.

> [!NOTE]
>
> This role is coming soon. It grants no access in any family today, so
> assigning it has no effect yet.

Running a restore is not yet distinct from running a backup, since both are the
same action on a schedule. Any permission set given to this role today would be
a [Backup Operator](../backup-operator) under a different name. When running a
restore becomes its own action, this is the role it attaches to.

It is one half of a separation of duties with the
[Restore Approver](../restore-approver), which approves a restore and chooses
its target. The two roles cannot be held at the same time.

## Organization

| Permission                      | Access    |
| ------------------------------- | --------- |
| Organization                    | No access |
| Members                         | No access |
| Audit log                       | No access |
| Data residency                  | No access |
| Restore points legal holds      | No access |
| Inventory resources legal holds | No access |

## Resources

| Permission            | Access    |
| --------------------- | --------- |
| Inventories           | No access |
| Apps                  | No access |
| Restore point data    | No access |
| Secret Providers      | No access |
| Integrations          | No access |
| Policies              | No access |
| Settings              | No access |
| Edges                 | No access |
| Configuration bundles | No access |
| Data classes          | No access |
| Environments          | No access |
| Schedules             | No access |

## Deployment

| Permission    | Access    |
| ------------- | --------- |
| Control plane | No access |
| License       | No access |

