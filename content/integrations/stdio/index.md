---
title: Stdio

subtitle: "Direct backups for data streams and command outputs via Stdio"

description: >
  Back up and restore data directly via Stdio without creating temporary files. Plakar ensures encrypted, deduplicated, and verifiable snapshots for database dumps, logs, and automated pipelines.

technology_title: Stdio is the bridge for live data

technology_description: >
  Stdio (Standard Input/Output) is the standard mechanism for moving data between software processes, allowing different tools and commands to communicate through streams. Plakar’s Stdio integration captures live output from databases, scripts, or other command-line processes and streams it directly into a secure backup. All data is encrypted, deduplicated, and stored as verifiable snapshots, ensuring integrity and security without ever creating temporary files on disk. This approach eliminates storage overhead, reduces security risks, and simplifies automated backup workflows.

categories:
  - source connector
  - destination connector
  
tags:
- Stdio
- Pipelines
- Automation
- Database Dumps
- Scripting
- Linux
- Unix

seo_tags:
  - stdin backup
  - stdout restore
  - database stream backup
  - pipe to backup
  - cli data protection
  - automated backup scripts
  - live data ingestion
  - secure data streaming
  
technical_documentation_link:

stage: stable

date: 2025-05-13

plakar_version: ">=1.0.0"

resource: Stdio

resource_type: stdio
---

## Why use Streams instead of Files?
In a typical workflow, you might export a database to a `.sql` file and then back up that file. This creates a few challenges:
- **Storage Waste**: You need enough free space to hold the uncompressed export before it even gets to your backup tool.
- **Security Risks**: Temporary files often sit on your disk unencrypted while waiting to be backed up.
- **Complexity**: You have to manage the creation and deletion of these intermediate files.

With the Stdio integration, Plakar reads data as it’s generated, encrypts and deduplicates it, and streams it straight to your Kloset Store without creating any intermediate files on disk.

## Automation with Stdio
Stdio is useful for administrators and power users building automated backups while avoiding temporary files. Data from scripts, commands, or applications can be backed up directly.

When recovery is needed, streams can be fed back into databases, tools, or terminals immediately, with full integrity verification. You can also inspect, browse, and search backups via the CLI or UI without performing a full restore first.

## How Plakar handles your data streams
Plakar handles live data directly:
- **Source Connector**: Capture output from any command or script and save it as a named object in a snapshot in Kloset.
- **Destination Connector**: Stream your saved data back into any tool or display it directly in your terminal without writing a file to disk first.

## Common Questions

**1. What kind of data can I back up this way?**  
Anything that produces text or binary output, such as database dumps, system logs, or diagnostic scripts.

**2. Do I need to name the stream?**  
Yes. Streams don’t have filenames, so you assign a name to identify and retrieve them later.

**3. Can I pipe a backup directly into another program?**  
Yes. You can restore a specific object from a snapshot and feed it directly into a tool like a database importer for fast recovery.
