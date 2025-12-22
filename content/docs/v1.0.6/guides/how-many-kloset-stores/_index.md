---
date: "2025-08-21T00:00:00Z"
title: How many Kloset stores should you create for your backups?
summary: "Learn how to decide the number of Kloset stores to create for your backups based on deduplication efficiency and backup source characteristics."
last_reviewed: "2025-12-08"
last_reviewed_version: "N/A"
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar version is irrelevant*

This is a recurring question we get: how many Kloset stores should you create?
* Should you have one for all your backups?
* Or one for your S3 backups, and one for your server backups?
* Or one per server, and one per Google Drive account?
* …

## Short answer: It depends.

A Kloset store acts as a **deduplication unit**. Everything inside it is deduplicated.

If the size of your backups is small, having a single Kloset store is easier to manage and probably good enough.

If the size of your backups is large, then you should consider how similar the data is across your backups:
* if they are very similar, one Kloset store is better for deduplication.
* if they are very different, multiple Kloset stores are better to keep things optimal.

## Example 1: One Kloset store for all server backups

Imagine you have 10 servers, each with 100 GB of data to back up. However, 80% of the data is identical across all servers (e.g., operating system files, common applications).

By using a single Kloset store for all 10 servers, you can take advantage of deduplication. Instead of storing 1 TB (10 * 100 GB), you would only need to store a few hundred gigabytes, depending on how much of the 80% shared data deduplicates.

*These numbers are illustrative and do not take into account compression, that may further reduce the storage size.*

## Example 2: One Kloset store per server

Now, imagine you have 10 S3 buckets, each with 100 GB of data to back up. However, in this case, each bucket has completely different data.

A single Kloset store would not provide deduplication benefits in this case, because there is no overlapping data.

## Example 3: Similar data but different settings

Multiple Kloset stores can also be useful when different data sets require different encryption keys, even if the data itself is similar.

For example, you might want to have one Kloset store available for your internal backups, and another one for your external backups, each with its own encryption key.

## Example 4: Small sets of data

If you have many small sets of data to back up (e.g., multiple small databases, configuration files, etc.), having a single Kloset store might not be useful because the deduplication benefits are minimal, but it may still be worth using a single store for management simplicity.