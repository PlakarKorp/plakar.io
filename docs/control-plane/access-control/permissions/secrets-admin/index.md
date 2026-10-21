
# Secrets Admin

The **Secrets Admin** owns the secret providers an organization's credentials
come from. The **Secret Providers** resource class is held in full, so providers
can be defined, configured, and removed, and it is the only resource this role
can change.

Integrations can be inspected but not changed. Every other resource class is out
of reach, so this role runs no backup and no restore. It holds no permission in
the organization family and nothing in the deployment family.

The [Operator](../operator) also holds secret providers in full, as one part of
the chain it runs. The **Secrets Admin** holds them on their own.

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
| Secret Providers      | Full      |
| Integrations          | View      |
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

