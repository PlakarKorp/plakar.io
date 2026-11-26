---
title: "secret_provider"
date: "2026-11-26T12:13:20Z"
weight: 18
summary: "Manage Plakar secret providers."
---

# secret_provider

Written `plakarkorp.plakar.secret_provider` in a task.

Manage Plakar secret providers.

Creates, updates and deletes secret providers in the Plakar management API. A
secret provider is an external secret manager, such as Vault or Scaleway Secret
Manager, that the fields of a store, a connector or an inventory can point into
instead of holding a value.

Declaring one only records how to reach the secret manager. Plakar contacts it
when a field that references it is resolved.

Secret providers are matched by name within the organization; the name is the
playbook's key, so it must be unique.

Only the options the playbook sets are managed on update; anything else keeps
its current server-side value.

## Examples

```yaml
- name: Vault
  plakarkorp.plakar.secret_provider:
    name: Vault
    integration: vault
    fields:
      url: https://vault.example.com:8200
      token: "{{ vault_plakar_token }}"

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

- name: Rotate the token Plakar reaches Vault with
  plakarkorp.plakar.secret_provider:
    name: Vault
    update_secrets: always
    fields:
      token: "{{ vault_plakar_token }}"

- name: Retire it
  plakarkorp.plakar.secret_provider:
    name: Vault
    state: absent
```

## Options

| Option            | Type | Required | Default     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ---- | -------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api_key`         | str  | No       |             | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable.                                                                                                                                                                                                                                                                                 |
| `api_url`         | str  | No       |             | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `fields`          | dict | No       |             | Integration-specific configuration, as a mapping of field name to plain value, for example `url` and `token` for `vault`. The credential of a secret provider is the one secret that cannot come from a secret provider. Take it from Ansible Vault or from a lookup, not from the playbook's text. On update, only the fields named here are compared and replaced; other existing fields are preserved.                                                                                                                                                                                                                                                                                          |
| `integration`     | str  | No       |             | Name of the installed integration backing the secret provider, for example `vault` or `scaleway`. Required when creating; immutable afterwards.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `name`            | str  | Yes      |             | Name of the secret provider.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `organization_id` | str  | No       |             | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `protocol`        | str  | No       |             | Protocol spoken to the secret manager. Defaults to the one the integration declares for secret providers. Unlike a store's, it does not share the integration's name, `vault` speaks `vault-sm`, so set it only when the integration declares several.                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `state`           | str  | No       | `present`   | Whether the secret provider should exist. One of `present`, `absent`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `timeout`         | int  | No       | `30`        | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `update_secrets`  | str  | No       | `on_create` | When to send a value the API does not show. Since v0.19 the Plakar Control Plane leaves the value of a sensitive field out of what it returns, so the module cannot tell whether the one in the playbook differs from the one stored. `on_create` sends such a value at creation only. Later runs leave the stored one alone and report no change for it, also when another option of the same task is updated. `always` sends it on every run, which then reports a change each time. Use it for the run that rotates a credential. A value that references a secret provider is always shown, and so always compared, as is every value on an older Control Plane. One of `on_create`, `always`. |
| `validate_certs`  | bool | No       | `true`      | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

## Returns

| Key               | Type        | Returned                                       | Description                                                                                                                                                                                        |
| ----------------- | ----------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `diff_keys`       | list of str | on update                                      | The option names whose values differed and drove the update.                                                                                                                                       |
| `secret_provider` | dict        | when the secret provider exists or was created | The secret provider acted on (a summary; field values are not echoed). A field of a store, a connector or an inventory references it by its `name` as `provider`, or by its `id` as `provider_id`. |
