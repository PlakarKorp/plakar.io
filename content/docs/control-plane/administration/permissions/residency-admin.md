---
title: "Residency Admin"
date: "2026-09-22T00:00:00Z"
summary: "Decides where the data of an organization is allowed to live."
weight: 11
---

# Residency Admin

The **Residency Admin** decides where data may live.
[Data residency](../../../compliance/residency) is held at configure, so this
role sets the residency of an inventory, which every resource in it inherits,
and the residency of an individual resource where that differs. It is the only
thing this role can change, and because the permission is held at configure
rather than in full, it cannot decide who else reaches it.

Inventories can be inspected but not changed. Every other resource class is out
of reach, as are the organization, its members, the audit log, and both legal
holds.

## Organization

| Permission                      | Access    |
| ------------------------------- | --------- |
| Organization                    | No access |
| Members                         | No access |
| Audit log                       | No access |
| Data residency                  | Configure |
| Restore points legal holds      | No access |
| Inventory resources legal holds | No access |

## Resources

| Permission            | Access    |
| --------------------- | --------- |
| Inventories           | View      |
| Apps                  | No access |
| Restore point data    | No access |
| Secret Providers      | No access |
| Integrations          | No access |
| Policies              | No access |
| Settings              | No access |
| Edges                 | No access |
| Configuration bundles | No access |
| Data classes          | No access |
| Environments          | No access |
| Schedules             | No access |

## Deployment

| Permission    | Access    |
| ------------- | --------- |
| Control plane | No access |
| License       | No access |
