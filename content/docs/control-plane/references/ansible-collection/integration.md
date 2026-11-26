---
title: "integration"
date: "2026-11-26T12:13:20Z"
weight: 7
summary: "Install Plakar integrations from the catalog."
---

# integration

Written `plakarkorp.plakar.integration` in a task.

Install Plakar integrations from the catalog.

Installs an integration from the catalog of the Plakar Control Plane and makes
that version the current one, or uninstalls it. An integration is what lets
Plakar speak to a kind of resource, for example `s3`, `sftp` or `vault`.

Integrations belong to the deployment, not to an organization. Installing and
uninstalling need the `platform-admin` role, and an uninstall takes the
integration away from every organization.

## Examples

```yaml
- name: The s3 integration, whichever version is there
  plakarkorp.plakar.integration:
    name: s3

- name: Vault, pinned
  plakarkorp.plakar.integration:
    name: vault
    version: v1.1.13

- name: Retire an integration nothing uses any more
  plakarkorp.plakar.integration:
    name: sftp
    state: absent
```

## Options

| Option            | Type | Required | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ---- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`         | str  | No       |           | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`         | str  | No       |           | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `name`            | str  | Yes      |           | Name of the integration in the catalog, for example `s3`.                                                                                                                                                                                                                                                                                                                                                          |
| `organization_id` | str  | No       |           | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `state`           | str  | No       | `present` | Whether the integration should be installed. `absent` uninstalls every installed version of it. The stores and connectors that use it stop working. One of `present`, `absent`.                                                                                                                                                                                                                                    |
| `timeout`         | int  | No       | `30`      | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `validate_certs`  | bool | No       | `true`    | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |
| `version`         | str  | No       |           | Version to install and make current, for example `v1.1.13`. Pinning it is the deterministic choice. Left out, an integration that is already installed is left on its current version, never upgraded. One that is not is installed at the highest version the catalog offers, in semantic-version order. The catalog marks no version as stable, so that may be a prerelease.                                     |

## Returns

| Key           | Type | Returned                                              | Description                                                                                                                                            |
| ------------- | ---- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `integration` | dict | when the integration is installed, or was uninstalled | The version that is current after the task, with its `id`, `name` and `version`. With `state=absent`, the name and the versions that were uninstalled. |
