---
title: "Plakar vs Cohesity"
slug: "cohesity"
description:
  "Plakar vs Cohesity Data Cloud (DataProtect 7.4.1): self-hosted control plane
  and open format against scale-out global dedup and a SaaS console. Dated
  sources."
summary:
  "Cohesity suits large mixed estates, while Plakar keeps the control plane in
  your infrastructure and writes an open format."
track: "enterprise"
plakar_product: "Plakar Control Plane"
plakar_version: "Control Plane 1.1.5, Plakar 1.1.8"
competitor: "Cohesity Data Cloud"
competitor_short: "Cohesity"
competitor_version: "DataProtect 7.4.1 (NetBackup 11.2 noted)"
verified: "2026-10-21"
verdict:
  "Cohesity has global deduplication across a scale-out cluster, the widest SaaS
  and cloud database coverage, clean-room recovery and the NetBackup install
  base. Plakar Control Plane keeps the whole control plane in your
  infrastructure, writes an open format open source Plakar can restore, and
  protects Kubernetes, Proxmox and OpenStack with its own connectors. Pick
  Cohesity for large mixed estates with Microsoft 365, Oracle or SAP HANA. Pick
  Plakar when the management console must stay on your side, when you want to
  read your backups without the vendor, and when you run Kubernetes, Proxmox or
  OpenStack."
highlights:
  - title: "The control plane stays in your infrastructure"
    text:
      "Plakar Control Plane is a virtual appliance you run yourself. Only
      licence metrics go to plakar.io. Cohesity clusters run on your site, but
      the Helios management console and the SaaS service are hosted by Cohesity
      in the US."
  - title: "Open engine, open format"
    text:
      "Plakar and its engine (Kloset) are ISC licensed. Open source Plakar reads
      and restores every store Control Plane writes. Cohesity SpanFS backups are
      proprietary, with no export tool and no third-party reader."
  - title: "Kubernetes, Proxmox and OpenStack as native sources"
    text:
      "Plakar has its own Kubernetes connector plus an Operator with CRDs, and
      native Proxmox VE and OpenStack connectors. Cohesity DataProtect uses
      Velero and a Datamover pod with cluster-admin rights, has no native
      Proxmox integration, and delivers OpenStack through partners."
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
            status: "partial",
            note:
              "Clusters run on your site or in your cloud, but the Helios
              console and the SaaS service are hosted by Cohesity in the US.",
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
              "Proprietary SpanFS format. No export tool and no third-party
              reader. Only the automation tooling on GitHub is open.",
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
              "No free edition documented. Commercial EULA, and the release
              notes say some features may need a separate licence.",
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
              "SpanFS global inline variable-length dedup and compression across
              the whole cluster. No ratio published.",
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
              "AES-256 in flight and at rest, internal or external KMS. In the
              SaaS service keys can be Cohesity-managed or customer-managed.",
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
              "Immutable snapshots, DataLock (WORM) and the FortKnox vault with
              an air-gap toggle. NetBackup adds object-lock WORM on MSDP.",
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
              "RBAC, MFA, SAML SSO, quorum approval for admin changes, audit
              logs, FIPS 140-3 modules in 7.4.1.",
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
              "ML anomaly detection, IOC and YARA threat scanning, DSPM, and
              clean-room recovery through RecoveryAgent.",
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
            status: "partial",
            note:
              "VMware, Nutanix AHV, Hyper-V, OpenShift Virtualization. No native
              Proxmox; OpenStack through Trilio (DataProtect) or Storware
              (NetBackup).",
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
              "Velero plus a Datamover pod with a cluster-admin token. No
              Cohesity operator or CRDs. NetBackup has a Helm operator with
              KubeVirt.",
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
              "SQL Server, Oracle, SAP HANA, MongoDB, Cassandra, PostgreSQL,
              plus cloud-managed databases on AWS, Azure and GCP.",
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
              "Windows, Linux and AIX agents with VSS. Entra ID and Okta
              protected as SaaS sources.",
          }
      - capability: "SaaS apps and cloud drives"
        plakar:
          {
            status: "partial",
            note:
              "IMAP mailboxes only. The Google Drive, OneDrive, Dropbox, iCloud
              and Notion connectors are in Plakar Community, not Control Plane.
              No Microsoft 365, SharePoint or Salesforce connector.",
          }
        competitor:
          {
            status: "yes",
            note:
              "Microsoft 365, Google Workspace, Slack, Salesforce, Okta and
              Entra ID, delivered as a SaaS service.",
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
              "External targets to S3 and compatibles, Azure Blob, GCS and NAS.
              Tape through QStar or PoINT gateways; native tape in NetBackup.",
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
              "REST v1 and v2, iris_cli, Ansible, PowerShell. Terraform provider
              has 13 resources and no release since May 2025. Policies live in
              the UI.",
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
              "Instant recovery and volume mount on VMware, AHV and OpenShift
              Virt, Test and Dev clones, PITR for databases.",
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
            status: "partial",
            note:
              "RecoveryAgent blueprints and clean rooms, threat scans of
              recovery points. No documented scheduled restore test outside
              RecoveryAgent.",
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
              "File-level and item-level recovery, instant volume mount,
              SmartFiles views readable over NFS, SMB and S3.",
          }
sections_intro:
  "Checkmarks hide architecture. These four points decide most Cohesity versus
  Plakar evaluations."
sections:
  - heading: "Where the control plane lives"
    competitor_text:
      "Cohesity clusters run on certified appliances, as virtual machines or in
      your cloud account. Management goes through Helios, a SaaS console. The
      Cloud Protection Service and its portal are hosted by Cohesity in the US.
      Multi-cluster management depends on Helios. If your data must be managed
      from inside your own network, you need to check this with your compliance
      team."
    plakar_text:
      "Plakar Control Plane is a virtual appliance (AMI, OVA, qcow2, ISO) that
      runs in your data center or your cloud account. Enrollment sends only
      licence and consumption metrics to plakar.io. Optional Edges run tasks
      near the workloads and do not need internet access. Data residency can be
      set by country per organization."
    bullets:
      - "Control Plane runs on AWS, OVHcloud, Scaleway, Exoscale, GCP, Proxmox,
        vSphere or Kubernetes"
      - "Edges (open source, ISC) poll Control Plane and run jobs close to the
        data"
      - "Residency and legal hold are set per organization"
  - heading: "Who can read your backups in ten years"
    competitor_text:
      "Cohesity backups live in SpanFS, a proprietary file system. There is no
      public specification, no export tool and no third-party reader. The exit
      path is to restore everything to primary storage. SmartFiles views are
      readable over NFS, SMB and S3, but DataProtect backups are not. NetBackup
      images are also proprietary, and the NetBackup agreement grants 12 months
      of restore-only use after a subscription ends."
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
  - heading: "Kubernetes, Proxmox and OpenStack"
    competitor_text:
      "DataProtect protects Kubernetes with Velero and a Cohesity Datamover pod.
      It needs a cluster-admin token and backs up at namespace level. There is
      no Cohesity operator and no Cohesity CRDs; the CRDs underneath are
      Velero's. NetBackup is different: it has a Helm-installed operator with
      KubeVirt and OpenShift Virtualization support. For Proxmox VE, the only
      documented options are an NFS target or a Remote Adapter script. OpenStack
      is delivered through Trilio on DataProtect and Storware on NetBackup."
    plakar_text:
      "Plakar has its own connectors for Kubernetes (resources, CSI snapshots,
      PVCs, KubeVirt VMs, namespace remapping, mTLS), Proxmox VE and OpenStack
      (Nova instances, Cinder volumes, Swift, Glance, Trove). They run with open
      source Plakar and with Control Plane. The Operator adds CRDs for
      cluster-native scheduling."
    bullets:
      - "Operator CRDs: Source, Store, Destination, ScheduleBackup,
        ScheduleSync, ScheduleCheck, Restore"
      - "Kubernetes connector 1.1.11 with KubeVirt VMs, namespace remapping and
        mTLS"
      - "OpenStack connector 1.1.1 released October 2026, Proxmox connector
        built with a partner on top of vzdump"
  - heading: "Where Cohesity is ahead today"
    competitor_text:
      "SpanFS deduplicates across the whole cluster, not per store. Microsoft
      365, Google Workspace, Slack, Salesforce and cloud-managed databases on
      AWS, Azure and GCP are covered as SaaS sources. Oracle, SAP HANA and
      Cassandra have agents. RecoveryAgent gives clean-room recovery with threat
      scans, and ML anomaly detection, YARA scanning and FortKnox are built in.
      SAML SSO, quorum approval and FIPS 140-3 modules are mature. NetBackup
      brings the largest install base in the market, native tape, and a
      Kubernetes operator with KubeVirt."
    plakar_text:
      "Control Plane deduplicates within a store, not across stores. There is no
      anomaly detection, no clean room and no SSO yet. Microsoft 365 mailboxes,
      Oracle, SAP HANA, Hyper-V, Nutanix AHV and tape are not covered. If those
      are must-haves, Cohesity is the safer choice today."
choose_competitor:
  - "You run a large mixed estate with Microsoft 365, Google Workspace, Oracle
    or SAP HANA and want one vendor for all of it."
  - "You want global deduplication across a scale-out cluster and instant
    recovery of many VMs at once."
  - "You need clean-room recovery, anomaly detection and threat scanning built
    into the backup platform."
  - "You already run NetBackup and want to keep it, with Helios as a single
    console for NetBackup and DataProtect."
  - "You need native tape, Hyper-V or Nutanix AHV."
choose_plakar:
  - "Your management console must stay in your own infrastructure, with no SaaS
    dependency and no data flowing to a US-hosted portal."
  - "You want to read and restore your backups without a vendor licence, now and
    in ten years."
  - "You run Kubernetes, Proxmox or OpenStack and want them as native sources,
    with an Operator and CRDs instead of Velero and cluster-admin tokens."
  - "You manage infrastructure as code and want backup policies in Git, applied
    by Terraform, Ansible or an Operator."
  - "You want end-to-end encryption where the storage provider and the backup
    admin never see plaintext."
faq:
  - q: "Is Plakar a replacement for Cohesity?"
    a:
      "For Kubernetes, Proxmox, OpenStack, Linux, VMware and cloud storage
      estates, yes. For estates that depend on Microsoft 365 backup, Oracle or
      SAP HANA agents, clean-room recovery or native tape, Cohesity still covers
      more. Teams can run both during a migration because Plakar stores are
      independent of the Cohesity cluster."
  - q: "Can I restore Plakar backups without Plakar Control Plane?"
    a:
      "Yes. Control Plane writes standard Kloset stores. The open source Plakar
      lists, verifies and restores every snapshot without any licence."
  - q: "Does Cohesity have a Terraform provider?"
    a:
      "Yes, cohesity/cohesity on the registry, version 2.1.3 with 13 resources,
      with no release since May 2025. Cohesity marks its GitHub tooling as
      community-contributed or best-effort and not covered by Cohesity Support.
      Plakar has an official provider, an Ansible collection and a Kubernetes
      Operator."
  - q: "Does Cohesity support Proxmox VE and OpenStack?"
    a:
      "Not natively in DataProtect as of 7.4.1. Proxmox is covered as an NFS
      target or through a Remote Adapter script. OpenStack is delivered through
      Trilio on DataProtect and Storware on NetBackup. Plakar has its own
      Proxmox and OpenStack connectors."
  - q: "How does Kubernetes protection compare?"
    a:
      "Cohesity DataProtect uses Velero plus a Cohesity Datamover pod and needs
      a cluster-admin token. There is no Cohesity operator or CRDs. NetBackup
      has a Helm operator with KubeVirt support. Plakar has a native connector
      with CSI snapshots, PVCs and KubeVirt VMs, plus an Operator with CRDs for
      Source, Store, Destination and scheduled tasks."
  - q: "How does deduplication compare?"
    a:
      "Cohesity SpanFS deduplicates globally across the cluster with
      variable-length chunks. Plakar deduplicates across everything in a store
      using content-defined chunking, not across stores. Neither vendor
      publishes a certified ratio, so test on your own data."
sources:
  - label: "Cohesity Platform 7.4.1 release notes (2026-07-27)"
    url: "https://mirror.vcu.edu/pub/cohesity/docs/Cohesity%20Release%20Notes%20v7.4.1.pdf"
  - label:
      "Cohesity Cloud Protection Services FAQ (Helios, hosting, global dedup,
      keys)"
    url: "https://www.cohesity.com/platform/cloud-protection-services/faq-cloud-protection-services/"
  - label: "Cohesity DataProtect workloads page"
    url: "https://www.cohesity.com/platform/dataprotect/"
  - label:
      "Cohesity DataProtect Kubernetes requirements (cluster-admin, Datamover)"
    url: "https://docs.cohesity.com/baas/data-protect/kubernetes-requirements.htm"
  - label: "Cohesity DataProtect Kubernetes Velero upgrade guide"
    url: "https://docs.cohesity.com/baas/data-protect/kubernetes-upgradevelero.htm"
  - label: "Cohesity blog on OpenShift Virtualization and Proxmox VE (2024)"
    url: "https://www.cohesity.com/blogs/cohesity-data-cloud-now-protects-red-hat-openshift-virtualization-and-proxmox-ve-workloads/"
  - label: "Cohesity OpenStack solution brief (Trilio)"
    url: "https://www.cohesity.com/resource-assets/solution-brief/protect-your-openstack-data-while-optimizing-cost-and-resiliency-solution-brief-en.pdf"
  - label: "Terraform registry, cohesity/cohesity provider"
    url: "https://registry.terraform.io/providers/Cohesity/cohesity/latest"
  - label: "Cohesity GitHub organization (tooling support status)"
    url: "https://github.com/cohesity"
  - label: "NetBackup subscription agreement, April 2026 (section 3.1)"
    url: "https://www.cohesity.com/content/dam/cohesity/resource-assets/agreements-archive/netbackup-april-2026.pdf"
  - label: "NetBackup 11.2 Kubernetes operator documentation"
    url: "https://docs.cohesity.com/docs/netbackup/11.2/150157643-172472261-0/v148896515-172472261"
  - label: "Plakar integrations list"
    url: "https://www.plakar.io/integrations/"
---
