---
title: "Plakar v1.1.3 is here"
date: 2026-06-16T12:00:00+0100
authors:
  - "gilles"
summary: "After a long beta and three release candidates, plakar v1.1.3 is finally out. It is the biggest release we have shipped so far: faster restores, much lower memory usage, a smaller cache footprint, a brand new terminal UI, better mounting, a new package manager, simpler integration interfaces, and a far more reliable execution model now that the agent is gone and cached has taken its place. It is stable, fully backward compatible, and ready for production."
categories:
  - announcement
  - release-notes
  - community
featured-scope:
  - hero-page
tags:
  - plakar
  - open-source
  - release
---

Back in January, we shipped **v1.1.0-beta** and called it "the foundation for what's next".
A long beta, three release candidates, and several thousand more snapshots later, that foundation is now done.

**plakar v1.1.3 is officially out.**

You read that right: we jumped straight to v1.1.3.
We were so eager to get this one into your hands that we skipped right past v1.1.0, v1.1.1, and v1.1.2, three whole versions, in our hurry to ship.
(Alright, the honest version is that we cut a few quick follow-ups on the way out the door and v1.1.3 is the one you actually want. But "too eager to release" is a much better story, so let's go with that.)
More seriously: during this release we moved our integrations to a monorepo workflow, and we are still getting used to it, a few of those extra version bumps are simply us finding our footing with the new process.

It is, without contest, the largest release we have ever published.
That is not just a feeling, the numbers back it up.
Here is what went in across our core repositories since **v1.0.6** (roughly six months of work, from late November to early June):

| Repository         | Commits | Pull requests |
|--------------------|--------:|--------------:|
| plakar             |     421 |           250 |
| kloset             |     599 |           274 |
| integrations       |   1,090 |           206 |

That is well over **2,000 commits** and several hundred reviewed pull requests, spread across plakar, Kloset, the gRPC bridge, the SDK, and our 25 integrations.

If you want the full story behind the headline features, the [v1.1.0-beta announcement](/posts/2026-01_09_plakar_1_1_0_beta/) still holds up and goes into much more detail than I will here, this post is the victory lap rather than the deep dive.
But since a lot of you discovered the v1.1.0 branch through that beta and then patiently helped us harden it, I want to recap what landed, what changed since the beta, and what comes next.

## TL;DR

* **v1.1.3 is final, stable, and fully backward compatible.** Your existing stores keep working as-is; creating a fresh store and syncing into it is optional and only needed to unlock the new-format optimizations (more on that below).
* The big features from the beta all made it: **new terminal UI**, **multi-directory backups** (single source), **rewritten FUSE mounting** (plus HTTP mounts), a **brand new package manager**, and **much simpler integration interfaces**.
* **Reliability:** the old agent is gone for good. A tiny background service called **cached** now handles shared cache and locking, while commands run directly in the CLI.
* **Performance:** restores are roughly **95% faster** in our Korpus tests, and most of the backup optimizations we held back during the beta have now landed too.
* **Memory and disk:** peak RAM is down across the board, and the default cache footprint is **much smaller**.
* **What changed since beta:** a lot of stabilization, a move to an integrations monorepo, mount refinements, `prune -group-by`, safer locking for `repair`, and better behaviour for `cached` on Windows.
* Thank you to everyone who tested the beta and reported issues. This release is genuinely better because of you.

## From beta to release

When we announced the beta, most of the heavy lifting was already behind us, the v1.1.0 branch had been baking through the second half of 2025, and we had already pushed tens of thousands of snapshots through it.
So the beta phase was never really about whether the code worked, it was about polishing the edges, catching the things only real users on real data find, and earning the confidence to call it stable.

That is exactly what happened.

We moved from beta to **release candidate** in spring, cut **three RCs**, and spent the time in between doing the unglamorous work that makes a release trustworthy:

* **Stabilization and testing.** We pushed test coverage up significantly across both plakar and Kloset, reaching 100% on several packages and lifting the rest substantially. None of this shows up in a feature list, but it is exactly the kind of work that lets us ship the next release faster and with fewer regressions.
* **An integrations monorepo.** We consolidated our many integration modules into a single monorepo, which dramatically simplifies how we cut releases and keep everything in lockstep. If you build from source, this should make your life easier too.
* **Mount refinements.** `plakar mount` learned to handle direct access to filesystem paths without browsing from the root, and gained an `-allow-others` flag to pass `fuse.AllowOther()` at mount time, a frequent request for shared setups.
* **`prune -group-by`.** Retention policies can now group snapshots when pruning, and the flag is properly documented. Kloset's `locate` also gained `-group-by` along with dataset and data-class filters.
* **Safer maintenance.** `repair` now takes an exclusive lock, the builder no longer fails on a stale lock, and maintenance waits for its lock to drain between runs. Small changes, but they remove entire categories of "why did two commands step on each other" bugs.
* **Windows.** `cached` now runs in the background on Windows as well, and no longer trips over syslog setup.

None of these are headline features. Together, they are the difference between "it works on my machine" and "you can run this in production".

## A quick recap of what's new

If you have been following along, you already know all of this. If you skipped the beta, here is the short version, in roughly the order you will notice it.

### A new terminal UI

plakar used to be *very* talkative.
Lots of information, but hard to follow during a long backup or restore.

v1.1.3 reworks terminal output around a proper rendering interface, with an `stdio` renderer that keeps the old behaviour exactly as it was, and a new `tui` renderer that gives you a clean, dedicated view of what plakar is actually doing.
It is available on `backup` and `restore` today, and we will progressively bring it to more commands like `check` and `sync`.

The result is a quieter, more readable terminal, without losing any of the detail when you actually want it.

### Multi-directory backups

```terminal
$ plakar backup /etc /home
```

Multi-directory backups are back, on a single source, now that we can handle resource naming unambiguously across every integration.
Work on true multi-source snapshots has started, it just did not make this release, hopefully the next one.

### Better FUSE and mounting

FUSE support has been completely rewritten and is far more reliable, including over high-latency connections and on macOS where it was historically painful.
On top of that, `plakar mount` can now mount specific snapshots or individual directories, and even expose a mount over HTTP.
More mount protocols, including S3, are on the way.

### A new package manager

The plugin system shipped in v1.0.0, but the package manager around it was... let's say it had room to grow.
v1.1.3 ships a brand new one, simpler, cleaner, and able to **update** integrations, which is the thing we were sorely missing.

### Simpler integration interfaces

The importer, exporter, and storage interfaces have been redesigned to be simpler and more explicit.
Implement a few CRUD functions and you have a new store.
Implement a function that enumerates your data and you have an importer.
Implement a function that reconstructs it and you have an exporter.

Writing a first integration is now a matter of hours for newcomers and minutes for experienced developers, and a happy side effect of the rework is that an Importer can now feed an Exporter directly, opening the door to a future "transfer" capability that moves data between origins and destinations without going through a Kloset at all.

### Agent is dead, long live cached

This is the change I am happiest about.

In v1.0.0 we introduced an *agent* process that executed commands on behalf of the CLI, which meant it always had to be running.
v1.0.4 made it auto-spawn and auto-teardown, but the agent stayed on the critical path: every command went through it, which made interactive prompts hard, turned a single failure into an agent-wide failure, and piled execution, coordination, and caching into one process.

In v1.1.3 the agent is gone.
It is replaced by **cached**, a lightweight, auto-managed process that does nothing but shared cache maintenance and locking.
It starts when needed, stops when it is not, and otherwise stays out of your way.
Commands now run directly in the CLI.

This single change shrinks the failure blast radius, unlocks features that were previously awkward or impossible, and makes plakar **considerably more reliable**.

## Performance and memory, finalized

During the beta we deliberately held back most of our backup optimizations, we did not want them muddying the release cycle while we were already happy with the unoptimized numbers.
Many of them have now landed.

Here is where we stand against v1.0.6, measured with **Korpus**, our assorted collection of low- and high-entropy files of every size and type laid out across a very large, deep directory tree:

| Op        | Items     | v1.0.6      | v1.1.3                 |
|-----------|-----------|-------------|------------------------|
| Backup    | 1.000.000 | ~3 minutes  | ~2 minutes **(-33%)**  |
| Sync      | 1.000.000 | ~5 minutes  | ~4 minutes **(-20%)**  |
| Restore   | 1.000.000 | ~60 minutes | ~3 minutes **(-95%)**  |
| Check     | 1.000.000 | ~1 minute   | ~1 minute              |

<small>*tested on a 14-core mac mini with 64 GiB RAM and NVMe storage.</small>

The restore number is the one that still makes me smile.
It comes from a better restore algorithm, smarter parallelism, better use of our prefetch mechanism, and the removal of some expensive system calls that were not strictly necessary.

Memory usage is down across the board too, after fixing a gRPC-level leak that affected long-running backups over SFTP and S3, reworking the caching subsystem, and defaulting to spilling temporary data to disk rather than holding it all in RAM:

|           | v1.0.6     | v1.1.3                |
|-----------|------------|-----------------------|
| Backup    | ~3.0 GiB   | ~1.3 GiB **(-43%)**   |
| Sync      | ~3.6 GiB   | ~1.7 GiB **(-52%)**   |
| Restore   | ~2.3 GiB   | ~800 MiB **(-66%)**   |
| Check     | ~1.3 GiB   | ~800 MiB **(-40%)**   |

<small>*tested on a 14-core mac mini with 64 GiB RAM and NVMe storage.</small>

And the default on-disk cache footprint is much smaller, since we removed the on-disk VFS cache and now query the store instead, trading a little bandwidth for a lot of local disk:

|     Items | v1.0.6 |          v1.1.3    |
| --------: | -----: | -----------------: |
| 1,000,000 |  4 GiB | 1.8 GiB **(-55%)** |

If you would rather keep the bandwidth and pay in disk, the flag to opt back into the old local cache behaviour is there for you.


## Get it now

```terminal
$ go install github.com/PlakarKorp/plakar@v1.1.3
```

A note on upgrading: your existing stores keep working exactly as before.
The binary is fully backward compatible and will happily read and write the stores you already have, so there is nothing you *need* to do.

That said, several of this release's optimizations come from changes to the on-disk store format, and an existing store won't pick those up on its own.
If you want the full benefit, the simplest path is to **create a fresh store and sync your old one into it**:

```terminal
$ plakar at /path/to/new-store create
$ plakar at /path/to/new-store sync from /path/to/old-store
```

Once everything has synced across, point your backups at the new store and keep the old one around until you are confident.
There is no rush, and no penalty for staying on your current store, you simply won't see the new-format gains until you move.

If you use third-party integrations such as SFTP or S3, this is also a good moment to refresh them so they link against the latest SDK:

```terminal
$ plakar pkg rm s3
$ plakar pkg add s3
```

## Thank you

This release exists in the shape it does because a lot of people pushed on it.

Thank you to everyone who installed a beta or an RC, ran it against real data, and told us what broke.
That feedback is exactly what turns "very stable" into "stable", and it is the reason we are comfortable calling v1.1.3 production-ready today.

And thank you to the team.
Those numbers up top, the two-thousand-plus commits and the hundreds of reviewed pull requests, are not an accident of activity: every one of them was written, reviewed, and approved by people who refused to trade quality for speed.
I keep saying it because it keeps being true: I am incredibly proud to work with people who move this fast without ever letting go of quality.

## What's next

With v1.1.3 out the door, the foundation we talked about in January is now load-bearing.
A lot of the prerequisite groundwork for our next milestones already shipped as part of this cycle, and several of them already have active branches:

* **Multi-source snapshots**, so a single snapshot can span multiple data sources.
* **Improved store maintenance and space recovery**, through recompaction and packfile work.
* **Store repairability**, with mechanisms to recover from corruption, including ECC and cross-store data sharing.

We also have several more performance experiments in the pipe that are showing promising early results.

This release was a big one and it bent our schedule around it for a while.
With it behind us, we are back to our regular release cadence, and you can expect the next release toward the end of summer.

As always: try it, break it, and tell us what happens.
Come hang out on our Discord if you want to follow along or help shape what comes next.

Happy hacking 🚀
