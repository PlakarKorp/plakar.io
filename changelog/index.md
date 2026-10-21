





## [Plakar](https://www.stg.plakar.io/changelog/plakar/index.md)

- [Plakar v1.1.7](index.md): A follow-up to the v1.1.6 authentication changes. Signing in from the Plakar UI now uses the confirmation code flow. This release also adds new <code>fs</code> exporter options and fixes backup lock handling and several Windows issues.
- [Plakar v1.1.6](index.md): A security release. Authenticating with <code>plakar login</code> now requires a confirmation code typed into the terminal that started it, and the API server stops accepting the previous flow on 18 September 2026.
- [Plakar v1.1.5](index.md): A security-focused patch release. Plakar now refuses to open an unencrypted Kloset store unless you opt in, plugins are signature-checked at install time, and the HTTP store and server were hardened.


## [Plakar Operator](https://www.stg.plakar.io/changelog/plakar-operator/index.md)

- [Plakar Operator v0.1.0](index.md): Adapts the operator to the new plakman API and fixes Helm chart image tagging.
- [Plakar Operator v0.0.3](index.md): Adds a Restore CRD, TaskRun reporting, EdgeTags, and connector reachability checks.
- [Plakar Operator v0.0.2](index.md): Adds Destination, task, and multi-group CRDs, a Helm chart, and a full regression test suite backed by a fake control plane.


## [Azure Blob Storage](https://www.stg.plakar.io/changelog/azblob/index.md)

- [Azure Blob Storage v1.1.0](index.md): First stable release of the Azure Blob Storage integration.


## [Filesystem](https://www.stg.plakar.io/changelog/fs/index.md)

- [Filesystem v1.1.8](index.md): Adds options to skip restoring ownership, permissions and times, and fixes backups on Windows.
- [Filesystem v1.1.0-beta.7](index.md): Fixes a regression with <code>-ignore-file</code>.


## [HTTP](https://www.stg.plakar.io/changelog/http/index.md)

- [HTTP v1.1.3](index.md): Hardens HTTP connections, refuses tokens over plain HTTP by default, and adds a request timeout.


## [LDAP](https://www.stg.plakar.io/changelog/ldap/index.md)

- [LDAP v1.1.0-beta.2](index.md): Refuses cleartext binds by default, fixes StartTLS, and adds the <code>ldap+starttls</code> protocol.


## [PostgreSQL](https://www.stg.plakar.io/changelog/postgresql/index.md)

- [PostgreSQL v1.1.1](index.md): Validates database names before backup and removes temporary SSL keys when a connector fails to start.


## [PTAR](https://www.stg.plakar.io/changelog/ptar/index.md)

- [PTAR v1.1.1](index.md): Hardens reading .ptar archives over HTTP.


## [RouterOS](https://www.stg.plakar.io/changelog/routeros/index.md)

- [RouterOS v1.1.0-alpha.2](index.md): Adds host key verification and SSH agent support, and redacts credentials from errors.
- [RouterOS v1.1.0-alpha.1](index.md): First alpha release of the RouterOS integration.


## [Scaleway](https://www.stg.plakar.io/changelog/scaleway/index.md)

- [Scaleway v1.1.11](index.md): Fixes restores that failed with a double close.


## [Tar](https://www.stg.plakar.io/changelog/tar/index.md)

- [Tar v1.1.1](index.md): Fixes the handling of symbolic links and hard links in archives.


## [Kubernetes](https://www.stg.plakar.io/changelog/k8s/index.md)

- [Kubernetes v1.1.11](index.md): Adds namespace remapping on restore, PVC ignore patterns, and cluster-level inventory entries.
- [Kubernetes v1.1.10](index.md): Adds KubeVirt VM support, Block PVC, namespace filtering, and mTLS between Plakar and the pod.
- [Kubernetes v1.1.9](index.md): Secures pod communication with mTLS, adds a readiness probe, and hardens resource cleanup and error handling.
- [Kubernetes v1.1.8](index.md): Makes kubeconfig optional in the schema.
- [Kubernetes v1.1.7](index.md): Fixes inventory endpoint paths, Root(), and PVC existence checks.
- [Kubernetes v1.1.6](index.md): Exposes the inventory schema for the Plakar Control Plane.
- [Kubernetes v1.1.5](index.md): Bundles the inventory and adds Endpoints to it.
- [Kubernetes v1.1.3](index.md): Fixes the PVC exporter validator and adds manifest classes.


## [FTP](https://www.stg.plakar.io/changelog/ftp/index.md)

- [FTP v1.1.3](index.md): A security release. FTPS is now the default and restore sets file permissions.


## [MySQL](https://www.stg.plakar.io/changelog/mysql/index.md)

- [MySQL v1.1.0](index.md): Hardens Cloud SQL proxy support and dump filename validation.
- [MySQL v1.1.1](index.md): Adds SSL file parameters and skips account listing for single-database backups.


## [OpenStack](https://www.stg.plakar.io/changelog/openstack/index.md)

- [OpenStack v1.1.1](index.md): Adds block storage and Nova instance backup and restore, and fixes encrypted volume handling.
- [OpenStack v1.1.0](index.md): First release. Backs up and restores Nova, Cinder, Swift, Trove, and Glance resources.


## [SFTP](https://www.stg.plakar.io/changelog/sftp/index.md)

- [SFTP v1.1.9](index.md): A security release that hardens restores.
- [SFTP v1.1.8](index.md): Read-only OpenSSH servers can be used as a store again.
- [SFTP v1.1.7](index.md): Stores check for the rename extension they need, and <code>set_owner</code> keeps setuid and setgid bits.
- [SFTP v1.1.6](index.md): A rework of the integration with faster restores, host key verification and path containment checks.
- [SFTP v1.1.5](index.md): Adds the <code>set_owner</code> option and fixes hardlinks and Windows support.
- [SFTP v1.1.4](index.md): Backups record file ownership.


## [Rclone](https://www.stg.plakar.io/changelog/rclone/index.md)

- [Rclone v1.1.2](index.md): Fixes a context lifecycle bug that could stall the rclone filesystem.
- [Rclone v1.1.1](index.md): Skips partially written files during backup.
- [Rclone v1.1.0](index.md): Full rewrite of the rclone integration with automated tests.


## [S3](https://www.stg.plakar.io/changelog/s3/index.md)

- [S3 v1.1.8](index.md): Adds ambient credentials, protects buckets with Object Lock from store re-creation, and makes <code>root</code> a prefix in every addressing mode.
- [S3 v1.1.7](index.md): Increases connection pool size and fixes prefix handling in virtual-host mode.
- [S3 v1.1.6](index.md): Adds optional region configuration, retry logic, and fixes silent errors during listing.



