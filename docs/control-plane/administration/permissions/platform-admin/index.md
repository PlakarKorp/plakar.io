
# Platform Admin

The **Platform Admin** holds the deployment family in full and nothing else.
That covers [Control Plane settings](../../settings/control-plane), including
the log and database exports, and the instance license.

It holds no permission in the organization family and no access to any resource
class, so it administers no organization and cannot read the data an
organization holds.

Because the instance belongs to no organization, deployment access reaches every
organization hosted on it. The role is granted within one organization, but what
it grants applies instance-wide. The [Superuser](../superuser) is the only other
role that reaches the deployment family.

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

| Permission    | Access |
| ------------- | ------ |
| Control plane | Full   |
| License       | Full   |

