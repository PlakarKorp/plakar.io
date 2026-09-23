
# API Automation Service Account

The **API Automation service account** is granted to an
[application user](../../users#application-users) rather than to a member, so it
is the role to use for CI/CD pipelines, orchestrators, and anything else that
authenticates to the API instead of signing in. Every resource class is held at
run, which lets it start work an organization has already defined and change
none of it.

Grant one account per integration. Actions are attributed to the identity that
performed them, so a separate account for each system keeps the audit log
specific about which one acted.

It holds no permission in the organization family and nothing in the deployment
family.

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

| Permission            | Access |
| --------------------- | ------ |
| Inventories           | Run    |
| Apps                  | Run    |
| Restore point data    | Run    |
| Secret Providers      | Run    |
| Integrations          | Run    |
| Policies              | Run    |
| Settings              | Run    |
| Edges                 | Run    |
| Configuration bundles | Run    |
| Data classes          | Run    |
| Environments          | Run    |
| Schedules             | Run    |

## Deployment

| Permission    | Access    |
| ------------- | --------- |
| Control plane | No access |
| License       | No access |

