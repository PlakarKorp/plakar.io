---
title: "Pruning snapshots"
date: "2026-04-24T00:00:00Z"
weight: 9
summary: "Remove old snapshots from a Kloset store using age, tags, or retention policies."
---

# Pruning Snapshots

`plakar prune` removes snapshots from a Kloset store. Snapshots can be selected for removal by age, tag, or retention policy.

By default, `plakar prune` runs in dry-run mode and makes no changes, you'll need to pass `-apply` to execute the operation.

On this guide, we will use a Kloset store is located at `$HOME/backups`, but your store can be located anywhere else:

## Previewing what would be pruned

Before removing anything, check which snapshots would be affected:

```sh
$ plakar at $HOME/backups prune -days 30
```

No snapshots are deleted without `-apply`. The output shows what *would* be removed.

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

A retention policy keeps a defined number of snapshots across different time windows and deletes everything else. This is the most common way to keep a store bounded over time.

```sh
$ plakar at $HOME/backups prune \
  -days 1 -per-day 7 \
  -weeks 4 -per-week 1 \
  -months 12 -per-month 1 \
  -years 5 -per-year 1 \
  -apply
```

This can be broken down as:

* `-days 1 -per-day 7` — For the past day, keep up to 7 snapshots. This preserves frequent checkpoints in the most recent period.
* `-weeks 4 -per-week 1` — For the past 4 weeks, keep 1 snapshot per week. Older intra-day snapshots are pruned down to a single representative per week.
* `-months 12 -per-month 1` — For the past 12 months, keep 1 snapshot per month.
* `-years 5 -per-year 1` — For the past 5 years, keep 1 snapshot per year.

Everything outside those windows is deleted.

## Using a named policy

Rather than specifying retention parameters on the command line each time, a named policy can be defined once and reused.

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

Pruning removes snapshots, but does not immediately free storage. Because Plakar deduplicates data across snapshots, the underlying chunks and packfiles remain until `plakar maintenance` runs (also consider the maintenance [grace period](../../explanations/how-maintenance-works/#the-grace-period)).

After pruning, run `plakar maintenance` to reclaim the freed space:

```sh
$ plakar maintenance
```

## See also

* [plakar policy](../references/commands/plakar-policy)
* [How maintenance works](../../explanations/how-maintenance-works)
