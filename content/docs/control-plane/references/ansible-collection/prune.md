---
title: "prune"
date: "2026-11-26T12:13:20Z"
weight: 16
summary: "Prune snapshots from a Plakar store by retention rule."
---

# prune

Written `plakarkorp.plakar.prune` in a task.

Prune snapshots from a Plakar store by retention rule.

Applies a retention rule to a store's snapshots and deletes what falls outside
it, through the Plakar management API. Snapshots under legal hold are never
deleted and are reported separately.

In check mode nothing is deleted — the API's prune preview reports what would be
deleted, kept and held.

The module is `changed` only when snapshots were actually deleted (or, in check
mode, would be).

## Examples

```yaml
- name: Keep a daily snapshot for a week and a monthly one for a year
  plakarkorp.plakar.prune:
    store: S3 Store
    retention:
      day: 7
      per_day: 1
      month: 12
      per_month: 1

- name: Retention per source rather than across the whole store
  plakarkorp.plakar.prune:
    store: S3 Store
    retention:
      year: 2
      per_year: 2
    group_by: dataset

- name: Only the nightly snapshots, and see what would go, without deleting
  plakarkorp.plakar.prune:
    store: S3 Store
    retention:
      day: 3
      per_day: 1
    tags: [nightly]
  check_mode: true
  register: preview
```

## Options

| Option            | Type        | Required | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ----------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`         | str         | No       |         | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`         | str         | No       |         | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `filters`         | dict        | No       |         | Further narrowing, passed to the API's locate filters — a mapping of `ignore_tags`, `before`, `since`, `name`, `category`, `environment`, `perimeter`, `job`, `dataset`, `latest`, `ids`, `types`, `origins`, `roots`, `data_classes`. `tags` is shorthand for `filters.tags`; both may be set and merge.                                                                                                          |
| `group_by`        | str         | No       |         | Partition the matched snapshots before applying the rule, so retention is honored per group instead of across the whole store — for example `dataset` keeps the rule per source instead of globally. One of `name`, `category`, `environment`, `perimeter`, `job`, `dataset`, `data-class`, `tag`, `origin`, `type`, `root`.                                                                                       |
| `organization_id` | str         | No       |         | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `retention`       | dict        | Yes      |         | The retention rule, as a mapping of bucket options — `minute`, `hour`, `day`, `week`, `month`, `year` say how many recent buckets of that unit to keep, and `per_minute`, `per_hour`, `per_day`, `per_week`, `per_month`, `per_year` how many snapshots to keep in each. For example `{day: 7, per_day: 1, month: 12, per_month: 1}` keeps one snapshot a day for a week and one a month for a year.               |
| `store`           | str         | Yes      |         | Name of the store to prune.                                                                                                                                                                                                                                                                                                                                                                                        |
| `tags`            | list of str | No       |         | Only consider snapshots carrying these tags.                                                                                                                                                                                                                                                                                                                                                                       |
| `timeout`         | int         | No       | `30`    | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `validate_certs`  | bool        | No       | `true`  | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |
| `wait`            | bool        | No       | `true`  | Whether to wait for the deletion job to finish when there is something to delete.                                                                                                                                                                                                                                                                                                                                  |
| `wait_timeout`    | int         | No       | `600`   | Seconds to wait for the deletion job before failing.                                                                                                                                                                                                                                                                                                                                                               |

## Returns

| Key       | Type         | Returned                              | Description                                                                                                      |
| --------- | ------------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `at_ids`  | list of str  | when a deletion ran                   | Identifiers of the deletion runs, when something was deleted. A long delete list may be split over several runs. |
| `deleted` | list of str  | always                                | Snapshot ids the run deleted (in check mode, would delete).                                                      |
| `floored` | list of str  | always                                | Snapshot ids the rule would delete but the organization's retention floor keeps anyway.                          |
| `held`    | list of str  | always                                | Snapshot ids excluded because they are under legal hold.                                                         |
| `jobs`    | list of dict | when a deletion ran and was waited on | The deletion jobs, when something was deleted and `wait=true`.                                                   |
| `kept`    | list of str  | in check mode                         | Snapshot ids the rule keeps. Only the preview reports this.                                                      |
