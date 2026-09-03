

# Plakar: Developer branch






## [Getting Started](https://www.plakar.io/docs/community/main/quickstart/index.md)

- [Overview](https://www.plakar.io/docs/community/main/quickstart/overview/index.md): A powerful backup tool with deduplication, end-to-end encryption, and flexible integrations for most data sources.
- [Installation](https://www.plakar.io/docs/community/main/quickstart/installation/index.md): Install Plakar and verify your installation.
- [Quickstart](https://www.plakar.io/docs/community/main/quickstart/first-backup/index.md): Get started with plakar: create your first backup, verify integrity, restore, and use the UI.
- [Synchronize multiple copies](https://www.plakar.io/docs/community/main/quickstart/synchronize-copies/index.md): Create a second copy of your Kloset Store to improve the durability of your backups.
- [Backup non-filesystem data](https://www.plakar.io/docs/community/main/quickstart/backup-non-filesystem-data/index.md): Create a backup for your non-filesystem data. In this guide, we will back up an S3 bucket but this logic applies to any connector supported by plakar.


## [Guides](https://www.plakar.io/docs/community/main/guides/index.md)

- [Scheduling Backups](https://www.plakar.io/docs/community/main/guides/setup-scheduler-daily-backups/index.md): Automate Plakar backups with your operating system&rsquo;s native scheduler: cron, systemd timers, launchd, or Windows Task Scheduler.
- [Importing Configurations](https://www.plakar.io/docs/community/main/guides/importing-configurations/index.md): Learn how to import configurations for stores, sources, and destinations in Plakar using the import command.
- [Creating a Kloset Store](https://www.plakar.io/docs/community/main/guides/create-kloset-repository/index.md): Create a Kloset Store on the filesystem using Plakar.
- [Serving a Kloset Store over the Network](https://www.plakar.io/docs/community/main/guides/serving-a-kloset-store-over-the-network/index.md): Expose a Kloset Store over HTTP using the plakar server command.
- [Excluding files from a backup](https://www.plakar.io/docs/community/main/guides/excluding-files-from-a-backup/index.md): Learn how to exclude files from a backup in Plakar
- [Retrieving secrets via external command](https://www.plakar.io/docs/community/main/guides/retrieve-passphrase-kloset-store/index.md): The passphrase for accessing an encrypted Kloset Store can be stored in the environment, a file, or in the configuration. It can also be retrieved via an external command, for example your password manager.
- [Creating a custom connector](https://www.plakar.io/docs/community/main/guides/creating-a-custom-connector/index.md): Step-by-step guide to implement and install your own Plakar connector (importer) in Go.
- [Logging In to Plakar](https://www.plakar.io/docs/community/main/guides/logging-in-to-plakar/index.md): Log in to unlock optional features like pre-built package installation and alerting.
- [Managing packages](https://www.plakar.io/docs/community/main/guides/managing-packages/index.md): How to install, upgrade, and remove Plakar integration packages.
- [Pruning snapshots](https://www.plakar.io/docs/community/main/guides/using-plakar-prune/index.md): Remove old snapshots from a Kloset store using age, tags, or retention policies.
- [Using Plakar UI](https://www.plakar.io/docs/community/main/guides/using-plakar-ui/index.md): Learn how to start and use the Plakar UI to browse snapshots, restore files, manage integrations, and view alerts.
- [Managing passphrases](https://www.plakar.io/docs/community/main/guides/managing-passphrases/index.md): How Kloset store passphrases work in Plakar and how to change the passphrase used by a Kloset store.
- [MySQL](https://www.plakar.io/docs/community/main/guides/mysql/index.md): Guides on backing up and restoring MySQL database
- [PostgreSQL](https://www.plakar.io/docs/community/main/guides/postgres/index.md): Guides on backing up and restoring PostgreSQL databases
- [OVHcloud](https://www.plakar.io/docs/community/main/guides/ovhcloud/index.md): Guides on running backups in OVHcloud
- [Exoscale](https://www.plakar.io/docs/community/main/guides/exoscale/index.md): Guides on running backups in Exoscale


## [Integrations](https://www.plakar.io/docs/community/main/integrations/index.md)

- [S3](https://www.plakar.io/docs/community/main/integrations/s3/index.md): Back up and restore S3 buckets with Plakar.
- [SFTP / SSH](https://www.plakar.io/docs/community/main/integrations/sftp/index.md): Back up and restore remote directories over SFTP/SSH, and host Kloset stores on remote SFTP servers.
- [HTTP(S)](https://www.plakar.io/docs/community/main/integrations/http/index.md): Install and configure the HTTP(S) integration for Plakar.
- [Dropbox](https://www.plakar.io/docs/community/main/integrations/dropbox/index.md): Back up and restore your Dropbox with Plakar, and host Kloset stores in Dropbox.
- [iCloud Drive](https://www.plakar.io/docs/community/main/integrations/iclouddrive/index.md): Back up and restore your iCloud Drive with Plakar, and host Kloset stores in iCloud Drive.
- [Koofr](https://www.plakar.io/docs/community/main/integrations/koofr/index.md): Back up and restore your Koofr with Plakar, and host Kloset stores in Koofr.
- [Google Drive](https://www.plakar.io/docs/community/main/integrations/googledrive/index.md): Back up and restore your Google Drive with Plakar, and host Kloset stores in Google Drive.
- [OneDrive](https://www.plakar.io/docs/community/main/integrations/onedrive/index.md): Back up and restore your OneDrive with Plakar, and host Kloset stores in OneDrive.
- [OpenDrive](https://www.plakar.io/docs/community/main/integrations/opendrive/index.md): Back up and restore OpenDrive data with Plakar, and host Kloset stores in OpenDrive.
- [Proton Drive](https://www.plakar.io/docs/community/main/integrations/protondrive/index.md): Back up and restore your Proton Drive with Plakar, and host Kloset stores in Proton Drive.
- [Proxmox](https://www.plakar.io/docs/community/main/integrations/proxmox/index.md): Back up and restore Proxmox virtual machines and containers with Plakar.
- [Kubernetes](https://www.plakar.io/docs/community/main/integrations/kubernetes/index.md): Back up and restore Kubernetes resources and persistent volumes with Plakar.
- [etcd](https://www.plakar.io/docs/community/main/integrations/etcd/index.md): Back up etcd clusters with Plakar.
- [Notion](https://www.plakar.io/docs/community/main/integrations/notion/index.md): Back up and restore your Notion workspace with Plakar.
- [PostgreSQL](https://www.plakar.io/docs/community/main/integrations/postgres/index.md): Back up and restore PostgreSQL databases with Plakar — logical dumps, AWS IAM authentication, and physical base backups.
- [MySQL / MariaDB](https://www.plakar.io/docs/community/main/integrations/mysql/index.md): Back up and restore MySQL and MariaDB databases with Plakar — logical dumps via mysqldump and mariadb-dump, with Google Cloud SQL support.
- [Azure Blob Storage](https://www.plakar.io/docs/community/main/integrations/azblob/index.md): Back up and restore Azure Blob Storage containers with Plakar.
- [Google Cloud Storage](https://www.plakar.io/docs/community/main/integrations/gcs/index.md): Back up and restore Google Cloud Storage buckets with Plakar.
- [OCI Registry](https://www.plakar.io/docs/community/main/integrations/oci/index.md): Use an OCI registry as a Kloset store backend with Plakar.
- [WebDAV](https://www.plakar.io/docs/community/main/integrations/webdav/index.md): Back up and restore WebDAV remotes with Plakar.
- [TAR](https://www.plakar.io/docs/community/main/integrations/tar/index.md): Import TAR archives into a Kloset store with Plakar.
- [STDIO](https://www.plakar.io/docs/community/main/integrations/stdio/index.md): Back up from stdin and restore to stdout or stderr with Plakar.
- [FTP](https://www.plakar.io/docs/community/main/integrations/ftp/index.md): Back up remote directories over FTP, and restore snapshots to FTP destinations.
- [IMAP](https://www.plakar.io/docs/community/main/integrations/imap/index.md): Back up and restore mailboxes over IMAP.


## [Explanations](https://www.plakar.io/docs/community/main/explanations/index.md)

- [How Plakar Works](https://www.plakar.io/docs/community/main/explanations/how-plakar-works/index.md): Understand the core architecture and data processing pipeline behind Plakar, including Kloset stores, chunking, deduplication, compression, encryption, and snapshot management
- [Should you push or pull backups](https://www.plakar.io/docs/community/main/explanations/should-you-pull-or-push-backups/index.md): Understand the difference between push and pull backup models, and how Plakar supports both.
- [How many Kloset Stores should you create](https://www.plakar.io/docs/community/main/explanations/how-many-kloset-stores/index.md): Understand how deduplication, data similarity, and security requirements affect the number of Kloset Stores you should use.
- [Why multiple backup copies matter](https://www.plakar.io/docs/community/main/explanations/why-several-copies/index.md): Understand why multiple backup copies drastically reduce the risk of data loss, and how this leads to the 3‑2‑1 backup strategy.
- [Why you need to backup your SaaS](https://www.plakar.io/docs/community/main/explanations/why-should-i-backup-my-saas/index.md): Understand why cloud services do not replace backups, and why SaaS data requires independent protection.
- [How Maintenance Works](https://www.plakar.io/docs/community/main/explanations/how-maintenance-works/index.md): Understand how Plakar stores backup data in chunks and packfiles, why deleting a snapshot does not immediately free space, and how the maintenance process safely reclaims unused storage.


## [References](https://www.plakar.io/docs/community/main/references/index.md)

- [Plakar Ptar](https://www.plakar.io/docs/community/main/references/ptar/index.md): Command reference for creating and accessing Ptar archives: syntax, options, and examples for plakar ptar and related commands.
- [Command line syntax](https://www.plakar.io/docs/community/main/references/command-line-syntax/index.md): How Plakar commands are structured, why flag order matters, and how to get help from the CLI.
- [Go Kloset SDK](https://www.plakar.io/docs/community/main/references/sdk/index.md): Go SDK reference for building Plakar integrations.
- [Commands](https://www.plakar.io/docs/community/main/references/commands/index.md): Reference for all Plakar commands. Browse detailed documentation for each command, including usage, options, and examples. Access help online or directly from your terminal.


## [Community](https://www.plakar.io/docs/community/main/community/index.md)




