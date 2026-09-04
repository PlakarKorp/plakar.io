---
title: Microsoft Active Directory

subtitle: Disaster recovery backups for Windows Active Directory

description: >
  Protect Active Directory against the scenario replication can't fix: no 
  healthy Domain Controller left to recover from. Plakar captures encrypted 
  System State backups of Domain Controllers while they're healthy, ready to 
  bring Active Directory back after hardware failure, corruption, or ransomware.

technology_title: >
  Active Directory recovers from most failures on its own, except the big one

technology_description: >
  Active Directory is designed to be resilient by nature: with multiple Domain 
  Controllers replicating to one another, the loss of a single server is 
  normally a non-event. That resilience assumes at least one healthy Domain 
  Controller survives. When every Domain Controller is lost or compromised at 
  once, whether by hardware failure, ransomware, or corruption that replicates 
  before it's detected, there's nothing left to recover from. Plakar closes 
  that gap by capturing a Windows System State backup of a Domain Controller 
  while it's healthy, storing it encrypted and independently of the domain, and 
  making it available when normal replication is no longer an option.

categories:
  - source
  - destination

seo_tags:
  - Active Directory backup
  - Active Directory disaster recovery
  - Domain Controller recovery
  - System State backup
  - Windows Server disaster recovery
  - ransomware protection
  - encrypted backup

links:
  - type: control-plane
    url: /docs/control-plane/resources/identity/msad/

edition:
  - control-plane

stage: stable

author:
  - type: official
    name: Plakar

new: true

date: 2026-08-10

resource: Active Directory

image: img/integrations/msad.png
---

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
