---
title: "Plakar vs Cohesity"
slug: "cohesity"
description:
  "Plakar vs Cohesity Data Cloud (DataProtect 7.4.1): open format and native
  connectors against scale-out global dedup and Helios, SaaS or self-managed.
  Dated sources."
summary:
  "Cohesity suits large mixed estates, while Plakar writes an open format that
  open source Plakar can restore without a licence."
track: "enterprise"
plakar_product: "Plakar Control Plane"
plakar_version: "Control Plane 1.1.5, Plakar 1.1.8"
competitor: "Cohesity Data Cloud"
competitor_short: "Cohesity"
competitor_version: "DataProtect 7.4.1 (NetBackup 11.2 noted)"
verified: "2026-10-23"
verdict:
  "Cohesity has global deduplication across a scale-out cluster, broad SaaS and
  cloud database coverage, clean-room recovery and the NetBackup install base.
  Its Helios console runs as SaaS or self-managed on-premises. Plakar Control
  Plane writes an open format open source Plakar can restore, protects
  Kubernetes, Proxmox and OpenStack with its own connectors, and keeps backup
  policies in code. Pick Cohesity for large mixed estates with Microsoft 365,
  Oracle or SAP HANA. Pick Plakar when you want to read your backups without the
  vendor, keep backup policies in Git, and run Kubernetes, Proxmox or OpenStack."
highlights:
  - title: "Where the control plane runs"
    text:
      "Plakar Control Plane is a virtual appliance you run yourself. Only
      licence metrics go to plakar.io. Cohesity clusters also run on your site.
      Helios, the management console, runs as SaaS with its console hosted in
      the US, or as Helios Self-Managed on-premises."
  - title: "Open engine, open format"
    text:
      "Plakar and its engine (Kloset) are ISC licensed. Open source Plakar reads
      and restores every store Control Plane writes. Cohesity SpanFS backups are
      proprietary, with no export tool and no third-party reader."
  - title: "Own connectors for Kubernetes, Proxmox and OpenStack"
    text:
      "Plakar has its own Kubernetes connector plus an Operator with CRDs, and
      native Proxmox VE and OpenStack connectors. Cohesity DataProtect uses
      Velero and a Datamover pod with cluster-admin rights and has no native
      Proxmox integration. Cohesity lists OpenStack as a natively protected
      hypervisor; the scope docs need a customer login."
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
              "Clusters run on your site or in your cloud. Helios Self-Managed
              runs the management plane on-premises; SaaS Helios has its console
              hosted in the US.",
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
              500 GB of managed data.",
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
              the whole cluster. No guaranteed ratio.",
          }
      - capability: "Client-side encryption, storage never sees keys"
        plakar:
          {
            status: "yes",
            note:
              "AES-256-GCM-SIV, Argon2id, on by default, independently audited
              in 2025. Encrypted on the source host; storage and vendor never
              see plaintext.",
          }
        competitor:
          {
            status: "partial",
            note:
              "Encrypted on the cluster at rest and in flight with an internal
              or external KMS; the cluster handles plaintext. SaaS keys can be
              Cohesity-managed or customer-managed.",
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
              logs, FIPS 140-3 enabled by default.",
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
              "VMware vSphere (agentless), Proxmox VE, OpenStack, KubeVirt and
              OpenShift Virtualization. No Hyper-V or Nutanix AHV.",
          }
        competitor:
          {
            status: "partial",
            note:
              "VMware, Nutanix AHV, Hyper-V and Azure Local, OpenShift
              Virtualization, Oracle Linux Virtualization Manager. No native
              Proxmox. OpenStack listed as natively protected, docs behind a
              customer login; NetBackup protects OpenStack with Storware.",
          }
      - capability: "Kubernetes"
        plakar:
          {
            status: "yes",
            note:
              "Native connectors for Kubernetes and OpenShift (resources, CSI
              snapshots, PVCs, KubeVirt VMs) plus an Operator with backup,
              restore, sync and check CRDs, one-off or recurring.",
          }
        competitor:
          {
            status: "partial",
            note:
              "Velero plus a Datamover pod with a cluster-admin token. No
              Cohesity operator or CRDs. NetBackup has a Helm operator with
              OpenShift Virtualization (KubeVirt) VMs.",
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
              "Windows (VSS), Linux, AIX, Solaris and HP-UX agents. Active
              Directory with forest recovery; Entra ID and Okta as SaaS sources.",
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
              "Microsoft 365, Google Workspace, Slack, Salesforce, Okta and
              Entra ID as a SaaS service. Microsoft 365 also on self-managed
              DataProtect.",
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
              has 12 resources and no release since May 2025. Policies and
              VMware jobs can be managed in Terraform, but the provider is
              narrow and best-effort.",
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
      - capability: "Automated restore drills"
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
  "The table is a start. These four points decide most Cohesity versus Plakar
  evaluations."
sections:
  - heading: "Where the control plane lives"
    competitor_text:
      "Cohesity clusters run on certified appliances, as virtual machines or in
      your cloud account. Multi-cluster management goes through Helios. SaaS
      Helios and the Cloud Services console are hosted by Cohesity in the US;
      backup data can stay in EU or APAC regions. Helios Self-Managed runs the
      management plane on-premises, including at air-gapped sites. If management
      must stay inside your network, plan for Helios Self-Managed."
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
  - heading: "Reading your backups without Cohesity"
    competitor_text:
      "Cohesity backups live in SpanFS, a proprietary file system. There is no
      public specification, no export tool and no third-party reader. The exit
      path is to restore everything to primary storage. SmartFiles views are
      readable over NFS, SMB and S3. NAS backups can be cloned to a view and
      mounted, but only through a running Cohesity cluster. NetBackup images are
      also proprietary, and the NetBackup terms grant 12 months of restore-only
      use after a subscription ends."
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
      - "Independent review of the engine's cryptography published in February
        2025"
  - heading: "Kubernetes, Proxmox and OpenStack"
    competitor_text:
      "DataProtect protects Kubernetes with Velero and a Cohesity Datamover pod.
      It needs a cluster-admin token and backs up namespaces and cluster-scoped
      resources. There is no Cohesity operator and no Cohesity CRDs; the CRDs
      underneath are Velero's. NetBackup is different: it has a Helm-installed
      operator with support for OpenShift Virtualization (KubeVirt) VMs. For
      Proxmox VE, the only documented options are an NFS target or a Remote
      Adapter script. Cohesity lists OpenStack as a natively protected
      hypervisor; the scope docs need a customer login. NetBackup protects
      OpenStack with Storware."
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
      AWS, Azure and GCP are covered as SaaS sources. Oracle and SAP HANA have
      agents; Cassandra is protected agentless. RecoveryAgent gives clean-room
      recovery with threat scans. ML anomaly detection and YARA scanning are
      built in, and FortKnox is available as a SaaS or self-managed vault. SAML
      SSO, quorum approval and FIPS 140-3 (enabled by default) are mature.
      NetBackup brings a large enterprise install base, native tape, and a
      Kubernetes operator with OpenShift Virtualization (KubeVirt) VMs."
    plakar_text:
      "Control Plane deduplicates within a store, not across stores. There is no
      anomaly detection, no clean room, no SSO and no ISO or SOC certification
      yet. Oracle, SAP HANA, Hyper-V, Nutanix AHV and tape are not covered, and
      Microsoft 365 is coming soon. If those are must-haves, Cohesity is the
      safer choice today."
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
  - "You want a self-hosted control plane that sends only licence metrics to the
    vendor."
  - "You want to read and restore your backups without a vendor licence, now and
    in ten years."
  - "You run Kubernetes, Proxmox or OpenStack and want them as native sources,
    with an Operator and CRDs instead of Velero and cluster-admin tokens."
  - "You manage infrastructure as code and want backup policies in Git, applied
    by Terraform, Ansible or an Operator."
  - "You want end-to-end encryption where the storage provider and plakar.io
    never see plaintext."
faq:
  - q: "Is Plakar a replacement for Cohesity?"
    a:
      "For Kubernetes, Proxmox, OpenStack, Linux, VMware and cloud storage
      estates it can be; validate with a timed restore test. For estates that
      depend on Microsoft 365 backup, Oracle or SAP HANA agents, clean-room
      recovery or native tape, Cohesity still covers more. Teams can run both
      during a migration because Plakar stores are independent of the Cohesity
      cluster."
  - q: "Can I restore Plakar backups without Plakar Control Plane?"
    a:
      "Yes. Control Plane writes standard Kloset stores. The open source Plakar
      lists, verifies and restores every snapshot without any licence."
  - q: "Does Cohesity have a Terraform provider?"
    a:
      "Yes, cohesity/cohesity on the registry, version 2.1.3 with 12 resources,
      with no release since May 2025. It can manage backup policies and VMware
      jobs. Cohesity marks its GitHub tooling as community-contributed or
      best-effort and not covered by Cohesity Support. Plakar has its own
      provider, an Ansible collection and a Kubernetes Operator."
  - q: "Does Cohesity support Proxmox VE and OpenStack?"
    a:
      "Proxmox VE is not supported natively. It is covered as an NFS target or
      through a Remote Adapter script. For OpenStack, Cohesity announced native
      backup in DataProtect in October 2026, with no public docs yet. NetBackup
      protects OpenStack with Storware. Plakar has its own Proxmox and OpenStack
      connectors."
  - q: "How does Kubernetes protection compare?"
    a:
      "Cohesity DataProtect uses Velero plus a Cohesity Datamover pod and needs
      a cluster-admin token. There is no Cohesity operator or CRDs. NetBackup
      has a Helm operator with OpenShift Virtualization (KubeVirt) support.
      Plakar has a native connector with CSI snapshots, PVCs and KubeVirt VMs,
      plus an Operator with CRDs for Source, Store, Destination and scheduled
      tasks."
  - q: "How does deduplication compare?"
    a:
      "Cohesity SpanFS deduplicates globally across the cluster with
      variable-length chunks. Plakar deduplicates across everything in a store
      using content-defined chunking, not across stores. Neither vendor
      publishes a certified ratio, so test on your own data."
sources:
  - label:
      "Cohesity Platform 7.4.1 release notes (2026-07-27, university mirror;
      Velero and Datamover pods, FIPS 140-3)"
    url: "https://mirror.vcu.edu/pub/cohesity/docs/Cohesity%20Release%20Notes%20v7.4.1.pdf"
  - label:
      "Cohesity Cloud Services FAQ (console hosting, data regions, global dedup,
      keys)"
    url: "https://www.cohesity.com/platform/cloud-protection-services/faq-cloud-protection-services/"
  - label:
      "Cohesity DataProtect page (workloads, Helios Self-Managed, OpenStack,
      FIPS 140-3)"
    url: "https://www.cohesity.com/platform/dataprotect/"
  - label:
      "Cohesity DataProtect datasheet (hypervisors, agents, Active Directory,
      Kubernetes scope)"
    url: "https://www.cohesity.com/resources/datasheet/cohesity-dataprotect/"
  - label: "Cohesity blog on the Helios self-managed control plane (2026-10-01)"
    url: "https://www.cohesity.com/blogs/cyber-resilience-for-self-managed-deployments/"
  - label: "Cohesity hypervisor solution brief (native OpenStack)"
    url: "https://www.cohesity.com/resources/solution-brief/protecting-virtualized-workloads-across-any-hypervisor/"
  - label: "Cohesity blog on Data Cloud releases (2026-10-20, FIPS 140-3)"
    url: "https://www.cohesity.com/blogs/cohesity-dataprotect-and-cohesity-cloud-services/"
  - label:
      "Cohesity Kubernetes requirements (cluster-admin, Datamover; sign-in
      required)"
    url: "https://docs.cohesity.com/baas/data-protect/kubernetes-requirements.htm"
  - label: "Cohesity Kubernetes Velero upgrade guide (sign-in required)"
    url: "https://docs.cohesity.com/baas/data-protect/kubernetes-upgradevelero.htm"
  - label: "Cohesity blog on OpenShift Virtualization and Proxmox VE (2024)"
    url: "https://www.cohesity.com/blogs/cohesity-data-cloud-now-protects-red-hat-openshift-virtualization-and-proxmox-ve-workloads/"
  - label: "Cohesity NoSQL and Hadoop page (agentless Cassandra protection)"
    url: "https://www.cohesity.com/solutions/nosql-and-hadoop/"
  - label: "Cohesity blog on NAS protection (2017, cloned views over NFS, SMB)"
    url: "https://www.cohesity.com/blogs/cohesity-nas-data-protection/"
  - label: "Terraform registry, cohesity/cohesity provider"
    url: "https://registry.terraform.io/providers/Cohesity/cohesity/latest"
  - label:
      "Cohesity Terraform provider repository (resources, support statement)"
    url: "https://github.com/cohesity/terraform-provider-cohesity"
  - label: "NetBackup Product Specific Terms, 26 November 2025 (section 3.1)"
    url: "https://www.cohesity.com/content/dam/cohesity/resource-assets/agreements-archive/netbackup-april-2026.pdf"
  - label: "NetBackup 11.2 Kubernetes features (OpenShift Virtualization)"
    url: "https://docs.cohesity.com/docs/netbackup/11.2/150157643-172472261-0/v148896515-172472261"
  - label: "NetBackup 11.2 Kubernetes operator Helm installation"
    url: "https://docs.cohesity.com/docs/netbackup/11.2/150157643-172472261-0/v160387596-172472261"
  - label: "NetBackup 11.1 for OpenStack (Storware)"
    url: "https://docs.cohesity.com/docs/netbackup/11.1/147269993-170375799-0/v173431684-170375799"
  - label: "Plakar integrations list"
    url: "https://www.plakar.io/integrations/"
---
