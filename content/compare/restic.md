---
title: "Plakar vs restic"
slug: "restic"
description:
  "Plakar vs restic: two open source Go binaries with client-side encryption and
  deduplication. Where they match, where they differ, with dated sources."
summary:
  "Both encrypt and deduplicate; restic fits plain file backups, while Plakar
  adds application-aware sources like VMs, Kubernetes and databases."
track: "oss"
plakar_product: "Plakar"
plakar_version: "Plakar 1.1.8"
competitor: "restic"
competitor_short: "restic"
competitor_version: "0.19.1"
verified: "2026-10-21"
secondary_cta_label: "Install Plakar"
secondary_cta_url: "/download/"
verdict:
  "restic is the most trusted tool in this category: a single binary, a
  documented format, an independent reimplementation and a large community.
  Plakar matches it on the basics (one Go binary, client-side encryption,
  content-defined deduplication, check without restore, FUSE mount) and adds
  what restic does not do: application-aware sources like VMs, Kubernetes,
  OpenStack and databases, restore of any snapshot into any destination, and a
  built-in web UI. Pick restic for plain file backups where its ecosystem
  matters more than connectors. Pick Plakar when your data lives in
  applications, not only in files."
highlights:
  - title: "Back up applications, not only files"
    text:
      "restic reads a filesystem or a stdin stream. Plakar has connectors for
      VMware, Proxmox, Kubernetes (including KubeVirt VMs), OpenStack,
      PostgreSQL, MySQL, MongoDB, SQL Server, Windows VSS and cloud drives."
  - title: "Restore into any destination"
    text:
      "A Plakar snapshot restores to any destination connector: a filesystem, an
      S3 bucket, an SFTP server or another Kubernetes namespace. restic restores
      files to a local path, or dumps them as tar or zip."
  - title: "A UI and a check command built in"
    text:
      "plakar ui browses, searches and restores from a store in your browser.
      plakar check verifies a snapshot without restoring it. restic has check
      --read-data too, but no UI of its own: that is Backrest, a separate
      project."
table:
  - section: "Architecture and licensing"
    rows:
      - capability: "Single binary, no server"
        hint: "Can you run it with nothing else installed?"
        plakar:
          {
            status: "yes",
            note:
              "One Go binary for Linux, macOS, FreeBSD and Windows. Data goes
              from the client to the storage backend. No agent.",
          }
        competitor:
          {
            status: "yes",
            note:
              "One Go binary, no server needed. Optional rest-server as a
              self-hosted HTTP target.",
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
              "BSD-2-Clause, fully open. Documented repository format with an
              independent reimplementation, rustic.",
          }
      - capability: "Central management"
        hint: "Seeing several machines or stores in one place"
        plakar:
          {
            status: "partial",
            note:
              "plakar ui and plakar server work per store. Plakar Control Plane
              is the next step up when you need a control plane.",
          }
        competitor:
          {
            status: "no",
            note:
              "No server, no central view. rest-server is a storage target only.
              Backrest is a third-party web UI.",
          }
  - section: "Storage engine and security"
    rows:
      - capability: "Deduplication"
        plakar:
          {
            status: "yes",
            note:
              "Content-defined chunking (FastCDC) across everything in a store.
              Not across stores.",
          }
        competitor:
          {
            status: "yes",
            note:
              "Content-defined chunking (Rabin fingerprint) across everything in
              a repository. Not across repositories.",
          }
      - capability: "Compression"
        plakar: { status: "yes", note: "LZ4, on by default." }
        competitor:
          {
            status: "yes",
            note:
              "zstd on format v2, with off, fastest, auto, better and max modes.",
          }
      - capability: "Encryption with keys you hold"
        plakar:
          {
            status: "yes",
            note:
              "AES-256-GCM-SIV, Argon2id key derivation, on by default.
              Independent cryptographic audit in 2025. Storage never sees keys.",
          }
        competitor:
          {
            status: "yes",
            note:
              "AES-256-CTR with Poly1305-AES, keys derived from your password
              with scrypt. Several keys per repository.",
          }
      - capability: "Immutability"
        plakar:
          {
            status: "partial",
            note:
              "Relies on object lock on the storage backend. Snapshots are
              content-addressed and tamper-evident.",
          }
        competitor:
          {
            status: "partial",
            note:
              "Append-only mode in rest-server, or bucket object lock. Docs warn
              that a fake-snapshot attack can defeat --keep-last retention.",
          }
      - capability: "Access control and audit log"
        plakar:
          {
            status: "partial",
            note:
              "Passphrase or keyfile per store. plakar server can require a
              bearer token and refuses deletes by default. No roles, MFA or
              audit log in open source Plakar.",
          }
        competitor:
          {
            status: "partial",
            note:
              "One repository password with optional extra keys. rest-server can
              run append-only. No roles, MFA or audit log.",
          }
  - section: "Workloads and integrations"
    rows:
      - capability: "Filesystems"
        plakar:
          {
            status: "yes",
            note:
              "Local filesystem on all platforms. Windows VSS through a
              connector, closed source, free in Plakar Community.",
          }
        competitor:
          {
            status: "yes",
            note:
              "Linux, BSD, macOS and Windows, with VSS snapshots through
              --use-fs-snapshot.",
          }
      - capability: "Hypervisors"
        plakar:
          {
            status: "partial",
            note:
              "VMware vSphere (agentless, closed source, free in Plakar
              Community), Proxmox VE, OpenStack, KubeVirt and OpenShift
              Virtualization. No Hyper-V or Nutanix.",
          }
        competitor:
          {
            status: "no",
            note:
              "No VM backup. restic sees only the files a VM host or guest
              exposes.",
          }
      - capability: "Kubernetes"
        plakar:
          {
            status: "yes",
            note:
              "Native connector for Kubernetes and OpenShift: resources, CSI
              snapshots, PVCs, KubeVirt VMs, namespace remapping on restore.",
          }
        competitor:
          {
            status: "no",
            note:
              "Nothing native. Velero used restic as a data mover and has
              replaced it with Kopia.",
          }
      - capability: "Databases"
        plakar:
          {
            status: "partial",
            note:
              "PostgreSQL, MySQL/MariaDB, MongoDB and etcd (open). SQL Server
              free in Plakar Community. No Oracle.",
          }
        competitor:
          {
            status: "partial",
            note:
              "No connectors. You pipe a dump into restic with --stdin or
              --stdin-from-command.",
          }
      - capability: "Cloud drives and mail"
        plakar:
          {
            status: "partial",
            note:
              "Google Drive, OneDrive, Dropbox, iCloud, Proton Drive, Koofr,
              OpenDrive, IMAP mailboxes and Notion (beta). Microsoft 365 coming
              soon. No SharePoint backup.",
          }
        competitor:
          {
            status: "no",
            note:
              "Not supported as sources. Only what you first sync to a local
              disk.",
          }
      - capability: "Storage targets"
        plakar:
          {
            status: "yes",
            note:
              "S3 and any S3-compatible, Azure Blob, Google Cloud Storage, SFTP,
              FTP, NFS, SMB, WebDAV, OCI registry, rclone.",
          }
        competitor:
          {
            status: "yes",
            note:
              "Local, SFTP, rest-server, S3 and S3-compatible, OpenStack Swift,
              Backblaze B2, Azure Blob, Google Cloud Storage, rclone.",
          }
  - section: "Automation and restore"
    rows:
      - capability: "Built-in scheduler"
        plakar:
          {
            status: "no",
            note:
              "None in open source Plakar. Docs use cron, systemd, launchd or
              Task Scheduler. Retention runs through plakar policy.",
          }
        competitor:
          {
            status: "no",
            note:
              "Docs say restic does not have a built-in way of scheduling
              backups. Use cron, systemd or tools like Backrest.",
          }
      - capability: "Scripting and JSON output"
        plakar:
          {
            status: "yes",
            note:
              "JSON output, a query language for snapshots, a local HTTP API
              behind plakar ui, a Go SDK for custom connectors.",
          }
        competitor:
          {
            status: "yes",
            note:
              "--json on backup, check, diff, find, forget, ls, restore,
              snapshots and stats. Documented exit codes.",
          }
      - capability: "Restore anywhere"
        hint: "Restore a snapshot into a different kind of destination"
        plakar:
          {
            status: "yes",
            note:
              "Any snapshot restores to any destination connector: filesystem,
              S3, SFTP, a Kubernetes namespace, a database.",
          }
        competitor:
          {
            status: "partial",
            note:
              "Restore to a local path with include and exclude filters, or dump
              to tar and zip. No other destination types.",
          }
      - capability: "Verify without restoring"
        plakar:
          {
            status: "yes",
            note:
              "plakar check verifies snapshot integrity. Options for a fast
              structural pass or a full read.",
          }
        competitor:
          {
            status: "yes",
            note:
              "restic check for structure, check --read-data or
              --read-data-subset for full or sampled content. Repair tools too.",
          }
      - capability: "Browse a backup without restoring"
        plakar:
          {
            status: "yes",
            note:
              "Mount any snapshot as a read-only filesystem, diff two snapshots,
              cat a single file, browse in the UI.",
          }
        competitor:
          {
            status: "yes",
            note: "FUSE mount on Linux, macOS and FreeBSD, ls, find and dump.",
          }
      - capability: "Built-in UI"
        plakar:
          {
            status: "yes",
            note:
              "plakar ui serves a web interface to browse, search and restore
              from a store. Backups start from the CLI.",
          }
        competitor:
          {
            status: "no",
            note:
              "Command line only. Backrest is a separate project that adds a web
              UI and scheduling.",
          }
sections_intro:
  "Both tools get the storage layer right. These four points decide most restic
  versus Plakar evaluations."
sections:
  - heading: "What you can back up"
    competitor_text:
      "restic backs up a filesystem path or a stream on stdin. That is the whole
      input model. Windows users can take a VSS snapshot first with
      --use-fs-snapshot. For a database you run the dump tool yourself and pipe
      it in with --stdin-from-command. There is no connector for VMs,
      Kubernetes, OpenStack or any application."
    plakar_text:
      "Plakar uses the same model for files, and adds connectors that talk to
      the application. The Kubernetes connector reads resources, CSI snapshots,
      PVCs and KubeVirt VMs. The VMware connector takes a temporary snapshot and
      reads the disks over the vSphere API. The database connectors cover
      PostgreSQL, MySQL, MongoDB, SQL Server and etcd. Cloud drives like Google
      Drive, OneDrive and Dropbox are sources too."
    bullets:
      - "Connector list with licence per connector: /integrations/"
      - "Open connectors build with plakar pkg build; the SDK lets you write
        your own"
      - "Five connectors are closed source and free in Plakar Community: Windows
        VSS, SQL Server, Active Directory, VMware, Scaleway"
  - heading: "Restore into something else"
    competitor_text:
      "restic restore writes files to a local path. restic dump writes a file or
      a tree as tar or zip. restic mount shows a snapshot as a filesystem. All
      three give you files on the machine running restic. Moving them anywhere
      else is a second step with another tool."
    plakar_text:
      "In Plakar every connector can be a source and a destination. A snapshot
      of a filesystem can restore into an S3 bucket or an SFTP server. A
      Kubernetes namespace can restore into another cluster under a new name. A
      database snapshot can restore into a running database. One command, no
      staging disk."
    bullets:
      - "plakar restore -to <destination> works with any configured destination
        connector"
      - "plakar sync copies a store between backends, so an S3 store can move to
        SFTP or local disk"
      - "plakar ptar exports a snapshot as a single portable archive"
  - heading: "Seeing and checking your backups"
    competitor_text:
      "restic check verifies the repository structure, and check --read-data
      reads every blob back to confirm it. --read-data-subset samples a part of
      the data for a cheaper run. There are repair commands for the index, packs
      and snapshots. There is no UI. Backrest, a separate open source project,
      adds a web interface and a scheduler on top of restic."
    plakar_text:
      "plakar check does the same job: it verifies a snapshot against its
      content hashes without restoring. plakar ui starts a web interface where
      you browse snapshots, search for a file, compare two snapshots and
      restore. The UI reads the same store Plakar writes, so nothing extra is
      installed."
    bullets:
      - "plakar ui, plakar check, plakar mount and plakar diff are part of the
        main binary"
      - "Snapshots are independent, not chains, so one damaged snapshot does not
        break the next"
      - "No built-in scheduler on either side: both rely on cron, systemd or
        Task Scheduler"
  - heading: "Where restic is ahead today"
    competitor_text:
      "restic has 36,700 GitHub stars and about 400 contributors. Its repository
      format is documented, and rustic, a separate project written in Rust,
      reads and writes the same repositories. That is a real exit path: two
      independent implementations of one format. Backrest gives restic users a
      web UI with scheduling. The docs are honest about limits, down to the
      fake-snapshot attack on --keep-last. For plain file backups, restic is the
      safe default."
    plakar_text:
      "Plakar has about 2,100 stars and 43 contributors. Only the Plakar
      toolchain reads a Kloset store today. Five connectors are closed source,
      free in Plakar Community. Plakar has no scheduler and no UI-based
      scheduling either. If you only back up files and you value a long
      community track record, restic is the lower-risk choice."
choose_competitor:
  - "You back up files and directories, and nothing else needs application-aware
    handling."
  - "You want a format with two independent implementations (restic and rustic)
    and a large community behind it."
  - "You already use Backrest, resticprofile or autorestic and your scheduling
    is solved."
  - "You want the tool with the largest community in this category."
choose_plakar:
  - "Your data lives in VMs, Kubernetes, OpenStack or databases and you want
    connectors, not dump scripts."
  - "You want to restore a snapshot into a different destination: another
    cluster, a bucket, a database."
  - "You want a web UI to browse and restore without installing a second
    project."
  - "You want encryption on by default with an independently audited engine."
  - "You want a tool that ships a new release every two to three weeks."
faq:
  - q: "Is Plakar a replacement for restic?"
    a:
      "For file backups the two overlap: one Go binary, client-side encryption,
      deduplication, mount and check. Plakar adds application connectors,
      cross-connector restore and a UI. restic adds a larger community and an
      independent reimplementation. If you only need files, either works."
  - q: "Can Plakar read a restic repository?"
    a:
      "No. The formats are different. To move, restore from restic to a
      filesystem and back that up with plakar. Both tools keep the data
      encrypted, so there is no plaintext copy on the storage side."
  - q: "Does Plakar have a built-in scheduler?"
    a:
      "No, and restic does not either. Both document cron, systemd and Task
      Scheduler. plakar policy handles retention."
  - q: "Is Plakar fully open source?"
    a:
      "Plakar, the Kloset engine and the SDK are ISC licensed. Most connectors
      are open. Five connectors are closed source, free in Plakar Community:
      Windows VSS, SQL Server, Active Directory, VMware and Scaleway. restic is
      BSD-2-Clause with no closed parts."
  - q: "How does encryption compare?"
    a:
      "Both encrypt on the client with keys derived from your password, and the
      storage never sees plaintext. restic uses AES-256-CTR with Poly1305-AES
      and scrypt. Plakar uses AES-256-GCM-SIV with Argon2id, on by default, and
      published an independent cryptographic audit in 2025."
  - q: "Can I restore Plakar backups without a Plakar account?"
    a:
      "Yes. Open source Plakar lists, verifies and restores every snapshot. An
      account is only needed to download the five closed connectors."
  - q: "How mature is Plakar compared with restic?"
    a:
      "Plakar's repository dates from March 2021 and version 1.0 shipped in May
      2025, after an independent cryptographic audit of the engine in February
      2025, and releases now come every two to three weeks. restic has a longer
      public track record and more users, and if that is your first criterion it
      is the safer pick today. Plakar's answer is verifiability: every snapshot
      can be checked without restoring, the engine is open source, and the audit
      report is public."
sources:
  - label: "restic rest-server (append-only mode)"
    url: "https://github.com/restic/rest-server"
  - label: "Introducing Plakar v1.0 (May 2025)"
    url: "https://www.plakar.io/posts/2025-05-01/introducing-plakar-v1.0-to-redefine-open-source-data-protection-with-3m-funding/"
  - label: "restic repository on GitHub (licence, stars, releases)"
    url: "https://github.com/restic/restic"
  - label: "restic docs, preparing a new repository (backends)"
    url: "https://restic.readthedocs.io/en/stable/030_preparing_a_new_repo.html"
  - label: "restic docs, backing up (stdin, VSS, scheduling)"
    url: "https://restic.readthedocs.io/en/stable/040_backup.html"
  - label: "restic docs, restoring from backup (restore, dump, mount)"
    url: "https://restic.readthedocs.io/en/stable/050_restore.html"
  - label: "restic docs, working with repositories (check --read-data)"
    url: "https://restic.readthedocs.io/en/stable/045_working_with_repos.html"
  - label: "restic docs, removing backup snapshots (fake-snapshot warning)"
    url: "https://restic.readthedocs.io/en/stable/060_forget.html"
  - label: "restic docs, scripting (JSON output, exit codes)"
    url: "https://restic.readthedocs.io/en/stable/075_scripting.html"
  - label: "restic docs, references (repository format, encryption)"
    url: "https://restic.readthedocs.io/en/stable/100_references.html"
  - label: "rustic, independent Rust implementation of the restic format"
    url: "https://github.com/rustic-rs/rustic"
  - label: "Backrest, third-party web UI and scheduler for restic"
    url: "https://github.com/garethgeorge/backrest"
  - label: "Plakar integrations list"
    url: "https://www.plakar.io/integrations/"
  - label: "Plakar repository on GitHub (licence, stars, releases)"
    url: "https://github.com/PlakarKorp/plakar"
  - label: "Plakar engine cryptographic audit (2025)"
    url: "https://www.plakar.io/posts/2025-02-28/audit-of-plakar-cryptography/"
---
