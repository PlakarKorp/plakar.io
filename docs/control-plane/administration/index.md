

# Administration

Administration covers managing settings, updating Plakar Control Plane, backing
up and restoring the appliance, and viewing system logs.






## [Signing In to Control Plane](https://www.stg.plakar.io/docs/control-plane/administration/signing-in/index.md)



## [Managing Organizations](https://www.stg.plakar.io/docs/control-plane/administration/organizations/index.md)



## [Managing Users](https://www.stg.plakar.io/docs/control-plane/administration/users/index.md)



## [Permissions](https://www.stg.plakar.io/docs/control-plane/administration/permissions/index.md)

- [Superuser](https://www.stg.plakar.io/docs/control-plane/administration/permissions/superuser/index.md): Full access to every organization and to the instance itself.
- [Platform Admin](https://www.stg.plakar.io/docs/control-plane/administration/permissions/platform-admin/index.md): Maintains the instance itself, and administers no organization.
- [Owner](https://www.stg.plakar.io/docs/control-plane/administration/permissions/owner/index.md): Full control over one organization, and nothing on the deployment.
- [Administrator](https://www.stg.plakar.io/docs/control-plane/administration/permissions/administrator/index.md): Everything inside an organization, except the organization settings themselves.
- [Organization Admin](https://www.stg.plakar.io/docs/control-plane/administration/permissions/organization-admin/index.md): Administers one organization, and cannot see or act outside it.
- [Operator](https://www.stg.plakar.io/docs/control-plane/administration/permissions/operator/index.md): Runs and defines the backup chain, without administering the organization.
- [API Automation Account](https://www.stg.plakar.io/docs/control-plane/administration/permissions/api-automation/index.md): Non-human identity for CI/CD and orchestrators, which runs what is already defined.
- [Backup Operator](https://www.stg.plakar.io/docs/control-plane/administration/permissions/backup-operator/index.md): Runs and supervises backup jobs, and defines none of them.
- [Policy Admin](https://www.stg.plakar.io/docs/control-plane/administration/permissions/policy-admin/index.md): Owns the shared backup vocabulary, and runs no backup.
- [Compliance Officer](https://www.stg.plakar.io/docs/control-plane/administration/permissions/compliance-officer/index.md): Places and releases legal holds, and reads the state they apply to.
- [Residency Admin](https://www.stg.plakar.io/docs/control-plane/administration/permissions/residency-admin/index.md): Decides where the data of an organization is allowed to live.
- [Secrets Admin](https://www.stg.plakar.io/docs/control-plane/administration/permissions/secrets-admin/index.md): Owns the secret providers an organization&rsquo;s credentials come from.
- [Edge Admin](https://www.stg.plakar.io/docs/control-plane/administration/permissions/edge-admin/index.md): Manages the machines an organization runs its work on.
- [Auditor](https://www.stg.plakar.io/docs/control-plane/administration/permissions/auditor/index.md): Reads everything in an organization and changes nothing.
- [Monitoring / SIEM Collector](https://www.stg.plakar.io/docs/control-plane/administration/permissions/siem-collector/index.md): Non-human identity that reads metrics and exports logs.
- [Backup Auditor](https://www.stg.plakar.io/docs/control-plane/administration/permissions/backup-auditor/index.md): Reads how backups are configured and what has run, and nothing else.
- [Key Manager](https://www.stg.plakar.io/docs/control-plane/administration/permissions/key-manager/index.md): Manages the KMS or HSM integration behind secret providers. Coming soon.
- [Restore Approver](https://www.stg.plakar.io/docs/control-plane/administration/permissions/restore-approver/index.md): Approves critical restores and chooses the authorised target. Coming soon.
- [Restore Operator](https://www.stg.plakar.io/docs/control-plane/administration/permissions/restore-operator/index.md): Triggers restores onto authorised targets within its perimeter. Coming soon.
- [Backup Migration Admin](https://www.stg.plakar.io/docs/control-plane/administration/permissions/migration-admin/index.md): Exports and imports backup data during a migration. Coming soon.


## [Two-factor authentication](https://www.stg.plakar.io/docs/control-plane/administration/two-factor-authentication/index.md)



## [Managing Settings](https://www.stg.plakar.io/docs/control-plane/administration/settings/index.md)

- [Control Plane Settings](https://www.stg.plakar.io/docs/control-plane/administration/settings/control-plane/index.md): Configure the Plakar Control Plane instance itself, from version and networking to diagnostics.
- [Organization Settings](https://www.stg.plakar.io/docs/control-plane/administration/settings/organization/index.md): Configure a single organization in Plakar Control Plane.


## [Email & SMTP Setup](https://www.stg.plakar.io/docs/control-plane/administration/email-and-smtp/index.md)



## [Webhook Setup](https://www.stg.plakar.io/docs/control-plane/administration/webhooks/index.md)



## [Configuration Bundles](https://www.stg.plakar.io/docs/control-plane/administration/configuration-bundles/index.md)



## [Updating Control Plane](https://www.stg.plakar.io/docs/control-plane/administration/updating-control-plane/index.md)

- [Updating AWS AMI](https://www.stg.plakar.io/docs/control-plane/administration/updating-control-plane/aws/index.md): How to update Plakar Control Plane AMI on AWS.
- [Updating Scaleway QCOW2](https://www.stg.plakar.io/docs/control-plane/administration/updating-control-plane/scaleway/index.md): How to update the Plakar Control Plane Scaleway installation image.
- [Updating vSphere](https://www.stg.plakar.io/docs/control-plane/administration/updating-control-plane/vsphere/index.md): How to update the Plakar Control Plane vSphere installation
- [Updating Proxmox ISO](https://www.stg.plakar.io/docs/control-plane/administration/updating-control-plane/proxmox/index.md): How to update the Plakar Control Plane Proxmox installation image.


## [Backup and Restore](https://www.stg.plakar.io/docs/control-plane/administration/backup-and-restore/index.md)

- [Backing Up Plakar Control Plane](https://www.stg.plakar.io/docs/control-plane/administration/backup-and-restore/backup/index.md): Step-by-step guide to back up Plakar Control Plane configuration and data using the UI.
- [Restoring Plakar Control Plane](https://www.stg.plakar.io/docs/control-plane/administration/backup-and-restore/restore/index.md): How to restore Plakar Control Plane from a backup snapshot to a new appliance.



