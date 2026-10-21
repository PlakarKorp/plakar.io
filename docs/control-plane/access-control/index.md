

# Access Control

Access to Plakar Control Plane is organized around organizations. An
organization isolates its inventories, apps and operational data from the other
organizations of the deployment. Users are members of organizations, sign in
with an optional second factor, and act within each organization according to
the permissions their roles grant there.






## [Managing Organizations](https://www.plakar.io/docs/control-plane/access-control/organizations/index.md)



## [Organization Settings](https://www.plakar.io/docs/control-plane/access-control/organization-settings/index.md)



## [Managing Users](https://www.plakar.io/docs/control-plane/access-control/users/index.md)



## [Two-factor authentication](https://www.plakar.io/docs/control-plane/access-control/two-factor-authentication/index.md)



## [Permissions](https://www.plakar.io/docs/control-plane/access-control/permissions/index.md)

- [Superuser](https://www.plakar.io/docs/control-plane/access-control/permissions/superuser/index.md): Full access to every organization and to the instance itself.
- [Platform Admin](https://www.plakar.io/docs/control-plane/access-control/permissions/platform-admin/index.md): Maintains the instance itself, and administers no organization.
- [Owner](https://www.plakar.io/docs/control-plane/access-control/permissions/owner/index.md): Full control over one organization, and nothing on the deployment.
- [Administrator](https://www.plakar.io/docs/control-plane/access-control/permissions/administrator/index.md): Everything inside an organization, except the organization settings themselves.
- [Organization Admin](https://www.plakar.io/docs/control-plane/access-control/permissions/organization-admin/index.md): Administers one organization, and cannot see or act outside it.
- [Operator](https://www.plakar.io/docs/control-plane/access-control/permissions/operator/index.md): Runs and defines the backup chain, without administering the organization.
- [API Automation Account](https://www.plakar.io/docs/control-plane/access-control/permissions/api-automation/index.md): Non-human identity for CI/CD and orchestrators, which runs what is already defined.
- [Backup Operator](https://www.plakar.io/docs/control-plane/access-control/permissions/backup-operator/index.md): Runs and supervises backup jobs, and defines none of them.
- [Policy Admin](https://www.plakar.io/docs/control-plane/access-control/permissions/policy-admin/index.md): Owns the shared backup vocabulary, and runs no backup.
- [Compliance Officer](https://www.plakar.io/docs/control-plane/access-control/permissions/compliance-officer/index.md): Places and releases legal holds, and reads the state they apply to.
- [Residency Admin](https://www.plakar.io/docs/control-plane/access-control/permissions/residency-admin/index.md): Decides where the data of an organization is allowed to live.
- [Secrets Admin](https://www.plakar.io/docs/control-plane/access-control/permissions/secrets-admin/index.md): Owns the secret providers an organization&rsquo;s credentials come from.
- [Edge Admin](https://www.plakar.io/docs/control-plane/access-control/permissions/edge-admin/index.md): Manages the machines an organization runs its work on.
- [Auditor](https://www.plakar.io/docs/control-plane/access-control/permissions/auditor/index.md): Reads everything in an organization and changes nothing.
- [Monitoring / SIEM Collector](https://www.plakar.io/docs/control-plane/access-control/permissions/siem-collector/index.md): Non-human identity that reads metrics and exports logs.
- [Backup Auditor](https://www.plakar.io/docs/control-plane/access-control/permissions/backup-auditor/index.md): Reads how backups are configured and what has run, and nothing else.
- [Key Manager](https://www.plakar.io/docs/control-plane/access-control/permissions/key-manager/index.md): Manages the KMS or HSM integration behind secret providers. Coming soon.
- [Restore Approver](https://www.plakar.io/docs/control-plane/access-control/permissions/restore-approver/index.md): Approves critical restores and chooses the authorised target. Coming soon.
- [Restore Operator](https://www.plakar.io/docs/control-plane/access-control/permissions/restore-operator/index.md): Triggers restores onto authorised targets within its perimeter. Coming soon.
- [Backup Migration Admin](https://www.plakar.io/docs/control-plane/access-control/permissions/migration-admin/index.md): Exports and imports backup data during a migration. Coming soon.



