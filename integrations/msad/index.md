
## Why protecting Active Directory matters

Active Directory sits underneath almost everything else in a Windows
environment. Logins, permissions, and access to other systems all depend on it
being available and correct, which is why losing it rarely stays contained to
one server.

Active Directory's replication model is built to absorb the loss of a single
Domain Controller, but it has real limits:

- **Replication assumes a survivor**: it works by copying good data from a
  healthy Domain Controller to a failed one. If every Domain Controller is lost
  or compromised at the same time, there is no healthy copy left to replicate
  from.
- **Corruption and ransomware can spread before detection**: changes to Active
  Directory propagate to every Domain Controller. A problem that is not caught
  immediately can spread throughout the domain just like a legitimate update.
- **Native backup tools are only half the story**: Windows Server Backup can
  create a System State backup, but without an independent location to store
  those backups, they can be exposed to the same failure that affected the
  Domain Controller.
- **Rebuilding without a backup means rebuilding from nothing**: without a
  usable System State backup, recovering a fully lost domain can require
  reconstructing users, groups, policies, and trust relationships manually.

For infrastructure this foundational, Active Directory needs a recovery plan for
the scenario its own replication cannot cover.

## What happens when every Domain Controller is lost

A total loss of Active Directory, whether caused by ransomware, a data center
failure, or corruption that spreads before detection, is one of the most severe
failures a Windows environment can face. So much of the environment depends on
the domain that the impact can extend far beyond the Domain Controllers
themselves.

Without an independent backup:

- **Dependent systems can fail together**: authentication, file shares, Group
  Policy, and applications relying on domain credentials can all be affected.
- **There is no peer to restore from**: normal Active Directory recovery relies
  on a healthy Domain Controller. When none exists, replication cannot provide a
  recovery path.
- **Manual reconstruction is slow and error-prone**: rebuilding users, groups,
  and policies from documentation or memory takes considerably longer than
  restoring a known-good System State.
- **The outage grows with time**: every hour without a working domain can extend
  the impact to systems and users that depend on it.

Plakar provides an independent recovery point by capturing System State backups
of Domain Controllers while they are healthy and storing them encrypted outside
the domain they protect.

## How Plakar protects your Active Directory environment

Plakar provides source and destination connectors for Active Directory System
State backups.

- **Source Connector**: capture a Windows System State backup from a healthy
  Domain Controller on a regular basis, encrypt and deduplicate the backup, and
  store it in a Kloset Store outside the domain it protects.
- **Destination Connector**: restore a verified System State backup to a
  prepared Windows server, providing the data required to recover Active
  Directory when no healthy Domain Controller remains available through normal
  replication.

This makes it possible to:

- Prepare for a worst-case scenario where every Domain Controller is lost,
  without relying on peer replication that assumes a survivor
- Keep Active Directory backups encrypted and stored independently of the domain
  they protect
- Recover a Domain Controller onto new hardware when the original server is a
  total loss

