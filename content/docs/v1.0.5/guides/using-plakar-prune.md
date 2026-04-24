---
title: "Pruning snapshots"
date: "2026-04-24T00:00:00Z"
weight: 9
summary: "Remove old snapshots from a Kloset store using age, tags, retention policies, or explicit IDs."
---

# Pruning Snapshots

`plakar prune` removes snapshots from a Kloset store. Snapshots can be selected for removal by age, tag, retention policy, or explicit ID.

By default, `plakar prune` runs in dry-run mode and makes no changes, you'll need to pass `-apply` to execute the operation.

## Previewing what would be pruned

Before removing anything, check which snapshots would be affected:

```sh
plakar prune -days 30
```

No snapshots are deleted without `-apply`. The output shows what *would* be removed.

## Removing snapshots by age

To delete snapshots older than 30 days:

```sh
plakar prune -days 30 -apply
```

You can use other flags like `-weeks`, `-months` or `-years` to specify age. 

## Removing snapshots by tag

To delete snapshots older than 30 days that carry a specific tag:

```sh
plakar prune -days 30 -tag daily-backup -apply
```

Only snapshots matching the tag are considered. Others are left untouched.

## Removing a specific snapshot

To delete a snapshot by ID:

```sh
plakar prune abc123 -apply
```

## Applying a retention policy

A retention policy keeps a defined number of snapshots across different time windows and deletes everything else. This is the most common way to keep a store bounded over time.

```sh
plakar prune \
  -days 1 -per-day 7 \
  -weeks 4 -per-week 1 \
  -months 12 -per-month 1 \
  -years 5 -per-year 1 \
  -apply
```

This can be broken down as:

* `-days 1 -per-day 7` - For the past day, keep up to 7 snapshots. This preserves frequent checkpoints in the most recent period.
* `-weeks 4 -per-week 1` - For the past 4 weeks, keep 1 snapshot per week. Older intra-day snapshots are pruned down to a single representative per week.
* `-months 12 -per-month 1` - For the past 12 months, keep 1 snapshot per month.
* `-years 5 -per-year 1` - For the past 5 years, keep 1 snapshot per year.

Everything outside those windows is deleted.

## Using a named policy

Rather than specifying retention parameters on the command line each time, a named policy can be defined once and reused.

Creating a policy:

```sh
plakar policy add weekly
```

Configuring its retention parameters:

```sh
plakar policy set weekly since='3 months'
plakar policy set weekly per-week=1
```

Applying it:

```sh
plakar prune -policy weekly -apply
```

### Managing policies

List all configured policies:

```sh
plakar policy show
```

Output format can be controlled with `-ini`, `-json`, or `-yaml`:

```sh
plakar policy show -json
```

Inspecting a specific policy:

```sh
plakar policy show weekly
```

Updating a parameter:

```sh
plakar policy set weekly per-week=2
```

Removing a parameter:

```sh
plakar policy unset weekly per-week
```

Deleting a policy:

```sh
plakar policy rm weekly
```

## Reclaiming storage after pruning

Pruning removes snapshots, but does not immediately free storage. Because Plakar deduplicates data across snapshots, the underlying chunks and packfiles remain until `plakar maintenance` runs (also consider the maintenance [grace period](../../explanations/how-maintenance-works/#the-grace-period)).

After pruning, you'll need to run `plakar maintenance` to reclaim the freed space:

```sh
plakar maintenance
```

## See also

* [plakar policy](../references/commands/plakar-policy)
* [How maintenance works](../../explanations/how-maintenance-works)
