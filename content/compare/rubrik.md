---
title: "Plakar vs Rubrik"
slug: "rubrik"
description:
  "Plakar vs Rubrik: self-hosted Plakar Control Plane and an open format against
  Rubrik Security Cloud, a SaaS control plane with threat analytics. Dated
  sources."
summary:
  "Rubrik leads on threat analytics and compliance; Plakar runs on your side,
  with an open format and policies from Git."
track: "enterprise"
plakar_product: "Plakar Control Plane"
plakar_version: "Control Plane 1.1.5, Plakar 1.1.8"
competitor: "Rubrik Security Cloud"
competitor_short: "Rubrik"
competitor_version: "RSC with CDM 9.6"
verified: "2026-10-23"
verdict:
  "Rubrik has threat analytics built into the backup pipeline, tested cyber
  recovery plans and a long compliance list. Plakar Control Plane runs in your
  own infrastructure, writes an open format open source Plakar can read without
  a vendor, and takes its policies from Git. Pick Rubrik when anomaly detection,
  recovery drills and certifications like FedRAMP are must-haves. Pick Plakar
  when you want no SaaS control plane, an exit path you can test today, and any
  snapshot restorable to any destination."
highlights:
  - title: "Control plane in your infrastructure, not in Rubrik's cloud"
    text:
      "Rubrik Security Cloud is hosted by Rubrik. Metadata and control go to
      RSC, backup data stays on your CDM cluster. Plakar Control Plane is a
      virtual appliance you run yourself. Only licence metrics leave your
      network."
  - title: "Open engine, open format"
    text:
      'Rubrik describes its store as a "proprietary, immutable file system".
      There is no export tool and no third-party reader. Plakar''s engine
      (Kloset) and Plakar itself are ISC licensed, and open source Plakar
      restores every store Control Plane writes.'
  - title: "Any snapshot to any destination"
    text:
      "Rubrik protects Proxmox VE, OpenStack and OpenShift Virtualization VMs.
      Its public material describes no restore from one hypervisor to another,
      apart from cloud conversion such as CloudOn (vSphere VMs to AWS or Azure).
      Plakar has its own connectors for Proxmox VE, OpenStack and Kubernetes
      with KubeVirt, and any snapshot restores to any destination."
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
              "RSC is SaaS hosted by Rubrik. RSC-Private is the self-managed,
              air-gapped option on an R7K appliance or a VM.",
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
              "Proprietary, immutable file system in Rubrik's own words. Only
              client tooling (SDKs, Terraform provider and modules, MCP server,
              scripts) is open source.",
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
              "No free tier. Subscription editions Foundation, Business and
              Enterprise, plus RSC-Private and RSC-Government.",
          }
      - capability: "Public documentation"
        hint: "Can you check the compatibility matrix before you buy?"
        plakar:
          {
            status: "yes",
            note:
              "Docs, changelogs and integration pages are public on plakar.io.",
          }
        competitor:
          {
            status: "partial",
            note:
              "docs.rubrik.com and the support site need a customer login. The
              developer portal and API reference are public.",
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
              "Atlas file system with global deduplication and compression
              across VMs on the cluster. No public ratio.",
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
            status: "no",
            note:
              "Encrypted on the cluster: AES-256 at rest and in flight,
              per-ingest keys wrapped by KEKs, TPM or external KMIP. The cluster
              handles plaintext.",
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
              "Append-only file system not exposed over standard protocols,
              Retention Lock, Legal Hold, SEC 17a-4 attestation.",
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
              "RBAC, SAML 2.0 SSO, mandatory TOTP MFA for native accounts,
              service accounts with short-lived tokens (up to 24 h).",
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
              "Data Threat Analytics: ML anomaly detection, Threat Monitoring
              with YARA and hash feeds, Turbo Threat Hunting, sensitive data
              discovery.",
          }
      - capability: "Compliance certifications"
        plakar:
          {
            status: "no",
            note:
              "No ISO or SOC certification published. The engine's cryptography
              was independently audited in 2025.",
          }
        competitor:
          {
            status: "yes",
            note:
              "ISO 27001, SOC 2 Type II, FedRAMP Moderate (RSC-Government),
              Common Criteria EAL2+ (RSC-Private and CDM), FIPS 140-3 validated
              cryptography, aligned with HITRUST CSF.",
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
            status: "yes",
            note:
              "vSphere, Hyper-V, Nutanix AHV, Azure Local, OLVM, Proxmox VE (GA
              April 2026), OpenShift Virtualization. OpenStack through a proxy
              VM that takes Cinder snapshots of instance volumes, with no Swift,
              Glance or Trove coverage stated.",
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
            status: "yes",
            note:
              "Protection Sets by namespace, cluster or application, CRDs, CSI
              volumes, OpenShift, Tanzu, Rancher, EKS, AKS, restore to another
              cluster.",
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
              "SQL Server, Oracle, PostgreSQL, MySQL, MongoDB, SAP HANA, IBM
              Db2. Live Mount for SQL Server.",
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
              "Windows filesets and hosts through the RBS agent, Active
              Directory and Entra ID, identity recovery workflows.",
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
              "Microsoft 365, Google Workspace, Salesforce, Dynamics 365, Jira,
              GitHub and Azure DevOps, licensed separately (Microsoft 365 per
              user).",
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
              "Data center backups land on the CDM cluster first. Archive to S3,
              S3-compatible, Azure Blob, GCS, NFS, tape (through a QStar archive
              server) or Rubrik Cloud Vault.",
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
              "GraphQL API, Terraform provider rubrikinc/polaris v1.11.2,
              PowerShell SDK, declarative SLA Domains. REST task API in beta, no
              CLI.",
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
            status: "partial",
            note:
              "Live Mount, Export and in-place restore within a hypervisor
              family, plus CloudOn conversion of vSphere VMs to AWS or Azure. No
              public claim of restoring a vSphere VM to Proxmox.",
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
            status: "yes",
            note:
              "Cyber Recovery: recovery plans, isolated recovery environment,
              scheduled test runs, validation scripts, reports. Needs CDM 8.1.3
              or later.",
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
              "Live Mount exposes a snapshot as an SMB share, global search.
              In-guest file restore uses the RBS agent or, on vSphere, VMware
              Tools.",
          }
sections_intro:
  "Checkmarks hide architecture. These four points decide most Rubrik versus
  Plakar evaluations."
sections:
  - heading: "Where your control plane runs"
    competitor_text:
      "Rubrik Security Cloud is a SaaS service hosted by Rubrik on a third-party
      cloud. Backup data stays on your CDM cluster or in your cloud account, but
      metadata and control go to RSC. If you need the control plane inside your
      perimeter, Rubrik sells RSC-Private, a self-managed version that runs on
      an R7K appliance or as a VM on vSphere/ESXi, and is air-gapped after
      registration."
    plakar_text:
      "Plakar Control Plane is a virtual appliance (AMI, OVA, qcow2, ISO) that
      you run in your own cloud account, data center or Kubernetes cluster. The
      only traffic to plakar.io is licence and consumption metrics. Edges, the
      optional workers that run tasks near your workloads, need no internet
      access."
    bullets:
      - "Control Plane images for AWS, OVHcloud, Scaleway, Exoscale, GCP,
        Proxmox, vSphere and Kubernetes"
      - "Edges are open source (ISC) and poll Control Plane from inside your
        network"
      - "Data residency by country and legal hold are set per organization in
        Control Plane"
  - heading: "Who can read your backups in ten years"
    competitor_text:
      'Rubrik''s Proxmox announcement describes its store as a "proprietary,
      immutable file system". There is no public specification, no export tool
      and no third-party reader. Archived data can only be restored through
      Rubrik software: a Rubrik cluster or Rubrik''s CloudOn conversion. The
      exit path is to restore everything to native formats while you still hold
      a licence. Rubrik''s own annual report lists the EU Data Act switching
      obligations as a business risk.'
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
  - heading: "Proxmox, OpenStack and the fine print"
    competitor_text:
      "Rubrik added Proxmox VE in April 2026. Its Proxmox page and datasheet
      cover VM export, file and folder recovery, global search and threat
      analytics. Live Mount is not stated for Proxmox. For OpenShift
      Virtualization, Rubrik lists Live Mount and file restore. OpenStack is
      protected through a proxy VM that takes Cinder snapshots of instance
      volumes, and Rubrik's material does not state coverage for Swift, Glance
      or Trove. The detailed compatibility matrix and release notes sit behind a
      customer login, so you cannot check them before you buy."
    plakar_text:
      "Plakar has its own connectors for Proxmox VE (built with a partner on top
      of vzdump), OpenStack (Nova instances, Cinder volumes, Swift, Glance,
      Trove) and Kubernetes, including KubeVirt VMs. One Control Plane instance
      covers every OpenStack tenant through inventories, created by hand or by
      Terraform. They work with open source Plakar and with Control Plane, and
      every snapshot can be browsed, mounted and restored to any destination.
      All docs and changelogs are public."
    bullets:
      - "OpenStack connector 1.1.1 released October 2026"
      - "Kubernetes connector 1.1.11 with KubeVirt VMs, namespace remapping and
        mTLS"
      - "Integration pages list licence, stage and author for every connector"
  - heading: "Where Rubrik is ahead today"
    competitor_text:
      "Data Threat Analytics scans backups for anomalies, YARA matches and
      sensitive data, and Turbo Threat Hunting is built for finding a clean
      recovery point fast. Cyber Recovery runs scheduled test restores in an
      isolated environment and produces reports. SAML SSO, FedRAMP Moderate,
      Common Criteria EAL2+ and FIPS 140-3 validated cryptography are in place.
      Global deduplication works across the whole cluster. For Hyper-V, Nutanix
      AHV, Oracle, SAP HANA, Db2, Microsoft 365 and Salesforce, Rubrik has
      coverage Plakar does not."
    plakar_text:
      "Control Plane verifies snapshots with scheduled check tasks but does not
      run recovery drills. There is no anomaly detection, no SSO and no
      published ISO or SOC certification yet. Deduplication is per store.
      Hyper-V, Nutanix, Oracle, SAP, Db2 and SaaS applications are not covered.
      If those are must-haves, Rubrik is the safer choice today."
choose_competitor:
  - "You need anomaly detection and threat hunting inside the backup pipeline,
    not bolted on."
  - "You need scheduled, reported recovery drills in an isolated environment."
  - "Your procurement requires FedRAMP, Common Criteria or FIPS 140-3 validated
    cryptography."
  - "You back up Hyper-V, Nutanix AHV, Oracle, SAP HANA, Microsoft 365 or
    Salesforce and want vendor-supported connectors."
  - "You want identity recovery for Active Directory, Entra ID and Okta from the
    same vendor."
choose_plakar:
  - "You do not want a SaaS control plane in the path of your backups, and you
    want the self-hosted option to be the default, not a special edition."
  - "You want to read and restore your backups without a vendor licence, now and
    in ten years."
  - "You want every snapshot, Proxmox, OpenStack and KubeVirt VMs included, to
    restore to any destination."
  - "You manage infrastructure as code and want backup policies in Git, applied
    by Terraform, Ansible or an Operator."
  - "You want to read the docs and the compatibility matrix before you talk to
    sales."
faq:
  - q: "Is Plakar a replacement for Rubrik?"
    a:
      "For Proxmox, OpenStack, Kubernetes, VMware, Linux and cloud storage
      estates, yes. If you depend on Rubrik's threat analytics, cyber recovery
      drills, compliance certifications or its Oracle, SAP, Microsoft 365 and
      Salesforce coverage, Rubrik still covers more."
  - q: "Can I restore Plakar backups without Plakar Control Plane?"
    a:
      "Yes. Control Plane writes standard Kloset stores. The open source Plakar
      lists, verifies and restores every snapshot without any licence."
  - q: "Can I read Rubrik backups without a Rubrik cluster?"
    a:
      "Not according to Rubrik's public material. The store is a proprietary
      file system, there is no export tool or third-party reader, and archived
      data can only be restored through Rubrik software: a Rubrik cluster or
      Rubrik's CloudOn conversion."
  - q: "Does Rubrik have a self-hosted control plane?"
    a:
      "Yes, as a separate product. RSC-Private runs self-managed on an R7K
      appliance or as a VM on vSphere/ESXi, and is air-gapped after
      registration. The standard Rubrik Security Cloud is SaaS hosted by Rubrik.
      Plakar Control Plane is self-hosted in every plan, including the Free
      plan."
  - q: "Does Rubrik support Proxmox?"
    a:
      "Yes, since April 2026. Rubrik's Proxmox page and datasheet cover VM
      export, file and folder recovery, global search and threat analytics. Live
      Mount is not stated, and the detailed docs are behind a customer login.
      Plakar's Proxmox connector supports backup and restore of VMs with the
      same browse, mount and cross-connector restore as every other source."
  - q: "Does Plakar have ransomware detection like Rubrik?"
    a:
      "No. Plakar snapshots are content-addressed and tamper-evident, and
      immutability comes from object lock on the storage backend. Rubrik adds ML
      anomaly detection, YARA-based threat monitoring and threat hunting on top
      of its immutable file system."
sources:
  - label: "Rubrik for Proxmox VE GA announcement (April 2026)"
    url: "https://www.rubrik.com/blog/technology/26/4/rubrik-for-proxmox-ve-uncompromised-cyber-resilience-is-now-generally-available"
  - label: "Rubrik Security Cloud-Private enhancements (October 2026)"
    url: "https://www.rubrik.com/blog/technology/26/10/stronger-inside-the-perimeter-the-latest-enhancements-to-rubrik-security-cloud-private"
  - label: "Rubrik annual report on Form 10-K, fiscal 2026"
    url: "https://www.sec.gov/Archives/edgar/data/1943896/000194389626000013/rbrk-20260131.htm"
  - label: "Rubrik on recovery from long-term archive"
    url: "https://www.rubrik.com/blog/products-solutions/18/2/recovery-long-term-archive"
  - label: "Rubrik developer portal, data center protection"
    url: "https://developer.rubrik.com/Rubrik-Security-Cloud-API/Data-Protection/Data-Center/"
  - label: "Rubrik developer portal, SaaS application protection"
    url: "https://developer.rubrik.com/Rubrik-Security-Cloud-API/SaaS-App-Protection/"
  - label: "Rubrik developer portal, threat analytics"
    url: "https://developer.rubrik.com/Rubrik-Security-Cloud-API/Threat-Analytics/"
  - label: "Rubrik compliance program"
    url: "https://www.rubrik.com/compliance-program"
  - label: "Rubrik Cyber Recovery"
    url: "https://www.rubrik.com/products/cyber-recovery"
  - label: "Rubrik OpenStack blueprint (July 2025)"
    url: "https://www.rubrik.com/blog/technology/25/7/fortifying-openstack-a-rubrik-blueprint-for-cyber-resilience"
  - label: "Rubrik encrypted lifecycle management"
    url: "https://www.rubrik.com/blog/technology/2021/08/rubrik-fully-encrypted-lifecycle-management"
  - label: "Rubrik Cerebro deduplication engine"
    url: "https://www.rubrik.com/blog/architecture/16/1/meet-cerebro-the-brains-behind-rubriks-time-machine"
  - label: "Terraform registry, rubrikinc/polaris provider"
    url: "https://registry.terraform.io/providers/rubrikinc/polaris/latest"
  - label: "Terraform registry, polaris_sla_domain resource"
    url: "https://registry.terraform.io/providers/rubrikinc/polaris/latest/docs/resources/sla_domain"
  - label: "Rubrik for Proxmox VE"
    url: "https://www.rubrik.com/solutions/proxmox-ve"
  - label: "Rubrik Proxmox VE datasheet (September 2026)"
    url: "https://www.rubrik.com/content/dam/rubrik/en/resources/data-sheet/ds-rubrik-data-protection-for-proxmox-ve.pdf"
  - label: "Rubrik Data Threat Analytics across hypervisors (2026)"
    url: "https://www.rubrik.com/blog/technology/26/7/modernize-your-hypervisors-not-your-attack-surface"
  - label: "Rubrik multi-hypervisor policy and layered security (October 2026)"
    url: "https://www.rubrik.com/blog/technology/26/10/simplify-multi-hypervisor-protection-with-unified-policy-and-layered-security"
  - label: "Rubrik for OpenShift Virtualization"
    url: "https://www.rubrik.com/solutions/openshift"
  - label: "Rubrik Security Cloud-Private for US federal brief (September 2026)"
    url: "https://www.rubrik.com/content/dam/rubrik/en/resources/solutions-brief/sb-rsc-private-for-us-federal-government.pdf"
  - label: "Rubrik CloudOn instantiation"
    url: "https://www.rubrik.com/blog/products-solutions/18/4/intelligent-application-instantiation-cloudon"
  - label: "Rubrik SaaS data protection"
    url: "https://www.rubrik.com/products/saas-data-protection"
  - label: "Rubrik developer portal, authentication"
    url: "https://developer.rubrik.com/Rubrik-Security-Cloud-API/authentication/"
  - label: "Rubrik API reference, file restore options"
    url: "https://developer.rubrik.com/Rubrik-Security-Cloud-API/API-Reference/types/inputs/RestoreFilesJobConfigInput/"
  - label: "Rubrik API reference, tape archive location"
    url: "https://developer.rubrik.com/Rubrik-Security-Cloud-API/API-Reference/types/inputs/CreateTapeTargetInput/"
  - label: "Plakar engine cryptographic audit (2025)"
    url: "https://www.plakar.io/posts/2025-02-28/audit-of-plakar-cryptography/"
---
