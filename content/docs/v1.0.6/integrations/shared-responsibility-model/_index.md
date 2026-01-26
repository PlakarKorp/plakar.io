---
title: Shared Responsibility Model
summary: Understanding the Shared Responsibility Model
date: "2026-01-25T00:00:00Z"
weight: 50
---

All major cloud storage providers operate under a **shared responsibility model**:
- **Provider's Responsibility**: Securing the infrastructure, physical security, network, and platform availability
- **Your Responsibility**: Managing access controls, user permissions, sharing settings, and protecting the actual data stored

**In simple terms: They protect the cloud, you protect what's in the cloud.**

## Why This Matters for Backups
While cloud providers secure their infrastructure, most of them don't protect you from:
- Accidental deletions by users
- Ransomware or malicious activity
- Account compromises
- Unintended sharing or permission changes
- Provider-side data loss (rare but possible)

This is why you need a tool like Plakar to provide an independent backup layer that ensures your data remains safe, verifiable, and restorable regardless of what happens in your cloud environment.

## Provider-Specific Resources
For detailed information on each provider's shared responsibility model:
- [Dropbox Shared Responsibility Guide](https://assets.dropbox.com/documents/en/trust/shared-responsibility-guide.pdf)
