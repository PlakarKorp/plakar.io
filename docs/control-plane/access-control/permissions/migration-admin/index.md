
# Backup Migration Admin

The **Backup Migration Admin** covers reversibility. It exports backup data out
of one instance and imports it into another while a migration is under way, and
deletes nothing.

> [!NOTE]
>
> This role is coming soon. It grants no access in any family today, so
> assigning it has no effect yet.

Moving backup data between instances is not yet an action the permission model
expresses. The only exports it knows are the log and database exports of the
deployment itself, which belong to the [Platform Admin](../platform-admin). When
migration becomes its own action, this is the role it attaches to.

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

