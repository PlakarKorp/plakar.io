---
title: "Managing Secrets"
date: "2026-11-26T00:00:00Z"
weight: 5
summary:
  "Declaring secret providers, and taking store, connector and inventory
  credentials from them."
---

# Managing Secrets

A field of a store, a connector or an inventory takes either a plain value or a
reference to a secret in a [secret provider](../../../secret-providers). Plakar
Control Plane resolves a reference each time it needs the value, so it only
stores the path.

## Secret providers

The `secret_provider` module declares a secret provider by name. Plakar Control
Plane needs a credential to reach the secret manager, such as a Vault token.
Take it from Ansible Vault or a lookup.

```yaml
- name: Declare Vault
  plakarkorp.plakar.secret_provider:
    name: Vault
    integration: vault
    fields:
      url: https://vault.example.com:8200
      token: "{{ vault_plakar_token }}"
```

## Referencing a secret

To take a field from a secret provider, give a mapping with `value`, the path of
the secret, and `provider`, the name of the secret provider. `provider_id` takes
its id instead. The `fields` of a store or a connector and the `configuration`
of an inventory accept this form.

```yaml
- name: A store whose keys stay in Vault
  plakarkorp.plakar.store:
    name: Offsite S3
    integration: s3
    resource: Ample Sky
    fields:
      root: /backups
      passphrase:
        value: secret/prod/plakar#passphrase
        provider: Vault
      access_key:
        value: secret/prod/s3#access_key
        provider: Vault
      secret_access_key:
        value: secret/prod/s3#secret_key
        provider: Vault
```

The path format depends on the secret manager. For Vault it is
`<secret engine>/<path>#<field>`. The page of each
[secret provider](../../../secret-providers) describes its format.

## Updating secrets

PCP does not return the value of a sensitive field, so a module cannot compare
it with the one in the playbook. `update_secrets` decides when the playbook's
value is sent:

- `on_create`, the default, sends it at creation only.
- `always` sends it on every run. Use it for the run that rotates a credential.

```yaml
- name: Rotate the token PCP reaches Vault with
  plakarkorp.plakar.secret_provider:
    name: Vault
    update_secrets: always
    fields:
      token: "{{ vault_plakar_token }}"
```

A reference to a secret provider is always compared, since PCP returns the path.
