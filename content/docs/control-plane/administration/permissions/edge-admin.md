---
title: "Edge Admin"
date: "2026-09-22T00:00:00Z"
summary: "Manages the machines an organization runs its work on."
weight: 13
---

# Edge Admin

The **Edge Admin** manages the machines an organization runs its work on. The
**Edges** resource class is held in full, so
[edges](../../../infrastructure/edges) can be enrolled, listed, and
decommissioned, and it is the only resource this role can change.

Inventories can be inspected but not changed. Every other resource class is out
of reach, so this role configures none of the work the edges carry out. It holds
no permission in the organization family and nothing in the deployment family.

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
| Apps                  | No access |
| Restore point data    | No access |
| Secret Providers      | No access |
| Integrations          | No access |
| Policies              | No access |
| Settings              | No access |
| Edges                 | Full      |
| Configuration bundles | No access |
| Data classes          | No access |
| Environments          | No access |
| Schedules             | No access |

## Deployment

| Permission    | Access    |
| ------------- | --------- |
| Control plane | No access |
| License       | No access |
