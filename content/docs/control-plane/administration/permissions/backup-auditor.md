---
title: "Backup Auditor"
date: "2026-09-22T00:00:00Z"
summary: "Reads how backups are configured and what has run, and nothing else."
weight: 16
---

# Backup Auditor

The **Backup Auditor** holds nothing above the view level, so nothing it reaches
can be changed. It sees how backups are configured and what has run: apps,
integrations, policies, settings, configuration bundles, data classes,
environments, schedules, and the audit log.

Restore point data, secret providers, inventories, and edges are out of reach,
so the review it supports covers the configuration and the record of activity
rather than the backed up data itself or the credentials used to reach it. It
holds no other organization permission and nothing in the deployment family.

The [Auditor](../auditor) reads everything an organization holds. The **Backup
Auditor** reads its configuration and its audit log alone.

## Organization

| Permission                      | Access    |
| ------------------------------- | --------- |
| Organization                    | No access |
| Members                         | No access |
| Audit log                       | View      |
| Data residency                  | No access |
| Restore points legal holds      | No access |
| Inventory resources legal holds | No access |

## Resources

| Permission            | Access    |
| --------------------- | --------- |
| Inventories           | No access |
| Apps                  | View      |
| Restore point data    | No access |
| Secret Providers      | No access |
| Integrations          | View      |
| Policies              | View      |
| Settings              | View      |
| Edges                 | No access |
| Configuration bundles | View      |
| Data classes          | View      |
| Environments          | View      |
| Schedules             | View      |

## Deployment

| Permission    | Access    |
| ------------- | --------- |
| Control plane | No access |
| License       | No access |
