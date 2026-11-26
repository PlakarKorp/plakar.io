---
title: "sync"
date: "2026-11-26T12:13:20Z"
weight: 20
summary: "Sync snapshots between Plakar stores."
---

# sync

Written `plakarkorp.plakar.sync` in a task.

Sync snapshots between Plakar stores.

Triggers an on-demand synchronization of snapshots from one store into another —
offsite replication, hot-to-cold tiering — through the Plakar management API.

Stores are addressed by name; names are resolved within the organization at run
time.

The run is asynchronous server-side. By default the module polls until the job
stops and fails unless it succeeded.

## Examples

```yaml
- name: Replicate the hot store offsite
  plakarkorp.plakar.sync:
    store: Hot S3
    to_store: Offsite S3

- name: Tier only the nightly snapshots to cold storage
  plakarkorp.plakar.sync:
    store: Hot S3
    to_store: Cold S3
    labels: [nightly]
```

## Options

| Option            | Type        | Required | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ----------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`         | str         | No       |         | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`         | str         | No       |         | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `edge_tags`       | list of str | No       |         | Select a remote edge by tags (all must match) to execute the job, falling back to local execution when no edge matches.                                                                                                                                                                                                                                                                                            |
| `labels`          | list of str | No       |         | Only sync snapshots carrying these labels.                                                                                                                                                                                                                                                                                                                                                                         |
| `organization_id` | str         | No       |         | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `store`           | str         | Yes      |         | Name of the store holding the snapshots to sync.                                                                                                                                                                                                                                                                                                                                                                   |
| `timeout`         | int         | No       | `30`    | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `to_store`        | str         | Yes      |         | Name of the store to sync the snapshots into.                                                                                                                                                                                                                                                                                                                                                                      |
| `validate_certs`  | bool        | No       | `true`  | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |
| `wait`            | bool        | No       | `true`  | Whether to wait for the triggered job to finish. When false, the module returns as soon as the run is accepted; poll it later with `plakarkorp.plakar.job_info`.                                                                                                                                                                                                                                                   |
| `wait_timeout`    | int         | No       | `600`   | Seconds to wait for the job to finish before failing.                                                                                                                                                                                                                                                                                                                                                              |

## Returns

| Key     | Type | Returned                   | Description                                                                                                                |
| ------- | ---- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `at_id` | str  | always (except check mode) | Identifier of the one-shot run (the scheduler's `at` entry).                                                               |
| `job`   | dict | when available             | The job the run materialized into. Only present once the scheduler picked the run up — with `wait=false` it may be absent. |
| `log`   | str  | on job failure             | Plain-text job log, fetched when the job did not succeed.                                                                  |

### Keys of `job`

| Key          | Type | Returned | Description                                                    |
| ------------ | ---- | -------- | -------------------------------------------------------------- |
| `id`         | str  |          | Job id, usable with `plakarkorp.plakar.job_info`.              |
| `started_at` | str  |          | When the job started, if it did.                               |
| `status`     | str  |          | One of `queued`, `running`, `canceled`, `succeeded`, `failed`. |
| `stopped_at` | str  |          | When the job stopped, if it did.                               |
