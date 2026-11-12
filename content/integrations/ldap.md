---
title: LDAP

subtitle: Encrypted, versioned backups of your LDAP directory

description: >
  Protect the users, groups and organizational units in your LDAP directory.
  Plakar exports every entry to LDIF and keeps encrypted, deduplicated snapshots
  you can restore from at any time.

technology_title: Your directory is the source of truth for access

technology_description: >
  LDAP directories such as OpenLDAP hold the accounts, groups and policies that
  decide who can sign in to which system. Losing a branch of the directory, or
  having it modified by mistake or by an attacker, can lock people out of
  everything that depends on it.

  Plakar backs up the directory as standard LDIF, the format every LDAP server
  can import, and keeps each run as an encrypted, deduplicated snapshot in a
  Kloset store.

categories:
  - source

seo_tags:
  - LDAP backup
  - OpenLDAP backup
  - directory backup
  - LDIF export
  - identity backup
  - encrypted backup
  - disaster recovery

links:
  - type: community
    url: /docs/community/main/integrations/ldap/
  - type: control-plane
    url: /docs/control-plane/resources/identity/ldap/

related:
  - msad
  - postgres
  - mysql

edition:
  - control-plane

stage: beta

binary: true

author:
  - type: official
    name: Plakar

date: 2026-11-12

resource: LDAP

image: img/integrations/ldap.png
---

## Why protecting your LDAP directory matters

A directory changes constantly as people join, leave and move between teams.
Most LDAP servers keep no history of those changes, so a mistake is permanent
unless a copy exists elsewhere:

- **Accidental deletion**: Removing the wrong organizational unit deletes every
  account and group beneath it.
- **Bad bulk changes**: A faulty script or provisioning job can overwrite
  attributes across thousands of entries at once.
- **Replication spreads mistakes**: Replicas copy every change, including the
  wrong ones, so they are not a backup.

## Security and compromise

The directory is a prime target, since control of it means control of access. If
an administrative account is compromised, an attacker can delete accounts,
change group memberships or plant new ones.

Plakar keeps each backup as an immutable snapshot, encrypted end to end and
stored outside the LDAP server. Plakar connects over TLS and refuses cleartext
binds unless you explicitly allow them, so the bind credentials are not exposed
on the network.

## How Plakar protects your LDAP directory

- **Source Connector**: Export every entry under a base DN to LDIF and store it
  as an encrypted, deduplicated snapshot. Each backup can be browsed, compared
  with earlier ones, and restored as an LDIF file that your LDAP server can
  import.
