
## Why protecting MongoDB data matters

A MongoDB deployment is usually the system of record for an application, which
means losing it is not a storage incident but an outage of the product itself.
The mechanisms that keep MongoDB available do not protect the contents:

- **Replication copies mistakes faithfully**: a replica set exists to survive a
  failed node. A `drop` on the primary reaches every secondary immediately,
  because propagating writes is precisely what it is built to do.
- **The oplog is a window, not an archive**: it is sized to let secondaries
  catch up, so the window it covers is measured in hours on a busy cluster. A
  problem noticed the next morning is past recovery from the oplog alone.
- **Schema-less means migration-heavy**: documents change shape as the
  application evolves, and a migration that writes the wrong shape is difficult
  to reverse without a copy of what came before.
- **Snapshots live with the cluster**: volume snapshots taken alongside the
  nodes share their fate when the account, the region, or the platform is
  compromised.

## What happens when database credentials are compromised

MongoDB access is controlled by users and roles, and the connection strings that
carry them are embedded in application configuration, CI pipelines, and
developer environments.

If a credential leaks or a role is scoped too broadly:

- **Deletion at the collection level**: an account with write access can drop
  collections or entire databases in a single command, across every node in the
  set.
- **Ransomware**: exposed MongoDB deployments are a standing target for
  automated campaigns that wipe databases and leave a ransom note in their
  place.
- **Silent modification**: an attacker who alters documents rather than deleting
  them leaves a cluster that looks healthy and serves wrong answers.
- **No recovery path**: replication and volume snapshots both track the live
  cluster, so neither offers a version of the data from before the damage.

Plakar mitigates this by storing snapshots in a Kloset outside the cluster, with
end-to-end encryption. If the deployment or its credentials are compromised, the
snapshot history remains intact and recoverable.

## How Plakar secures your MongoDB deployments

Plakar drives the MongoDB command line utilities, so the export it captures is
the one MongoDB itself produces:

- **Source Connector**: export a running server and store the result as an
  encrypted, deduplicated snapshot in a Kloset Store, independent of the cluster
  it came from. Because snapshots are deduplicated, keeping a long history of
  daily exports costs a fraction of storing each one whole.
- **Destination Connector**: restore a verified snapshot to the original
  deployment, a replacement cluster, or a staging environment.

This makes it possible to:

- Recover from a dropped collection or a bad migration long after the oplog
  window has closed
- Keep backup credentials separate from the accounts the application connects
  with
- Populate a staging or development environment from a known-good production
  snapshot
- Move a deployment between hosts, providers, or environments

Plakar also lets you browse and verify a snapshot before restoring, so you can
confirm what a recovery point contains before committing to it.

