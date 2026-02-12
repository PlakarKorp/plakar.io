---
date: "2025-01-30T00:00:00Z"
title: Should you push or pull backups?
summary: Understand the difference between push and pull backup models, and how Plakar supports both.
last_reviewed: "2026-01-30"
last_reviewed_version: "v1.1.0"
weight: 2
aliases:
  - /docs/v1.1.0/guides/backups-push-or-pull
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

When designing a backup strategy, one of the first decisions to make is whether backups should be **pushed** from the systems being backed up or **pulled** from a central backup server.

Both models are widely used. Plakar supports both approaches and lets you choose where backup operations are initiated.

## What does “push” mean?

In a **push model**, each system initiates its own backups.

Each server runs Plakar locally and sends its data to a remote Kloset Store. Backups are triggered from the source systems themselves.

Conceptually:
- The data source controls when backups happen
- Each system needs access to the backup destination
- Backup logic is distributed across machines

This model is often used when servers are autonomous or managed independently.

## What does “pull” mean?

In a **pull model**, a central system initiates backups.

A backup server connects to other machines, retrieves their data, and stores it locally in a Kloset Store. The source systems do not actively participate in the backup process.

Conceptually:
- Backups are controlled from a single place
- Source systems expose data but do not run backup jobs
- Backup logic is centralized

This model is common in environments with many servers or strict access controls.

## How Plakar differs

Plakar does not enforce one model over the other.

Plakar treats both local paths and remote locations as sources hence the same backup mechanism can be used in either direction. The difference is simply *where the `backup` command is executed*.

This flexibility allows you to adapt your backup strategy to your operational and security requirements.

## Choosing between push and pull

There is no universally correct choice. Each model has advantages and trade‑offs.

### Push backups are often preferred when:
- Servers are self‑managed or isolated
- Outbound access to a backup destination is allowed
- Backup schedules are owned by individual systems
- Simplicity is more important than central control

### Pull backups are often preferred when:
- You want centralized control and visibility
- You manage a large number of servers
- Backup credentials and passphrases should exist in one place
- You want to minimize software running on production systems

## Hybrid approach

Some environments use a combination of both models.

For example:
- Critical systems push backups immediately (more frequently)
- Less critical systems are backed up periodically via pull
- Remote or restricted environments use pull through controlled access points

Plakar supports any of these approaches without requiring different tools or workflows.
