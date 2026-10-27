
# Policy Admin

The **Policy Admin** defines the shared objects that backups are configured
against. Policies and their SLAs, configuration bundles, data classes, and
environments are held in full, and they are the only resources this role can
change.

The resources those definitions apply to are read-only. Inventories, apps,
restore point data, secret providers, integrations, and schedules can be
inspected, which is what makes it possible to see where a policy or a data class
takes effect, but the work itself cannot be run or altered. Settings and edges
are out of reach.

It holds no permission in the organization family and nothing in the deployment
family.

The [Operator](../operator) runs the backup chain and configures no settings.
The **Policy Admin** defines what the chain is configured against and runs no
backup.

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
| Inventories           | View      |
| Apps                  | View      |
| Restore point data    | View      |
| Secret Providers      | View      |
| Integrations          | View      |
| Policies              | Full      |
| Settings              | No access |
| Edges                 | No access |
| Configuration bundles | Full      |
| Data classes          | Full      |
| Environments          | Full      |
| Schedules             | View      |

## Deployment

| Permission    | Access    |
| ------------- | --------- |
| Control plane | No access |
| License       | No access |

