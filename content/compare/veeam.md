---
title: "Plakar vs Veeam"
slug: "veeam"
description:
  "Plakar Control Plane compared with Veeam Backup & Replication 13.1: open
  engine and open format against the market leader in hypervisor coverage. Dated
  sources, honest verdicts."
summary:
  "Veeam leads on hypervisor breadth and restore tooling, while Plakar offers an
  open format and policies as code."
track: "enterprise"
plakar_product: "Plakar Control Plane"
plakar_version: "Control Plane 1.1.5, Plakar 1.1.8"
competitor: "Veeam Data Platform"
competitor_short: "Veeam"
competitor_version: "Backup & Replication 13.1"
verified: "2026-10-21"
verdict:
  "Veeam covers more hypervisors than anyone and has the most mature restore
  tooling. Plakar Control Plane gives you an open engine, an open data format
  you can read without the vendor, and policies as code. Pick Veeam for breadth
  on VMware and Hyper-V estates. Pick Plakar when you want to own your backups,
  automate them from Git, and protect OpenStack, Proxmox and KubeVirt as
  first-class sources."
highlights:
  - title: "Open engine, open format"
    text:
      "Plakar and its engine (Kloset) are ISC licensed. Open source Plakar reads
      and restores every store Control Plane writes. Veeam backups live in the
      proprietary VBK format and the extract utility only reads full backups,
      not incrementals."
  - title: "Policies as code"
    text:
      "Plakar ships a Terraform provider, an Ansible collection and a Kubernetes
      Operator with CRDs. Veeam has a REST API and PowerShell, but no official
      Terraform provider and no declarative policy model."
  - title: "OpenStack, Proxmox and KubeVirt as native sources"
    text:
      "Plakar backs up OpenStack Nova and Cinder, Proxmox VE and KubeVirt VMs
      through its own connectors. Veeam does not support OpenStack and covers
      KubeVirt only through an OpenShift plug-in, with full Kubernetes left to
      Kasten, a separate product."
table:
  - section: "Architecture and licensing"
    rows:
      - capability: "Self-hosted control plane"
        hint: "Where the management layer runs"
        plakar:
          {
            status: "yes",
            note:
              "Virtual appliance (AMI, OVA, qcow2, ISO) in your infrastructure.
              Only licence metrics go to plakar.io.",
          }
        competitor:
          {
            status: "yes",
            note:
              "Linux software appliance or Windows install. Windows to appliance
              migration unsupported in 13.1.",
          }
      - capability: "Open source engine and format"
        hint: "Can you read your backups without the vendor?"
        plakar:
          {
            status: "yes",
            note:
              "Plakar and its Kloset engine are ISC. Control Plane and Operator
              are closed, but write standard Kloset stores open source Plakar
              can restore.",
          }
        competitor:
          {
            status: "no",
            note:
              "Proprietary VBK/VIB/VBM. Extract utility reads full backups only,
              not incrementals or scale-out repositories.",
          }
      - capability: "Free tier"
        plakar:
          {
            status: "yes",
            note:
              "Open source Plakar is free. Control Plane Free plan covers up to
              500 GB of managed data with no time limit.",
          }
        competitor:
          {
            status: "partial",
            note:
              "Community Edition protects 10 workloads, sends telemetry, no
              support.",
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
            status: "partial",
            note:
              "Inline dedup per job chain, not global. Global dedup needs a
              third-party appliance.",
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
              "AES with password keys. External KMS (KMIP) only on Advanced and
              Premium editions. Post-quantum key exchange new in 13.1.",
          }
      - capability: "Immutability"
        plakar:
          {
            status: "partial",
            note:
              "Relies on object lock on the storage backend. Legal hold inside
              Control Plane blocks deletion through Plakar.",
          }
        competitor:
          {
            status: "yes",
            note:
              "Hardened Linux repository, governance-mode immutability on
              standard Linux repos (13.1), S3 Object Lock.",
          }
      - capability: "RBAC, MFA and audit log"
        plakar:
          {
            status: "partial",
            note:
              "Org-scoped RBAC with 21 roles, enforceable TOTP 2FA, audit log,
              webhooks to SIEM. No SSO or SAML yet.",
          }
        competitor:
          {
            status: "yes",
            note:
              "RBAC, mandatory MFA on the appliance, SAML SSO, four-eyes
              authorization, syslog forwarding.",
          }
      - capability: "Ransomware and anomaly detection"
        plakar:
          {
            status: "no",
            note:
              "Not documented. Snapshots are tamper-evident and
              content-addressed.",
          }
        competitor:
          {
            status: "yes",
            note:
              "Inline entropy and IoC scanning, YARA, Recon Scanner on Premium.",
          }
  - section: "Workloads and integrations"
    rows:
      - capability: "Hypervisors"
        plakar:
          {
            status: "partial",
            note:
              "VMware vSphere (agentless), Proxmox VE, OpenStack, KubeVirt. No
              Hyper-V or Nutanix AHV.",
          }
        competitor:
          {
            status: "yes",
            note:
              "14 platforms including VMware, Hyper-V, AHV, Proxmox, OLVM,
              XCP-ng. No OpenStack.",
          }
      - capability: "Kubernetes"
        plakar:
          {
            status: "yes",
            note:
              "Native connector (resources, CSI snapshots, PVCs, KubeVirt VMs)
              plus an Operator with CRDs.",
          }
        competitor:
          {
            status: "partial",
            note:
              "Kasten is a separate product licensed per node. The 13.1 KubeVirt
              plug-in covers OpenShift Virtualization only.",
          }
      - capability: "Databases"
        plakar:
          {
            status: "partial",
            note:
              "PostgreSQL, MySQL/MariaDB, MongoDB (open), SQL Server (closed
              source, free in Plakar Community), etcd. No Oracle, SAP HANA or
              Db2.",
          }
        competitor:
          {
            status: "yes",
            note:
              "Plug-ins for SQL Server, Oracle RMAN, SAP HANA, Db2. PostgreSQL
              and MySQL only through image-level or agent backups.",
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
            status: "yes",
            note:
              "Windows agent with VSS, Entra ID, automated AD Forest Recovery in
              13.1.",
          }
      - capability: "SaaS apps and cloud drives"
        plakar:
          {
            status: "partial",
            note:
              "Notion (beta), Google Drive, OneDrive, Dropbox, iCloud and IMAP
              mailboxes. No Microsoft 365 mailbox, SharePoint or Salesforce
              connector.",
          }
        competitor:
          {
            status: "partial",
            note:
              "Sold as separate per-user products (Veeam Backup for Microsoft
              365, Veeam Data Cloud).",
          }
      - capability: "Storage targets"
        plakar:
          {
            status: "yes",
            note:
              "S3 and any S3-compatible, Azure Blob, Google Cloud Storage, SFTP,
              FTP, NFS, SMB, WebDAV, OCI registry. No tape.",
          }
        competitor:
          {
            status: "yes",
            note:
              "S3, S3-compatible, Azure, GCS, SMB/NFS, Linux and Windows
              repositories, tape, dedup appliances.",
          }
  - section: "Automation and restore"
    rows:
      - capability: "Infrastructure as code"
        plakar:
          {
            status: "yes",
            note:
              "Terraform provider, Ansible collection, Kubernetes Operator with
              CRDs, REST API with API keys, webhooks.",
          }
        competitor:
          {
            status: "partial",
            note:
              "REST API still being completed, PowerShell 7 module. No official
              Terraform provider, no declarative policy model.",
          }
      - capability: "Restore anywhere"
        plakar:
          {
            status: "yes",
            note:
              "Any snapshot restores to any destination connector, for example a
              VM disk to S3 or a Kubernetes namespace into another cluster.",
          }
        competitor:
          {
            status: "yes",
            note:
              "Instant Recovery across hypervisors, export to VHD, VHDX and
              VMDK, application-item explorers.",
          }
      - capability: "Automated restore testing"
        plakar:
          {
            status: "partial",
            note:
              "Scheduled integrity checks per policy verify snapshots without
              restoring. No automated boot-and-test lab.",
          }
        competitor:
          {
            status: "yes",
            note:
              "SureBackup boots VMs in an isolated lab and runs heartbeat, ping
              and application tests.",
          }
      - capability: "Browse a backup without restoring"
        plakar:
          {
            status: "yes",
            note:
              "Mount any snapshot as a read-only filesystem, diff two snapshots,
              cat a single file.",
          }
        competitor:
          {
            status: "yes",
            note:
              "File-level recovery browser and explorers for supported
              applications.",
          }
sections_intro:
  "Checkmarks hide architecture. These four points decide most Veeam versus
  Plakar evaluations."
sections:
  - heading: "Who can read your backups in ten years"
    competitor_text:
      'Backups are written in the VBK, VIB and VBM formats. There is no public
      specification and no third-party reader. Veeam''s extract utility restores
      from full backups only, not from incrementals or scale-out repositories,
      and needs a Veeam account to download. When Veeam says "zero vendor
      lock-in" it means you can restore a VM to another hypervisor, not that you
      can read the backup without Veeam.'
    plakar_text:
      "The Kloset format and Plakar are open source under the ISC licence.
      Control Plane writes standard Kloset stores. If you stop paying, open
      source Plakar still lists, verifies and restores every snapshot. You can
      also export a snapshot as a portable ptar archive."
    bullets:
      - "Engine source: github.com/PlakarKorp/plakar and
        github.com/PlakarKorp/kloset"
      - "Restore path without the vendor: install Plakar, open the store, run
        restore"
      - "Independent cryptographic audit of the engine published in February
        2025"
  - heading: "Policies in Git, not in a console"
    competitor_text:
      'Jobs are objects you create in the console, the REST API or PowerShell.
      The REST API is still "progressing toward full coverage" in 13.1. There is
      no official Terraform provider (the registry namespace is empty) and no
      way to declare a backup policy as a file that a pipeline applies.'
    plakar_text:
      "Control Plane has a Terraform provider, an Ansible collection and a
      Kubernetes Operator. Sources, stores, destinations and schedules are
      resources you commit. SLA policies set frequency, retention and
      verification. Webhooks push job events to your SIEM or chat."
    bullets:
      - "Terraform provider plakarkorp/plakar on the registry"
      - "Operator CRDs: Source, Store, Destination, ScheduleBackup,
        ScheduleSync, ScheduleCheck, Restore"
      - "Pre and post job hooks on Edges for application quiescing"
  - heading: "OpenStack, Proxmox and KubeVirt"
    competitor_text:
      "Veeam supports 14 hypervisors but not OpenStack, and Veeam staff on the
      forum point to an agent-only workaround. KubeVirt is supported only inside
      OpenShift Virtualization through a 13.1 plug-in. Full Kubernetes needs
      Kasten, which is a separate product licensed per worker node."
    plakar_text:
      "Plakar has its own connectors for OpenStack (Nova instances, Cinder
      volumes, Swift, Glance, Trove), Proxmox VE and Kubernetes, including
      KubeVirt VMs. They run with open source Plakar and with Control Plane. The
      Operator adds CRDs for cluster-native scheduling."
    bullets:
      - "OpenStack connector 1.1.1 released October 2026"
      - "Kubernetes connector 1.1.11 with KubeVirt VMs, namespace remapping and
        mTLS"
      - "Proxmox connector built with a partner on top of vzdump"
  - heading: "Where Veeam is ahead today"
    competitor_text:
      "SureBackup verifies restores by booting them in a lab. Instant Recovery
      works across hypervisors. Inline malware scanning, YARA rules and
      four-eyes authorization are built in. The SAML SSO, Entra ID and AD Forest
      Recovery features are mature. For Hyper-V, Nutanix AHV, Oracle, SAP HANA
      and Microsoft 365, Veeam has coverage Plakar does not."
    plakar_text:
      "Control Plane verifies snapshots with scheduled check tasks but does not
      boot them. There is no anomaly detection and no SSO yet. Hyper-V, Nutanix,
      Oracle, SAP and Microsoft 365 mailboxes are not covered. If those are
      must-haves, Veeam is the safer choice today."
choose_competitor:
  - "Your estate is mostly VMware, Hyper-V or Nutanix AHV and you need
    any-to-any instant recovery across them."
  - "You need automated restore testing that boots VMs (SureBackup) and inline
    malware scanning out of the box."
  - "You back up Oracle, SAP HANA, Db2 or Microsoft 365 mailboxes and want
    vendor-supported plug-ins."
  - "You already run Veeam and your team knows the console."
choose_plakar:
  - "You want to read and restore your backups without a vendor licence, now and
    in ten years."
  - "You run OpenStack, Proxmox or KubeVirt and want them as native sources, not
    workarounds."
  - "You manage infrastructure as code and want backup policies in Git, applied
    by Terraform, Ansible or an Operator."
  - "You want end-to-end encryption where the storage provider and the backup
    admin never see plaintext."
  - "You want a self-hosted control plane with a free tier and an open source
    engine underneath."
faq:
  - q: "Is Plakar a replacement for Veeam?"
    a:
      "For OpenStack, Proxmox, Kubernetes, Linux and cloud storage estates, yes.
      For large VMware or Hyper-V estates that depend on SureBackup, Oracle or
      SAP plug-ins, or Microsoft 365 backup, Veeam still covers more. Many teams
      run both during a migration because Plakar stores are independent of the
      Veeam catalog."
  - q: "Can I restore Plakar backups without Plakar Control Plane?"
    a:
      "Yes. Control Plane writes standard Kloset stores. The open source Plakar
      lists, verifies and restores every snapshot without any licence."
  - q: "Does Veeam have a Terraform provider?"
    a:
      "Not an official one. As of October 2026 the Terraform registry namespace
      for Veeam is empty. VeeamHub publishes community sample code. Plakar has
      an official provider and an Ansible collection."
  - q: "Does Plakar support Hyper-V?"
    a:
      "No. Plakar supports VMware vSphere, Proxmox VE, OpenStack and KubeVirt.
      Hyper-V is not on the public integrations list."
  - q: "How does deduplication compare?"
    a:
      "Plakar deduplicates across everything in a store using content-defined
      chunking. Veeam deduplicates within a job chain, not globally, and
      recommends 4 MB blocks for large files, which gives the lowest ratio.
      Neither vendor publishes a certified ratio, so test on your own data."
  - q: "Does Plakar have ransomware detection like Veeam?"
    a:
      "No. Plakar snapshots are content-addressed and tamper-evident, and
      immutability comes from object lock on the storage backend. Veeam adds
      inline entropy scanning, YARA rules and a Recon Scanner on higher
      editions."
sources:
  - label: "Veeam Backup & Replication 13.1 release notes"
    url: "https://helpcenter.veeam.com/rn/veeam_backup_13_1_release_notes.html"
  - label: "Veeam hypervisor protection, What's New in 13"
    url: "https://helpcenter.veeam.com/docs/vbr/wn/hypervisor_protection.html"
  - label: "Veeam compression and deduplication guide"
    url: "https://helpcenter.veeam.com/docs/vbr/userguide/compression_deduplication.html?ver=13"
  - label: "Veeam extract utility documentation"
    url: "https://helpcenter.veeam.com/archive/vbr/13.0.2/userguide/extract_utility.html"
  - label: "Veeam SureBackup tests"
    url: "https://helpcenter.veeam.com/docs/vbr/userguide/surebackup_tests.html"
  - label: "Veeam REST API, What's New in 13"
    url: "https://helpcenter.veeam.com/docs/vbr/wn/rest_api.html"
  - label: "Veeam licensing policy"
    url: "https://www.veeam.com/licensing-policy.html"
  - label: "Veeam forum on OpenStack support"
    url: "https://forums.veeam.com/veeam-backup-replication-f2/openstack-backup-support-t102699.html"
  - label: "Terraform registry, Veeam namespace"
    url: "https://registry.terraform.io/v2/providers?filter[namespace]=veeam"
  - label: "Plakar integrations list"
    url: "https://www.plakar.io/integrations/"
  - label: "Plakar Terraform provider"
    url: "https://registry.terraform.io/providers/plakarkorp/plakar/latest"
  - label: "Plakar engine cryptographic audit (2025)"
    url: "https://www.plakar.io/posts/2025-02-28/audit-of-plakar-cryptography/"
---
