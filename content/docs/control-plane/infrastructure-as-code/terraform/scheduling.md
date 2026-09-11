---
title: "Scheduling"
date: "2026-09-11T00:00:00Z"
weight: 2
summary:
  "Declaring backup, prune, sync and check schedules with plakar_schedule."
---

# Scheduling

`plakar_schedule` declares a recurring [task](../../../scheduling/tasks) and the
rules that trigger it. A single resource covers all four task types, selected by
`type`: `backup`, `prune`, `sync` and `check`.

A task acts on one or two apps, and the schedule names them with `origin_id` and
`target_id`. Which app belongs in which argument depends on the type:

| Type     | `origin_id` | `target_id`         |
| -------- | ----------- | ------------------- |
| `backup` | the source  | the store           |
| `sync`   | the store   | the store synced to |
| `prune`  | the store   | none                |
| `check`  | the store   | none                |

Both arguments take ids, so they are normally filled from a
[store or connector](./stores-and-connectors) resource or data source rather
than written literally.

## Recurrence

A schedule runs because of its `rule` blocks, and at least one is required.
`periodicity` is the interval between runs in seconds. `jitter` spreads each run
randomly around that interval, which prevents a fleet of schedules from starting
at the same moment. `start` is an RFC3339 time the interval is counted from.

```terraform
resource "plakar_schedule" "nightly" {
  name      = "Nightly database backup"
  type      = "backup"
  origin_id = data.plakar_connector.db.id
  target_id = plakar_store.offsite.id
  labels    = ["nightly"]

  rule {
    periodicity = 86400
  }
}
```

A schedule can carry several rules, each with its own `enabled` argument, which
is how one task runs on more than one cadence. The schedule itself has an
`enabled` argument that stops it from running at all.

## Labels

A backup schedule applies its `labels` to every restore point it creates. For
the other three types the same argument filters instead: only restore points
carrying those labels are considered.

The two behaviours combine. A backup schedule labels what it writes, and a prune
or check schedule acts only on restore points with that label, so one store can
hold several sets of restore points governed by different rules.

`ignores` applies to backups alone, and holds the path patterns to leave out.

## Retention

Retention is a property of a prune schedule rather than of a store, and lives in
the `retention` map.

```terraform
resource "plakar_schedule" "retention" {
  name      = "Retention policy"
  type      = "prune"
  origin_id = plakar_store.offsite.id
  group_by  = "dataset"

  retention = {
    day       = 7
    per_day   = 1
    month     = 12
    per_month = 1
  }

  rule {
    periodicity = 86400
  }
}
```

The map is expressed in buckets. `minute`, `hour`, `day`, `week`, `month` and
`year` set how many recent buckets of that size to keep, and `per_minute`
through `per_year` set how many restore points to keep within each bucket. The
configuration above keeps one restore point a day for the last seven days and
one a month for the last twelve months.

`group_by` partitions the matched restore points before the rule is applied.
With `dataset`, the rule holds for each source separately instead of across the
store, so a source that backs up frequently cannot exhaust the allowance of the
others.

A prune skips restore points under a
[legal hold](../../../compliance/legal-hold), whether the prune was declared
here or scheduled from the web interface.

## Drift on name and description

Plakar Control Plane stores `name` and `description` but does not return them
from the API, so the provider cannot detect a change made to either outside
Terraform. Every other argument is refreshed on each plan and drifts back on the
next apply.
