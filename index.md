





## [Plakar Blog](https://plakar.io/posts/index.md)

- [Plakar v1.1.3 is here](https://plakar.io/posts/2026-06-16/plakar-v1.1.3-is-here/index.md): After a long beta and three release candidates, plakar v1.1.3 is finally out. It is the biggest release we have shipped so far: faster restores, much lower memory usage, a smaller cache footprint, a brand new terminal UI, better mounting, a new package manager, simpler integration interfaces, and a far more reliable execution model now that the agent is gone and cached has taken its place. It is stable, fully backward compatible, and ready for production.
- [go-cdc-chunkers v1.1.0: faster, leaner, and provably correct](https://plakar.io/posts/2026-06-14/go-cdc-chunkers-v1.1.0-faster-leaner-and-provably-correct/index.md): go-cdc-chunkers v1.1.0 lands with a new spec-faithful JC variant topping the benchmarks at 3.7 GB/s, a caller-owned buffer API that cuts peak memory by a third and allocations by ~100×, 100% test coverage, fuzzing, and cross-language conformance vectors. Here is what changed and why it matters for Plakar.
- [The Plakar Frontend, Explained](https://plakar.io/posts/plakar-ui-series/index.md): A series for backend developers exploring the Plakar UI tech stack: pnpm, Turborepo, React, TypeScript, Zod, TanStack Query/Form/Table/Router, React Aria Components, Storybook, testing, and the frontend build pipeline.
- [Backing Up 12 Months of Wikipedia Data with Plakar](https://plakar.io/posts/2026-05-22/backing-up-12-months-of-wikipedia-with-plakar/index.md): We backed up 12 months of English Wikipedia dumps into a single Kloset store, using deduplication and content-defined chunking to drastically reduce storage usage.
- [Backing up PostgreSQL with Plakar](https://plakar.io/posts/2026-04-03/backing-up-postgresql-with-plakar/index.md): We built a PostgreSQL integration for Plakar that covers both logical backups (pg_dump / pg_dumpall) and physical backups (pg_basebackup), making database backups as straightforward as any other Plakar backup: no scripts, no glue code.
- [Backing up Proxmox with Plakar: a third-party integration built in a few days](https://plakar.io/posts/2026-03-16/backing-up-proxmox-with-plakar-a-third-party-integration-built-in-a-few-days/index.md): The team at FactorFX built a Proxmox integration for Plakar that wraps Proxmox’s native vzdump backups and stores them as deduplicated Plakar snapshots, making VM and container backups portable, encrypted, and easy to restore across clusters.
- [Backing up kubernetes clusters with Plakar](https://plakar.io/posts/2026-02-18/backing-up-kubernetes-clusters-with-plakar/index.md): We built a Kubernetes integration for Plakar that backs up clusters at three levels: etcd (disaster recovery), manifests (granular restore and inspection), and persistent volumes (via CSI snapshots). This enables full cluster recovery, fine-grained restores, and data portability across environments.
- [Storing backups in an OCI registry](https://plakar.io/posts/2026-02-07/storing-backups-in-an-oci-registry/index.md): After a podcast discussion, we implemented an OCI registry storage backend. This article discusses the concept and showcases our proof of concept.
- [Plakar v1.1.0-beta: the foundation for what’s next](https://plakar.io/posts/2026-01-26/plakar-v1.1.0-beta-the-foundation-for-whats-next/index.md): plakar v1.1.0-beta marks a major step forward, with significant performance gains, architectural simplifications, and powerful new user-facing features. From faster backups and restores to better mounting, cleaner integrations, and a more reliable execution model, this release lays solid foundations for what comes next. The beta is stable, backward compatible, and ready to be explored.
- [Researching a PostgreSQL viewer for Plakar](https://plakar.io/posts/2026-01-11/researching-a-postgresql-viewer-for-plakar/index.md): An R&amp;D exploration of adding a PostgreSQL viewer to the Plakar UI, comparing filesystem-based approaches with block-level copy-on-write using qcow2.
- [Plakar joins the Linux Foundation and Cloud Native Computing Foundation](https://plakar.io/posts/2026-01-07/plakar-joins-the-linux-foundation-and-cloud-native-computing-foundation/index.md): We are proud to announce that Plakar has officially joined the Linux Foundation and the CNCF as a member, marking a pivotal step in establishing an Open Standard for Resilience.
- [Announcing Plakar Enterprise for AWS (Preview)](https://plakar.io/posts/2025-12-31/announcing-plakar-enterprise-for-aws-preview/index.md): We are proud to announce the immediate availability of Plakar Enterprise for AWS, bringing Cloud-Native Resilience and Zero-Trust security to your VPC.
- [Release v1.0.6 — Bugfix and memory usage improvement](https://plakar.io/posts/2025-11-30/release-v1.0.6-bugfix-and-memory-usage-improvement/index.md): v1.0.6 brings a few bugfixes and huge memory usage improvements.
- [Release v1.0.5 — Refinements, Hooks & Build Improvements](https://plakar.io/posts/2025-10-15/release-v1.0.5-refinements-hooks-build-improvements/index.md): v1.0.5 is here! This release focuses on build improvements, UI updates, smarter pipelines, new hook capabilities, and various maintenance enhancements.
- [Falsehoods Engineers belief about backup](https://plakar.io/posts/2025-09-17/falsehoods-engineers-believe-about-backup/index.md): Falsehoods Engineers belief about backup
- [Release v1.0.4 — A new milestone for Plakar](https://plakar.io/posts/2025-09-16/release-v1.0.4-a-new-milestone-for-plakar/index.md): Plakar v1.0.4 introduces pre-packaged binaries, a new plugin system for integrations, smarter caching, policy-based lifecycle management, UI refinements, and major performance boosts — marking a milestone release for the platform.
- [Back up Notion? Yes, you can.](https://plakar.io/posts/2025-07-17/back-up-notion-yes-you-can./index.md): With our new Notion integration, plakar can now snapshot and restore workspaces directly — docs, databases, and more. No hacks. Just data.
- [go-kloset-sdk is live!](https://plakar.io/posts/2025-07-15/go-kloset-sdk-is-live/index.md): want to craft a ptar archive but you don&rsquo;t need a full-fledged backup solution ? here comes kapsul, our ptar-specific tool, providing all you need from building to restoring and inspecting.
- [Introducing go-cdc-chunkers: chunk and deduplicate everything](https://plakar.io/posts/2025-07-11/introducing-go-cdc-chunkers-chunk-and-deduplicate-everything/index.md): We released go-cdc-chunkers, our open source library to provide Content-Defined Chunking. Here&rsquo;s why deduplication is important.
- [Kapsul: a tool to create and manage deduplicated, compressed and encrypted PTAR vaults](https://plakar.io/posts/2025-07-07/kapsul-a-tool-to-create-and-manage-deduplicated-compressed-and-encrypted-ptar-vaults/index.md): want to craft a ptar archive but you don&rsquo;t need a full-fledged backup solution ? here comes kapsul, our ptar-specific tool, providing all you need from building to restoring and inspecting.
- [Technical deep dive into .ptar: replacing .tgz for petabyte-scale S3 archives](https://plakar.io/posts/2025-06-30/technical-deep-dive-into-.ptar-replacing-.tgz-for-petabyte-scale-s3-archives/index.md): .tgz made sense in 1994, but today we need archiving that supports deduplication, encryption, S3, and zero trust. here’s why we built .ptar.
- [It doesn't make sense to wrap modern data in a 1979 format, introducing .ptar](https://plakar.io/posts/2025-06-27/it-doesnt-make-sense-to-wrap-modern-data-in-a-1979-format-introducing-.ptar/index.md): .ptar is our own archive format, a self-contained kloset, a container for your data. You end up with a standalone file that provides deduplication, compression, encryption, with all of the fancy features of a kloset store!
- [Plakar v1.0.2 was released: mostly S3 improvements!](https://plakar.io/posts/2025-06-03/plakar-v1.0.2-was-released-mostly-s3-improvements/index.md): Plakar v1.0.2 adds an automatic security check for new critical releases. It also fixes relative-path resolution when using an agent, plus delivers dramatic S3 performance and memory improvements for faster, more reliable backups.
- [Introducing Plakar v1.0 to redefine Open-Source Data Protection with $3M funding](https://plakar.io/posts/2025-05-01/introducing-plakar-v1.0-to-redefine-open-source-data-protection-with-3m-funding/index.md): Immutable, queryable, encrypted snapshots with context and integrity — Kloset redefines how data is stored, verified, and reused
- [Kloset: the immutable data store](https://plakar.io/posts/2025-04-29/kloset-the-immutable-data-store/index.md): Immutable, queryable, encrypted snapshots with context and integrity — Kloset redefines how data is stored, verified, and reused
- [A Short history of backup](https://plakar.io/posts/2025-03-31/a-short-history-of-backup/index.md): From magnetic tapes to immutable snapshots, how backups evolved into strategic, queryable, open tools ready for modern data challenges
- [Plakar 1.0.1-beta.13 out!](https://plakar.io/posts/2025-03-19/plakar-1.0.1-beta.13-out/index.md): New UI filters, timeline navigation, S3 and FTP support, checkpointing, and performance boosts in Plakar’s latest beta release
- [Plakar beta.4 and upcoming features](https://plakar.io/posts/2025-03-08/plakar-beta.4-and-upcoming-features/index.md): New UI previews, performance boosts, SFTP fixes, CLI testing, packaging on BSDs—beta.4 refines Plakar while previewing what’s next
- [Audit of Plakar cryptography](https://plakar.io/posts/2025-02-28/audit-of-plakar-cryptography/index.md): Independent cryptographic audit of Plakar by Jean-Philippe Aumasson confirming a sound overall design, with recommendations to modernize components. Key improvements include switching to Argon2id for password hashing, AES-GCM-SIV for chunk encryption, AES-KW for key wrapping, and replacing SHA-256 digests with keyed BLAKE3 MACs. No major security issues were found, and follow-up review validated the updated architecture, algorithms, and implementation.
- [Plakar beta release!](https://plakar.io/posts/2025-02-26/plakar-beta-release/index.md): First public beta of Plakar is out: scalable, encrypted, efficient, and open-source backups ready for real-world testing and feedback
- [Understanding RTO and RPO in disaster recovery](https://plakar.io/posts/2025-02-12/understanding-rto-and-rpo-in-disaster-recovery/index.md): Learn how RTO and RPO define recovery speed and data loss tolerance—essential metrics for building resilient disaster recovery strategies
- [The 3-2-1 backup rule: A proven strategy for data protection](https://plakar.io/posts/2025-02-11/the-3-2-1-backup-rule-a-proven-strategy-for-data-protection/index.md): Discover why the 3-2-1 backup rule remains the gold standard for protecting your data from deletion, disasters, and ransomware
- [S3 is not a backup: why you need a real backup strategy](https://plakar.io/posts/2025-02-10/s3-is-not-a-backup-why-you-need-a-real-backup-strategy/index.md): S3 offers durable storage, not true backups. Learn why you need dedicated tools for secure, recoverable, and resilient data protection
- [Why replication is not backup](https://plakar.io/posts/2025-02-10/why-replication-is-not-backup/index.md): Replication ensures availability, not recovery. Learn why true backups remain essential to protect against deletion, corruption, or malicious actions


## [Plakar Integrations](https://plakar.io/integrations/index.md)

- [Azure Blob Storage](https://plakar.io/integrations/azblob/index.md): Protect your Azure Blob Storage containers against accidental deletion, ransomware, and misconfiguration. Plakar provides immutable, encrypted snapshots for Azure Blob Storage, restorable across any provider or environment.

- [Google Cloud Storage](https://plakar.io/integrations/gcs/index.md): Protect your Google Cloud Storage buckets against accidental deletion, ransomware, and misconfiguration. Plakar provides immutable, encrypted snapshots for GCS, restorable across any provider or environment.

- [etcd](https://plakar.io/integrations/etcd/index.md): Protect your etcd cluster against data loss and node failures. Plakar takes encrypted, deduplicated snapshots of etcd cluster state, giving you a reliable recovery point when it matters most.

- [MySQL / MariaDB](https://plakar.io/integrations/mysql/index.md): Protect your MySQL and MariaDB databases against data loss, accidental deletion, and misconfiguration. Plakar provides encrypted, deduplicated snapshots using the backup tools MySQL and MariaDB already ship with.

- [PostgreSQL](https://plakar.io/integrations/postgres/index.md): Protect your PostgreSQL databases against data loss, accidental deletion, and misconfiguration. Plakar provides encrypted, deduplicated snapshots using either logical or physical backups, restorable to any environment.

- [CalDAV](https://plakar.io/integrations/caldav/index.md): Backup and restore your calendar data from any CalDAV-compatible server using Plakar. Plakar creates encrypted, deduplicated, and verifiable backups of your scheduling data.

- [Dropbox](https://plakar.io/integrations/dropbox/index.md): Back up your Dropbox workloads with Plakar to protect against data loss, corruption, and ransomware. Immutable, encrypted, and restorable even offline and across environments.

- [Filesystem](https://plakar.io/integrations/fs/index.md): Back up local directories and mounted filesystems to protect against accidental deletion, corruption, and ransomware. Versioned, encrypted, and fully restorable across systems.

- [FTP](https://plakar.io/integrations/ftp/index.md): Back up and restore directories to and from remote FTP servers. Plakar provides encrypted, deduplicated, and verifiable snapshots for FTP-accessible environments.

- [Google Drive](https://plakar.io/integrations/googledrive/index.md): Back up your Google Drive workloads with Plakar to protect against data loss, corruption, and ransomware. Create immutable, encrypted, and verifiable backups for your Google drive data.

- [iCloud Drive](https://plakar.io/integrations/iclouddrive/index.md): Back up your iCloud Drive files with Plakar to protect against data loss, corruption, and ransomware. Create immutable, encrypted, and verifiable backups for your iCloud Drive data.

- [IMAP](https://plakar.io/integrations/imap/index.md): Back up and restore IMAP mailboxes with end-to-end encryption, immutability, and verifiable integrity. Plakar ensures your email history remains protected across any IMAP-compatible mail server.

- [Koofr](https://plakar.io/integrations/koofr/index.md): Back up your Koofr files with Plakar to protect against data loss, corruption, and ransomware. Create immutable, encrypted, and verifiable backups for your Koofr data.

- [MinIO](https://plakar.io/integrations/minio/index.md): Back up your MinIO workloads with Plakar to protect against data loss, corruption, and ransomware. Immutable, encrypted, and restorable even offline and across environments.

- [Notion](https://plakar.io/integrations/notion/index.md): Back up and restore Notion pages, databases, media, and comments. Plakar ensures encrypted, deduplicated, and verifiable snapshots of your entire workspace.

- [OneDrive](https://plakar.io/integrations/onedrive/index.md): Back up your OneDrive files with Plakar to protect against data loss, corruption, and ransomware. Create immutable, encrypted, and verifiable backups for your OneDrive data.

- [OpenDrive](https://plakar.io/integrations/opendrive/index.md): Back up your OpenDrive workloads with Plakar to protect against data loss, corruption, and ransomware. Plakar provides immutable, encrypted backups.

- [Proton Drive](https://plakar.io/integrations/protondrive/index.md): Back up your Proton Drive workloads with Plakar to protect against data loss, corruption, and ransomware. Immutable, encrypted, and restorable even offline and across environments.

- [S3](https://plakar.io/integrations/s3/index.md): Protect your object storage against accidental deletion, ransomware, and cloud misconfigurations. Plakar provides immutable, encrypted snapshots for S3, restorable across any provider or environment.

- [SFTP](https://plakar.io/integrations/sftp/index.md): Back up and restore directories to and from remote servers over SFTP. Plakar ensures encrypted, deduplicated, and verifiable snapshots across Linux, BSD, and NAS environments.

- [Stdio](https://plakar.io/integrations/stdio/index.md): Back up and restore data directly via Stdio without creating temporary files. Plakar ensures encrypted, deduplicated, and verifiable snapshots for database dumps, logs, and automated pipelines.

- [Tar](https://plakar.io/integrations/tar/index.md): Import data from existing tar archives into Plakar. Imported data is stored securely as deduplicated, verifiable snapshots.

- [Kubernetes](https://plakar.io/integrations/kubernetes/index.md): Protect your Kubernetes infrastructure at every level. Plakar backs up etcd for disaster recovery, manifests for granular inspection and restore, and persistent volumes via CSI snapshots. All encrypted, deduplicated, and portable across environments.

- [Proxmox](https://plakar.io/integrations/proxmox/index.md): Protect your Proxmox clusters against data loss, ransomware, and misconfiguration. Plakar wraps native Proxmox backups into encrypted, deduplicated snapshots that are portable, verifiable, and restorable across clusters or storage backends.



## [Download Plakar](https://plakar.io/download/index.md)

- [Plakar Control Plane](index.md)
- [Plakar v1.0.4](index.md): Download binaries and packages for Plakar v1.0.4. All links are served from plakar.io.
- [Plakar v1.0.5](index.md): Download binaries and packages for Plakar v1.0.5. All links are served from plakar.io.
- [Plakar v1.0.6](index.md): Download binaries and packages for Plakar v1.0.6. All links are served from plakar.io.
- [Plakar v1.1.0](index.md): Download binaries and packages for Plakar v1.1.0. All links are served from plakar.io.
- [Plakar v1.1.2](index.md): Download binaries and packages for Plakar v1.1.2. All links are served from plakar.io.
- [Plakar v1.1.3](index.md): Download binaries and packages for Plakar v1.1.3. All links are served from plakar.io.


## [Legal Notice](https://plakar.io/legal-notice/index.md)

- [Feature and Bug Bounty Program Policy](https://plakar.io/legal-notice/bounty-policy/index.md)
- [Plakar Bounty Roadmap](https://plakar.io/legal-notice/bounties/index.md)


## [Privacy Policy](https://plakar.io/privacy-policy/index.md)



## [Branding](https://plakar.io/branding/index.md)



## [Community](https://plakar.io/community/index.md)



## [Contact](https://plakar.io/contact/index.md)



## [Documentation](https://plakar.io/docs/index.md)

- [Control Plane Docs](https://plakar.io/docs/control-plane/index.md): Plakar Control Plane documentation hub, find guides, references, and resources for working with Plakar Control Plane.
- [Community Docs](https://plakar.io/docs/community/index.md)


## [Solutions](https://plakar.io/solutions/index.md)

- [AWS](https://plakar.io/solutions/aws/index.md)
- [Compare](https://plakar.io/solutions/compare/index.md)
- [Cost Efficiency](https://plakar.io/solutions/cost-efficiency/index.md)
- [On-Premises](https://plakar.io/solutions/on-premises/index.md)



