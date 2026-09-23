
# Organization Admin

The **Organization Admin** administers the organization itself. It holds the
**Organization** permission and the **Settings** resource class in full, which
covers the [organization settings](../../settings/organization).

Its other organization permissions are narrower. Members are held at configure,
so they can be read and changed but not removed, and the access others hold over
them cannot be changed. The audit log is read-only. Data residency and both
legal holds are out of reach.

Every resource class other than settings is out of reach, so the organization's
data and the operations that run against it are not visible to this role. It
holds nothing in the deployment family.

The [Administrator](../administrator) is its counterpart: it administers
everything the organization contains, but not the organization itself.

## Organization

| Permission                      | Access    |
| ------------------------------- | --------- |
| Organization                    | Full      |
| Members                         | Configure |
| Audit log                       | View      |
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
| Settings              | Full      |
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

