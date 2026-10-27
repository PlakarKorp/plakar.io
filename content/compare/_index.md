---
title: "Compare Plakar with other backup tools"
description:
  "How Plakar compares with Veeam, Rubrik, Cohesity, Commvault, restic, Borg,
  Kopia and rclone. Built from vendor documentation, with dated sources."
lede:
  "Plakar is open source backup with an open data format, encryption keys only
  you hold, and connectors for VMs, Kubernetes and databases. Here is how it
  compares, including where other tools are ahead."
aliases:
  - /solutions/compare/
verified: "2026-10-21"
benefits:
  - icon: "ri/open-source-line"
    title: "Restore without us"
    text:
      "The engine and the data format are open source (ISC). Open source Plakar
      reads and restores every store, including stores written by Plakar Control
      Plane."
  - icon: "ri/lock-2-line"
    title: "Keys only you hold"
    text:
      "Encryption runs on the client and is on by default. Storage providers and
      backup admins see only encrypted chunks. The design follows a 2025
      independent cryptographic audit."
  - icon: "ri/stack-line"
    title: "Applications, not only files"
    text:
      "Connectors for VMware, Proxmox, OpenStack, Kubernetes, PostgreSQL, MySQL,
      MongoDB and SQL Server. Restore any snapshot into any connector."
  - icon: "ri/git-merge-line"
    title: "Backup policy as code"
    text:
      "Plakar Control Plane adds a Terraform provider, an Ansible collection, a
      Kubernetes Operator and a REST API, so policies live in Git."
matrices:
  - id: "enterprise"
    title: "Plakar Control Plane vs enterprise backup platforms"
    intro:
      "For teams that need a backup platform with a control plane, policies and
      access control. Columns link to the full comparison."
    plakar: "Plakar Control Plane"
    columns:
      - { name: "Veeam", slug: "veeam" }
      - { name: "Rubrik", slug: "rubrik" }
      - { name: "Cohesity", slug: "cohesity" }
      - { name: "Commvault", slug: "commvault" }
    rows:
      - capability: "Restore backups without the vendor's software"
        cells: ["yes", "partial", "no", "no", "no"]
      - capability: "Client-side encryption, storage never sees keys"
        cells: ["yes", "partial", "no", "no", "partial"]
      - capability: "Open source agents (Edges)"
        cells: ["yes", "no", "no", "no", "no"]
      - capability: "Self-hosted control plane, no SaaS required"
        cells: ["yes", "yes", "partial", "yes", "yes"]
      - capability: "Official Terraform provider"
        cells: ["yes", "no", "yes", "partial", "yes"]
      - capability: "Backup policies as code (GitOps)"
        cells: ["yes", "partial", "yes", "partial", "partial"]
      - capability: "Kubernetes in the same product"
        cells: ["yes", "partial", "yes", "partial", "yes"]
      - capability: "VMware vSphere, agentless"
        cells: ["yes", "yes", "yes", "yes", "yes"]
      - capability: "OpenStack as a native source"
        cells: ["yes", "no", "partial", "partial", "yes"]
      - capability: "Proxmox VE as a native source"
        cells: ["yes", "yes", "yes", "no", "yes"]
      - capability: "Hyper-V and Nutanix AHV"
        cells: ["no", "yes", "yes", "yes", "yes"]
      - capability: "SaaS apps and cloud drives"
        cells: ["partial", "partial", "yes", "yes", "yes"]
      - capability: "Ransomware and anomaly detection"
        cells: ["no", "yes", "yes", "yes", "yes"]
      - capability: "Access control (RBAC, MFA, audit log, SSO)"
        cells: ["partial", "yes", "yes", "yes", "yes"]
      - capability: "Automated restore drills"
        cells: ["partial", "yes", "yes", "partial", "yes"]
      - capability: "Free tier"
        cells: ["yes", "partial", "no", "no", "no"]
  - id: "oss"
    title: "Plakar vs open source backup tools"
    intro:
      "For engineers who back up with a command-line tool today. Columns link to
      the full comparison."
    plakar: "Plakar"
    columns:
      - { name: "restic", slug: "restic" }
      - { name: "Borg", slug: "borg" }
      - { name: "Kopia", slug: "kopia" }
      - { name: "rclone", slug: "rclone" }
    rows:
      - capability: "Point-in-time snapshots with deduplication"
        cells: ["yes", "yes", "yes", "yes", "no"]
      - capability: "Encryption on by default"
        cells: ["yes", "yes", "partial", "yes", "no"]
      - capability: "Native connectors for VMs, Kubernetes and databases"
        cells: ["yes", "no", "no", "no", "no"]
      - capability: "Agentless VMware vSphere backup"
        cells: ["yes", "no", "no", "no", "no"]
      - capability: "Google Drive, OneDrive, Dropbox and IMAP as sources"
        cells: ["yes", "no", "no", "no", "partial"]
      - capability: "S3 and object storage targets"
        cells: ["yes", "yes", "partial", "yes", "yes"]
      - capability: "Restore into a different system"
        cells: ["yes", "partial", "partial", "partial", "partial"]
      - capability: "Verify backups without restoring"
        cells: ["yes", "yes", "yes", "yes", "partial"]
      - capability: "Built-in UI"
        cells: ["yes", "no", "no", "yes", "partial"]
      - capability: "Built-in scheduler"
        cells: ["no", "no", "no", "yes", "no"]
      - capability: "Windows support"
        cells: ["yes", "yes", "partial", "yes", "yes"]
      - capability: "Data readable by a second, independent tool"
        cells: ["no", "yes", "no", "no", "yes"]
      - capability: "Every component open source"
        cells: ["partial", "yes", "yes", "yes", "yes"]
      - capability: "Large community (10,000+ GitHub stars)"
        cells: ["no", "yes", "yes", "yes", "yes"]
matrix_note:
  "Partial means the capability exists with limits: a separate product or
  add-on, a beta, a third-party tool, or narrower coverage. Borg object storage
  targets are in the 2.0 beta only. Cohesity announced native OpenStack backup
  in October 2026, with no public docs yet. Plakar's five closed connectors
  (Windows VSS, SQL Server, Active Directory, VMware, Scaleway) are free in
  Plakar Community. Plakar Control Plane access control: 20 roles, 2FA you can
  enforce per organization, an audit log, webhooks to your SIEM, legal hold and
  data residency. It has no single sign-on yet. Each comparison page explains
  every cell and lists its sources."
questions_title: "Six questions to ask any backup vendor"
questions_intro:
  "Checkmarks hide architecture. These questions separate a backup you own from
  a backup you rent. Here is how Plakar answers them."
questions:
  - q: "Can I restore my backups without your software or a licence?"
    why: "Your last line of defense should not depend on a contract renewal."
    answer:
      "Yes. Plakar and its data format are open source. Open source Plakar
      lists, verifies and restores every snapshot."
    link:
      {
        label: "How Plakar works",
        url: "/docs/community/main/explanations/how-plakar-works/",
      }
  - q: "Who holds the encryption keys?"
    why: "Whoever holds the keys can read your data."
    answer:
      "Only you. Encryption happens on the client before data leaves the host.
      The storage provider and the backup admin never see plaintext."
    link:
      {
        label: "The 2025 cryptographic audit",
        url: "/posts/2025-02-28/audit-of-plakar-cryptography/",
      }
  - q: "How do I prove a backup will restore?"
    why: "A backup you have never verified is a hope, not a backup."
    answer:
      "plakar check verifies a snapshot's integrity without restoring it.
      Control Plane runs those checks on a schedule as part of each policy."
    link:
      {
        label: "plakar check",
        url: "/docs/community/main/references/commands/plakar-check/",
      }
  - q: "Can I restore into a different system?"
    why: "After an incident, the original system may be gone."
    answer:
      "Yes. Any snapshot restores into any connector: a VM disk to S3, a
      filesystem to SFTP, a Kubernetes namespace into another cluster."
    link:
      {
        label: "plakar restore",
        url: "/docs/community/main/references/commands/plakar-restore/",
      }
  - q: "Can our backup policy live in Git?"
    why: "Policies changed by hand in a console drift and are hard to audit."
    answer:
      "Yes, with Control Plane: Terraform provider, Ansible collection,
      Kubernetes Operator and REST API."
    link:
      {
        label: "Infrastructure as code",
        url: "/docs/control-plane/infrastructure-as-code/",
      }
  - q: "What happens to my data if the vendor disappears?"
    why: "Backups often outlive the tools that wrote them."
    answer:
      "The format is open source and documented in code, with a Go SDK. Your
      stores stay readable with open source Plakar, and you can move them to any
      storage with plakar sync."
    link:
      {
        label: "plakar sync",
        url: "/docs/community/main/references/commands/plakar-sync/",
      }
proof:
  - title: "Linux Foundation and CNCF member"
    text: "Silver member of both foundations since January 2026."
    url: "/posts/2026-01-07/plakar-joins-the-linux-foundation-and-cloud-native-computing-foundation/"
  - title: "Independently audited cryptography"
    text: "Reviewed by Jean-Philippe Aumasson in February 2025. Report public."
    url: "/posts/2025-02-28/audit-of-plakar-cryptography/"
  - title: "Open source on GitHub"
    text: "Plakar, its engine, SDK and most connectors under the ISC licence."
    url: "https://github.com/PlakarKorp/plakar"
  - title: "On AWS and OVHcloud marketplaces"
    text:
      "Plakar Control Plane is listed on AWS Marketplace and OVHcloud
      Marketplace."
    url: "/posts/2026-07-10/plakar-control-plane-aws-marketplace/"
faq:
  - q: "What types of backup tools exist, and what are the tradeoffs?"
    a:
      "There are four common types. Enterprise backup suites (Veeam, Rubrik,
      Cohesity, Commvault) cover the widest range of workloads, but store data
      in proprietary formats and are licensed per workload or per terabyte. Open
      source backup tools (restic, Borg, Kopia) are free and encrypt on the
      client, but back up files only and have no fleet management console. Sync
      tools (rclone) copy files to cloud storage, but keep no snapshots and do
      no deduplication. Plakar sits between the first two: an open source engine
      with application connectors, plus an optional self-hosted Control Plane
      for policies and access control."
  - q: "Is Plakar open source?"
    a:
      "Plakar and its engine (Kloset), the SDK, Edge, the Terraform provider,
      the Ansible collection and most connectors are open source under the ISC
      licence. Five connectors are closed source and free in Plakar Community:
      Windows VSS, SQL Server, Active Directory, VMware and Scaleway. Plakar
      Control Plane and its Kubernetes Operator are commercial and closed
      source, with a free plan."
  - q: "How is Plakar different from enterprise backup suites?"
    a:
      "Plakar Control Plane is self-hosted, and it writes an open format that
      open source Plakar can restore without any licence. Policies can be
      managed from Terraform, Ansible or Kubernetes. The suites cover more
      workloads today, including Hyper-V, Nutanix AHV, Microsoft 365 mailboxes
      and Salesforce, and add ransomware detection and single sign-on, which
      Plakar does not have yet."
  - q: "How is Plakar different from restic, Borg and Kopia?"
    a:
      "All four encrypt on the client and deduplicate. Plakar adds native
      connectors for VMs, Kubernetes and databases, restores any snapshot into
      any connector, and has a built-in UI. restic, Borg and Kopia have larger
      communities and longer track records, and restic's format has a second,
      independent reader (rustic)."
  - q: "When is Plakar not the right choice?"
    a:
      "When you need Hyper-V, Nutanix AHV, Oracle, SAP HANA, Microsoft 365
      mailboxes, SharePoint or Salesforce backup, tape, single sign-on or
      built-in ransomware detection today. In those cases an enterprise suite
      covers more. Microsoft 365 support is coming soon."
  - q: "How do you keep these comparisons accurate?"
    a:
      "Each page compares a specific Plakar version with a specific version of
      the other tool, using that vendor's own documentation, release notes and
      announcements. Every page shows the date it was last checked and lists its
      sources. If something is wrong or out of date, tell us and we will fix it."
---
