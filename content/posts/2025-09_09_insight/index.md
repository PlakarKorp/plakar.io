---
title: "Falsehoods Engineers believe about backup"
date: 2025-09-16T10:00:00+0100
authors:
- "julien"
summary: "Falsehoods Engineers believe about backup"
categories:
  - insights
tags:
 - plakar
 - backup
---

Here is a list of common false assumptions about backup that I’ve heard repeatedly over the past year from discussions with engineers, CTOs, and sysadmins across various industries.
These misconceptions often sound reasonable, but they create a false sense of safety until reality strikes.

- **If a backup finished successfully, it can be restored**  
  A backup that completes without errors doesn't guarantee it can be restored.

  Most failures happen during recovery due to corruption, misconfiguration, or missing pieces.

  *[(Gitlab incident)](https://about.gitlab.com/blog/gitlab-dot-com-database-incident/)*
  In 2017, a maintenance mistake wiped the primary database and multiple backups failed validation, forcing a restore that lost about six hours of production data.


- **RAID, replication, or snapshots are backups**  
  They are not. These mechanisms protect availability, not recoverability. They replicate corruption, deletions, and ransomware with impressive speed.
  
  Replication synchronizes data including accidental deletions or corruptions. Backups preserve history and offer rollback.

  *[(Meta)](https://arxiv.org/abs/2102.11245)*
  Meta documented “silent data corruptions” from faulty CPUs that replication dutifully propagated across systems, proving redundancy isn’t the same as recoverability.


- **Cloud providers back up my data**  
  They don’t. All cloud providers offer at the best durability and redundancy, not backups. You are responsible for protecting your own data.
  
  They all use a shared responsibility model that clearly states that backups are your job and implicitly (or clearly) state that you should backup you data out of their scope.

  *[(Google cloud UniSuper incident)](https://blocksandfiles.com/2024/05/14/google-cloud-unisuper/)*
  In 2024, a Google Cloud provisioning misconfiguration deleted UniSuper’s entire GCVE environment across regions—service was down for two weeks until backups were rebuilt.

- **The database files are enough to recover the database** 
  Not without transaction logs or consistency coordination. Copying raw files doesn't guarantee usable data.  
  *[(Microsoft TechCommunity: top 5 reasons why backup goes wrong)](https://techcommunity.microsoft.com/blog/azuregovernanceandmanagementblog/the-top-5-reasons-why-backup-and-recovery-in-the-cloud-goes-wrong-and-how-to-avo/3676072?utm_source=chatgpt.com)*
  Microsoft’s guidance highlights real-world restores that fail because required logs/consistency points weren’t captured—even when raw database files existed.

- **Our backups are safe from ransomware**  
  If they are accessible from the network, they are a primary target. Ransomware hits backups first. Isolation and immutability are critical.

  To prevent data leakage, backups should be encrypted, but you can still lose access to your data if the ransomware also encrypts or deletes your backups.

  *[(PerCSoft / DDS Safe)](https://krebsonsecurity.com/2019/08/ransomware-bites-dental-data-backup-firm/)*
  A ransomware attack on the dental-backup provider encrypted the cloud backups of hundreds of practices, leaving many without a usable recovery point.

- **A well-configured S3 bucket doesn't require backup**  
  Even a perfectly configured S3 bucket - with Versioning, Object Lock (Compliance mode), and MFA Delete - is not a backup.

  AWS itself advises creating immutable copies in an isolated secondary account to protect against breaches, misconfigurations, compromised credentials, or accidental deletions.
  The official architecture (AWS Storage Blog, 2023) explicitly shows that replication and object-lock alone do not protect you from logical corruption or account compromise: you must replicate to a separate, restricted account to keep an independent, immutable copy.

  In practice, replication can also amplify failures or ransomware attacks if not isolated: when the source data is encrypted or deleted, the replication faithfully propagates the damage to the destination. This is why AWS recommends automated suspension of replication when suspicious PUT or DELETE activity is detected — a classic anti-ransomware safeguard.

  S3 is designed for durability, not recoverability. A “well-configured bucket” ensures data isn’t lost due to hardware failure, but it won’t help you recover from a logic error, a bad IAM policy, or an API key compromise.
  True protection requires an independent, immutable backup — ideally in another account or region, with Object Lock compliance and strict key isolation.

  *[(AWS Blog: Modern Data Protection Architecture on Amazon S3, Part 1)](https://aws.amazon.com/blogs/storage/modern-data-protection-architecture-on-amazon-s3-part-1/?utm_source=chatgpt.com)*

- **Encryption in transit and at rest is not end-to-end security for backup**  
  Real E2E means client-side encryption with customer-held keys. If the backup server or its KMS can decrypt, an attacker who compromises it can too.  
  
  CVE-2023-27532 shows the risk: an unauthenticated actor could query Veeam Backup Service and pull encrypted credentials from the config database, then pivot to hosts and repositories. It was exploited in the wild.  
  
  *[(CISA KEV: CVE-2023-27532)](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) • [(BlackBerry on Cuba ransomware)](https://blogs.blackberry.com/en/2023/08/cuba-ransomware-deploys-new-tools-targets-critical-infrastructure-sector-in-the-usa-and-it-integrator-in-latin-america) • [(Group-IB on EstateRansomware)](https://www.group-ib.com/resources/research-blog/)*


- **Incremental backups are always safer and faster**  

  Not always. Long incremental chains rely on an index/catalog; if it’s corrupted or unavailable, the chain becomes unusable—one bad link can break the whole sequence.

  Example Commvault: when an Index V2 becomes corrupted, it’s marked Critical and, on the next browse/restore, Commvault rebuilds only from the latest cycle, making intermediate incremental points unavailable (common error: “The index cannot be accessed”).
  This can happen silently if the index is corrupted but still readable, leading to unnoticed data loss until a restore is needed.

  *[(Commvault docs – Troubleshooting Index V2)](https://documentation.commvault.com/v11/commcell-console/troubleshooting_indexing_version_2.html) • [(Commvault Community – “The index cannot be accessed”)](https://community.commvault.com/self-hosted-q-a-2/when-doing-restore-error-the-index-cannot-be-accessed-2615)*


- **A daily backup is enough**  
  For most modern systems, losing 23 hours of data is not acceptable. Recovery Point Objectives must match business needs.

  *Why*: in many businesses, one day of irreversible data loss ≈ one full day of revenue (orders, invoices, subscriptions, transactions that can’t be reconstructed), plus re-work and SLA penalties. For mid-to-large companies, that can quickly reach millions of euros.

  *Rule-of-thumb*:  
  Cost of a 24h RPO ≈ (Daily net revenue) + (Re-entry/reconciliation labor) + (SLA/chargebacks) + (churn/opportunity loss).

  *[(Gitlab incident)](https://about.gitlab.com/blog/gitlab-dot-com-database-incident/)*
  GitLab’s postmortem shows how relying on a single daily point risks losing an entire day’s business activity in one incident.

- **Backup storage will always be available**  
  Storage fills up, disks fail, and credentials expire. Many backup systems stop quietly when that happens.
  
  *Why*: Capacity: backup jobs commonly fail with “There is not enough space on the disk,” and operations like synthetic fulls/merges require extra temporary space (so “TBs free” can still be insufficient).
    - Index/metadata growth: index restores can balloon and fill disks, blocking browse/restore and further jobs (Commvault Index Restore filling the index disk; guidance on index cache pressure).
    - Expired credentials/tokens: cloud backups fail when AWS tokens or Azure SAS credentials expire (e.g., S3 ExpiredToken, SAS token expiry breaks backup-to-URL).

- **Backup is an IT problem**  
  It's not. It's a business continuity and risk management concern. Recovery priorities should be defined at the business level.
  
  *[(Ransomware attack shutters 157-year-old Lincoln College)](https://www.cbsnews.com/news/lincoln-college-closes-ransomware-hackers-illinois/)*



Help us debunk these myths by sharing your own experiences and insights in this reddit thread: 

Most backup incidents go underreported: for obvious reasons, vendors and affected organizations rarely disclose full details. All the more reason to master the fundamentals (RPO/RTO, isolation, immutability, key separation) and to regularly test restores don’t wait for public post-mortems to learn.

We are building Plakar as an Open Source project to help everyone protect their data effectively and cover all these bases.