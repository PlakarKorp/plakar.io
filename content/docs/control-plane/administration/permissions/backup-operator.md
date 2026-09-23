---
title: "Backup Operator"
date: "2026-09-22T00:00:00Z"
summary: "Runs and supervises backup jobs, and defines none of them."
weight: 8
---

# Backup Operator

The **Backup Operator** runs the work that other roles define. Apps, restore
point data, and schedules are held at run, so backups and restores can be
started and followed without any of them being changed. Inventories are visible,
which is what identifies the resources a job acts on.

Every other resource class is out of reach, as is the organization family. The
role initiates critical actions but holds nothing that would let it change the
conditions they run under, or let anyone else run them.

The [Operator](../operator) defines the backup chain and runs it. The **Backup
Operator** only runs it.

## Organization

| Permission                      | Access    |
| ------------------------------- | --------- |
| Organization                    | No access |
| Members                         | No access |
| Audit log                       | No access |
| Data residency                  | No access |
| Restore points legal holds      | No access |
| Inventory resources legal holds | No access |

## Resources

| Permission            | Access    |
| --------------------- | --------- |
| Inventories           | View      |
| Apps                  | Run       |
| Restore point data    | Run       |
| Secret Providers      | No access |
| Integrations          | No access |
| Policies              | No access |
| Settings              | No access |
| Edges                 | No access |
| Configuration bundles | No access |
| Data classes          | No access |
| Environments          | No access |
| Schedules             | Run       |

## Deployment

| Permission    | Access    |
| ------------- | --------- |
| Control plane | No access |
| License       | No access |
