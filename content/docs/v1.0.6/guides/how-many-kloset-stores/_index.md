---
date: "2025-08-21T00:00:00Z"
title: How many Kloset stores should you create for your backups?
summary: "Learn how to decide the number of Kloset stores to create for your backups based on deduplication efficiency and backup source characteristics."
last_reviewed: "2025-08-21"
last_reviewed_version: "N/A"
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar version is irrelevant*

This is a recurring question we get: how many Kloset stores should you create?
* Should you have one for all your backups?
* Or one for your S3 backups, and one for your server backups?
* Or one per server, and one per Google Drive account?
* …

## Short answer: It depends.

You can see a Kloset store as a deduplication unit. Everything inside it is deduplicated.

If your backups share lots of the same data, having them in one store improves the deduplication efficiency, as they will share the same chunks. If the contents of your backups are very different, then it could make sense to have multiple Kloset stores.

If your backup sources are very different but the size of your backups is small, then having one easy-to-manage Kloset store is probably good enough and you don't mind if the deduplication inside the Kloset store is not optimal.

