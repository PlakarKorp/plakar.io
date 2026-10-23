---
title: "Plakar vs Commvault"
slug: "commvault"
description:
  "Plakar vs Commvault: Plakar Control Plane against Commvault Cloud 11.46. One
  open appliance versus a very wide workload matrix. Dated sources, honest
  verdicts."
summary:
  "Commvault covers a very wide workload matrix, while Plakar is one self-hosted
  appliance with an open format and policies as code."
track: "enterprise"
plakar_product: "Plakar Control Plane"
plakar_version: "Control Plane 1.1.5, Plakar 1.1.8"
competitor: "Commvault Cloud"
competitor_short: "Commvault"
competitor_version: "11.46 (Innovation Release) and Commvault Cloud SaaS"
verified: "2026-10-23"
verdict:
  "Commvault protects a very wide range of workloads and ships a full cyber
  recovery stack: Air Gap Protect, Threat Scan and Cleanroom Recovery. Plakar
  Control Plane is one self-hosted appliance with an open engine, an open data
  format you can read without the vendor, encryption on by default and policies
  as code. Pick Commvault when you need one console for dozens of databases,
  SaaS apps and tape. Pick Plakar when you want a small footprint, backups you
  own, and automation from Git."
highlights:
  - title: "Open engine, open format"
    text:
      "Plakar and its engine (Kloset) are ISC licensed. Open source Plakar reads
      and restores every store Control Plane writes. Commvault writes
      proprietary chunks that need the CommServe database to restore, and
      publishes no export tool."
  - title: "One appliance, encrypted by default"
    text:
      "Control Plane is a single virtual appliance plus optional Edges.
      Commvault needs a CommServe with SQL Server, MediaAgents with a
      Deduplication Database on fast disk, and access nodes. Its own docs say
      DDB and DR backups are not encrypted."
  - title: "Policies as code"
    text:
      "Plakar ships a Terraform provider, an Ansible collection and a Kubernetes
      Operator with CRDs. Commvault also has an official Terraform provider, an
      Ansible collection and a REST API, but no Kubernetes operator."
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
              "CommServe, MediaAgents and access nodes you run, or SaaS run by
              Commvault, with data in Commvault-managed Air Gap Protect storage
              or your own cloud storage.",
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
              "Proprietary chunk format that needs CommServe metadata to
              restore. Public repos are SDKs and wrappers, not the product.",
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
            status: "no",
            note:
              "No free edition. Licensed per front-end terabyte, VM pack,
              instance or user, by quote or SaaS subscription.",
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
              "Block-level global dedup across storage policies, source-side or
              on the MediaAgent, tracked in a Deduplication Database (DDB).",
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
              "FIPS 140-3 software encryption. Keys live in the CommServe
              database, optionally wrapped by a KMIP server, AWS KMS or Azure
              Key Vault. DDB and DR backups are not encrypted.",
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
              "WORM storage lock, S3 Object Lock (governance mode since July
              2026), Air Gap Protect with compliance lock on by default.",
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
              "RBAC, 2FA, SAML SSO, Multi-Person Authorization, Audit Trail
              Report, Security Assessment Report.",
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
              "Threat Scan (anomaly detection, YARA and hash IOC scanning, scan
              on restore) for VMs, files and objects, in software and SaaS,
              licensed separately. Cleanroom Recovery for clean restores.",
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
              "VMware, Hyper-V, Nutanix AHV, Proxmox VE (CBT since October
              2026), OpenStack, XenServer, OLVM, HPE VME and the major clouds.",
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
            status: "yes",
            note:
              "Kubernetes 1.20 to 1.36 and OpenShift Virtualization. No operator
              or CRDs for backup policy (only CvTask hook CRDs). Needs an access
              node, and for KubeVirt a RHEL VM inside the cluster.",
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
              "SQL Server, PostgreSQL, MySQL, MongoDB, Oracle, SAP HANA, Db2,
              Sybase, Snowflake, Databricks and more.",
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
              "Windows file system agent with VSS, Active Directory and Okta
              identity resilience.",
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
            status: "yes",
            note:
              "Microsoft 365, Google Workspace, Salesforce, Dynamics 365,
              GitHub, Confluence, Okta. Jira in early adopter. monday.com
              through a downloadable connector to Unified Data Vault.",
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
              "S3 and compatibles, Azure Blob, GCS, OCI, Alibaba OSS, disk and
              NAS libraries, tape, Air Gap Protect managed storage.",
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
            status: "yes",
            note:
              "Official partner Terraform provider (plans, storage, hypervisors,
              VM groups, Kubernetes, users and roles), Ansible, REST API, Python
              and PowerShell SDKs, QCommand XML command line. No Kubernetes
              operator.",
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
              "Live Mount for VMware and Hyper-V, cross-hypervisor conversion
              with Proxmox VE as a destination, file and full restores for every
              workload.",
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
              "Auto Recovery and Cleanroom Recovery for orchestrated DR tests.
              Daily DDB verification checks that stored blocks are valid for
              restore, but is off by default for cloud libraries.",
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
              "Browse and restore single files from the console for every
              workload, Live Mount VMs straight from backup.",
          }
sections_intro:
  "Checkmarks hide architecture. These four points decide most Commvault versus
  Plakar evaluations."
sections:
  - heading: "Who can read your backups in ten years"
    competitor_text:
      "Commvault writes backup data as proprietary chunks. To restore them you
      need the CommServe metadata database and a running Commvault install.
      Restores still work after a license expires. There is no published format,
      no third-party reader and no export tool. Media Explorer, the old
      standalone reader, is now limited to recovering the CommServe DR backup.
      The docs cover importing other vendors' archives into Commvault, not the
      other way round. Your exit path is to keep a CommServe and MediaAgents
      running for as long as you may need restores, or to restore everything out
      before you decommission."
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
  - heading: "One appliance, encrypted by default"
    competitor_text:
      "A self-managed Commvault estate is a tier of servers: a CommServe on SQL
      Server for the catalog, one or more MediaAgents with the Deduplication
      Database on fast dedicated disk, and access nodes per workload type.
      Protecting KubeVirt VMs alone needs a RHEL VM access node with 8 vCPU and
      16 GB. Encryption keys are stored in the CommServe database, optionally
      wrapped by a KMIP server, AWS KMS or Azure Key Vault. Commvault's own
      documentation states that DDB backups and DR backups are not encrypted."
    plakar_text:
      "Control Plane is one virtual appliance (AMI, OVA, qcow2, ISO) that you
      run in your own infrastructure. Optional Edges run tasks near the
      workloads and need no inbound access or internet. Encryption is on by
      default for every store, with AES-256-GCM-SIV and Argon2id, and the
      passphrase never leaves you. The storage backend and plakar.io only ever
      see ciphertext."
    bullets:
      - "Appliance images for AWS, OVHcloud, Scaleway, Exoscale, GCP, Proxmox,
        vSphere and Kubernetes"
      - "Edges are open source (ISC) and poll Control Plane, so no inbound
        firewall rules"
      - "Credentials can live in Vault, AWS Secrets Manager, GCP, OVHcloud or
        Scaleway secret stores"
  - heading: "Policies in Git"
    competitor_text:
      "Commvault plans and storage can be built in the Command Center or from
      code. The command line is QCommands and XML files you save from the
      console, then replay. There are a REST API, a Python SDK (cvpysdk), a
      PowerShell SDK and an Ansible collection. The official Terraform provider
      (Commvault/commvault on the registry, partner tier) manages server plans,
      storage, hypervisors, VM groups, Kubernetes app groups, users and roles.
      There is no Kubernetes operator, and no CRDs for backup policy."
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
  - heading: "Where Commvault is ahead today"
    competitor_text:
      "Commvault covers a very wide range of workloads from one console:
      Hyper-V, Nutanix AHV, XenServer, Oracle, SAP HANA, Db2, Snowflake,
      Microsoft 365, Google Workspace, Salesforce and tape. The cyber recovery
      stack is complete: Air Gap Protect managed storage, Threat Scan for
      malware and anomalies, Cleanroom Recovery for isolated DR tests, Active
      Directory and Okta recovery. Releases follow a monthly Innovation cadence
      plus a long-term support track. SAML SSO and Multi-Person Authorization
      are mature."
    plakar_text:
      "Control Plane verifies snapshots with scheduled check tasks but does not
      boot them in a clean room. There is no anomaly detection and no SSO yet.
      Hyper-V, Nutanix, Oracle, SAP and tape are not covered, and Microsoft 365
      is coming soon. If those are must-haves, Commvault is the safer choice
      today."
choose_competitor:
  - "You need one console for a very wide estate: Hyper-V, Nutanix, Oracle, SAP
    HANA, Db2, Snowflake and tape."
  - "You back up Microsoft 365, Google Workspace, Salesforce or Dynamics 365 and
    want vendor-supported connectors."
  - "You want managed air-gapped storage, malware scanning on restore and
    clean-room DR tests from the same vendor."
  - "You need SAML SSO and multi-person authorization on day one."
  - "You already run Commvault and your team knows the Command Center."
choose_plakar:
  - "You want to read and restore your backups without a vendor licence, now and
    in ten years."
  - "You want one appliance and optional Edges instead of a CommServe,
    MediaAgents and access nodes."
  - "You manage infrastructure as code and want backup policies in Git, applied
    by Terraform, Ansible or an Operator."
  - "You want encryption on by default for everything, with keys the storage
    provider and the backup vendor never see."
  - "You run OpenStack, Proxmox or KubeVirt and want a self-hosted control plane
    with a free tier and an open source engine."
faq:
  - q: "Is Plakar a replacement for Commvault?"
    a:
      "For VMware, Proxmox, OpenStack, Kubernetes, Linux, Windows, mainstream
      databases and cloud storage estates, yes. For Hyper-V, Nutanix, Oracle,
      SAP HANA, Microsoft 365 or tape, Commvault still covers more."
  - q: "Can I restore Plakar backups without Plakar Control Plane?"
    a:
      "Yes. Control Plane writes standard Kloset stores. The open source Plakar
      lists, verifies and restores every snapshot without any licence."
  - q: "Can I read Commvault backups without Commvault?"
    a:
      "No. The data is stored as proprietary chunks that need the CommServe
      database to restore, and Commvault publishes no export tool or format
      specification. Media Explorer is now limited to recovering the CommServe
      DR backup."
  - q: "Does Commvault have a Terraform provider?"
    a:
      "Yes. Commvault/commvault on the Terraform Registry is an official partner
      provider. It manages server plans, storage, hypervisors, VM groups,
      Kubernetes app groups, users and roles. Plakar has a provider that manages
      stores, connectors, schedules, inventories, organizations and roles."
  - q: "Are Commvault backups encrypted?"
    a:
      "Backup data can be encrypted with a FIPS 140-3 library, and keys are
      stored in the CommServe database, optionally wrapped by a KMIP server, AWS
      KMS or Azure Key Vault. Commvault's documentation states that
      Deduplication Database backups and DR backups are not encrypted. Plakar
      encrypts every store by default and never stores the passphrase."
  - q: "Does Plakar support Hyper-V or Microsoft 365?"
    a:
      "Not Hyper-V, and Microsoft 365 is coming soon. Plakar Control Plane
      supports VMware vSphere, Proxmox VE, OpenStack and KubeVirt as
      hypervisors, and Notion (beta) and IMAP mailboxes as SaaS sources.
      Commvault covers both today."
sources:
  - label: "Commvault 11.46 Innovation Release, new features newsletter"
    url: "https://documentation.commvault.com/11.46/software/newsletter_for_new_features_in_innovation_release_11_46.html"
  - label: "Commvault, encrypting backup data"
    url: "https://documentation.commvault.com/11.46/commcell-console/encrypting_backup_data_01.html"
  - label: "Commvault, third-party key management support"
    url: "https://documentation.commvault.com/11.46/software/third_party_key_management_support.html"
  - label: "Commvault, optimize storage space using deduplication"
    url: "https://documentation.commvault.com/11.46/commcell-console/optimize_storage_space_using_deduplication.html"
  - label: "Commvault, command line for scripting and automation"
    url: "https://documentation.commvault.com/11.46/commcell-console/command_line_for_scripting_and_automation.html"
  - label:
      "Commvault GitHub organization (cvpysdk, Terraform provider, Ansible)"
    url: "https://github.com/Commvault"
  - label: "Commvault Terraform provider on the Terraform Registry"
    url: "https://registry.terraform.io/providers/Commvault/commvault/latest"
  - label: "Commvault, virtualized platform support"
    url: "https://documentation.commvault.com/11.46/software/virtualized_platform_support.html"
  - label: "Commvault, support for Kubernetes and KubeVirt protection"
    url: "https://documentation.commvault.com/11.46/software/support_and_requirements_for_virtual_machines_and_containers_protection.html"
  - label: "Commvault, application-consistent Kubernetes backups with CvTasks"
    url: "https://documentation.commvault.com/11.46/software/application_consistent_backups_for_kubernetes_using_cvtasks.html"
  - label: "Commvault, verification of deduplicated data"
    url: "https://documentation.commvault.com/11.46/commcell-console/verification_of_deduplicated_data.html"
  - label: "Commvault, Threat Scan"
    url: "https://documentation.commvault.com/11.46/software/threat_scan.html"
  - label: "Commvault SaaS, Threat Detection and Response supported workloads"
    url: "https://documentation.commvault.com/saas/supported_workloads.html"
  - label: "Commvault SaaS, Threat Scan requirements"
    url: "https://documentation.commvault.com/saas/commvault_threat_scan_requirements.html"
  - label: "Commvault, Air Gap Protect"
    url: "https://documentation.commvault.com/11.46/software/air_gap_protect_secure_air_gapped_cloud_storage_for_backups.html"
  - label: "Commvault, Air Gap for Grid"
    url: "https://documentation.commvault.com/11.46/software/air_gap_for_grid.html"
  - label: "Commvault Cloud, data center regions"
    url: "https://documentation.commvault.com/saas/commvault_cloud_data_center_regions.html"
  - label: "Commvault SaaS, Early Adopter program"
    url: "https://documentation.commvault.com/saas/early_adopter_program.html"
  - label: "Commvault, backing up monday.com to Unified Data Vault"
    url: "https://documentation.commvault.com/11.46/software/backing_up_monday_com_to_unified_data_vault.html"
  - label: "Commvault community, import and export backups"
    url: "https://community.commvault.com/self-hosted-q-a-2/import-export-backups-6553"
  - label: "Commvault, retrieving DR backups using Media Explorer"
    url: "https://documentation.commvault.com/11.46/commcell-console/retrieving_disaster_recovery_dr_backups_from_tape_or_disk_storage_using_media_explorer.html"
  - label: "Commvault, supported vendors for third-party data import"
    url: "https://documentation.commvault.com/11.46/software/supported_vendors_for_third_party_data_import.html"
  - label: "Commvault, what happens when a license expires"
    url: "https://documentation.commvault.com/11.46/commcell-console/faq_what_happens_when_license_expires.html"
  - label: "Commvault release types and release tracks"
    url: "https://documentation.commvault.com/11.46/software/commvault_software_releases_release_types_and_release_tracks.html"
  - label: "Plakar integrations list"
    url: "https://www.plakar.io/integrations/"
---
