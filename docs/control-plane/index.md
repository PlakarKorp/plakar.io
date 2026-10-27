

# Plakar Control Plane Documentation






## [Getting Started](https://www.stg.plakar.io/docs/control-plane/intro/index.md)

- [Overview](https://www.stg.plakar.io/docs/control-plane/intro/overview/index.md): An introduction to Plakar Control Plane, its core concepts, and how to get started.
- [Installation](https://www.stg.plakar.io/docs/control-plane/intro/installation/index.md): How to deploy Plakar Control Plane as a virtual appliance on your infrastructure.
- [Enrollment](https://www.stg.plakar.io/docs/control-plane/intro/enrollment/index.md): How to enroll your Plakar Control Plane instance on first setup.
- [Signing In to Control Plane](https://www.stg.plakar.io/docs/control-plane/intro/signing-in/index.md): Sign in to Plakar Control Plane and select the organization you want to work in.
- [Billing & Plans](https://www.stg.plakar.io/docs/control-plane/intro/billing/index.md): Plakar Control Plane plans and how to manage your license.


## [Integrations](https://www.stg.plakar.io/docs/control-plane/integrations/index.md)



## [Secret Providers](https://www.stg.plakar.io/docs/control-plane/secret-providers/index.md)

- [AWS Secrets Manager](https://www.stg.plakar.io/docs/control-plane/secret-providers/aws/index.md): How to configure and use AWS Secrets Manager as a secret provider in Plakar Control Plane.
- [HashiCorp Vault](https://www.stg.plakar.io/docs/control-plane/secret-providers/vault/index.md): How to configure and use HashiCorp Vault as a secret provider in Plakar Control Plane.
- [Scaleway Secret Manager](https://www.stg.plakar.io/docs/control-plane/secret-providers/scaleway/index.md): How to configure and use Scaleway Secret Manager as a secret provider in Plakar Control Plane.
- [GCP Secret Manager](https://www.stg.plakar.io/docs/control-plane/secret-providers/gcp/index.md): How to configure and use Google Cloud Secret Manager as a secret provider in Plakar Control Plane.
- [OVHcloud Secret Manager](https://www.stg.plakar.io/docs/control-plane/secret-providers/ovhcloud/index.md): How to configure and use OVHcloud Secret Manager as a secret provider in Plakar Control Plane.


## [Inventories](https://www.stg.plakar.io/docs/control-plane/inventories/index.md)

- [Managed Inventories](https://www.stg.plakar.io/docs/control-plane/inventories/managed/index.md): Managed inventories that discover resources from a cloud provider or platform.
- [Self-Managed Inventories](https://www.stg.plakar.io/docs/control-plane/inventories/self-managed/index.md): How to connect and manage a self-managed inventory in Plakar Control Plane.
- [Configuration Bundles](https://www.stg.plakar.io/docs/control-plane/inventories/configuration-bundles/index.md): How to use configuration bundles to share credentials and settings across resources.


## [Resource Apps](https://www.stg.plakar.io/docs/control-plane/apps/index.md)

- [Store App](https://www.stg.plakar.io/docs/control-plane/apps/stores/index.md): How store apps work in Plakar Control Plane.
- [Source App](https://www.stg.plakar.io/docs/control-plane/apps/sources/index.md): How source apps work in Plakar Control Plane.
- [Destination App](https://www.stg.plakar.io/docs/control-plane/apps/destinations/index.md): How destination apps work in Plakar Control Plane.


## [Resource Types](https://www.stg.plakar.io/docs/control-plane/resources/index.md)

- [Block Storage](https://www.stg.plakar.io/docs/control-plane/resources/block-storage/index.md): An overview of block storage resources in Plakar Control Plane.
- [Compute](https://www.stg.plakar.io/docs/control-plane/resources/compute/index.md): An overview of compute resources in Plakar Control Plane.
- [Database](https://www.stg.plakar.io/docs/control-plane/resources/database/index.md): An overview of database resources in Plakar Control Plane.
- [File Storage](https://www.stg.plakar.io/docs/control-plane/resources/file-storage/index.md): An overview of file storage resources in Plakar Control Plane.
- [Hypervisor](https://www.stg.plakar.io/docs/control-plane/resources/hypervisor/index.md): An overview of hypervisor resources in Plakar Control Plane.
- [Identity](https://www.stg.plakar.io/docs/control-plane/resources/identity/index.md): An overview of identity resources in Plakar Control Plane.
- [Object Storage](https://www.stg.plakar.io/docs/control-plane/resources/object-storage/index.md): An overview of object storage resources in Plakar Control Plane.
- [Security](https://www.stg.plakar.io/docs/control-plane/resources/security/index.md): An overview of security resources in Plakar Control Plane.
- [Service](https://www.stg.plakar.io/docs/control-plane/resources/service/index.md): An overview of service resources in Plakar Control Plane.


## [Plakar Edge](https://www.stg.plakar.io/docs/control-plane/edges/index.md)

- [How Edges Work](https://www.stg.plakar.io/docs/control-plane/edges/how-edges-work/index.md): How edges connect to Plakar Control Plane, receive tasks, and access secrets.
- [Edge Requirements](https://www.stg.plakar.io/docs/control-plane/edges/requirements/index.md): Network access and host tools an edge needs to run tasks for Plakar Control Plane.
- [Edge Enrollment](https://www.stg.plakar.io/docs/control-plane/edges/enrollment/index.md): Enable edge enrollment for an organization and share edges with child organizations.
- [Edges Installation](https://www.stg.plakar.io/docs/control-plane/edges/installation/index.md): Install an edge as a standalone binary or as a Kubernetes workload.
- [Running Tasks](https://www.stg.plakar.io/docs/control-plane/edges/running-tasks/index.md): Run tasks on edges and how Plakar Control Plane selects an edge.
- [Pre-job and Post-job Hooks](https://www.stg.plakar.io/docs/control-plane/edges/hooks/index.md): Run scripts on an edge immediately before and after a backup or restore.
- [Supervision and Metrics](https://www.stg.plakar.io/docs/control-plane/edges/monitoring/index.md): Health, readiness, and Prometheus metrics endpoints exposed by edges.


## [Scheduling](https://www.stg.plakar.io/docs/control-plane/scheduling/index.md)

- [Scheduled Tasks](https://www.stg.plakar.io/docs/control-plane/scheduling/tasks/index.md): The different types of tasks you can run in Plakar Control Plane.
- [One-off Tasks](https://www.stg.plakar.io/docs/control-plane/scheduling/one-off-tasks/index.md): How to run a task immediately as a one-off operation in Plakar Control Plane.
- [Manual Scheduler](https://www.stg.plakar.io/docs/control-plane/scheduling/manual-scheduler/index.md): How to attach schedules to tasks and monitor job history in Plakar Control Plane.
- [Policy Scheduler](https://www.stg.plakar.io/docs/control-plane/scheduling/policy-scheduler/index.md): How policies automatically schedule tasks in Plakar Control Plane.
- [User Schedulers](https://www.stg.plakar.io/docs/control-plane/scheduling/user-schedulers/index.md): How Application users get their own scheduler through the Plakar Control Plane API.
- [Job History](https://www.stg.plakar.io/docs/control-plane/scheduling/job-history/index.md): How to monitor job history and view job details in Plakar Control Plane.


## [Access Control](https://www.stg.plakar.io/docs/control-plane/access-control/index.md)

- [Managing Organizations](https://www.stg.plakar.io/docs/control-plane/access-control/organizations/index.md): Organize and isolate resources, configuration, and administration within Plakar Control Plane.
- [Organization Settings](https://www.stg.plakar.io/docs/control-plane/access-control/organization-settings/index.md): Configure a single organization in Plakar Control Plane.
- [Managing Users](https://www.stg.plakar.io/docs/control-plane/access-control/users/index.md): Manage users and application identities in Plakar Control Plane.
- [Two-factor authentication](https://www.stg.plakar.io/docs/control-plane/access-control/two-factor-authentication/index.md): Secure your Plakar Control Plane account with two-factor authentication.
- [Permissions](https://www.stg.plakar.io/docs/control-plane/access-control/permissions/index.md): How access is granted in Plakar Control Plane, and what each role can reach.


## [Compliance](https://www.stg.plakar.io/docs/control-plane/compliance/index.md)

- [SLA Policies](https://www.stg.plakar.io/docs/control-plane/compliance/policies/index.md): How to create and manage SLA policies in Plakar Control Plane.
- [Data Residency](https://www.stg.plakar.io/docs/control-plane/compliance/residency/index.md): Constrain where backup data is allowed to live in Plakar Control Plane.
- [Legal Hold](https://www.stg.plakar.io/docs/control-plane/compliance/legal-hold/index.md): Protect a restore point from deletion, or a resource from being used, while a hold is in place.
- [Audit Log](https://www.stg.plakar.io/docs/control-plane/compliance/audit-log/index.md): The record of administrative and configuration activity in an organization.


## [Operations](https://www.stg.plakar.io/docs/control-plane/operations/index.md)

- [Control Plane Settings](https://www.stg.plakar.io/docs/control-plane/operations/control-plane-settings/index.md): Configure the Plakar Control Plane instance itself, from version and networking to diagnostics.
- [Email & SMTP Setup](https://www.stg.plakar.io/docs/control-plane/operations/email-and-smtp/index.md): Configure SMTP for email notifications.
- [Webhook Setup](https://www.stg.plakar.io/docs/control-plane/operations/webhooks/index.md): Configure webhooks to receive event notifications from Plakar Control Plane.
- [Updating Control Plane](https://www.stg.plakar.io/docs/control-plane/operations/updating/index.md): How to update Plakar Control Plane and its underlying deployment infrastructure.
- [Backup and Restore](https://www.stg.plakar.io/docs/control-plane/operations/backup-and-restore/index.md): How to back up and restore the Plakar Control Plane configuration and data.


## [Infrastructure as Code](https://www.stg.plakar.io/docs/control-plane/infrastructure-as-code/index.md)

- [Kubernetes Operator](https://www.stg.plakar.io/docs/control-plane/infrastructure-as-code/kubernetes-operator/index.md): Manage Plakar Control Plane declaratively from Kubernetes using the plakar-operator.
- [Terraform Provider](https://www.stg.plakar.io/docs/control-plane/infrastructure-as-code/terraform/index.md): Manage Plakar Control Plane declaratively with the plakarkorp/plakar Terraform provider.
- [Ansible Collection](https://www.stg.plakar.io/docs/control-plane/infrastructure-as-code/ansible/index.md): Drive Plakar Control Plane from playbooks with the plakarkorp.plakar Ansible collection.


## [General Guides](https://www.stg.plakar.io/docs/control-plane/guides/index.md)

- [Automating Backups](https://www.stg.plakar.io/docs/control-plane/guides/automated-backups/index.md): Back up the resources of a cloud account automatically, from discovery to scheduled backups, with an inventory, configuration bundles and SLA policies.
- [Managing passphrases](https://www.stg.plakar.io/docs/control-plane/guides/managing-passphrases/index.md): How store passphrases work in Plakar Control Plane and how to change the passphrase used by a store.
- [Scaleway](https://www.stg.plakar.io/docs/control-plane/guides/scaleway/index.md): Guides and tutorials for configuring Scaleway services with Plakar.
- [AWS](https://www.stg.plakar.io/docs/control-plane/guides/aws/index.md): Guides and tutorials for configuring AWS services with Plakar.
- [Google Cloud](https://www.stg.plakar.io/docs/control-plane/guides/google-cloud/index.md): Guides and tutorials for configuring Google Cloud services with Plakar.
- [OVHcloud](https://www.stg.plakar.io/docs/control-plane/guides/ovhcloud/index.md): Guides and tutorials for configuring OVHcloud services with Plakar.
- [OpenStack](https://www.stg.plakar.io/docs/control-plane/guides/openstack/index.md): Guides and tutorials for configuring OpenStack services with Plakar.
- [Windows](https://www.stg.plakar.io/docs/control-plane/guides/windows/index.md): Guides and tutorials for configuring Windows hosts for use with Plakar.
- [Kubernetes](https://www.stg.plakar.io/docs/control-plane/guides/kubernetes/index.md): Guides and tutorials for using Plakar with Kubernetes.
- [MTU and Jumbo Frames](https://www.stg.plakar.io/docs/control-plane/guides/mtu-and-jumbo-frames/index.md): Background on Ethernet MTU, jumbo frames, and TCP MSS, and why they matter for control plane deployments.
- [Hosting a Package Repository](https://www.stg.plakar.io/docs/control-plane/guides/self-hosted-package-repository/index.md): Set up self-hosted repositories so Plakar Control Plane can fetch integrations and appliance components without reaching plakar.io.


## [References](https://www.stg.plakar.io/docs/control-plane/references/index.md)

- [Kubernetes Operator](https://www.stg.plakar.io/docs/control-plane/references/kubernetes-operator/index.md): Field-by-field reference for every custom resource defined by plakar-operator.
- [Terraform Provider](https://www.stg.plakar.io/docs/control-plane/references/terraform-provider/index.md): Argument-by-argument reference for every resource and data source in the plakar Terraform provider.
- [Ansible Collection](https://www.stg.plakar.io/docs/control-plane/references/ansible-collection/index.md): Option-by-option reference for every module in the plakarkorp.plakar Ansible collection.



