

# Permissions

Permissions in Plakar Control Plane are scoped to an organization. A user who
belongs to several organizations holds a separate set of permissions in each
one, and nothing granted in one organization carries over to another. See
[Managing Users](../users) for how membership works.

A user who has just been added to an organization has no permissions at all.
They can sign in, but they cannot reach any resource or perform any operation
until permissions are granted to them.

## Permission families

Permissions are grouped into three families, based on what the access reaches.

### Organization

Applies across the whole organization rather than to any individual resource. It
covers the organization itself and the administrative records attached to it:

- Organization
- Members
- Audit log
- Data residency
- Restore points legal holds
- Inventory resources legal holds

### Resources

Applies to the resources that belong to the organization. Access is expressed
per resource class:

- Inventories
- Apps
- Restore point data
- Secret Providers
- Integrations
- Policies
- Settings
- Edges
- Configuration bundles
- Data classes
- Environments
- Schedules

### Deployment

Applies to the instance itself, which belongs to no organization. Access granted
here reaches every organization hosted on the instance, not only the one the
permission was granted in:

- Control plane
- License

## Access levels

Every resource in a family is held at one of five levels:

- **No access**, the permission cannot be reached at all.
- **View**, it can be read but not changed.
- **Run**, it can be read and the work it defines can be started, but it cannot
  be changed.
- **Configure**, it can be read and changed, but not deleted, and who else can
  reach it cannot be changed either.
- **Full**, everything above, including deleting and granting access to it.

## Roles

Access is granted by assigning a role. A role is a preset set of capabilities,
and the accesses it grants are always a combination of capabilities described in
the three families.

Roles are offered in two sets. **Standard** holds the four that cover most
cases: [Owner](owner), [Administrator](administrator),
[Operator](operator), and [Auditor](auditor). **Advanced** holds every other
role, each of which narrows access to one area of the system, such as policies,
secret providers, or edges, or is meant for a non-human identity. Switching to
the advanced set is what makes those available to grant.






## [Superuser](https://www.stg.plakar.io/docs/control-plane/access-control/permissions/superuser/index.md)



## [Platform Admin](https://www.stg.plakar.io/docs/control-plane/access-control/permissions/platform-admin/index.md)



## [Owner](https://www.stg.plakar.io/docs/control-plane/access-control/permissions/owner/index.md)



## [Administrator](https://www.stg.plakar.io/docs/control-plane/access-control/permissions/administrator/index.md)



## [Organization Admin](https://www.stg.plakar.io/docs/control-plane/access-control/permissions/organization-admin/index.md)



## [Operator](https://www.stg.plakar.io/docs/control-plane/access-control/permissions/operator/index.md)



## [API Automation Account](https://www.stg.plakar.io/docs/control-plane/access-control/permissions/api-automation/index.md)



## [Backup Operator](https://www.stg.plakar.io/docs/control-plane/access-control/permissions/backup-operator/index.md)



## [Policy Admin](https://www.stg.plakar.io/docs/control-plane/access-control/permissions/policy-admin/index.md)



## [Compliance Officer](https://www.stg.plakar.io/docs/control-plane/access-control/permissions/compliance-officer/index.md)



## [Residency Admin](https://www.stg.plakar.io/docs/control-plane/access-control/permissions/residency-admin/index.md)



## [Secrets Admin](https://www.stg.plakar.io/docs/control-plane/access-control/permissions/secrets-admin/index.md)



## [Edge Admin](https://www.stg.plakar.io/docs/control-plane/access-control/permissions/edge-admin/index.md)



## [Auditor](https://www.stg.plakar.io/docs/control-plane/access-control/permissions/auditor/index.md)



## [Monitoring / SIEM Collector](https://www.stg.plakar.io/docs/control-plane/access-control/permissions/siem-collector/index.md)



## [Backup Auditor](https://www.stg.plakar.io/docs/control-plane/access-control/permissions/backup-auditor/index.md)



## [Key Manager](https://www.stg.plakar.io/docs/control-plane/access-control/permissions/key-manager/index.md)



## [Restore Approver](https://www.stg.plakar.io/docs/control-plane/access-control/permissions/restore-approver/index.md)



## [Restore Operator](https://www.stg.plakar.io/docs/control-plane/access-control/permissions/restore-operator/index.md)



## [Backup Migration Admin](https://www.stg.plakar.io/docs/control-plane/access-control/permissions/migration-admin/index.md)




