
# Administrator

The **Administrator** covers everything inside the organization except the
organization itself. It holds full access to every resource class, and to the
rest of the organization: members, audit logs, data residency, and both the
resource and inventory legal hold.

The **Organization** permission is the one exception, and an **Administrator**
has no access to it. This means the
[organization settings](../../settings/organization) are out of reach entirely,
neither visible nor editable. An **Administrator** administers what the
organization contains and the members using it, but not the organization itself.
Like the [Owner](../owner), it holds nothing in the deployment family.

## Organization

| Permission                      | Access    |
| ------------------------------- | --------- |
| Organization                    | No access |
| Members                         | Full      |
| Audit log                       | Full      |
| Data residency                  | Full      |
| Restore points legal holds      | Full      |
| Inventory resources legal holds | Full      |

## Resources

| Permission            | Access |
| --------------------- | ------ |
| Inventories           | Full   |
| Apps                  | Full   |
| Restore point data    | Full   |
| Secret Providers      | Full   |
| Integrations          | Full   |
| Policies              | Full   |
| Settings              | Full   |
| Edges                 | Full   |
| Configuration bundles | Full   |
| Data classes          | Full   |
| Environments          | Full   |
| Schedules             | Full   |

## Deployment

| Permission    | Access    |
| ------------- | --------- |
| Control plane | No access |
| License       | No access |

