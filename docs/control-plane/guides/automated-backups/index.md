
# Automating Backups

Plakar Control Plane can back up the resources of a cloud account without any
backup being set up by hand. Once the pieces below are in place, a resource
created at the provider is discovered, gets a source app, and is scheduled for
backup by the policy that matches it, with no further action.

The chain relies on four pieces, each covered by its own documentation:

- A [managed inventory](../../inventories#managed-inventories) discovers the
  resources of the account.
- Tags set at the provider give each resource an
  [environment and data class](../../resources#environment-and-data-class-tags).
- A [configuration bundle](../../inventories/configuration-bundles) creates a
  source app for every matching resource.
- An [SLA policy](../../compliance/policies) schedules backups for the source
  apps whose environment and data class it targets.

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Provider["Cloud provider"]
    Resource["Resource<br/>plakar:env=production<br/>plakar:class=database"]
  end

  subgraph PCP["Plakar Control Plane"]
    Inventory["Managed inventory<br/>synced every 15 minutes"]
    Bundle["Configuration bundle<br/>auto-create connectors"]
    Source["Source app<br/>production · database"]
    Policy["SLA policy<br/>scope: production database"]
    Scheduler["Policy scheduler"]
  end

  Store["Store app<br/>same residency"]

  Resource -->|"discovered with its tags"| Inventory
  Inventory -->|"resource in scope"| Bundle
  Bundle -->|"creates"| Source
  Policy -->|"frequency & retention"| Scheduler
  Scheduler -->|"schedules backups of"| Source
  Source -->|"backed up to"| Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

{{< steps >}}

{{< step >}}

## Connect a managed inventory

Create a managed inventory for the cloud account, such as an
[AWS](../../inventories/managed/aws) or a
[Scaleway](../../inventories/managed/scaleway) inventory. The inventory
discovers the resources of the account and keeps them up to date.

Inventories are synchronized automatically in the background every 15 minutes. A
resource created at the provider appears in the inventory at the next
synchronization, and a resource deleted at the provider disappears from it.

> [!NOTE]
>
> The 15-minute interval is fixed for now. Support for a custom synchronization
> interval is planned for an upcoming release.

{{< /step >}}

{{< step >}}

## Classify resources at the provider

Policies select what to back up by environment and data class, so each resource
needs both. They are set as tags or labels on the resource at the cloud
provider, where the people who create the resources already manage them:

- **Environment**: `plakar:env=<value>`, for example `plakar:env=production`
- **Data Class**: `plakar:class=<value>`, for example `plakar:class=database`

The inventory reads these tags when it discovers the resource. See
[environment and data class tags](../../resources#environment-and-data-class-tags)
for every accepted form of the prefix.

Create the environments and data classes the tags use under **Organization ->
Classification**, so that policies can be scoped to them. See
[managing environments and data classes](../../compliance/policies#managing-environments--data-classes).

{{< /step >}}

{{< step >}}

## Create a store

Backups are written to a store. Create a [store app](../../apps/stores) from the
**Stores** tab of the inventory that holds the storage, such as an S3 bucket,
then initialize it.

A policy only schedules a backup when the source and the store share the same
[data residency](../../compliance/residency). Use a store with the same
residency as the resources it protects.

{{< /step >}}

{{< step >}}

## Create source apps automatically

A resource is only backed up once it has a source app, and creating one per
resource by hand does not scale. A configuration bundle with **Auto-create
connectors** enabled creates a source app for every resource in its scope, using
the configuration it holds.

Create a bundle on the inventory, with **Source** as its connector type, the
integration and protocol of the resources to protect, and a scope that selects
them, for example the `Object Storage` class. The bundle must supply every field
the integration requires, such as the credentials, otherwise no app is created.
See
[auto-creating apps](../../inventories/configuration-bundles#auto-creating-apps).

Each source app takes its **Environment** and **Data Class** from the tags of
its resource, which is what connects it to the policies of the next step.

{{< /step >}}

{{< step >}}

## Target the resources with an SLA policy

An SLA policy states how often backups are taken and how long they are kept, and
which store holds them. Create a policy with the frequency and retention the
resources need and the store created earlier, then scope it to an environment
and one or more data classes, for example `production` and `database`. A tag can
narrow the scope further.

The [policy scheduler](../../scheduling/policy-scheduler) then creates a backup
schedule for every source app that matches the scope and shares the residency of
the store. Policies can be layered, for example a general policy for every
production source and a stricter one for production databases.

{{< /step >}}

{{< /steps >}}

## What happens next

From then on, the chain runs on its own. When a resource tagged
`plakar:env=production` and `plakar:class=database` is created at the provider:

1. The next synchronization of the inventory discovers it, within 15 minutes.
2. The configuration bundle creates a source app for it, with `production` as
   its environment and `database` as its data class.
3. The policy that targets `production` and `database` picks up the source app
   and schedules its backups.

Backups that run can be followed in the
[job history](../../scheduling/job-history), and the protection status of each
resource shows whether it is covered.

A resource is left out of the chain when it is not in the scope of a bundle,
when the bundle lacks a required field, when it carries no environment and data
class matched by a policy, or when its residency differs from that of the
policy's store.

## Other ways to automate

This guide sets everything up from the web interface. Plakar Control Plane can
also be configured from code, for teams that already describe their
infrastructure that way and want it versioned and reviewed like the rest. Each
tool covers part of the configuration:

- The [Kubernetes Operator](../../infrastructure-as-code/kubernetes-operator)
  declares stores, sources, destinations, restores and schedules as Kubernetes
  custom resources.
- The [Ansible collection](../../infrastructure-as-code/ansible) drives Plakar
  Control Plane from playbooks, to declare apps and inventories or to run
  backups, restores and other operations.
- The [Terraform provider](../../infrastructure-as-code/terraform) declares
  stores, connectors, schedules, inventories and organizations.

