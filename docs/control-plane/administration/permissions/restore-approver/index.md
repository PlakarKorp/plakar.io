
# Restore Approver

The **Restore Approver** approves critical restores and chooses the target a
restore is allowed to write to.

> [!NOTE]
>
> This role is coming soon. It grants no access in any family today, so
> assigning it has no effect yet.

Nothing currently records whether an action was approved, so there is no
permission this role could hold that would mean what its name says. It is named
ahead of the approval flow it belongs to.

It is deliberately not approximated with the permissions that exist today.
Administrative access to connectors and schedules would turn it into a stronger
[Restore Operator](../restore-operator), and the two exist as a separation of
duties: whoever triggers a restore is not the one who approves it. For that
reason the two roles cannot be held at the same time.

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

