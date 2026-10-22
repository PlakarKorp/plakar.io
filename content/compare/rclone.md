---
title: "Plakar vs rclone"
slug: "rclone"
description:
  "Plakar vs rclone 1.75.2: rclone syncs files to 59 storage backends. Plakar
  adds snapshots, deduplication, retention and audited encryption on top. Dated
  facts."
summary:
  "rclone syncs files across 59 backends, while Plakar adds snapshots,
  deduplication, retention and encryption on by default."
track: "oss"
plakar_product: "Plakar"
plakar_version: "Plakar 1.1.8"
competitor: "rclone"
competitor_short: "rclone"
competitor_version: "1.75.2"
verified: "2026-10-21"
secondary_cta_label: "Install Plakar"
secondary_cta_url: "/download/"
verdict:
  "rclone is the best tool for moving files between 59 storage backends, and it
  leaves plain files behind. It is not a snapshot backup tool: no snapshots, no
  deduplication, no retention. Plakar adds those, plus encryption on by default
  and application-aware sources, and it can use your rclone remotes as storage.
  Pick rclone to mirror or migrate files. Pick Plakar when you need to restore
  what a file looked like on a given date."
highlights:
  - title: "Snapshots, deduplication and retention on top of sync"
    text:
      "rclone sync makes the target look like the source. Its backup story is a
      side folder for displaced files (--backup-dir) or bucket versioning,
      cleaned by hand. Plakar keeps every backup as an independent snapshot,
      deduplicates with content-defined chunking and applies retention rules
      with plakar policy."
  - title: "Encryption that hides more than crypt"
    text:
      "rclone's crypt wrapper encrypts content and names but leaves file sizes,
      modification times and directory structure visible, and its compress
      wrapper is experimental. Plakar encrypts and compresses every chunk by
      default, with cryptography audited independently in 2025."
  - title: "rclone under Plakar, not instead of it"
    text:
      "Plakar has an rclone connector. Any rclone remote can be a backup source,
      a storage backend for a Kloset store, or a restore destination. You keep
      rclone's reach and add a real backup history."
table:
  - section: "Architecture and licensing"
    rows:
      - capability: "Central management"
        hint: "Can you see and drive more than one host?"
        plakar:
          {
            status: "partial",
            note:
              "Single binary with a built-in web UI (plakar ui) and a local API.
              No fleet view without Control Plane.",
          }
        competitor:
          {
            status: "partial",
            note:
              "Single binary, single user. Optional rc API and web GUI on one
              host. No fleet view.",
          }
      - capability: "Open source engine and format"
        hint: "Can you read your backups without the vendor?"
        plakar:
          {
            status: "yes",
            note:
              "Plakar and its Kloset engine are ISC. Five connectors (VSS, SQL
              Server, AD, VMware, Scaleway) are closed source, free in Plakar
              Community.",
          }
        competitor:
          {
            status: "yes",
            note:
              "MIT, fully open, nothing closed. The target holds plain files any
              client can read.",
          }
      - capability: "Point-in-time snapshots"
        hint: "Can you go back to how things were on a date?"
        plakar:
          {
            status: "yes",
            note:
              "Every backup is an independent, content-addressed snapshot. No
              incremental chains to repair.",
          }
        competitor:
          {
            status: "no",
            note:
              "No snapshots. sync keeps displaced files in a side folder with
              --backup-dir, or you rely on bucket versioning.",
          }
  - section: "Storage engine and security"
    rows:
      - capability: "Deduplication"
        plakar:
          {
            status: "yes",
            note:
              "Content-defined chunking across everything in a store. Not across
              stores.",
          }
        competitor:
          {
            status: "no",
            note:
              "One source file is one object on the target. The FAQ says rclone
              cannot upload partial changes to an object.",
          }
      - capability: "Encryption with keys you hold"
        plakar:
          {
            status: "yes",
            note:
              "AES-256-GCM-SIV, Argon2id, on by default, independently audited
              in 2025. Storage never sees keys.",
          }
        competitor:
          {
            status: "partial",
            note:
              "Optional crypt wrapper. File sizes, modtimes and directory
              structure stay visible. A password change does not re-key data.",
          }
      - capability: "Compression"
        plakar: { status: "yes", note: "LZ4 on every chunk, built in." }
        competitor:
          {
            status: "partial",
            note:
              "Experimental compress wrapper. Its own docs say things may break
              and data may be lost.",
          }
      - capability: "Immutability"
        plakar:
          {
            status: "partial",
            note: "Relies on object lock on the storage backend.",
          }
        competitor:
          {
            status: "partial",
            note:
              "The --immutable flag refuses to change existing files. Real WORM
              needs object lock on the backend, for example S3.",
          }
      - capability: "Security posture"
        plakar:
          {
            status: "partial",
            note:
              "Encryption on by default with independently audited cryptography,
              signed packages, bearer-token auth and no deletes by default on
              plakar server. No RBAC or audit log in open source Plakar.",
          }
        competitor:
          {
            status: "partial",
            note: "rc API access is equivalent to shell access, per its docs.",
          }
  - section: "Workloads and integrations"
    rows:
      - capability: "Application-aware sources"
        plakar:
          {
            status: "yes",
            note:
              "VMware, Proxmox, OpenStack, Kubernetes with KubeVirt, PostgreSQL,
              MySQL, MongoDB, Windows VSS, SQL Server, IMAP.",
          }
        competitor:
          {
            status: "no",
            note:
              "Files only: local, SMB, SFTP, FTP, HDFS, WebDAV. No VM, database
              or Kubernetes awareness.",
          }
      - capability: "Files that change during backup"
        plakar:
          {
            status: "partial",
            note:
              "Consistent captures where the platform offers them: Windows VSS,
              VMware VM snapshots, Kubernetes CSI snapshots, native database
              dumps. No LVM or ZFS snapshot for plain Linux files.",
          }
        competitor:
          {
            status: "no",
            note:
              "Aborts with 'source file is being updated' unless you pass
              --local-no-check-updated. No VSS integration.",
          }
      - capability: "Kubernetes"
        plakar:
          {
            status: "yes",
            note:
              "Native connector: resources, CSI snapshots, PVCs, KubeVirt VMs,
              namespace remapping, mTLS.",
          }
        competitor:
          {
            status: "no",
            note:
              "No operator or CRDs. A CronJob container or the Docker volume
              plugin at best.",
          }
      - capability: "Storage targets"
        plakar:
          {
            status: "yes",
            note:
              "S3 and compatibles, Azure Blob, GCS, SFTP, FTP, NFS, SMB, WebDAV,
              OCI registry, plus any rclone remote.",
          }
        competitor:
          {
            status: "yes",
            note:
              "59 backends, including 53 named S3 providers, Azure, GCS, Swift,
              B2, SFTP, SMB, WebDAV, Storj. No tape.",
          }
      - capability: "Plain files on the target"
        hint: "Can you open the target with any client?"
        plakar:
          {
            status: "no",
            note:
              "A Kloset store holds encrypted chunks. Read it with open source
              Plakar or the Go SDK, not a file browser.",
          }
        competitor:
          {
            status: "yes",
            note:
              "The target is a copy of your files. Only crypt names and
              .rclonelink files need rclone to read.",
          }
  - section: "Automation and restore"
    rows:
      - capability: "Retention policy"
        plakar:
          {
            status: "yes",
            note:
              "Keep rules managed with plakar policy. Snapshots outside the
              rules are pruned.",
          }
        competitor:
          {
            status: "no",
            note:
              "No retention engine. Clean --backup-dir folders by hand or with
              backend lifecycle rules.",
          }
      - capability: "Verify a backup without restoring"
        plakar:
          {
            status: "yes",
            note:
              "plakar check verifies a snapshot in place. Mount, diff and cat
              work without a restore.",
          }
        competitor:
          {
            status: "partial",
            note:
              "check compares sizes and hashes, --download compares bytes. It
              proves the copy matches now, not a past state.",
          }
      - capability: "Restore a point in time"
        plakar:
          {
            status: "yes",
            note:
              "Restore any snapshot, any path, to any destination connector
              (cross-connector restore).",
          }
        competitor:
          {
            status: "partial",
            note:
              "Copy back the current tree. Older versions only from --backup-dir
              folders or bucket versioning with --s3-version-at.",
          }
      - capability: "Built-in scheduler"
        plakar:
          {
            status: "no",
            note:
              "None in open source Plakar. Docs use cron, systemd, launchd or
              Task Scheduler.",
          }
        competitor:
          { status: "no", note: "None. cron, systemd or Task Scheduler." }
      - capability: "Browse backups in a UI"
        plakar:
          {
            status: "yes",
            note:
              "plakar ui serves a local web UI to browse snapshots, compare them
              and restore files.",
          }
        competitor:
          {
            status: "partial",
            note:
              "rclone gui and the rc web GUI drive transfers and show remotes.
              There is no backup history to browse.",
          }
sections_intro:
  "rclone and Plakar solve different problems. These four points decide what you
  need on top of rclone sync, and when rclone alone is enough."
sections:
  - heading: "Sync is not backup"
    competitor_text:
      "rclone sync makes the destination identical to the source. Delete a file
      at home and the next sync deletes it on the target. The documented way
      around this is --backup-dir, which moves displaced files into a dated side
      folder, or object versioning on the bucket. There is no snapshot, no
      catalog and no retention engine: you clean old side folders yourself or
      with lifecycle rules. Restore means copying a directory tree back."
    plakar_text:
      "Every plakar backup is an independent snapshot you can list, mount, diff
      and restore on its own. Retention rules are managed with plakar policy.
      plakar check verifies a snapshot without restoring it. You can restore one
      file from last month to a different destination than it came from."
    bullets:
      - "rclone: sync, --backup-dir, --suffix and --immutable are flags, not a
        history"
      - "Plakar: backup, check, policy, restore and mount work on snapshots"
      - "Plakar restores a snapshot of X into Y, for example an SFTP source into
        S3"
  - heading: "What the storage provider can see"
    competitor_text:
      "rclone's crypt remote encrypts file content (XSalsa20-Poly1305) and file
      names (AES-256 EME) with a password you hold. Its docs list what it does
      not hide: file sizes, modification times, directory structure and whether
      two files share a name. Changing the password does not re-encrypt existing
      data. The compress remote is marked experimental, with a warning that
      things may break and data may be lost."
    plakar_text:
      "Plakar encrypts and compresses every chunk by default. The store holds
      content-addressed chunks, so the provider sees neither names, sizes nor
      structure. Keys never leave you. The cryptography (AES-256-GCM-SIV,
      Argon2id, BLAKE3, Ed25519) was audited independently in February 2025."
    bullets:
      - "rclone crypt docs: sizes, modtimes and structure are visible on the
        target"
      - "Plakar: encryption on by default, audit published 2025-02-28"
      - "Deduplication means the same chunk is stored once across a whole store"
  - heading: "Use rclone under Plakar"
    competitor_text:
      "rclone's real strength in backup is reach. It speaks to 59 backends and
      53 named S3 providers from one binary, with published support tiers. That
      is why restic and kopia use it as a transport. If a provider is not on
      Plakar's native list, rclone probably reaches it."
    plakar_text:
      "Plakar ships an rclone connector. Any configured rclone remote can be a
      backup source (back up a Google Drive or Proton Drive account), a storage
      backend for a Kloset store, or a restore destination. You keep your
      rclone.conf and add snapshots, deduplication, encryption and retention on
      top."
    bullets:
      - "Connector page: /integrations/rclone/"
      - "Source, storage and destination roles use the same remote"
      - "Native Plakar connectors exist for S3, Azure, GCS, SFTP, NFS, SMB and
        WebDAV without rclone"
  - heading: "Where rclone is ahead today"
    competitor_text:
      "rclone reaches 59 backends. The target holds plain files that any client
      can read, which is the strongest exit path there is. mount, serve (http,
      webdav, sftp, s3, restic and more) and bisync have no equivalent in
      plakar. The project has 60,000 GitHub stars, more than a thousand
      contributors, a full-time maintainer and monthly patch releases. Its docs
      label experimental features honestly."
    plakar_text:
      "Plakar's community is far smaller (about 2,100 stars), there is no
      third-party reader for the Kloset format, five connectors are closed
      binaries, and there is no built-in scheduler. Plakar does not do two-way
      sync or serve a remote over another protocol. If you need to mirror or
      migrate files, not keep a history, rclone is the right tool."
choose_competitor:
  - "You want to mirror or migrate files between clouds and keep plain files on
    the target that any client can read."
  - "You need a backend Plakar does not reach natively and do not need snapshots
    (or you will put Plakar on top)."
  - "You need mount, serve or two-way sync (bisync) rather than a backup
    history."
  - "You want the largest community and a full-time maintainer behind a single
    binary."
choose_plakar:
  - "You need to restore what a file, a database or a VM looked like on a given
    date, not only the latest copy."
  - "You want deduplication and retention rules instead of dated side folders
    cleaned by hand."
  - "You want encryption on by default where the storage provider sees no names,
    sizes or structure."
  - "You back up VMs, Kubernetes, databases or Windows with VSS, not only files."
  - "You want to verify a backup in place and browse it in a UI without
    restoring it."
faq:
  - q: "Is rclone a backup tool?"
    a:
      "rclone describes itself as rsync for cloud storage. It copies, syncs,
      moves and mounts files. It has no snapshots, no deduplication and no
      retention policy. Its backup story is sync with --backup-dir or bucket
      versioning. That is a mirror with a trash folder, not a backup history."
  - q: "Can Plakar use my rclone remotes?"
    a:
      "Yes. Plakar has an rclone connector. A remote can be a backup source, the
      storage backend for a Kloset store, or a restore destination. Many teams
      keep rclone for reach and add Plakar for snapshots, encryption and
      retention."
  - q: "Does rclone deduplicate?"
    a:
      "No. One source file becomes one object on the target. The rclone FAQ
      explains that cloud stores do not support partial uploads, so a one-byte
      change re-uploads the whole file. Plakar splits files into content-defined
      chunks and stores each chunk once per store."
  - q: "Is rclone crypt enough to protect my data?"
    a:
      "It encrypts content and names with a password you hold, which is good.
      Its docs list what stays visible: file sizes, modification times,
      directory structure and name equality. The password is stored lightly
      obscured in rclone.conf unless you enable config encryption, and changing
      it does not re-key data. Plakar hides all of that by default."
  - q: "What does Plakar not do that rclone does?"
    a:
      "Two-way sync (bisync), mounting a remote as a drive, serving a remote
      over http, webdav, sftp or s3, and reaching 59 backends natively. Plakar
      has no built-in scheduler, a much smaller community and no third-party
      reader for its format. For the next step up when you need a control plane,
      Plakar Control Plane adds scheduling, roles and a fleet view on top of the
      same stores."
  - q: "How mature is Plakar compared with rclone?"
    a:
      "Plakar is younger. Version 1.0 shipped in May 2025, after an independent
      cryptographic audit of the engine in February 2025, and releases now come
      every two to three weeks. rclone has a longer public track record and more
      users, and if that is your first criterion it is the safer pick today.
      Plakar's answer is verifiability: every snapshot can be checked without
      restoring, the engine is open source, and the audit report is public."
sources:
  - label: "Introducing Plakar v1.0 (May 2025)"
    url: "https://www.plakar.io/posts/2025-05-01/introducing-plakar-v1.0-to-redefine-open-source-data-protection-with-3m-funding/"
  - label: "rclone FAQ, no partial uploads or binary diffs"
    url: "https://rclone.org/faq/"
  - label: "rclone crypt remote, what it does not hide"
    url: "https://rclone.org/crypt/"
  - label: "rclone compress remote, experimental warning"
    url: "https://rclone.org/compress/"
  - label: "rclone global flags, --backup-dir, --suffix, --immutable"
    url: "https://rclone.org/docs/"
  - label: "rclone overview, supported backends"
    url: "https://rclone.org/overview/"
  - label: "rclone local backend, files updated during transfer"
    url: "https://rclone.org/local/"
  - label: "rclone check command"
    url: "https://rclone.org/commands/rclone_check/"
  - label: "rclone remote control API (rc)"
    url: "https://rclone.org/rc/"
  - label: "rclone S3 backend, versioning and object lock"
    url: "https://rclone.org/s3/"
  - label: "Plakar rclone integration"
    url: "https://www.plakar.io/integrations/rclone/"
---
