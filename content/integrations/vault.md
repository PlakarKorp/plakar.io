---
title: Vault

subtitle: Encrypted backups and restores for HashiCorp Vault clusters

description: >
  Back up and restore a HashiCorp Vault cluster's secrets. Plakar exports a
  Vault cluster into an encrypted, deduplicated Kloset snapshot and restores it
  back to the same cluster or a freshly provisioned one.

technology_title:
  Vault secures secrets, but recovering a cluster is still on you

technology_description: >
  HashiCorp Vault centralizes and controls access to secrets, but it has no
  built-in way to snapshot and recover a cluster independently of Vault itself.

  Plakar adds a secret provider, an importer, and an exporter for Vault, so a
  cluster's secrets can be captured, stored in a Kloset, and restored back to
  the same cluster or a new one.

categories:
  - source
  - destination
  - secrets-manager

seo_tags:
  - HashiCorp Vault backup
  - Vault disaster recovery
  - Vault cluster restore
  - encrypted Vault backup
  - secrets management backup
  - Vault snapshot

links:
  - type: control-plane
    url: /docs/control-plane/resources/security/vault/

edition:
  - control-plane

stage: stable

author:
  - type: official
    name: Plakar

new: true

date: 2026-07-24

resource: Vault

image: img/integrations/vault.png
---

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

- **Secret provider**: by default, Plakar Control Plane stores its secrets
  directly in its own database. Vault can instead be configured as an external
  secret provider, so those secrets are managed by Vault rather than stored in
  Control Plane itself.
- **Source connector**: capture a snapshot of a Vault cluster and store it in an
  encrypted, deduplicated Kloset, independent of the running Vault instance.
- **Destination connector**: restore a snapshot back into a Vault cluster,
  resetting it to an earlier known-good state.

Instead of relying on Vault's own operational tooling to recover a cluster,
Plakar gives you an independent, verifiable copy of its secrets, encrypted and
ready to restore whenever you need it.
