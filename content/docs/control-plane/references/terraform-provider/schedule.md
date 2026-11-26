---
title: "plakar_schedule"
date: "2026-11-26T11:35:02Z"
weight: 11
summary: "Arguments and attributes of the plakar_schedule resource."
---

# plakar_schedule

## Resource

A scheduled task — a backup, prune, sync or check with its recurrence rules. A scheduled prune carries the retention rule.

### Example Usage

```terraform
# The source and the store the schedules below run on, looked up by name so
# the example stands alone.
data "plakar_connector" "db" {
  name = "Production DB"
  type = "source"
}

data "plakar_store" "offsite" {
  name = "Offsite S3"
}

resource "plakar_schedule" "nightly" {
  name      = "Nightly database backup"
  type      = "backup"
  origin_id = data.plakar_connector.db.id
  target_id = data.plakar_store.offsite.id
  labels    = ["nightly"]

  rule {
    periodicity = 86400
  }
}

resource "plakar_schedule" "retention" {
  name      = "Retention policy"
  type      = "prune"
  origin_id = data.plakar_store.offsite.id
  group_by  = "dataset"
  retention = {
    day     = 7
    per_day = 1
  }

  rule {
    periodicity = 86400
  }
}
```

**Required**

| Argument    | Type   | Description                                                                                   |
| ----------- | ------ | --------------------------------------------------------------------------------------------- |
| `name`      | String | Name of the schedule. Stored but not echoed by the API, so drift on the name is not detected. |
| `origin_id` | String | Id of the origin connector: the source for a backup, the store for a prune, sync or check.    |
| `type`      | String | What the schedule runs: backup, prune, sync or check.                                         |

**Optional**

| Argument      | Type           | Description                                                                                                                                                                            |
| ------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `description` | String         | Free-form description. Stored but not echoed by the API.                                                                                                                               |
| `enabled`     | Boolean        | Whether the schedule runs at all.                                                                                                                                                      |
| `group_by`    | String         | For a prune: partition matched snapshots before applying the rule, e.g. dataset to hold the rule per source.                                                                           |
| `ignores`     | List of String | For a backup: path patterns to exclude.                                                                                                                                                |
| `labels`      | List of String | For a backup: labels stamped on the snapshots. For the other types: only snapshots carrying these tags are considered.                                                                 |
| `retention`   | Map of Number  | For a prune: the retention rule, as bucket options — minute, hour, day, week, month, year for how many recent buckets to keep, per_minute ... per_year for how many snapshots in each. |
| `target_id`   | String         | Id of the target connector: the store for a backup, the destination store for a sync. A check has none.                                                                                |
| `rule`        | Block List     | A recurrence of the schedule. At least one.                                                                                                                                            |

**Read-Only**

| Attribute | Type   | Description |
| --------- | ------ | ----------- |
| `id`      | String |             |

### Nested Schema for `rule`

**Required**

| Argument      | Type   | Description           |
| ------------- | ------ | --------------------- |
| `periodicity` | Number | Seconds between runs. |

**Optional**

| Argument  | Type    | Description                               |
| --------- | ------- | ----------------------------------------- |
| `enabled` | Boolean | Whether this rule fires.                  |
| `jitter`  | Number  | Seconds of random spread around each run. |
| `start`   | String  | RFC3339 time the rule starts from.        |

**Read-Only**

| Attribute | Type   | Description              |
| --------- | ------ | ------------------------ |
| `id`      | String | Server-assigned rule id. |

### Import

```shell
terraform import plakar_schedule.example <uuid>
```
