---
# Title used to describe the integration in the listing page
title: "{{ Resource }}"

# Concise benefit-driven subtitle (used as subheading in hero section)
subtitle: "Resilient, encrypted backups for your {{ Resource }} environment"

# SEO friendly description used in integration hero section
description: >
  Back up your {{ Resource }} workloads with Plakar to protect against data loss,
  corruption, and ransomware. Immutable, encrypted, and restorable —
  even offline and across environments.

# Just after the hero, if not set or blank, "{{ Resource }} is everywhere and often underprotected" will be used
technology_title: {{ Resource }} is everywhere and often underprotected

# SEO friendly answer to : {{ Resource }} is everywhere and often underprotected
technology_description: >
  {{ Resource }} has become a foundational component in many modern infrastructures... # describe why {{ Resource }} is awesome
  Yet in many environments, {{ Resource }} is deployed without the safeguards...
  Plakar helps to ... # depending on {{ Resource }} category, describe how Plakar helps protect it or use it to store critical data or both

# What the integration provides
# Values: 'source-connector', 'destination-connector', 'storage-connector', 'viewer'
categories:
  - source connector
  - destination connector
  - storage connector
  - viewer


# Tags used for filtering on the Plakar site
tags:
  - S3-compatible

# Tags used for SEO and search on the Plakar site
seo_tags:
  - {Resource}
  - {Resource} providers...
  - {Resource} semantic words...
  # always relevant
  - backup
  - disaster recovery
  - encryption
  - deduplication
  - versioning
  - immutable storage
  - compliance
  - long-term archiving
  - airgapped backup
  - snapshot technology
  - portable format

# Link to the technical documentation of the integration
technical_documentation_link: docs/main/integrations/{{ Resource | lower }}/

# Stage of maturity: 'beta', 'stable', 'coming soon', 'deprecated'
stage: stable | beta | coming soon | deprecated

# Publication or last updated date (ISO 8601)
date: 2025-07-28

# Plakar version compatibility
plakar_version: ">=1.0.3"

# Name of the resource, e.g. "PostgreSQL", "MySQL", "MongoDB", "Kubernetes", etc.
resource: {{ Resource }} 

# Type of resource integrated
resource_type: object-storage | database | filesystem | vm | container | api

---

<!-- General guidelines for this template:

"Resporitory" should never be use to talk about Kloset, use Kloset store"

Char "—" is strictely forbidden inside documentation.

-->

## 🧠 Why protecting {{ Resource }} matters

<!--
Assume the critical role of {{ Resource }} is already known or covered in the technology_description.

Focus this section on the *risks and consequences* of leaving {{ Resource }} unprotected.
Mention scenarios like silent corruption, accidental deletion, compliance failure, ransomware access, or operational downtime.
The goal is to justify the need for added protection, not to reintroduce the resource.
SEO goal: capture queries like “{{ Resource }} backup risks”, “protecting {{ Resource }} data”, “immutable backups for {{ Resource }}”.

If {{ Resource }} is under a shared responsibility model contract, let's explain to user that it's their responsibility to make their backups from a contractual standpoint.

-->

## 🔓 What happens when {{ Resource }} ...

<!--
Use this section to describe the most realistic and high-impact failure scenario for {{ Resource }}.

Examples:
- MinIO → ...is accessed with leaked credentials
- PostgreSQL → ...gets corrupted by a bad migration
- NFS → ...is mounted and wiped by mistake
- Kubernetes → ...loses state due to a node failure
- Proxmox → ...has no external snapshot and the VM fails

Write 2–3 sentences explaining what typically goes wrong, and why native protection is insufficient.

Then list how Plakar addresses this exact risk:
- Immutable, encrypted snapshots
- Externalized storage (air-gap or access isolation)
- Granular recovery without full restore

SEO goal: attract queries like “{{ Resource }} failure recovery”, “accidental deletion in {{ Resource }}”, “backup strategy for {{ Resource }}”.
-->

## 🛡️ How Plakar secures your {{ Resource }} workflows

<!--
Explain how Plakar integrates with {{ Resource }}:
- As a source to back up data from {{ Resource }}
- As a backend to store snapshots from other systems
- As a restore destination for verified snapshots

Clarify what Plakar adds: encryption, deduplication, versioning, snapshot browsing, offline usage.
SEO goal: emphasize “{{ Resource }} backup with Plakar”, “restore {{ Resource }} data”, etc.
Avoid low-value repetition; show what’s unique.
-->


## 🧰 Everything in one tool: backup, verify, restore, browse

<!--
Summarize Plakar’s value proposition as an all-in-one platform.
Highlight key capabilities:
- Immutable snapshots
- End-to-end encryption
- Deduplication
- On-demand inspection (UI/CLI)
- Cold storage export

Position Plakar as a single, transparent, and efficient solution for all workflows involving {{ Resource }}.
SEO goal: centralize feature keywords while staying concrete and benefits-focused.
-->