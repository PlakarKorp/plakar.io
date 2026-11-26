---
title: "environment"
date: "2026-11-26T12:13:20Z"
weight: 5
summary: "Manage the environments of a Plakar organization."
---

# environment

Written `plakarkorp.plakar.environment` in a task.

Manage the environments of a Plakar organization.

Adds an environment to an organization, or removes it. Environments are the
names a store or a connector can carry as its `environment`, and the
Classification page lists them.

A new organization comes with `integration`, `production`, `staging` and
`testing`.

Names are kept exactly as written, case and spaces included, so `Prod` and
`prod` are two environments. A name is its own identity; there is nothing to
update.

## Examples

```yaml
- name: A pre-production environment
  plakarkorp.plakar.environment:
    name: preprod

- name: Label a store with it
  plakarkorp.plakar.store:
    name: Offsite S3
    environment: preprod

- name: The organization has no testing environment
  plakarkorp.plakar.environment:
    name: testing
    state: absent
```

## Options

| Option            | Type | Required | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ---- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`         | str  | No       |           | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`         | str  | No       |           | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `name`            | str  | Yes      |           | Name of the environment.                                                                                                                                                                                                                                                                                                                                                                                           |
| `organization_id` | str  | No       |           | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `state`           | str  | No       | `present` | Whether the environment should exist. `absent` removes the name for the whole organization. One of `present`, `absent`.                                                                                                                                                                                                                                                                                            |
| `timeout`         | int  | No       | `30`      | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `validate_certs`  | bool | No       | `true`    | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |

## Returns

| Key           | Type | Returned                                    | Description                                |
| ------------- | ---- | ------------------------------------------- | ------------------------------------------ |
| `environment` | dict | when the environment exists, or was removed | The environment acted on, with its `name`. |

> [!NOTE]
>
> Call it by its full name, `plakarkorp.plakar.environment`. The short name is
> also a task keyword, which Ansible would read instead.
