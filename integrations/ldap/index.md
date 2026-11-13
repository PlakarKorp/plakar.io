
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

