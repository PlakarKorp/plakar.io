---
title: "restore"
date: "2026-11-26T12:13:20Z"
weight: 17
summary: "Trigger a Plakar restore."
---

# restore

Written `plakarkorp.plakar.restore` in a task.

Trigger a Plakar restore.

Triggers an on-demand restore of a snapshot from a store onto a destination
connector, through the Plakar management API.

Connectors are addressed by name. When no `snapshot_id` is given, the newest
snapshot in the store is restored.

The run is asynchronous server-side. By default the module polls until the job
stops and fails unless it succeeded.

## Examples

```yaml
- name: Restore the latest snapshot
  plakarkorp.plakar.restore:
    api_url: https://plakar.example.com
    api_key: "{{ plakar_api_key }}"
    store: S3 Store
    destination: Recovery target

- name: Restore a specific snapshot
  plakarkorp.plakar.restore:
    store: S3 Store
    destination: Recovery target
    snapshot_id: d3f1286e79df77637224188ccb5ad9dd3bb1fb5df353fcf7822222cce9eb7c3c
```

## Options

| Option            | Type        | Required | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ----------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`         | str         | No       |         | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`         | str         | No       |         | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `destination`     | str         | Yes      |         | Name of the destination connector to restore onto.                                                                                                                                                                                                                                                                                                                                                                 |
| `edge_tags`       | list of str | No       |         | Select a remote edge by tags (all must match) to execute the job, falling back to local execution when no edge matches.                                                                                                                                                                                                                                                                                            |
| `organization_id` | str         | No       |         | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `snapshot_id`     | str         | No       |         | Identifier of the snapshot to restore. When omitted, the newest snapshot in the store (by creation time) is restored.                                                                                                                                                                                                                                                                                              |
| `store`           | str         | Yes      |         | Name of the store connector holding the snapshot.                                                                                                                                                                                                                                                                                                                                                                  |
| `timeout`         | int         | No       | `30`    | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `validate_certs`  | bool        | No       | `true`  | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |
| `wait`            | bool        | No       | `true`  | Whether to wait for the triggered job to finish. When false, the module returns as soon as the run is accepted; poll it later with `plakarkorp.plakar.job_info`.                                                                                                                                                                                                                                                   |
| `wait_timeout`    | int         | No       | `600`   | Seconds to wait for the job to finish before failing.                                                                                                                                                                                                                                                                                                                                                              |

## Returns

| Key           | Type | Returned                   | Description                                                                                                                |
| ------------- | ---- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `at_id`       | str  | always (except check mode) | Identifier of the one-shot run (the scheduler's `at` entry).                                                               |
| `job`         | dict | when available             | The job the run materialized into. Only present once the scheduler picked the run up — with `wait=false` it may be absent. |
| `log`         | str  | on job failure             | Plain-text job log, fetched when the job did not succeed.                                                                  |
| `snapshot_id` | str  | always                     | The snapshot that was restored.                                                                                            |

### Keys of `job`

| Key          | Type | Returned | Description                                                    |
| ------------ | ---- | -------- | -------------------------------------------------------------- |
| `id`         | str  |          | Job id, usable with `plakarkorp.plakar.job_info`.              |
| `started_at` | str  |          | When the job started, if it did.                               |
| `status`     | str  |          | One of `queued`, `running`, `canceled`, `succeeded`, `failed`. |
| `stopped_at` | str  |          | When the job stopped, if it did.                               |
