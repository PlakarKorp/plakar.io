
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

