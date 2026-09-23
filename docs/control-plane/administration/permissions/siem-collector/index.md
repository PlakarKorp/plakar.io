
# Monitoring / SIEM Collector

The **Monitoring collector** is granted to an
[application user](../../users#application-users) rather than to a member, for
systems that read the state of an organization and ship it elsewhere. Every
resource class and the audit log are held at view, so it collects metrics and
exports log records without changing anything.

The rest of the organization family is out of reach: the organization itself,
its members, data residency, and both legal holds. It holds nothing in the
deployment family.

The [Auditor](../auditor) reads the same resources along with the rest of the
organization family. This role stops at the audit log, which is what a collector
needs.

## Organization

| Permission                      | Access    |
| ------------------------------- | --------- |
| Organization                    | No access |
| Members                         | No access |
| Audit log                       | View      |
| Data residency                  | No access |
| Restore points legal holds      | No access |
| Inventory resources legal holds | No access |

## Resources

| Permission            | Access |
| --------------------- | ------ |
| Inventories           | View   |
| Apps                  | View   |
| Restore point data    | View   |
| Secret Providers      | View   |
| Integrations          | View   |
| Policies              | View   |
| Settings              | View   |
| Edges                 | View   |
| Configuration bundles | View   |
| Data classes          | View   |
| Environments          | View   |
| Schedules             | View   |

## Deployment

| Permission    | Access    |
| ------------- | --------- |
| Control plane | No access |
| License       | No access |

