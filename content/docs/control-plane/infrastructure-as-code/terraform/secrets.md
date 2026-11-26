---
title: "Managing Secrets"
date: "2026-11-25T00:00:00Z"
weight: 5
summary:
  "Keeping store and connector credentials out of Terraform state with secret
  providers and write-only fields."
---

# Managing Secrets

A field of a store or a connector takes one of three forms, and the form decides
where its value is kept:

- `fields` holds a plain value. PCP stores it, and Terraform records it in
  state.
- `secret_fields` holds a reference to a secret in a
  [secret provider](../../../secret-providers). Plakar Control Plane resolves it
  each time it needs the value, so PCP and Terraform state only hold the path.
- `fields_wo` holds a write-only value. Plakar Control Plane stores it, and
  Terraform never records it in state.

Each field goes in exactly one of the three maps. A store or connector can use
all three maps at once, with a different form for each field. In the following
store, `root` is plain, the passphrase is write-only, and the S3 keys come from
Vault:

```terraform
resource "plakar_store" "offsite" {
  name        = "Offsite S3"
  integration = "s3"
  resource    = "Ample Sky"
  environment = "production"

  fields = {
    root = "/backups"
  }

  fields_wo = {
    passphrase = var.offsite_passphrase
  }
  fields_wo_version = 1

  secret_fields = {
    access_key        = { provider = plakar_secret_provider.vault.id, path = "secret/backups/offsite#access_key" }
    secret_access_key = { provider = plakar_secret_provider.vault.id, path = "secret/backups/offsite#secret_access_key" }
  }
}
```

## Secret providers

`plakar_secret_provider` declares a
[secret provider](../../../secret-providers), the external secret manager that
`secret_fields` read from. Plakar Control Plane needs a credential to reach the
secret manager, such as a Vault token. Put it in `fields_wo` to keep it out of
Terraform state.

```terraform
variable "vault_token" {
  type      = string
  sensitive = true
  ephemeral = true
}

resource "plakar_secret_provider" "vault" {
  name        = "Vault"
  integration = "vault"

  fields = {
    url = "https://vault.example.com:8200"
  }

  fields_wo = {
    token = var.vault_token
  }
  fields_wo_version = 1
}
```

A `secret_fields` entry names the secret provider by its id, and the path of the
secret in it. The path format depends on the secret manager. For Vault it is
`<secret engine>/<path>#<field>`, as in the example above. The page of each
[secret provider](../../../secret-providers) describes its format.

## Write-only fields

Write-only fields require Terraform 1.11 or later. Terraform cannot compare a
write-only value with anything, so it does not detect a changed value. It sends
`fields_wo` at creation, and again each time `fields_wo_version` changes. To
rotate a credential, change its value and increase `fields_wo_version`.

A key removed from `fields_wo` keeps its value in PCP, as with `fields`. The
examples on this page pass write-only values through ephemeral variables.

## Importing an app with secrets

An import adopts only the fields the integration does not mark as sensitive.
Declare the sensitive ones again after the import, in any of the three forms. A
write-only value cannot be recovered from PCP, so after an import, keep it in
`fields_wo` and increase `fields_wo_version` to send it again.
