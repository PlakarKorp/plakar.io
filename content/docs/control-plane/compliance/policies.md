---
title: "SLA Policies"
date: "2026-05-13T00:00:00Z"
weight: 1
summary: "How to create and manage SLA policies in Plakar Control Plane."
aliases:
  - /control-plane-docs/operations/policies/
  - /docs/control-plane/operations/policies/
---

# SLA Policies

An SLA policy defines backup requirements for your sources i.e. how often
backups should be taken and how long they should be retained. When a policy is
scoped to an environment and data class, Plakar Control Plane automatically
creates backup schedules for all source apps that match.

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Policy["SLA Policy"]
    Requirements["Frequency & retention"]
    Scope["Scope\n(environment, data class, tag)"]
    PolicyStore["Store app"]
  end

  subgraph Sources["Source Apps"]
    S1["Source A\nproduction · database"]
    S2["Source B\nproduction · critical"]
    S3["Source C\nstaging · database"]
  end

  Scope -->|"auto-match"| S1 & S2
  S1 & S2 -->|"schedule created"| Backup["Backup"]
  Requirements --> Backup
  Backup --> PolicyStore
{{< /mermaid >}}
<!-- prettier-ignore-end -->

Policies belong to a single organization. You work only with the policies of the
organization you signed in to, and what you can do with them is determined by
the [permissions](../../access-control/permissions) you hold there.

## Creating a policy

A policy is created in two steps: its rules, then its scope. Nothing is
scheduled until both are set and the policy is created.

### Rules

The rules of a policy define how often backups are taken, how long they are kept
and where they are stored. They are set per retention tier:

- Daily
- Weekly
- Monthly
- Yearly

Any combination of tiers can be enabled. For each enabled tier, you configure:

- **Backups:** how many backups are taken within the period of the tier, for
  example 24 a day, which is one every hour.
- **Keep for:** how long the restore points of the tier are kept, for example 7
  days. The number of restore points this keeps is derived from both values.
- **Stored on:** the [store](../../apps/stores) the backups of the tier are
  written to. Each tier can use a different store.

**Check integrity** runs a [check task](../../scheduling/tasks#check-task) after
each backup to verify it. It's recommended to leave this on.

![](../images/creating-a-policy.png)

### Scope

The scope of a policy selects the source apps it applies to:

- **Environment:** required. The environment the policy applies to.
- **Data Classes:** required. One or more data classes the policy applies to.
- **Tags:** optional. Narrows the matched sources down further to only those
  carrying the specified tags. Useful when environment and data class alone
  would match more sources than intended.

Environments and data classes are managed from the organization's
[classification settings](#managing-environments--data-classes).

While the scope is being set, a preview lists the resources and source apps that
match it, so the coverage of the policy can be checked before it is created. The
preview can be filtered by inventory.

Any source app whose environment and data class match the policy is
automatically scheduled according to its rules. When a new source app is added
with matching values, it is picked up by the policy without any additional
configuration.

Scope is not the only condition. A policy also respects
[data residency](./residency): a matched source is only scheduled when it and
the store it is backed up to share the same residency.

A source app can be covered by multiple policies if their scopes overlap. This
allows policies to be layered, for example a general policy covering all
production sources and a stricter policy specifically covering production
databases.

![](../images/scoping-a-policy.png)

### Summary

While the policy is being created, a summary shows the contract it defines:

- **RPO:** the maximum data loss window, based on the most frequent backup.
- **Lookback:** how far back data can be restored, based on the longest
  retention.
- **Restore points kept:** the approximate number of restore points the policy
  keeps across its tiers.
- **Covered:** the number of resources the scope matches.

## Scheduling

Once a policy is created, the policy scheduler automatically creates backup
schedules for all matching sources, using the store of each tier. See the
[policy scheduler documentation](../../scheduling/policy-scheduler) for more
details.

## Managing environments & data classes

Environments and data classes used by the SLA system to scope resources are
managed per organization, from **Organization -> Classification**. From there,
you can create new environments and data classes, or delete existing ones.

Because they belong to an organization, the environments and data classes
available to a policy are the ones defined in the organization that policy lives
in. See [Managing Organizations](../../access-control/organizations) for more
information about how organizations isolate configuration.

![Creating and deleting environments and data classes](../images/managing-classifications.png)
