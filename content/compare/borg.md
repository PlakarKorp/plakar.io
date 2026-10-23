---
title: "Plakar vs BorgBackup"
slug: "borg"
description:
  "Plakar vs BorgBackup: open source Plakar with native cloud targets and
  application connectors against Borg 1.4.5 over SSH. Dated sources, honest
  verdicts."
summary:
  "Borg is an efficient archiver for files over SSH, while Plakar adds native
  cloud targets and application-aware connectors."
track: "oss"
plakar_product: "Plakar"
plakar_version: "Plakar 1.1.8"
competitor: "BorgBackup"
competitor_short: "Borg"
competitor_version: "1.4.5 (2.0 in beta)"
verified: "2026-10-23"
secondary_cta_label: "Install Plakar"
secondary_cta_url: "/download/"
verdict:
  "Borg is a mature, very efficient deduplicating archiver for files, with more
  than ten years of stable releases and a strong untrusted-server threat model.
  Plakar adds what Borg 1.x does not have: native S3, Azure, GCS and SFTP
  targets, application-aware connectors for VMs, Kubernetes and databases,
  restore from any snapshot into any destination, Windows support and a built-in
  UI. Pick Borg for file backups to an SSH host you control. Pick Plakar when
  your backups must go to object storage and cover more than files."
highlights:
  - title: "Object storage without a server-side binary"
    text:
      "Borg 1.x reaches a remote repository through borg serve over SSH, which
      needs borg on the server. The documented fallback is a slower client-side
      SSHFS mount. S3/B2 and SFTP backends, plus Azure, GCS and others through
      rclone, arrive only in the 2.0 beta, which the project says is not for
      production. Plakar writes to S3 and S3-compatible stores, Azure Blob,
      Google Cloud Storage, SFTP, NFS, SMB and more today."
  - title: "Application-aware sources, not only paths"
    text:
      "Borg reads filesystem paths, stdin and raw devices. Databases need a dump
      step: pipe it into borg create, or use borgmatic's dump hooks. Plakar has
      connectors for VMware, Proxmox, Kubernetes, OpenStack, PostgreSQL, MySQL,
      MongoDB, Windows VSS and cloud drives, and any snapshot restores into any
      destination connector."
  - title: "Audited crypto, on by default, with a built-in UI"
    text:
      "Plakar encrypts every store by default with AES-256-GCM-SIV and Argon2id,
      independently audited in 2025, and ships a web UI to browse, diff and
      restore. Borg has a strong crypto design too, but no UI of its own and no
      third-party reader for either format."
table:
  - section: "Architecture and licensing"
    rows:
      - capability: "Central management"
        hint: "Is there a server, a UI or a control plane?"
        plakar:
          {
            status: "partial",
            note:
              "Single binary with a built-in web UI and an optional plakar
              server. Plakar Control Plane is the next step up when you need a
              control plane.",
          }
        competitor:
          {
            status: "no",
            note:
              "CLI only. A remote repository is borg serve over SSH. No server
              UI, no API, no central view of many clients.",
          }
      - capability: "Open source engine and format"
        hint: "Can you read your backups without the vendor?"
        plakar:
          {
            status: "yes",
            note:
              "Plakar and the Kloset engine are ISC. Five connectors are closed
              but free in Plakar Community. No third-party reader yet.",
          }
        competitor:
          {
            status: "yes",
            note:
              "BSD licence, no closed parts. Internals are documented, but there
              is no third-party reader either.",
          }
      - capability: "Platforms"
        plakar:
          {
            status: "yes",
            note:
              "Single Go binary for Linux, macOS, FreeBSD and Windows, amd64 and
              arm64.",
          }
        competitor:
          {
            status: "partial",
            note:
              "Linux, macOS and BSD. Windows is not a supported platform in 1.x
              (WSL and Cygwin are experimental). 2.0 beta ships an experimental
              Windows exe.",
          }
  - section: "Storage engine and security"
    rows:
      - capability: "Deduplication scope"
        plakar:
          {
            status: "yes",
            note:
              "Content-defined chunking across everything in a store. Not across
              stores.",
          }
        competitor:
          {
            status: "yes",
            note:
              "Content-defined chunking across files, machines and history in
              one repository. One writer at a time in 1.x.",
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
            status: "yes",
            note:
              "AES-256-CTR with HMAC-SHA256 or BLAKE2b, chosen at init. Keys
              stay on the client (keyfile) or in the repo under your passphrase
              (repokey); the server sees ciphertext. AEAD modes in the 2.0 beta.",
          }
      - capability: "Immutability"
        plakar:
          {
            status: "partial",
            note:
              "Relies on object lock on the storage backend. The plakar server
              refuses deletes unless -allow-delete is set.",
          }
        competitor:
          {
            status: "partial",
            note:
              "Append-only only protects segment files: delete and prune are
              still accepted, a later normal-mode write purges data, and
              recovery is a manual rollback.",
          }
      - capability: "Access control and audit log"
        plakar:
          {
            status: "partial",
            note:
              "Passphrase per store. plakar server can require a bearer token
              and refuses deletes unless -allow-delete is set. No roles, MFA or
              audit log; those are in Plakar Control Plane.",
          }
        competitor:
          {
            status: "partial",
            note:
              "SSH keys plus restrict-to-path and append-only forced commands.
              No RBAC, no MFA, no audit log beyond a transactions file.",
          }
  - section: "Workloads and integrations"
    rows:
      - capability: "Storage targets"
        plakar:
          {
            status: "yes",
            note:
              "S3 and any S3-compatible, Azure Blob, Google Cloud Storage, SFTP,
              FTP, NFS, SMB, WebDAV, OCI registry, local disk.",
          }
        competitor:
          {
            status: "partial",
            note:
              "Local disk, SSH with borg installed on the server, or a slower
              client-side SSHFS mount in 1.x. S3/B2, SFTP and rclone targets
              only in the 2.0 beta.",
          }
      - capability: "Hypervisors and VMs"
        plakar:
          {
            status: "partial",
            note:
              "VMware vSphere (closed source, free in Plakar Community), Proxmox
              VE, OpenStack, KubeVirt. No Hyper-V or Nutanix AHV.",
          }
        competitor:
          {
            status: "no",
            note:
              "No hypervisor API. The docs suggest backing up inside the VM, or
              backing up a shut-down VM's disk image or block device.",
          }
      - capability: "Kubernetes"
        plakar:
          {
            status: "yes",
            note:
              "Native connector: resources, CSI snapshots, PVCs, KubeVirt VMs,
              namespace remapping on restore.",
          }
        competitor:
          {
            status: "no",
            note: "Nothing native. No operator, no CRDs, no CSI snapshots.",
          }
      - capability: "Databases"
        plakar:
          {
            status: "partial",
            note:
              "PostgreSQL, MySQL/MariaDB, MongoDB (open), SQL Server (closed
              source, free in Plakar Community), etcd. No Oracle.",
          }
        competitor:
          {
            status: "partial",
            note:
              "Not in Borg itself. borgmatic hooks stream dumps of PostgreSQL,
              MySQL/MariaDB, MongoDB, SQLite, InfluxDB and OpenLDAP into the
              archive.",
          }
      - capability: "Windows and Active Directory"
        plakar:
          {
            status: "yes",
            note:
              "Windows VSS and Active Directory connectors, closed source, free
              in Plakar Community.",
          }
        competitor:
          {
            status: "no",
            note:
              "Windows is not a 1.x platform. No VSS or Active Directory
              support.",
          }
      - capability: "Cloud drives and SaaS"
        plakar:
          {
            status: "partial",
            note:
              "Google Drive, OneDrive, Dropbox, iCloud, Proton Drive, Koofr,
              OpenDrive, IMAP mailboxes and Notion (beta). No Microsoft 365
              mailbox or SharePoint backup.",
          }
        competitor:
          {
            status: "no",
            note: "Filesystem paths, stdin and command output only.",
          }
  - section: "Automation and restore"
    rows:
      - capability: "Scheduling and configuration as code"
        plakar:
          {
            status: "partial",
            note:
              "No built-in scheduler, use cron or systemd. Retention with plakar
              policy. Terraform and Ansible exist for Control Plane only.",
          }
        competitor:
          {
            status: "partial",
            note:
              "No built-in scheduler. borgmatic YAML plus cron or systemd is the
              usual setup. Retention through prune flags.",
          }
      - capability: "API and SDK"
        plakar:
          {
            status: "yes",
            note:
              "Go SDK for connectors, JSON output, and a local HTTP API behind
              plakar ui. No remote management API without Plakar Control Plane.",
          }
        competitor:
          {
            status: "no",
            note:
              "JSON output only. No management API. The 2.0 beta adds a REST
              storage protocol for repositories, not for management.",
          }
      - capability: "Restore anywhere"
        plakar:
          {
            status: "yes",
            note:
              "Any snapshot restores to any destination connector, for example a
              Kubernetes namespace into another cluster or files to S3.",
          }
        competitor:
          {
            status: "partial",
            note:
              "borg extract into the current directory or to stdout, export-tar,
              or mount. Restores to a filesystem only, not into another system
              type.",
          }
      - capability: "Verify without restoring"
        plakar:
          {
            status: "yes",
            note:
              "plakar check verifies a snapshot end to end without writing
              files.",
          }
        competitor:
          {
            status: "yes",
            note:
              "borg check with verify-data. The docs note it cannot catch data
              that was already corrupt at ingest.",
          }
      - capability: "Browse a backup without restoring"
        plakar:
          {
            status: "yes",
            note:
              "Mount any snapshot read-only, diff two snapshots, cat a single
              file, browse in the UI.",
          }
        competitor:
          {
            status: "partial",
            note:
              "FUSE mount of any archive, plus borg list and borg diff. No
              built-in UI, and no FUSE mount in the macOS binaries. The 2.0 beta
              adds borg webdav to serve archives over HTTP.",
          }
      - capability: "Built-in UI"
        plakar:
          {
            status: "yes",
            note:
              "plakar ui serves a local web interface to browse, search and
              restore.",
          }
        competitor:
          {
            status: "no",
            note:
              "No UI of its own. Vorta is a separate community desktop app for
              Linux and macOS.",
          }
sections_intro:
  "Checkmarks hide architecture. These four points decide most Borg versus
  Plakar evaluations."
sections:
  - heading: "Where your backups can live"
    competitor_text:
      "Borg 1.x has two kinds of repository: a local path, or a remote host
      running borg serve over SSH, which needs borg on the server. Without borg
      on the server, the fallback is a client-side SSHFS or NFS mount, which the
      docs describe as slower and advise avoiding. There is no S3, Azure, GCS or
      SFTP target in 1.x. The 2.0 beta adds S3/B2, SFTP and rclone backends, but
      the project states that beta releases are for testing on new repositories
      only, not for production, and 2.0 has no release date."
    plakar_text:
      "Plakar writes a Kloset store to S3 and any S3-compatible service, Azure
      Blob, Google Cloud Storage, SFTP, FTP, NFS, SMB, WebDAV, an OCI registry
      or a local disk. Nothing runs on the storage side. The same store can be
      synced to another backend with plakar sync, and exported as a portable
      ptar archive."
    bullets:
      - "Borg remote repositories: borg serve over SSH, or an SSHFS mount,
        documented in the quickstart and general usage guide"
      - "Borg 2.0 page: testing releases only, no final release yet (checked
        2026-10-21)"
      - "Plakar storage backends are listed on the integrations page"
  - heading: "Files only, or the application too"
    competitor_text:
      "Borg backs up paths, stdin and raw block devices. It has no idea what a
      VM, a Kubernetes namespace or a database is. For databases you pipe a dump
      into borg create, or use borgmatic, a separate tool, which streams the
      dump into the archive and restores it with a command. For VMs the docs
      suggest backing up inside the VM, or a shut-down VM's disk image, with a
      FAQ tip to touch a small dummy file before the snapshot so the VM image is
      not re-chunked."
    plakar_text:
      "Plakar has connectors for VMware vSphere, Proxmox VE, Kubernetes
      (including KubeVirt VMs), OpenStack, PostgreSQL, MySQL/MariaDB, MongoDB,
      SQL Server, etcd, Windows VSS and Active Directory, plus cloud drives and
      IMAP. Each connector can be a source or a destination, so a snapshot of
      one thing can be restored into another. VMware, VSS, Active Directory, SQL
      Server and Scaleway are closed source, free in Plakar Community. MongoDB
      and the others are open."
    bullets:
      - "Borg create accepts paths, stdin and raw devices with read-special"
      - "borgmatic database hooks: PostgreSQL, MySQL/MariaDB, MongoDB, SQLite,
        InfluxDB, OpenLDAP"
      - "Plakar Kubernetes connector 1.1.11: CSI snapshots, PVCs, KubeVirt VMs,
        namespace remapping"
  - heading: "Append-only is not immutable, for either of us"
    competitor_text:
      "Borg's append-only repository flag, or a forced borg serve command, is a
      documented protection against a hacked client deleting backups. The notes
      also say what it does not cover: delete and prune commands are still
      accepted, a single write in normal mode purges the data, and recovery
      means rolling back segment files by hand. In 1.x a repository also takes
      an exclusive lock, so one client writes at a time."
    plakar_text:
      "Plakar does not claim WORM on its own either. Snapshots are
      content-addressed and tamper-evident, and the plakar server refuses
      deletes unless you pass -allow-delete. Real immutability comes from object
      lock on the storage backend, which is why native S3, Azure and GCS targets
      matter. Borg 1.x has no native object storage target, so it cannot use
      bucket object lock directly."
    bullets:
      - "Borg usage notes: append-only mode, what it protects and what it does
        not"
      - "plakar server: -allow-delete is off by default"
      - "Object lock belongs to the bucket, not to the backup tool"
  - heading: "Where Borg is ahead today"
    competitor_text:
      "Borg has shipped stable releases for more than ten years and has 13,900
      GitHub stars and 326 contributors. Its client-side deduplication and
      compression are very efficient for file workloads, and its threat model
      (untrusted server, untrusted network, only authenticated encryption
      schemes) is mature and well documented. The ecosystem is wide: borgmatic
      for configuration and database hooks, Vorta as a desktop GUI, and hosting
      providers such as BorgBase and Hetzner Storage Box that run borg on their
      side. Any SSH box you already have can be a target."
    plakar_text:
      "Plakar is younger, with about 2,100 stars and 43 contributors, and
      releases every two to three weeks. There is no third-party reader for the
      Kloset format yet, no built-in scheduler, and five connectors are closed.
      If you only back up files to an SSH host and want the longest track
      record, Borg is the safer choice today."
choose_competitor:
  - "You back up files from Linux, macOS or BSD hosts to an SSH server you
    control, and you do not need object storage."
  - "You want a stable 1.x series with more than ten years of releases and a
    large, established community."
  - "You already run borgmatic or Vorta and your database dumps and retention
    live in that YAML."
  - "You use a hosting provider that runs borg on the server side, such as
    BorgBase or Hetzner Storage Box."
choose_plakar:
  - "Your backups must go to S3, Azure, Google Cloud Storage or SFTP today, with
    no binary on the storage side."
  - "You protect VMs, Kubernetes, OpenStack or databases and want the tool to
    understand them, not only their files."
  - "You need to restore a snapshot into a different place, for example a
    Kubernetes namespace into another cluster."
  - "You have Windows hosts to back up, with VSS and Active Directory."
  - "You want encryption on by default, an audited engine, and a built-in UI to
    browse and restore."
faq:
  - q: "Is Plakar a replacement for Borg?"
    a:
      "For file backups to SSH, both work. Plakar adds native object storage
      targets, application connectors, cross-connector restore, Windows support
      and a UI. Borg has the longer track record and the borgmatic and Vorta
      ecosystem. Both formats are open, and neither has a third-party reader."
  - q: "Can Borg back up to S3?"
    a:
      "Not in the stable 1.x series. Borg 1.x writes to a local path or to a
      remote host running borg serve over SSH. S3, SFTP and rclone backends
      exist only in the 2.0 beta, which the project says is not for production."
  - q: "Does Borg work on Windows?"
    a:
      "Windows is not a supported platform in Borg 1.x. WSL and Cygwin are
      documented as experimental. The 2.0 beta ships an experimental Windows
      executable. Plakar ships a native Windows binary and Windows VSS and
      Active Directory connectors."
  - q: "Is Borg append-only mode the same as immutable storage?"
    a:
      "No. Borg's notes say append-only only affects the low-level structure of
      the repository. It makes deletes recoverable by a manual rollback, but
      delete and prune commands are still accepted. Plakar does not claim WORM
      by itself either. Both rely on the storage layer, and Plakar can write to
      buckets with object lock enabled."
  - q: "How does deduplication compare?"
    a:
      "Both use content-defined chunking and deduplicate across everything in
      one repository or store, not across repositories. Borg publishes one
      figure: about one million unchanged files in about four minutes on
      server-grade hardware. Plakar's dated benchmark is one million items
      backed up in about two minutes on a 14-core Mac mini. Neither publishes a
      dedup ratio, so test on your own data."
  - q: "What happens to Borg 1.x repositories when 2.0 ships?"
    a:
      "Borg 2.0 cannot open 1.x repositories directly. The migration path is
      borg transfer from a 1.x repository into a new 2.0 repository, which takes
      time and space. As of October 2026, 2.0 is still in beta, and the legacy
      crypto code needed to read 1.x repositories is planned for removal in 2.1."
  - q: "How mature is Plakar compared with Borg?"
    a:
      "Plakar is younger. Version 1.0 shipped in May 2025, after an independent
      cryptographic audit of the engine in February 2025, and releases now come
      every two to three weeks. Borg has a longer public track record and more
      users, and if that is your first criterion it is the safer pick today.
      Plakar's answer is verifiability: every snapshot can be checked without
      restoring, the engine is open source, and the audit report is public."
sources:
  - label: "Introducing Plakar v1.0 (May 2025)"
    url: "https://www.plakar.io/posts/2025-05-01/introducing-plakar-v1.0-to-redefine-open-source-data-protection-with-3m-funding/"
  - label: "Borg general usage: repository URLs (local path, ssh://)"
    url: "https://borgbackup.readthedocs.io/en/stable/usage/general.html"
  - label: "Borg quickstart: borg on the remote host, SSHFS fallback, VM advice"
    url: "https://borgbackup.readthedocs.io/en/stable/quickstart.html"
  - label: "Borg installation: platforms, WSL and Cygwin experimental"
    url: "https://borgbackup.readthedocs.io/en/stable/installation.html"
  - label: "Borg FAQ: borg serve vs SSHFS, lock, VM image tip, performance"
    url: "https://borgbackup.readthedocs.io/en/stable/faq.html"
  - label: "Borg 2.0 release page: beta status, new backends, borg transfer"
    url: "https://www.borgbackup.org/releases/borg-2.0.html"
  - label: "Borg changelog: 2.0 betas for testing on new repos, borg webdav"
    url: "https://borgbackup.readthedocs.io/en/master/changes.html"
  - label: "Borg README (master): experimental Windows exe in 2.0"
    url: "https://github.com/borgbackup/borg/blob/master/README.rst"
  - label: "Borg 2.0.0b25 release (September 2026): Windows exe"
    url: "https://github.com/borgbackup/borg/releases/tag/2.0.0b25"
  - label: "Borg 1.4.5 release notes: no FUSE mount in the macOS binaries"
    url: "https://github.com/borgbackup/borg/releases/tag/1.4.5"
  - label: "Borg internals: security and threat model"
    url: "https://borgbackup.readthedocs.io/en/stable/internals/security.html"
  - label: "Borg init: encryption modes, including none and repokey"
    url: "https://borgbackup.readthedocs.io/en/stable/usage/init.html"
  - label: "Borg usage notes: append-only mode"
    url: "https://borgbackup.readthedocs.io/en/stable/usage/notes.html"
  - label: "Borg create: sources, stdin and read-special"
    url: "https://borgbackup.readthedocs.io/en/stable/usage/create.html"
  - label: "Borg extract: current directory or stdout"
    url: "https://borgbackup.readthedocs.io/en/stable/usage/extract.html"
  - label: "borgmatic: configuration and integrations"
    url: "https://torsion.org/borgmatic/"
  - label: "borgmatic: database hooks and streaming dumps"
    url: "https://torsion.org/borgmatic/how-to/backup-your-databases/"
  - label: "Vorta: desktop client for macOS and Linux"
    url: "https://vorta.borgbase.com/"
  - label: "Borg on GitHub: stars, contributors, releases"
    url: "https://github.com/borgbackup/borg"
  - label: "borgbackup.org: licence, project status and ecosystem"
    url: "https://www.borgbackup.org/"
  - label: "Plakar integrations list"
    url: "https://www.plakar.io/integrations/"
  - label: "Plakar engine cryptographic audit (2025)"
    url: "https://www.plakar.io/posts/2025-02-28/audit-of-plakar-cryptography/"
---
