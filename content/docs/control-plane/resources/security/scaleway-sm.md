---
title: "Scaleway Secret Manager"
date: "2026-06-30T00:00:00Z"
weight: 1
summary:
  "How to configure a Scaleway Secret Manager resource in Plakar Control Plane."
---

# Scaleway Secret Manager

Scaleway Secret Manager resources represent secrets stored in a Scaleway
project. Plakar Control Plane backs up secrets using the Scaleway Secret Manager
API and stores their values in the Kloset store.

During restore, Plakar Control Plane writes the secrets back to a Scaleway
Secret Manager project. The destination project can be different from the source
project, which makes it possible to copy secrets across projects or regions.

## Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Scaleway["Scaleway Project (source)"]
    Secrets["Secrets"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["Scaleway Secret Manager<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"read secrets"| Secrets
  Secrets --> Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  Store["Kloset Store"]

  subgraph Plakar["Plakar Control Plane"]
    Destination["Scaleway Secret Manager<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph Scaleway["Scaleway Project (destination)"]
    Secrets["Secrets"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"write secrets"| Secrets
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Configuration

Scaleway Secret Manager resources can be configured using a source or
destination app.

### Integration

Automatically set to the Scaleway integration for any resource with `class`
Secret Manager and `subclass` Scaleway.

### Access Key and Secret Key

The access key and secret key used to authenticate with Scaleway. See the
documentation on
[Managing IAM Policies and API Keys on Scaleway](../../../guides/scaleway/iam-and-api-keys)
for instructions on how to set up the permissions and generate an access key and
secret key.

### Region

The Scaleway region where the secrets are stored, for example `fr-par`.

## Additional configuration

### Source

#### Environment

Optional. The SLA environment covering this source, for example production,
staging, or development. See the
[policies documentation](../../../operations/policies) for more details.

#### Data Class

Optional. The SLA data class covering this source, for example critical or PII.
See the [policies documentation](../../../operations/policies) for more details.

## Permissions

Plakar Control Plane requires a set of IAM permissions on your Scaleway project
to read and write secrets. These permissions should be attached to an IAM
application that Plakar Control Plane will use to authenticate. See the
documentation on
[Managing IAM Policies and API Keys on Scaleway](../../../guides/scaleway/iam-and-api-keys)
for instructions on how to set up the permissions and generate an access key and
secret key.

### Source

| Permission                   | Description                            |
| ---------------------------- | -------------------------------------- |
| `SecretManagerReadOnly`      | Read access to secret metadata         |
| `SecretManagerSecretAccess`  | Read access to secret values           |
| `SecretManagerSecretCreate`  | Create new secrets                     |
| `SecretManagerSecretWrite`   | Write new secret versions              |
| `SecretManagerSecretRestore` | Recover secrets or versions on restore |
