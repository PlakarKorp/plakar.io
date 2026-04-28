---
title: "Release v1.0.6 — Bugfix and memory usage improvement"
date: 2025-11-30T10:00:00+0100
authors:
- "nestor"
summary: "v1.0.6 brings a few bugfixes and huge memory usage improvements."
categories:
  - release-notes
featured-scope:
 - hero-page
tags:
 - plakar
 - release
 - hooks
 - ui
 - build
 - backup
---

Our next major stable version, **v1.1.0**, is planned for December and will bring many significant improvements. However, we recently fixed an issue important enough to justify a minor release ahead of schedule.

The bug itself is unlikely to occur,
it requires a specific and unfortunate timing,
but since at least one user encountered it, we decided to reduce the risk of others hitting it by providing this bugfix release early.

We **strongly encourage** everyone to update to the latest version and run the new command from the machine you use to perform backups:

```
plakar repair
```

If anything needs to be corrected, the tool will let you know and prompt you to apply the fix with:

```
plakar repair -apply
```

Even if everything is already correct,
as it will be for the vast majority of users,
running the command is a simple, safe step to ensure your repository is fully consistent while **v1.1.0** is being finalized.

---

## Get it now !

Instructions on how to download and install are available in the [Download](/download/v1.0.6/) section !

---



### Avoid possible state desynchronization

Discord user **`eau`** reported a situation where snapshots looked perfectly fine on the machine that created them, but not on another machine. Since `plakar check` confirmed the data was valid on at least one machine, we quickly identified this as a **state-synchronization mismatch**, not a data issue.

We traced the cause to a small logic bug that could, in rare circumstances, let a machine record a snapshot in its **local** state before the corresponding **remote** state became visible to others.
This is now fully resolved. We introduced a two-stage commit that guarantees the remote state is updated **before** the snapshot appears locally, eliminating the possibility of desynchronization.


#### How likely is it that you hit it?

The bug could only occur if, during a backup, every single write to the store succeeded except the very last one,
an extremely unlucky sequence.
Still, since it did happen once, we recommend updating and running:

```
plakar repair
```

from the machine that performs your backups. In nearly all cases, it will simply report that nothing needs to be done, but it’s a quick and safe check.

Even though it was not needed in this case,
it's interesting to note that Plakar’s storage format also provides resilience: as long as the data is present in the repository, there are multiple ways to reconstruct state information if necessary.


### Improved memory usage for integrations

We also identified and fixed two memory-related issues in **go-kloset-sdk**, the library used by all non-builtin integrations (such as SFTP, S3, and others).

**1. Storage API memory leak**
A leak in the storage API caused unnecessary memory growth whenever a command read data from a store. This affected all third-party integrations and could lead to excessive RAM usage during operations like listing, checking, or restoring snapshots.

**2. Large buffer retention during restores**
A second issue caused large memory buffers to be kept alive when checking or restoring snapshots, again only when using non-builtin integrations. This meant that large snapshots could trigger unexpectedly high memory usage on S3 or SFTP backends.

Both problems were easy to miss since they only impacted external integrations and required working with large snapshots to become noticeable. However, after recent user reports, we investigated and resolved both issues.

To benefit from the fix,
update plakar to v1.0.6 then run `plakar pkg rm` and `plakar pkg add` for each of the integrations you use:

```
$ plakar pkg rm s3
$ plakar pkg add s3
```

This will fetch the new version of the integration,
linked against the corrected `go-kloset-sdk`.


If you’ve been experiencing high memory usage on S3 or SFTP, this update should make you very happy 🙂


## What’s next?

Over the past two months, most of our attention has been dedicated to our upcoming **`plakar enterprise`** product, a substantial milestone that deserves its own dedicated post. We’ll share more about it very soon.

At the same time, we’ve been making significant progress on **`plakar community`**, but some of the largest improvements still require polishing and thorough testing before they’re ready for release.
We weren’t comfortable leaving the state-synchronization bug open for several more weeks, and given that we had also made substantial improvements to memory usage, we decided to ship **v1.0.6** as a minor release.
This provides an immediate fix for the state issue as well as the high-memory usage problems some users experienced with SFTP and S3.

Looking ahead, **v1.1.0** is scheduled for release in December.
It will include a major revamp of the caching layer along with several additional optimizations and reworks.
Until then, we strongly recommend updating to **v1.0.6** to benefit from these reliability and performance improvements.

---

## Full Changelog

👉 [v1.0.5...v1.0.6](https://github.com/PlakarKorp/plakar/compare/v1.0.5...v1.0.6)

---

As always, feedback is welcome: try it out, break things, and tell us what happens!
