---
title: "job_info"
date: "2026-11-26T12:13:20Z"
weight: 12
summary: "Query Plakar job state."
---

# job_info

Written `plakarkorp.plakar.job_info` in a task.

Query Plakar job state.

Reads job state from the Plakar management API, either one job by id or a
filtered list.

Never changes anything.

## Examples

```yaml
- name: Last failed backups
  plakarkorp.plakar.job_info:
    task_type: backup
    status: failed
    limit: 10
  register: failed

- name: One job, with its log
  plakarkorp.plakar.job_info:
    job_id: "{{ run.job.id }}"
    include_log: true
```

## Options

| Option            | Type | Required | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ---- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`         | str  | No       |         | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`         | str  | No       |         | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `at_id`           | str  | No       |         | Return the job of this one-shot run, as returned in `at_id` by `plakarkorp.plakar.backup` and `plakarkorp.plakar.restore`. While the scheduler has not yet materialized the run into a job, the module returns an empty `jobs` list — poll with `until`.                                                                                                                                                           |
| `include_log`     | bool | No       | `false` | Also fetch each returned job's plain-text log. Meant for a single job or a narrow filter; logs are fetched one request per job.                                                                                                                                                                                                                                                                                    |
| `job_id`          | str  | No       |         | Return exactly this job. Mutually exclusive with the list filters.                                                                                                                                                                                                                                                                                                                                                 |
| `limit`           | int  | No       | `50`    | Maximum number of jobs to return.                                                                                                                                                                                                                                                                                                                                                                                  |
| `offset`          | int  | No       | `0`     | Pagination offset.                                                                                                                                                                                                                                                                                                                                                                                                 |
| `organization_id` | str  | No       |         | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `status`          | str  | No       |         | Only jobs in this state. One of `queued`, `running`, `canceled`, `succeeded`, `failed`.                                                                                                                                                                                                                                                                                                                            |
| `task_type`       | str  | No       |         | Only jobs of this task type. One of `backup`, `restore`, `sync`, `check`, `prune`, `rm`, `maintenance`.                                                                                                                                                                                                                                                                                                            |
| `timeout`         | int  | No       | `30`    | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `validate_certs`  | bool | No       | `true`  | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |

## Returns

| Key     | Type         | Returned     | Description                                                  |
| ------- | ------------ | ------------ | ------------------------------------------------------------ |
| `jobs`  | list of dict | always       | The matching jobs, newest first (server ordering).           |
| `total` | int          | when listing | Total number of jobs matching the filter, before pagination. |

### Keys of `jobs`

| Key           | Type | Returned                | Description                                                    |
| ------------- | ---- | ----------------------- | -------------------------------------------------------------- |
| `created_at`  | str  |                         | When the job row was created.                                  |
| `id`          | str  |                         | Job id.                                                        |
| `log`         | str  | when `include_log=true` | Plain-text job log.                                            |
| `schedule_at` | str  |                         | When the job was scheduled to run.                             |
| `started_at`  | str  |                         | When the job started, if it did.                               |
| `status`      | str  |                         | One of `queued`, `running`, `canceled`, `succeeded`, `failed`. |
| `stopped_at`  | str  |                         | When the job stopped, if it did.                               |
| `task_type`   | str  |                         | Type of the task that produced the job.                        |
