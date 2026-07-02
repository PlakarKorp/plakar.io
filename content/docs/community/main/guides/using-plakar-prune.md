---
title: "Pruning snapshots"
date: "2026-04-24T00:00:00Z"
weight: 10
summary:
  "Remove old snapshots from a Kloset store using age, tags, or retention
  policies."
aliases:
  - /docs/main/guides/using-plakar-prune/
---

# Pruning Snapshots

`plakar prune` removes snapshots from a Kloset store. Snapshots can be selected
for removal by age, tag, or retention policy.

Every backup you run creates a new snapshot in your Kloset store. If left
unchecked, snapshots can accumulate indefinitely.

Pruning lets you define how much history you actually need — such as keeping
hourly snapshots for the past week, daily ones for the past month, monthly ones
for the past year — and discard everything else. This keeps your store from
growing without bound while preserving important recovery points.

By default, `plakar prune` runs in dry-run mode and makes no changes. You'll
need to pass `-apply` to execute the operation.

In this guide, we will use a Kloset store located at `$HOME/backups`, but your
store can be located anywhere else.

## Previewing what would be pruned

Before removing anything, check which snapshots would be affected:

```sh
$ plakar at $HOME/backups prune -days 30
```

No snapshots are deleted without `-apply`. The output shows what _would_ be
removed.

## Removing snapshots by age

To delete snapshots older than 30 days:

```sh
$ plakar at $HOME/backups prune -days 30 -apply
```

You can use other flags like `-weeks`, `-months`, or `-years` to specify age.

## Removing snapshots by tag

To delete snapshots older than 30 days that carry a specific tag:

```sh
$ plakar at $HOME/backups prune -days 30 -tag daily-backup -apply
```

Only snapshots matching the tag are considered. Others are left untouched.

## Applying a retention policy

A retention policy keeps a defined number of snapshots across different time
windows and deletes everything else. This is the most common way to keep a store
bounded over time.

```sh
$ plakar at $HOME/backups prune \
  -days 1 -per-day 7 \
  -weeks 4 -per-week 1 \
  -months 12 -per-month 1 \
  -years 5 -per-year 1 \
  -apply
```

This can be broken down as:

- `-days 1 -per-day 7` — For the past day, keep up to 7 snapshots. This
  preserves frequent checkpoints in the most recent period.
- `-weeks 4 -per-week 1` — For the past 4 weeks, keep 1 snapshot per week. Older
  intra-day snapshots are pruned down to a single representative per week.
- `-months 12 -per-month 1` — For the past 12 months, keep 1 snapshot per month.
- `-years 5 -per-year 1` — For the past 5 years, keep 1 snapshot per year.

Everything outside those windows is deleted.

## Grouping snapshots before applying retention

By default, retention rules apply across the entire result set as a whole. The
`-group-by` flag partitions snapshots by a metadata key first, then applies
retention rules independently within each group.

This matters when your store contains snapshots from multiple sources. Without
grouping, `-per-day 1` keeps a single snapshot for the day regardless of which
machine or job it came from. With `-group-by name`, it keeps the newest snapshot
_per name_ for the day.

The general form is:

```sh
$ plakar at $HOME/backups prune -days 30 -per-day 1 -group-by <key> -apply
```

Supported keys:

| Key           | Description                                      |
| ------------- | ------------------------------------------------ |
| `name`        | Snapshot name                                    |
| `category`    | Snapshot category                                |
| `environment` | Environment label (e.g. `production`, `staging`) |
| `perimeter`   | Perimeter label                                  |
| `job`         | Job name                                         |
| `dataset`     | Dataset name                                     |
| `data-class`  | Data classification label                        |
| `tag`         | Snapshot tag                                     |
| `origin`      | Origin identifier                                |
| `type`        | Snapshot type                                    |
| `root`        | Backup root path                                 |

Keys like `tag`, `origin`, `type`, `root`, and `data-class` are multi-valued: a
snapshot can belong to more than one group. In that case, the snapshot
participates in retention evaluation for each group it belongs to, and a keep
decision in any group takes precedence over delete.

### Example: per-name retention

A store holds snapshots from several different backup jobs, each identified by a
distinct name. To keep the most recent snapshot per name for the last 30 days:

```sh
$ plakar at $HOME/backups prune -days 30 -per-day 1 -group-by name -apply
```

Without `-group-by name`, only a single snapshot across all jobs would be kept
per day.

### Example: per-environment retention

To apply the same per-week retention independently to each environment:

```sh
$ plakar at $HOME/backups prune -weeks 4 -per-week 1 -group-by environment -apply
```

### Using `-group-by` with a named policy

`-group-by` composes naturally with `-policy`:

```sh
$ plakar at $HOME/backups prune -policy weekly -group-by name -apply
```

## Using a named policy

Rather than specifying retention parameters on the command line each time, a
named policy can be defined once and reused.

You can create a policy and configure its retention parameters:

```sh
$ plakar policy add weekly
$ plakar policy set weekly since='3 months'
$ plakar policy set weekly per-week=1
```

Then apply the policy:

```sh
$ plakar at $HOME/backups prune -policy weekly -apply
```

### Managing policies

```sh
$ plakar policy show              # list all policies (YAML by default)
$ plakar policy show -json        # output as JSON
$ plakar policy show weekly       # inspect a specific policy
$ plakar policy set weekly per-week=2   # update a parameter
$ plakar policy unset weekly per-week   # remove a parameter
$ plakar policy rm weekly         # delete a policy
```

## Reclaiming storage after pruning

Pruning removes snapshots, but does not immediately free storage. Because Plakar
deduplicates data across snapshots, the underlying chunks and packfiles remain
until `plakar maintenance` runs (also consider the maintenance
[grace period](../../explanations/how-maintenance-works/#the-grace-period)).

After pruning, run `plakar maintenance` to reclaim the freed space:

```sh
$ plakar maintenance
```

## See also

- [plakar policy](../references/commands/plakar-policy)
- [How maintenance works](../../explanations/how-maintenance-works)
