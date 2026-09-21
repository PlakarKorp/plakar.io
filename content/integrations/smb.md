---
title: SMB

subtitle: Encrypted, deduplicated backups for SMB and CIFS network shares

description: >
  Protect the file shares your teams work from every day against accidental
  deletion, ransomware, and hardware failure. Plakar captures immutable,
  encrypted snapshots of SMB shares on Windows servers, NAS appliances, and
  Samba hosts, restorable to any share or environment.

technology_title: Everyone relies on the SMB share, nobody backs it up

technology_description: >
  SMB, also known as CIFS, is how organisations share folders across a network.
  It runs on Windows file servers, on NAS appliances from Synology and QNAP, and
  on Samba hosts across Unix. Shares accumulate the documents, project files,
  and departmental data a business runs on, often with no owner and no backup
  policy. A RAID array protects against a failed disk, and a snapshot schedule
  on the appliance protects against a bad afternoon, but neither survives
  ransomware, a stolen administrator account, or the appliance itself being
  destroyed. Plakar reads shares directly over SMB2/3 and turns them into
  encrypted, deduplicated snapshots stored somewhere else entirely.

categories:
  - source
  - destination

seo_tags:
  - SMB backup
  - CIFS backup
  - NAS backup
  - Samba backup
  - Windows file share backup
  - network share backup
  - ransomware protection
  - immutable snapshots
  - encrypted backup
  - disaster recovery

links:
  - type: community
    url: /docs/community/main/integrations/smb/
  - type: control-plane
    url: /docs/control-plane/resources/file-storage/smb/

edition:
  - community
  - control-plane

stage: stable

author:
  - type: official
    name: Plakar

new: true

date: 2026-09-21

resource: SMB

image: img/integrations/smb.svg
---

## Why protecting network shares matters

The file share is usually the oldest piece of infrastructure in the building and
the least supervised. It holds contracts, designs, invoices, and years of work
that exist nowhere else, accessed daily by people who assume someone is looking
after it.

What protects a share usually turns out to be less than expected:

- **RAID is not a backup**: redundant disks keep the appliance running through a
  hardware failure. They do nothing about a file deleted by mistake, overwritten
  by the wrong version, or encrypted by malware.
- **Appliance snapshots live on the appliance**: NAS snapshot schedules are
  useful for quick rollbacks, but they sit on the same device as the data.
  Theft, fire, a failed controller, or a wiped array takes both.
- **Shares grow without an owner**: departments create folders, staff leave, and
  nobody can say which directories still matter. Data that nobody claims is data
  nobody protects.
- **Recycle bins expire**: the Windows and Samba safety nets are short-lived and
  size-limited. By the time a deletion is noticed, weeks later, the copy is
  usually gone.

For the data a business actually works from day to day, the share needs a copy
that does not depend on the machine serving it.

## What happens when a file server is compromised

SMB shares are reachable from every workstation on the network, which makes them
one of the first things ransomware looks for. A single compromised desktop with
write access to a mapped drive is enough.

If a share is hit or an administrator account is misused:

- **Encryption at network speed**: ransomware walks mapped drives and encrypts
  files across the share, damaging data far beyond the machine that was
  originally infected.
- **Snapshots deleted first**: attackers with administrative access to the
  appliance routinely remove its local snapshots before encrypting, precisely
  because those snapshots are the obvious recovery path.
- **Quiet, widespread damage**: shared folders have no single owner watching
  them, so corruption or deletion can sit unnoticed for a long time while
  backups continue to overwrite the good copies.
- **Nothing to restore from**: once the live share and the appliance snapshots
  are both gone, rebuilding from whatever staff kept locally is the only option
  left.

Plakar mitigates this by reading shares over SMB into a Kloset stored outside
the file server. If the share or the appliance managing it is compromised, the
snapshot history stays intact and recoverable.

## How Plakar secures your SMB shares

Plakar uses SMB2/3 directly, with no kernel mount, no `smbclient`, and no root
privileges, so it can back up a share from wherever it runs:

- **Source Connector**: walk an entire share or a single subtree, capturing
  files, directories, and symlinks. Plakar encrypts and deduplicates the
  contents before writing them to a Kloset Store, independent of the server the
  share came from.
- **Destination Connector**: restore a verified snapshot to the original share,
  a replacement appliance, or a different environment, recreating the directory
  hierarchy and file contents.

This makes it possible to:

- Back up Windows file servers, NAS appliances, and Samba hosts through one
  protocol, with one tool
- Keep backup credentials separate from the accounts staff use to reach the
  share
- Migrate a share to new hardware by restoring a snapshot onto the replacement
- Protect departmental data that was never covered by a formal backup policy

Plakar also lets you browse, search, and verify a snapshot before restoring, so
recovering a single deleted file does not mean restoring an entire share.

Instead of trusting a share to the appliance that serves it, Plakar gives you an
independent, encrypted, and verifiable history of the files your organisation
works from.
