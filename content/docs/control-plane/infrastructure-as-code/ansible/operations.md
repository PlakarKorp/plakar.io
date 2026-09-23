---
title: "Running Operations"
date: "2026-09-23T00:00:00Z"
weight: 1
summary:
  "Triggering backups, restores, syncs, checks and prunes, and reading the jobs
  they create."
---

# Running Operations

Five modules ask PCP to perform work: `backup`, `restore`, `sync`, `check` and
`prune`. Each names the apps it acts on, and each creates a job that PCP runs.

They describe no desired state, so they act every time the play runs. That makes
them the counterpart of a [schedule](../../../scheduling/tasks) rather than a
replacement for one. A schedule repeats on an interval PCP controls. A playbook
runs the work when Ansible reaches the task, such as before a release or after a
migration.

```yaml
- name: Back up the production database
  plakarkorp.plakar.backup:
    source: Production DB
    store: S3 Store
    labels: [nightly]

- name: Replicate the store offsite
  plakarkorp.plakar.sync:
    store: S3 Store
    to_store: Offsite S3

- name: Restore the latest snapshot onto the recovery target
  plakarkorp.plakar.restore:
    store: S3 Store
    destination: Recovery target
```

## Waiting for a job

Backups and restores run asynchronously in PCP. By default a module polls until
the job stops, so the task finishes when the work does, and a failed job fails
the task.

`wait_timeout` bounds that polling and defaults to 600 seconds. A backup of a
large source needs more.

Setting `wait: false` returns as soon as the run is accepted. The play continues
immediately, and the run is followed later with `job_info`.

A module returns `at_id`, the identifier of the one-shot run it created. The run
becomes a job only once the scheduler picks it up, so `job_info` returns an
empty `jobs` list until then, which is what `until` waits out:

```yaml
- name: Start the backup without blocking the play
  plakarkorp.plakar.backup:
    source: Production DB
    store: S3 Store
    wait: false
  register: started

- name: Follow the run once the scheduler materializes it
  plakarkorp.plakar.job_info:
    at_id: "{{ started.at_id }}"
  register: job
  until: job.jobs | length > 0
  retries: 30
  delay: 10
```

A run that has already finished carries its job in `job`, so `job.id` is what
`job_info` takes as `job_id`.

## Reading job state

`job_info` reads one job, or a list filtered by `task_type` and `status`. The
filtered form reports on what PCP has been doing, rather than on what this play
started:

```yaml
- name: Report the backups that failed
  plakarkorp.plakar.job_info:
    task_type: backup
    status: failed
  register: failed
```

## Pruning

`prune` applies a retention rule to the snapshots in a store. The rule is
expressed in buckets: `minute`, `hour`, `day`, `week`, `month` and `year` set
how many recent buckets of that size to keep, and `per_minute` through
`per_year` set how many snapshots to keep within each bucket.

```yaml
- name: Keep a daily snapshot for a week, a monthly one for a year
  plakarkorp.plakar.prune:
    store: S3 Store
    retention:
      day: 7
      per_day: 1
      month: 12
      per_month: 1
    group_by: dataset
    tags: [nightly]
    filters:
      ignore_tags: [do-not-prune]
```

`group_by: dataset` partitions the snapshots before the rule is applied, so the
allowance holds for each source separately rather than across the whole store.
Without it, a source that backs up frequently can consume the allowance of the
others.

`tags` narrows the rule to snapshots carrying those tags, and
`filters.ignore_tags` excludes snapshots from consideration entirely.

Snapshots under a [legal hold](../../../compliance/legal-hold) are never
deleted, whichever rule matches them.

### Checking a rule before it runs

A prune in check mode deletes nothing. It reports what the rule would delete,
what it would keep, and what it held back:

```sh
$ ansible-playbook retention.yml --check
```
