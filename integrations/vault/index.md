
## Why protecting Vault matters

Vault is often the single source of truth for an organization's secrets:
database credentials, API tokens, encryption keys. Vault itself focuses on
access control and secure storage, not on independent recovery if the cluster is
lost, corrupted, or misconfigured.

- **No independent recovery path**: without a snapshot stored outside the
  cluster, there is nothing to restore from if Vault's own storage backend is
  lost or corrupted.
- **Cluster access can be lost outright**: misplacing the material Vault needs
  to unlock itself on startup can leave an otherwise healthy cluster permanently
  inaccessible.
- **Single point of failure for everything else**: because so many other systems
  depend on Vault for their own credentials, a Vault outage or data loss event
  tends to cascade.

## Security and Compromise

Vault access is controlled by tokens and authentication methods that are, in
turn, provisioned and revoked by administrators. If that control plane is
misused or credentials leak:

- **Unauthorized secret access**: a leaked token can expose every secret it has
  permission to read, not just one system's credentials.
- **Token misuse**: automation and CI pipelines that hold long-lived Vault
  tokens are a common target, since compromising one grants access to everything
  that token can reach.
- **No recovery without a snapshot**: if secrets are deleted, overwritten, or
  Vault's storage backend itself is corrupted, there is no way back without a
  copy stored independently of Vault.

Plakar mitigates this by keeping Vault snapshots encrypted end-to-end and stored
outside the Vault cluster itself, so a compromised cluster doesn't put its own
backup history at risk.

## How Plakar protects your Vault cluster

Plakar integrates with Vault in three ways:

- **Secret provider** (Control Plane only): by default, Plakar Control Plane
  stores its secrets directly in its own database. Vault can instead be
  configured as an external secret provider, so those secrets are managed by
  Vault rather than stored in Control Plane itself.
- **Exporter**: capture a snapshot of a Vault cluster and store it in an
  encrypted, deduplicated Kloset, independent of the running Vault instance.
- **Importer**: restore a snapshot back into a Vault cluster, resetting it to an
  earlier known-good state.

Instead of relying on Vault's own operational tooling to recover a cluster,
Plakar gives you an independent, verifiable copy of its secrets, encrypted and
ready to restore whenever you need it.

