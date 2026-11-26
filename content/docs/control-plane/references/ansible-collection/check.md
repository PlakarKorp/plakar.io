---
title: "check"
date: "2026-11-26T12:13:20Z"
weight: 2
summary: "Verify the integrity of Plakar snapshots."
---

# check

Written `plakarkorp.plakar.check` in a task.

Verify the integrity of Plakar snapshots.

Triggers an on-demand integrity check of the snapshots held in a store, through
the Plakar management API.

The store is addressed by name and resolved within the organization at run time.
Without `snapshot_id` the whole store is checked.

The run is asynchronous server-side. By default the module polls until the job
stops and fails unless it succeeded — a failed check means the data did not
verify.

## Examples

```yaml
- name: Weekly integrity check of the offsite store
  plakarkorp.plakar.check:
    store: Offsite S3
    wait_timeout: 3600

- name: Verify one snapshot before restoring it
  plakarkorp.plakar.check:
    store: S3 Store
    snapshot_id: "{{ snapshot_to_restore }}"
```

## Options

| Option            | Type        | Required | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ----------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`         | str         | No       |         | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`         | str         | No       |         | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `edge_tags`       | list of str | No       |         | Select a remote edge by tags (all must match) to execute the job, falling back to local execution when no edge matches.                                                                                                                                                                                                                                                                                            |
| `labels`          | list of str | No       |         | Only check snapshots carrying these labels.                                                                                                                                                                                                                                                                                                                                                                        |
| `organization_id` | str         | No       |         | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `snapshot_id`     | str         | No       |         | Check only this snapshot.                                                                                                                                                                                                                                                                                                                                                                                          |
| `store`           | str         | Yes      |         | Name of the store whose snapshots to verify.                                                                                                                                                                                                                                                                                                                                                                       |
| `timeout`         | int         | No       | `30`    | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
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
