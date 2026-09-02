---
title: Plakar Control Plane

subtitle: Back up and restore the Plakar Control Plane appliance itself

description: >
  Protect the Plakar Control Plane appliance against hardware failure,
  misconfiguration, or a full appliance replacement. Plakar backs up its own
  configuration and internal database into an encrypted, deduplicated Kloset
  snapshot.

technology_title: The appliance managing your backups needs a backup too

technology_description: >
  Plakar Control Plane is itself a stateful system. It holds every inventory,
  resource, app, schedule, and policy that keeps your other backups running, and
  none of that is duplicated anywhere else by default.

  The PCP integration closes that gap by treating the running appliance as a
  resource like any other, so it can be captured, stored in a Kloset, and
  restored using the same workflow as everything else it protects.

categories:
  - source

seo_tags:
  - Plakar Control Plane backup
  - appliance disaster recovery
  - control plane configuration backup
  - self-backup
  - appliance replacement

links:
  - type: control-plane
    url: /docs/control-plane/resources/services/pcp/

edition:
  - control-plane

stage: beta

author:
  - type: official
    name: Plakar

new: true

date: 2026-08-24

resource: Plakar Control Plane

image: img/logos/plakar-logo-icon.svg
---

## Why back up the appliance itself?

Plakar Control Plane holds its own configuration and internal database:
inventories, resources, apps, schedules, and policies. None of that is
duplicated anywhere else by default, so losing the appliance means losing the
record of everything it manages, not just the data it protects.

- **Hardware failure**: a disk or instance failure can take down the appliance
  itself, independently of any of the resources it backs up.
- **Bad upgrades or misconfiguration**: an appliance update or a configuration
  change gone wrong can leave Control Plane in a broken state that's faster to
  restore from a backup than to repair by hand.
- **Full appliance replacement**: migrating to new hardware or a new cloud
  instance normally means recreating every inventory, resource, app, and
  schedule from scratch.

## How Plakar protects itself

The PCP integration treats the running appliance as a resource like any other,
moving data in both directions:

- **Source Connector**: connect to the running appliance, capture its
  configuration files and a dump of its internal database, then encrypt and
  deduplicate the result into a Kloset Store, independent of the appliance it
  came from.
