---
title: "How Maintenance Works"
date: "2026-03-18T00:00:00Z"
summary: "Understand how Plakar stores backup data in chunks and packfiles, why deleting a snapshot does not immediately free space, and how the maintenance process safely reclaims unused storage."
weight: 6
---

Plakar uses chunking and deduplication to store backups efficiently. Multiple snapshots share data, so only what has actually changed gets written to the store. Because of this, removing a snapshot is a two-step process: `plakar rm` marks it as deleted, and `plakar maintenance` does the actual cleanup. This page explains how that works.

## How data is stored

### Chunking and deduplication

When a backup runs, Plakar does not store files as-is. Instead, it splits the incoming data stream into variable-size pieces called **chunks**, using a Content-Defined Chunking (CDC) algorithm. Before writing a chunk, Plakar checks whether it already exists in the store. If it does, it is reused rather than written again.

This is what makes deduplication work across snapshots. Two backups of the same directory, taken a day apart, will share the vast majority of their chunks. Only the chunks corresponding to files that actually changed will be new.

For a deeper look at CDC and the library Plakar uses to implement it, see the [go-cdc-chunkers blog post](https://www.plakar.io/posts/2025-07-11/introducing-go-cdc-chunkers-chunk-and-deduplicate-everything/).

### Packfiles

Chunks are not written to the store one by one. For performance reasons, Plakar groups many chunks together into larger containers called **packfiles**, targeting roughly 64 MB each. This reduces the number of objects written to the store and makes storage and network operations significantly more efficient.

When possible, Plakar tries to keep chunks belonging to the same file in the same packfile. This limits fragmentation and makes restores faster.

The diagram below shows how two snapshots can share chunks inside the same packfile. Chunk 2 and Chunk 3 are referenced by both Snapshot A and Snapshot B, but exist only once in the store.

{{< mermaid >}}
flowchart LR
  subgraph Snapshots
    S1["Snapshot A"]
    S2["Snapshot B"]
  end

  subgraph P1["Packfile 1"]
    C1["Chunk 1"]
    C2["Chunk 2 ◄── shared"]
    C3["Chunk 3 ◄── shared"]
  end

  subgraph P2["Packfile 2"]
    C4["Chunk 4"]
  end

  S1 --> C1
  S1 --> C2
  S1 --> C3
  S2 --> C2
  S2 --> C3
  S2 --> C4

classDef snapshotBox fill:#ffe4e6,stroke:#cad5e2
classDef packfileBox fill:#dbeafe,stroke:#cad5e2
class S1,S2 snapshotBox
class C1,C2,C3,C4 packfileBox
{{< /mermaid >}}

## Why deleting a snapshot does not free space immediately

Because chunks are shared across snapshots, Plakar cannot simply delete a chunk when a snapshot is removed. Another snapshot might still be referencing it.

When you run `plakar rm`, Plakar records a new state where that snapshot no longer exists. The store reflects this immediately, the snapshot is gone from listings and cannot be restored. But the underlying chunks and packfiles remain untouched until maintenance determines whether they are still needed.

## The maintenance process

Running `plakar maintenance` is what actually reclaims storage. During a maintenance run, Plakar scans the store and identifies chunks that are no longer referenced by any snapshot. Those chunks are marked as candidates for deletion and held for a grace period before removal.

### The grace period

Marked chunks remain in the store for a grace period, currently set to 7 days. On the next maintenance run after that window, chunks that are still unreferenced become eligible for removal. If a chunk has since been referenced again by a new backup, the mark is removed and the chunk is kept.

This delay exists to protect backups that are currently in progress. A long-running backup might write chunks that appear unreferenced to maintenance, because the snapshot that will reference them has not been committed yet.

{{< mermaid >}}
flowchart LR
  A["plakar rm (snapshot removed)"] --> B["Unreferenced chunks marked for deletion"]
  B --> C{"Grace period elapsed?"}
  C -- No --> D["Chunks retained"]
  C -- Yes --> E{"Still unreferenced?"}
  E -- No --> D
  E -- Yes --> F["Eligible for removal"]
  F --> G["Packfile GC"]

classDef default fill:#dbeafe,stroke:#cad5e2
classDef decision fill:#ffe4e6,stroke:#cad5e2
class C,E decision
{{< /mermaid >}}

### Garbage collection at the packfile level

Maintenance does not remove chunks directly, it operates at the packfile level. A packfile can only be removed if every chunk it contains is unreferenced. If even one chunk inside a packfile is still needed, the whole packfile stays.

This means some unreferenced chunks may remain stored beyond the grace period if they share a packfile with chunks that are still active. This is a known tradeoff of the current design.

### Checkpoints and long-running backups

Plakar prevents maintenance from deleting data that an active backup depends on through a checkpoint mechanism: the state of an in-progress backup is recorded every 15 minutes. Maintenance accounts for these checkpoints and will not remove chunks that a running backup may still need.

## Current limitations

The current maintenance model can only garbage-collect packfiles that are entirely unreferenced. Partially unused packfiles cannot be compacted. Consider the following scenario:

1. A large file is backed up; its chunks are written into a packfile.
2. Months later, the file changes significantly. New chunks are written to new packfiles.
3. The original packfile now contains a mix of still-referenced chunks (unchanged parts of the file) and unreferenced ones (parts that changed).

That packfile cannot be removed, because it is not fully unreferenced. The unused chunks inside it remain in the store.

A future **recompaction** feature (currently under development) will address this by merging underutilized packfiles and regrouping related chunks, making it possible to reclaim space from packfiles that are mostly stale.
