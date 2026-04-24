---
title: "How Pruning Works"
date: "2026-04-24T00:00:00Z"
weight: 7
summary: "Understand how Plakar decides which snapshots to keep, how retention policies work across different time windows, and what happens to storage after pruning runs."
---

# How Pruning Works

Plakar accumulates snapshots over time. Without a way to remove old ones, a Kloset Store will grow indefinitely. `plakar prune` command controls how many snapshots are kept and which ones get removed.

## Pruning versus maintenance

Pruning and maintenance are distinct operations that work together.

* `plakar prune` decides which snapshots to delete. It applies a retention policy based on age, tags, or explicit IDs and removes the snapshots that fall outside of it.
* `plakar maintenance` decides what to do with the data those snapshots left behind. Because Plakar deduplicates chunks across snapshots, removing a snapshot does not immediately free storage. Maintenance scans the store and after a [grace period](./how-maintenance-works/#the-grace-period), deletes packfiles whose chunks are entirely unreferenced.

In practice, a complete cleanup cycle runs both: prune first to remove unwanted snapshots, then maintenance to reclaim the freed space.

## Retention policies

The most common use of `plakar prune` is not to remove individual snapshots by ID, but to apply a retention policy: a set of rules that describe how many snapshots to keep over different time windows, and how to discard the rest.

Consider this example:

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

Everything else is deleted.

## Dry-run by default

`plakar prune` does not delete anything unless you pass `-apply`. Without it, the command shows which snapshots would be removed, but makes no changes to the repository.

```sh
# Preview what would be pruned
plakar prune -days 30

# Actually prune
plakar prune -days 30 -apply
```

This makes it safe to experiment with retention rules before committing to them. It is good practice to run without `-apply` first, review the output, and only then run with `-apply` once the results look correct.

## Filtering by tag

Pruning can be scoped to snapshots with a specific tag. This is useful when different backup jobs produce differently tagged snapshots that should follow different retention rules.

```sh
# Remove all daily-backup snapshots older than 30 days
plakar prune -days 30 -tag daily-backup -apply
```

When using tags, pruning only considers snapshots that carry that tag. Other snapshots are left untouched regardless of age.

## Removing specific snapshots

Snapshots can also be pruned by ID, without any time-based filtering:

```sh
plakar prune abc123 -apply
```

This is equivalent to `plakar rm` and is useful for one-off removals.

## Using named policies

Rather than specifying retention parameters on the command line each time, a named policy can be defined once and referenced by name:

```sh
plakar prune -policy default -apply
```

Named policies are managed with `plakar policy`. See [plakar policy](../references/commands/plakar-policy) reference documentation for details.

## What happens after pruning

Once pruning is complete, the removed snapshots are gone from all listings and cannot be restored. However, the storage they occupied is not freed until `plakar maintenance` runs. Until then, the underlying chunks and packfiles remain in the repository.

## See also

* [How maintenance works](../how-maintenance-works)
