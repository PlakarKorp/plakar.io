---
date: "2026-01-30T00:00:00Z"
title: How many Kloset Stores should you create?
summary: Understand how deduplication, data similarity, and security requirements affect the number of Kloset Stores you should use.
last_reviewed: "2026-01-30"
last_reviewed_version: "v1.1.0"
weight: 3
aliases:
  - /docs/v1.0.6/guides/how-many-kloset-stores
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

A common design question when setting up backups with Plakar is how many **Kloset Stores** to create.

Should you use:
- A single store for everything?
- Separate stores for servers, SaaS data, or cloud buckets?
- One store per system?

There is no universal answer. The right choice depends on how your data is structured and how you want to manage it.

## The key idea: Kloset Stores are deduplication boundaries

You can view a Kloset Store as a **deduplication unit**. Data is deduplicated *within* a store, but **never across stores**. This means the number of stores you create directly affects:

- Storage efficiency
- Encryption boundaries
- Operational complexity

Understanding how similar your data is, matters more than how many sources you have.

## When a single Kloset Store makes sense

Using one store is often the simplest option.

This works well when:
- Backup sizes are relatively small
- Data across sources is largely similar
- You want minimal operational overhead

### Example: Similar data across many servers

Imagine 10 servers, each with 100 GB of data. Most of that data is identical: operating systems, shared libraries, common applications.

By storing all backups in a single Kloset Store, Plakar can deduplicate the shared data. Instead of storing 1 TB, only the unique portions are kept.

This approach maximizes deduplication and keeps management simple.

*These numbers are illustrative and do not account for compression.*

## When multiple Kloset Stores are better

Multiple stores are often preferable when data sets have little or no overlap.

### Example: Independent data sets

Consider 10 S3 buckets, each containing 100 GB of unrelated data.

Because there is no meaningful overlap, a single Kloset Store would provide little deduplication benefit. In this case, separating data into multiple stores can simplify management without increasing storage usage.

## Separating stores for security or policy reasons

Deduplication is not the only reason to create multiple stores.

You may also want separation when:
- Different data sets require different encryption keys
- Access policies differ
- Data has different retention or compliance requirements

### Example: Same data, different trust boundaries

You might store internal backups and external customer backups separately, even if the data structure is similar, so each store can use a different encryption key.

## Small data sets and simplicity

For many small backups (configuration files, small databases, metadata), the deduplication benefit may be minimal regardless of layout.

In these cases, using a single Kloset Store is often still the right choice simply because it is easier to operate.

## Summary

When deciding how many Kloset Stores to create, consider:

- How similar your data sets are
- Whether deduplication efficiency matters
- Whether data needs to be isolated for security or policy reasons
- How much operational complexity you are willing to manage

In practice, many environments start with a single store and introduce additional stores only when a clear need appears.
