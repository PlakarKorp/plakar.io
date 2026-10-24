---
title: "Plakar vs Veeam"
slug: "veeam"
description:
  "Plakar Control Plane compared with Veeam Backup & Replication 13.1: open
  engine and open format against a platform that covers 14 hypervisors. Dated
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
verified: "2026-10-23"
verdict:
  "Veeam covers 14 hypervisors and has mature restore tooling. Plakar Control
  Plane gives you an open engine, an open data format you can read without the
  vendor, and policies as code. Pick Veeam for breadth on VMware and Hyper-V
  estates. Pick Plakar when you want to own your backups, automate them from
  Git, and protect OpenStack, Proxmox and KubeVirt as first-class sources."
highlights:
  - title: "Open engine, open format"
    text:
      "Plakar and its engine (Kloset) are ISC licensed. Open source Plakar reads
      and restores every store Control Plane writes. Veeam backups live in the
      proprietary VBK format. Without a Veeam server you restore them with
      Veeam's own closed extract utility."
  - title: "Policies as code"
    text:
      "Plakar ships a Terraform provider, an Ansible collection and a Kubernetes
      Operator with CRDs. Veeam has a REST API and PowerShell, but no official
      Terraform provider and no declarative policy model in Backup &
      Replication. Kasten, a separate product, keeps its policies as Kubernetes
      custom resources."
  - title: "OpenStack, Proxmox and KubeVirt as native sources"
    text:
      "Plakar backs up OpenStack Nova and Cinder, Proxmox VE and KubeVirt VMs
      through its own connectors. Veeam does not support OpenStack. Inside
      Backup & Replication, KubeVirt is covered only by an OpenShift
      Virtualization plug-in. Kasten, a separate product, covers Kubernetes and
      KubeVirt VMs."
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
              "Plakar, its Kloset engine and the Edge agent are ISC. Control
              Plane and Operator are closed, but write standard Kloset stores
              open source Plakar can restore.",
          }
        competitor:
          {
            status: "no",
            note:
              "Proprietary VBK/VIB/VBM. The free extract utility restores
              without a Veeam server, but it is Veeam's own closed tool.
              Fox-IT's open source dissect.archive parses unencrypted full VBK
              files.",
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
              "Community Edition protects 10 workloads, sends telemetry,
              best-effort support only.",
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
              "Inline dedup within each backup file, which in v13 means per
              machine. Cross-machine dedup relies on the storage (a dedup
              appliance or Windows Server Data Deduplication).",
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
              "Org-scoped RBAC with 20 roles, enforceable TOTP 2FA, audit log,
              webhooks to SIEM. No SSO or SAML yet.",
          }
        competitor:
          {
            status: "yes",
            note:
              "RBAC, MFA (optional on the appliance since 13.1), SAML SSO,
              four-eyes authorization, syslog forwarding.",
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
              "Inline entropy and IoC scanning. YARA on Advanced and Premium,
              Recon Scanner on Premium.",
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
              "Kasten is a separate product licensed per node and also protects
              KubeVirt VMs. The 13.1 KubeVirt plug-in covers OpenShift
              Virtualization only.",
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
              "Plug-ins for SQL Server, Oracle RMAN, SAP HANA, SAP on Oracle,
              SAP MaxDB and Db2, plus MongoDB backup policies. PostgreSQL (with
              WAL logs) through application-aware image or agent backups. MySQL
              through application-aware Linux agent backups.",
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
              "Notion (beta) and IMAP mailboxes. Microsoft 365 coming soon. The
              Google Drive, OneDrive, Dropbox and iCloud connectors are in
              Plakar Community. No SharePoint or Salesforce connector.",
          }
        competitor:
          {
            status: "partial",
            note:
              "Sold as separate per-user products (Veeam Backup for Microsoft
              365, Veeam Data Cloud for Microsoft 365).",
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
              Terraform provider. No declarative policy model in Backup &
              Replication (Kasten, a separate product, uses Kubernetes custom
              resources).",
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
      specification. An independent forensic parser (Fox-IT dissect.archive)
      reads VBK files, but not encrypted or incremental ones. Veeam''s extract
      utility restores without a backup server, but it is closed Veeam software,
      needs a Veeam account to download separately, and on a scale-out
      repository needs full and incremental files on the same extent. When Veeam
      says "zero vendor lock-in" it means you can restore a VM to another
      hypervisor, not that the backup format is open.'
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
      In 13.1 Veeam "continues progress toward full REST API coverage". There is
      no official Terraform provider (the registry namespace is empty), and
      Backup & Replication has no way to declare a backup policy as a file that
      a pipeline applies. Kasten, a separate product for Kubernetes, keeps its
      policies as custom resources.'
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
      forum point to an agent-only workaround. Inside Backup & Replication,
      KubeVirt is supported only on OpenShift Virtualization, through a plug-in
      released in September 2026. Kasten, a separate product licensed per worker
      node, covers full Kubernetes and also protects KubeVirt VMs."
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
      four-eyes authorization are built in, as are SAML SSO, Entra ID backup and
      AD Forest Recovery. For Hyper-V, Nutanix AHV, Oracle, SAP HANA and
      Microsoft 365, Veeam has coverage Plakar does not."
    plakar_text:
      "Control Plane verifies snapshots with scheduled check tasks but does not
      boot them. There is no anomaly detection and no SSO yet. Hyper-V, Nutanix,
      Oracle and SAP are not covered, and Microsoft 365 is coming soon. If those
      are must-haves, Veeam is the safer choice today."
choose_competitor:
  - "Your estate is mostly VMware, Hyper-V or Nutanix AHV and you need
    any-to-any instant recovery across them."
  - "You need automated restore testing that boots VMs (SureBackup) and inline
    malware scanning out of the box."
  - "You back up Oracle, SAP HANA or Db2 and want vendor-supported plug-ins, or
    Microsoft 365 mailboxes with Veeam Backup for Microsoft 365."
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
      SAP plug-ins, or Microsoft 365 backup, Veeam still covers more."
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
      chunking. Veeam deduplicates within each machine's backup chain, not
      globally, and recommends 4 MB blocks for large files, which gives the
      lowest ratio. Neither vendor publishes a certified ratio, so test on your
      own data."
  - q: "Does Plakar have ransomware detection like Veeam?"
    a:
      "No. Plakar snapshots are content-addressed and tamper-evident, and
      immutability comes from object lock on the storage backend. Veeam adds
      inline entropy scanning, YARA rules on Advanced and Premium, and a Recon
      Scanner on Premium."
sources:
  - label: "Veeam Backup & Replication 13.1 release notes"
    url: "https://helpcenter.veeam.com/rn/veeam_backup_13_1_release_notes.html"
  - label: "Veeam Data Platform 13.1 press release (14 hypervisors)"
    url: "https://www.veeam.com/company/press-release/veeam-data-platform-v13-1-now-available-helping-organizations-recover-clean-and-fast-from-cyber-disruption.html"
  - label: "Veeam hypervisor protection, What's New in 13.1"
    url: "https://helpcenter.veeam.com/docs/vbr/wn/hypervisor_protection.html"
  - label: "Veeam security, What's New in 13.1 (post-quantum key exchange)"
    url: "https://helpcenter.veeam.com/docs/vbr/wn/security.html"
  - label: "Veeam backup repositories, What's New in 13.1 (immutability)"
    url: "https://helpcenter.veeam.com/docs/vbr/wn/backup_repositories.html"
  - label: "Veeam identity protection, What's New in 13.1 (AD Forest Recovery)"
    url: "https://helpcenter.veeam.com/docs/vbr/wn/identity_protection.html"
  - label: "Veeam appliances, What's New in 13.1 (optional MFA)"
    url: "https://helpcenter.veeam.com/docs/vbr/wn/veeam_software_appliance_and_veeam_infrastructure_appliance.html"
  - label: "Veeam application protection, What's New in 13.1"
    url: "https://helpcenter.veeam.com/docs/vbr/wn/enterprise_application_and_database_protection.html"
  - label: "Veeam PostgreSQL WAL settings"
    url: "https://helpcenter.veeam.com/docs/vbr/userguide/vm_copy_vss_postgresql_vm.html"
  - label: "Veeam Agent MySQL processing settings"
    url: "https://helpcenter.veeam.com/docs/vbr/userguide/agent_job_guest_mysql.html"
  - label: "Veeam compression and deduplication guide"
    url: "https://helpcenter.veeam.com/docs/vbr/userguide/compression_deduplication.html?ver=13"
  - label: "Veeam backup chain formats (per-machine dedup)"
    url: "https://helpcenter.veeam.com/docs/vbr/userguide/per_vm_backup_files.html"
  - label: "Veeam backup repository requirements (Windows Data Deduplication)"
    url: "https://helpcenter.veeam.com/docs/vbr/userguide/system_requirements_backup_repo.html"
  - label: "Veeam KMS requirements (Advanced or Premium)"
    url: "https://helpcenter.veeam.com/docs/vbr/userguide/kms_requirements.html"
  - label: "Veeam extract utility documentation"
    url: "https://helpcenter.veeam.com/docs/vbr/userguide/extract_utility.html"
  - label: "Fox-IT dissect.archive VBK parser"
    url: "https://github.com/fox-it/dissect.archive/blob/main/dissect/archive/vbk.py"
  - label: "Veeam SureBackup, how it works"
    url: "https://helpcenter.veeam.com/docs/vbr/userguide/surebackup_hiw.html"
  - label: "Veeam REST API, What's New in 13.1"
    url: "https://helpcenter.veeam.com/docs/vbr/wn/rest_api.html"
  - label: "Veeam licensing policy"
    url: "https://www.veeam.com/legal/licensing-policy.html"
  - label: "Veeam Backup & Replication Community Edition"
    url: "https://www.veeam.com/products/free/backup-recovery.html"
  - label: "Veeam Plug-in for KubeVirt limitations"
    url: "https://helpcenter.veeam.com/docs/vbr/userguide/vkp_limitations.html"
  - label: "Veeam Plug-in for KubeVirt build numbers (KB4914)"
    url: "https://www.veeam.com/kb4914"
  - label: "Veeam Kasten KubeVirt VM protection"
    url: "https://docs.kasten.io/latest/usage/vm_protection/"
  - label: "Veeam Kasten Policy custom resource"
    url: "https://docs.kasten.io/latest/api/policies/"
  - label: "Veeam forum thread on OpenStack backup"
    url: "https://forums.veeam.com/rhv-olvm-sc-hypercore-xcp-ng-hpe-vme-f62/openstack-backup-t80794.html"
  - label: "Terraform registry, Veeam namespace"
    url: "https://registry.terraform.io/v2/providers?filter[namespace]=veeam"
  - label: "Plakar integrations list"
    url: "https://www.plakar.io/integrations/"
  - label: "Plakar Terraform provider"
    url: "https://registry.terraform.io/providers/plakarkorp/plakar/latest"
  - label: "Plakar engine cryptographic audit (2025)"
    url: "https://www.plakar.io/posts/2025-02-28/audit-of-plakar-cryptography/"
---
