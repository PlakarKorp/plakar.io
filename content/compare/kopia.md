---
title: "Plakar vs Kopia"
slug: "kopia"
description:
  "Plakar vs Kopia: open source Plakar compared with Kopia 0.23.1. Two close
  engines, different sources, UI and Kubernetes paths. Dated sources."
summary:
  "Kopia and Plakar are close engines; Kopia adds a desktop app and scheduler,
  while Plakar adds application-aware sources."
track: "oss"
plakar_product: "Plakar"
plakar_version: "Plakar 1.1.8"
competitor: "Kopia"
competitor_short: "Kopia"
competitor_version: "0.23.1"
verified: "2026-10-23"
secondary_cta_label: "Install Plakar"
secondary_cta_url: "/download/"
verdict:
  "Kopia and Plakar are the two closest engines in open source backup: both use
  content-defined chunking, both encrypt by default, both support Object Lock.
  Kopia adds a desktop app, a built-in scheduler and repo-wide deduplication,
  and it is the data mover inside Velero, OADP and Kasten. Plakar adds
  application-aware sources (VMs, databases, Kubernetes), restore from any
  source into any destination, and an engine audited in 2025. Pick Kopia for
  file backups from laptops and servers with a GUI. Pick Plakar when your
  sources are not just files."
highlights:
  - title: "Sources beyond files"
    text:
      "Kopia backs up files and directories, with Windows VSS as an experimental
      CLI policy. Databases and ZFS snapshots are before and after scripts you
      write. Plakar has connectors for VMware, Proxmox, OpenStack, Kubernetes,
      PostgreSQL, MySQL, MongoDB, SQL Server, Windows VSS and cloud drives."
  - title: "Restore into any destination"
    text:
      "A Plakar snapshot restores to any destination connector: a filesystem
      backup into S3, a Kubernetes namespace into another cluster. Kopia
      restores files to a directory or a zip or tar archive, or mounts the
      snapshot."
  - title: "Audited encryption, independent snapshots"
    text:
      "Both tools encrypt by default with keys only you hold. Plakar's engine
      (AES-256-GCM-SIV, Argon2id, BLAKE3) was audited by an independent
      cryptographer in 2025. Each Plakar snapshot is complete on its own, not a
      link in a chain."
table:
  - section: "Architecture and licensing"
    rows:
      - capability: "Central management"
        hint: "How many machines can you see from one place?"
        plakar:
          {
            status: "partial",
            note:
              "Single binary, no agent. A web UI with plakar ui and plakar
              server for shared stores. Fleet management is Plakar Control
              Plane, a separate product.",
          }
        competitor:
          {
            status: "partial",
            note:
              "Single binary. Optional kopia server proxies a repository with
              per-user accounts and lists snapshots from every user and host. No
              fleet console that schedules or monitors clients. KopiaUI desktop
              for Windows, macOS, Linux.",
          }
      - capability: "Open source engine and format"
        hint: "Can you read your backups without the project?"
        plakar:
          {
            status: "yes",
            note:
              "Plakar and its Kloset engine are ISC. Five connectors (VSS, SQL
              Server, Active Directory, VMware, Scaleway) are closed source,
              free in Plakar Community.",
          }
        competitor:
          {
            status: "yes",
            note:
              "Apache-2.0 for the CLI, server, web UI and KopiaUI. Community
              governed, no commercial edition.",
          }
      - capability: "Built-in UI and scheduler"
        plakar:
          {
            status: "partial",
            note:
              "Web UI with plakar ui to browse, diff and restore. No scheduler.
              Docs use cron, systemd, launchd or Task Scheduler.",
          }
        competitor:
          {
            status: "yes",
            note:
              "KopiaUI desktop app and web UI in server mode. Policies set
              snapshot frequency (interval, times of day or cron) and retention.
              Schedules run while KopiaUI or kopia server is running.",
          }
  - section: "Storage engine and security"
    rows:
      - capability: "Deduplication scope"
        plakar:
          {
            status: "yes",
            note:
              "Content-defined chunking (FastCDC) across every snapshot in a
              store, from any host. Not across stores.",
          }
        competitor:
          {
            status: "yes",
            note:
              "Content-defined chunking, deduplicated across all users and hosts
              of one repository.",
          }
      - capability: "Encryption with keys you hold"
        plakar:
          {
            status: "yes",
            note:
              "AES-256-GCM-SIV, Argon2id, BLAKE3, on by default. Independently
              audited in 2025. Storage never sees keys.",
          }
        competitor:
          {
            status: "yes",
            note:
              "Mandatory. AES-256-GCM or ChaCha20, scrypt key derivation by
              default (PBKDF2 optional). Unencrypted repositories are not
              allowed. A lost password cannot be recovered.",
          }
      - capability: "Immutability"
        plakar:
          {
            status: "partial",
            note:
              "Relies on object lock on the storage backend. plakar server
              refuses deletes unless -allow-delete is set.",
          }
        competitor:
          {
            status: "yes",
            note:
              "Object Lock (governance or compliance mode) on S3 and
              S3-compatible storage including B2, Azure and GCS, set when the
              repository is created. Lock extension during full maintenance is
              opt-in.",
          }
      - capability: "Multi-user access control"
        plakar:
          {
            status: "no",
            note:
              "No user accounts, RBAC or audit log in open source Plakar. Those
              live in Plakar Control Plane.",
          }
        competitor:
          {
            status: "partial",
            note:
              "Repository server has per-user accounts and ACLs on snapshot and
              policy manifests, not on content. No MFA or audit log.",
          }
  - section: "Workloads and integrations"
    rows:
      - capability: "Virtual machines"
        plakar:
          {
            status: "yes",
            note:
              "VMware vSphere (agentless, closed source, free in Plakar
              Community), Proxmox VE, OpenStack Nova and Cinder, KubeVirt. No
              Hyper-V.",
          }
        competitor:
          {
            status: "no",
            note:
              "No VM sources. Kopia backs up files and directories on Linux,
              macOS and Windows.",
          }
      - capability: "Databases"
        plakar:
          {
            status: "yes",
            note:
              "PostgreSQL, MySQL/MariaDB, MongoDB and etcd are open connectors.
              SQL Server is closed source and free in Plakar Community. No
              Oracle.",
          }
        competitor:
          {
            status: "partial",
            note:
              "No database connectors. Dump before a snapshot with a before
              action script you write and maintain.",
          }
      - capability: "Windows VSS"
        plakar:
          {
            status: "yes",
            note:
              "Windows VSS connector, closed source, free in Plakar Community.",
          }
        competitor:
          {
            status: "partial",
            note:
              "Native VSS through a policy setting (CLI only, shipped as
              experimental in 0.16). ZFS and LVM snapshots need before and after
              action scripts.",
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
            status: "partial",
            note:
              "No connector of its own. Kopia is the data mover inside Velero,
              Red Hat OADP and Veeam Kasten.",
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
              "No SaaS sources. Google Drive exists only as an experimental
              repository target.",
          }
      - capability: "Storage targets"
        plakar:
          {
            status: "yes",
            note:
              "S3 and compatibles, Azure Blob, Google Cloud Storage, SFTP, FTP,
              NFS, SMB, WebDAV, OCI registry, rclone. No tape.",
          }
        competitor:
          {
            status: "yes",
            note:
              "S3 and compatibles, Azure Blob, Backblaze B2, GCS, WebDAV, SFTP,
              Google Drive and rclone (both experimental), local filesystem,
              Kopia server. No tape.",
          }
  - section: "Automation and restore"
    rows:
      - capability: "Policies and scheduling"
        plakar:
          {
            status: "partial",
            note:
              "Retention with plakar policy. No built-in scheduler. Run backups
              from cron or a systemd timer.",
          }
        competitor:
          {
            status: "yes",
            note:
              "JSON policies per global, host, user or path with snapshot
              frequency and retention. Import and export from the CLI.",
          }
      - capability: "API and infrastructure as code"
        plakar:
          {
            status: "partial",
            note:
              "JSON output, query language, local HTTP API behind plakar ui, Go
              SDK for connectors. No Terraform provider in open source Plakar.",
          }
        competitor:
          {
            status: "partial",
            note:
              "JSON output. kopia server exposes gRPC and HTTP APIs used by its
              UI. Kopia offers them for client tools but publishes no API
              reference. No Terraform provider.",
          }
      - capability: "Restore anywhere"
        plakar:
          {
            status: "yes",
            note:
              "Any snapshot restores to any destination connector, for example a
              filesystem backup to S3 or a namespace into another cluster.",
          }
        competitor:
          {
            status: "partial",
            note:
              "File-level restore to a directory or to a zip or tar archive on
              any platform, or mount the snapshot.",
          }
      - capability: "Verify and browse without restoring"
        plakar:
          {
            status: "yes",
            note:
              "plakar check verifies a snapshot without restoring. Mount it
              read-only, diff two snapshots, cat a single file, browse in the
              UI.",
          }
        competitor:
          {
            status: "yes",
            note:
              "snapshot verify checks structure and can sample file contents.
              Mount a snapshot as a filesystem. Full maintenance (CLI or
              KopiaUI) runs a structure-only verify daily; content sampling is a
              manual CLI run.",
          }
sections_intro:
  "The engines look alike on a checklist. These four points decide most Kopia
  versus Plakar evaluations."
sections:
  - heading: "Files only, or application-aware sources"
    competitor_text:
      "Kopia snapshots files and directories on Linux, macOS and Windows. That
      is the whole source list. On Windows, a CLI policy setting can read from a
      VSS shadow copy (shipped as experimental in 0.16). For a database or a ZFS
      snapshot, you enable actions and write a before script and an after
      script. Kopia runs them around the snapshot. The scripts are yours to
      test, maintain and keep consistent on every host."
    plakar_text:
      "Plakar treats sources as connectors. The same backup command works on a
      directory, a PostgreSQL database, a vSphere VM, a Kubernetes namespace or
      a Google Drive. The connector handles quiescing and the data format.
      Database connectors and VSS need the vendor tools on the host that runs
      the backup. Four of the source connectors (VSS, SQL Server, Active
      Directory, VMware) are closed source, free in Plakar Community. MongoDB,
      PostgreSQL, MySQL, Kubernetes, Proxmox and OpenStack are open."
    bullets:
      - "Kopia: files only, plus opt-in before and after action scripts"
      - "Plakar: 36 integrations usable with open source Plakar, 31 of them open
        source"
      - "Plakar connectors are symmetric: a source can also be a restore
        destination"
  - heading: "Reading your backups in ten years"
    competitor_text:
      "Kopia is fully open, so you can always rebuild the client, and repository
      sync-to copies a repository to another backend. But the on-disk format has
      no formal specification (the architecture page points to the Go API docs)
      and there is no third-party reader. Everything is encrypted with a
      password only you hold, and Kopia says a forgotten password cannot be
      recovered."
    plakar_text:
      "Plakar is in the same position on one point: there is no third-party
      reader for the Kloset format either. What you get is an ISC-licensed
      engine, a published Go SDK, and ptar, a portable single-file archive you
      can move and open anywhere Plakar runs. Stores sync between any two
      backends with plakar sync. The encryption design was audited by an
      independent cryptographer in February 2025. Plakar Control Plane, the next
      step up when you need a control plane, writes the same stores, so open
      source Plakar can always read them."
    bullets:
      - "Both: open source code, no formal on-disk spec, no third-party reader"
      - "Plakar: Go SDK, ptar portable archives, audited cryptography"
      - "Kopia: repository sync-to, no password recovery by design"
  - heading: "Kubernetes: a data mover or a connector"
    competitor_text:
      "Kopia is the default uploader in Velero since 1.12 and the engine behind
      Velero's built-in data mover. Red Hat OADP and Veeam Kasten use it the
      same way. This is a real strength: a lot of Kubernetes backup traffic runs
      through Kopia code. It is also indirect. Kopia itself has no Kubernetes
      connector, no operator and no CRDs. Velero's docs warn that large files
      take a long time to scan even when little has changed, and that many small
      files use a lot of CPU and memory."
    plakar_text:
      "Plakar has its own Kubernetes connector. It backs up resources, CSI
      volume snapshots, PVCs and KubeVirt VMs, with namespace remapping on
      restore and mTLS to the cluster. It runs with open source Plakar. There is
      no operator or CRD in open source Plakar; the Plakar Operator ships with
      Control Plane and is closed."
    bullets:
      - "Kopia: default uploader in Velero, engine in OADP and Kasten, nothing
        of its own"
      - "Plakar: Kubernetes connector 1.1.11 with KubeVirt VMs, namespace
        remapping and mTLS"
      - "Neither open source tool offers CRDs; Plakar's Operator is a Control
        Plane component"
  - heading: "Where Kopia is ahead today"
    competitor_text:
      "Kopia ships a desktop app for Windows, macOS and Linux, and a policy
      engine that schedules snapshots and retention without cron. Deduplication
      is repository-wide across all hosts and users. Object Lock support is
      built in, with opt-in lock extension during full maintenance, and optional
      Reed-Solomon error correction exists (experimental). The repository server
      gives per-user accounts and TLS. The community is much larger: about
      14,400 GitHub stars and 155 contributors, and Kopia code runs inside
      Velero, OADP and Kasten. Every component is open; there are no closed
      connectors."
    plakar_text:
      "Plakar has no scheduler and no desktop app; the web UI runs with plakar
      ui. Deduplication stays inside one store. Immutability depends on the
      backend's object lock with no lock management in Plakar itself. The
      community is smaller (about 2,100 stars, 43 contributors), five connectors
      are closed, and the format has no reader outside the Plakar toolchain. If
      you back up files from many laptops and want a GUI with a scheduler, Kopia
      is the simpler choice today."
choose_competitor:
  - "Your sources are files and directories, and a before and after script
    covers the rest."
  - "You want a desktop app and a built-in scheduler with no cron, systemd or
    Control Plane."
  - "You already run Velero, Red Hat OADP or Veeam Kasten and want the same
    engine on your servers."
  - "You want one repository that deduplicates across every host and user."
  - "You want every component open source with no account needed for any
    connector."
choose_plakar:
  - "You back up VMs, databases or Kubernetes and do not want to maintain
    scripts per host."
  - "You want to restore a snapshot into a different destination, not only onto
    a filesystem."
  - "You want an engine whose encryption was audited by an independent
    cryptographer."
  - "You want a built-in web UI to browse, diff and restore, and snapshots that
    stand on their own."
  - "You want a clear next step up: Plakar Control Plane reads the same stores
    when you need a control plane."
faq:
  - q: "Is Plakar a replacement for Kopia?"
    a:
      "For file backups, both work. Plakar adds application-aware sources
      (VMware, Proxmox, OpenStack, Kubernetes, PostgreSQL, MySQL, MongoDB, SQL
      Server, cloud drives) and restore into any destination. Kopia adds
      KopiaUI, a scheduler, repo-wide dedup and its role inside Velero. Test
      both on your data; neither project publishes dedup ratios or throughput
      numbers."
  - q: "Does Kopia back up databases or VMs?"
    a:
      "Not natively. Kopia backs up files and directories. Its docs show how to
      run a dump or a ZFS or LVM snapshot through before and after action
      scripts, and a CLI policy setting can use Windows VSS (shipped as
      experimental in 0.16). There is no VM, database, SaaS or Kubernetes source
      in Kopia itself."
  - q: "Does Plakar have a scheduler like Kopia?"
    a:
      "No. Plakar sets retention with plakar policy but does not run backups on
      a timer. The docs use cron, systemd timers, launchd or Windows Task
      Scheduler. Kopia policies include snapshot frequency and KopiaUI or kopia
      server runs them. Scheduling with SLA policies is part of Plakar Control
      Plane."
  - q: "Can I read Kopia or Plakar backups without the tool?"
    a:
      "For both, no. Neither has a formal on-disk specification or a third-party
      reader. Kopia points to its Go API docs; Plakar publishes a Go SDK and the
      ptar portable archive format. Both are open source, so the reader will
      always exist."
  - q: "How does deduplication compare?"
    a:
      "Both use content-defined chunking. Kopia deduplicates across all hosts
      and users that write to one repository. Plakar deduplicates across every
      snapshot in one store, from any host, but not between stores. Kopia offers
      zstd, s2, gzip, pgzip and deflate compression per policy; Plakar uses LZ4.
      Neither project publishes a dedup ratio, so measure on your own data."
  - q: "How mature is Plakar compared with Kopia?"
    a:
      "Plakar is younger. Version 1.0 shipped in May 2025, after an independent
      cryptographic audit of the engine in February 2025, and releases now come
      every two to three weeks. Kopia has a longer public track record and more
      users, and if that is your first criterion it is the safer pick today.
      Plakar's answer is verifiability: every snapshot can be checked without
      restoring, the engine is open source, and the audit report is public."
sources:
  - label: "Introducing Plakar v1.0 (May 2025)"
    url: "https://www.plakar.io/posts/2025-05-01/introducing-plakar-v1.0-to-redefine-open-source-data-protection-with-3m-funding/"
  - label: "Kopia features"
    url: "https://kopia.io/docs/features/"
  - label: "Kopia installation (KopiaUI and web UI)"
    url: "https://kopia.io/docs/installation/"
  - label: "Kopia getting started (policies, import and export)"
    url: "https://kopia.io/docs/getting-started/"
  - label: "Kopia encryption"
    url: "https://kopia.io/docs/advanced/encryption/"
  - label: "Kopia before and after actions"
    url: "https://kopia.io/docs/advanced/actions/"
  - label: "Kopia supported repositories"
    url: "https://kopia.io/docs/repositories/"
  - label: "Kopia ransomware protection (Object Lock)"
    url: "https://kopia.io/docs/advanced/ransomware-protection/"
  - label: "Kopia error correction"
    url: "https://kopia.io/docs/advanced/ecc/"
  - label: "Kopia repository server"
    url: "https://kopia.io/docs/repository-server/"
  - label: "Kopia architecture"
    url: "https://kopia.io/docs/advanced/architecture/"
  - label: "Kopia consistency and verification"
    url: "https://kopia.io/docs/advanced/consistency/"
  - label: "Kopia governance"
    url: "https://github.com/kopia/kopia/blob/master/GOVERNANCE.md"
  - label: "Kopia v0.16.0 release notes (Windows VSS)"
    url: "https://github.com/kopia/kopia/releases/tag/v0.16.0"
  - label: "Kopia v0.23.1 release notes"
    url: "https://github.com/kopia/kopia/releases/tag/v0.23.1"
  - label: "Kopia v0.23.1 repository create flags (KDF, retention mode)"
    url: "https://github.com/kopia/kopia/blob/v0.23.1/cli/command_repository_create.go"
  - label: "Kopia v0.23.1 restore modes (zip, tar)"
    url: "https://github.com/kopia/kopia/blob/v0.23.1/cli/command_restore.go"
  - label: "Kopia v0.23.1 compression algorithms"
    url: "https://github.com/kopia/kopia/tree/v0.23.1/repo/compression"
  - label: "Velero v1.12.0 release notes (Kopia default uploader)"
    url: "https://github.com/vmware-tanzu/velero/releases/tag/v1.12.0"
  - label: "Velero 1.18 CSI snapshot data movement"
    url: "https://velero.io/docs/v1.18/csi-snapshot-data-movement/"
  - label: "Red Hat OADP Data Mover (OKD 4.20)"
    url: "https://docs.okd.io/4.20/backup_and_restore/application_backup_and_restore/installing/about-oadp-data-mover.html"
  - label: "Veeam Kasten storage repositories API"
    url: "https://docs.kasten.io/latest/api/repositories/"
  - label: "Plakar integrations list"
    url: "https://www.plakar.io/integrations/"
  - label: "Plakar engine cryptographic audit (2025)"
    url: "https://www.plakar.io/posts/2025-02-28/audit-of-plakar-cryptography/"
---
