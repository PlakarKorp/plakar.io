

# Plakar: v1.0.5






## [Getting Started](https://plakar.io/docs/community/v1.0.5/quickstart/index.md)

- [Quickstart](https://plakar.io/docs/community/v1.0.5/quickstart/quickstart/index.md): Get started with plakar: installation, creating your first backup, verifying, restoring, and using the UI. This guide helps you quickly set up plakar and perform essential backup operations.


## [Guides](https://plakar.io/docs/community/v1.0.5/guides/index.md)

- [Scheduling Tasks](https://plakar.io/docs/community/v1.0.5/guides/setup-scheduler-daily-backups/index.md): Learn how to configure and run the Plakar scheduler to automate backups.
- [Importing Configurations](https://plakar.io/docs/community/v1.0.5/guides/importing-configurations/index.md): Learn how to import configurations for stores, sources, and destinations in Plakar using the import command.
- [Creating a Kloset Store](https://plakar.io/docs/community/v1.0.5/guides/create-kloset-repository/index.md): Create a Kloset Store on the filesystem using Plakar.
- [Serving a Kloset Store over the Network](https://plakar.io/docs/community/v1.0.5/guides/serving-a-kloset-store-over-the-network/index.md): Expose a Kloset Store over HTTP using the plakar server command.
- [Excluding files from a backup](https://plakar.io/docs/community/v1.0.5/guides/excluding-files-from-a-backup/index.md): Learn how to exclude files from a backup in Plakar
- [Retrieving secrets via external command](https://plakar.io/docs/community/v1.0.5/guides/retrieve-passphrase-kloset-store/index.md): The passphrase for accessing an encrypted Kloset Store can be stored in the environment, a file, or in the configuration. It can also be retrieved via an external command, for example your password manager.
- [Logging In to Plakar](https://plakar.io/docs/community/v1.0.5/guides/logging-in-to-plakar/index.md): Log in to unlock optional features like pre-built package installation and alerting.
- [Managing packages](https://plakar.io/docs/community/v1.0.5/guides/managing-packages/index.md): How to install, upgrade, and remove Plakar integration packages.
- [Pruning snapshots](https://plakar.io/docs/community/v1.0.5/guides/using-plakar-prune/index.md): Remove old snapshots from a Kloset store using age, tags, or retention policies.
- [Using Plakar UI](https://plakar.io/docs/community/v1.0.5/guides/using-plakar-ui/index.md): Learn how to start and use the Plakar UI to browse snapshots, restore files, manage integrations, and view alerts.


## [Integrations](https://plakar.io/docs/community/v1.0.5/integrations/index.md)

- [S3](https://plakar.io/docs/community/v1.0.5/integrations/s3/index.md): Back up and restore S3 buckets with Plakar.
- [SFTP / SSH](https://plakar.io/docs/community/v1.0.5/integrations/sftp/index.md): Back up and restore remote directories over SFTP/SSH, and host Kloset stores on remote SFTP servers.
- [HTTP](https://plakar.io/docs/community/v1.0.5/integrations/http/index.md): Install and configure the HTTP integration for Plakar.
- [Notion](https://plakar.io/docs/community/v1.0.5/integrations/notion/index.md): Back up and restore your Notion workspace with Plakar.
- [Dropbox](https://plakar.io/docs/community/v1.0.5/integrations/dropbox/index.md): Back up and restore your Dropbox with Plakar, and host Kloset stores in Dropbox.
- [iCloud Drive](https://plakar.io/docs/community/v1.0.5/integrations/iclouddrive/index.md): Back up and restore your iCloud Drive with Plakar, and host Kloset stores in iCloud Drive.
- [Koofr](https://plakar.io/docs/community/v1.0.5/integrations/koofr/index.md): Back up and restore your Koofr with Plakar, and host Kloset stores in Koofr.
- [Google Drive](https://plakar.io/docs/community/v1.0.5/integrations/googledrive/index.md): Back up and restore your Google Drive with Plakar, and host Kloset stores in Google Drive.
- [OneDrive](https://plakar.io/docs/community/v1.0.5/integrations/onedrive/index.md): Back up and restore your OneDrive with Plakar, and host Kloset stores in OneDrive.
- [OpenDrive](https://plakar.io/docs/community/v1.0.5/integrations/opendrive/index.md): Back up and restore OpenDrive data with Plakar, and host Kloset stores in OpenDrive.
- [Proton Drive](https://plakar.io/docs/community/v1.0.5/integrations/protondrive/index.md): Back up and restore your Proton Drive with Plakar, and host Kloset stores in Proton Drive.


## [Explanations](https://plakar.io/docs/community/v1.0.5/explanations/index.md)

- [How Plakar Works](https://plakar.io/docs/community/v1.0.5/explanations/how-plakar-works/index.md): Understand the core architecture and data processing pipeline behind Plakar, including Kloset stores, chunking, deduplication, compression, encryption, and snapshot management
- [Should you push or pull backups](https://plakar.io/docs/community/v1.0.5/explanations/should-you-pull-or-push-backups/index.md): Understand the difference between push and pull backup models, and how Plakar supports both.
- [How many Kloset Stores should you create](https://plakar.io/docs/community/v1.0.5/explanations/how-many-kloset-stores/index.md): Understand how deduplication, data similarity, and security requirements affect the number of Kloset Stores you should use.
- [Why multiple backup copies matter](https://plakar.io/docs/community/v1.0.5/explanations/why-several-copies/index.md): Understand why multiple backup copies drastically reduce the risk of data loss, and how this leads to the 3‑2‑1 backup strategy.
- [Why you need to backup your SaaS](https://plakar.io/docs/community/v1.0.5/explanations/why-should-i-backup-my-saas/index.md): Understand why cloud services do not replace backups, and why SaaS data requires independent protection.
- [How Maintenance Works](https://plakar.io/docs/community/v1.0.5/explanations/how-maintenance-works/index.md): Understand how Plakar stores backup data in chunks and packfiles, why deleting a snapshot does not immediately free space, and how the maintenance process safely reclaims unused storage.


## [References](https://plakar.io/docs/community/v1.0.5/references/index.md)

- [Command line syntax](https://plakar.io/docs/community/v1.0.5/references/command-line-syntax/index.md): How Plakar commands are structured, why flag order matters, and how to get help from the CLI.
- [Commands](https://plakar.io/docs/community/v1.0.5/references/commands/index.md): Reference for all Plakar commands. Browse detailed documentation for each command, including usage, options, and examples. Access help online or directly from your terminal.


## [Community](https://plakar.io/docs/community/v1.0.5/community/index.md)




