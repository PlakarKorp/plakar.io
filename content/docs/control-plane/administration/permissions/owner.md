---
title: "Owner"
date: "2026-09-08T00:00:00Z"
weight: 2
summary: "Full control over one organization, and nothing on the deployment."
---

# Owner

The **Owner** has full control over the organization it is granted in. It holds
full access to every permission in the organization family and to every resource
class, which is the same reach the [Superuser](../superuser) has inside a single
organization.

What separates the two is the deployment family. The **Owner** holds nothing
there, so it cannot change
[Control Plane settings](../../settings/control-plane) or manage the license,
and its access stops at the boundary of its own organization.

## Organization

| Permission                      | Access |
| ------------------------------- | ------ |
| Organization                    | Full   |
| Members                         | Full   |
| Audit log                       | Full   |
| Data residency                  | Full   |
| Restore points legal holds      | Full   |
| Inventory resources legal holds | Full   |

## Resources

| Permission            | Access |
| --------------------- | ------ |
| Inventories           | Full   |
| Apps                  | Full   |
| Restore point data    | Full   |
| Secret Providers      | Full   |
| Integrations          | Full   |
| Policies              | Full   |
| Settings              | Full   |
| Edges                 | Full   |
| Configuration bundles | Full   |
| Data classes          | Full   |
| Environments          | Full   |
| Schedules             | Full   |

## Deployment

| Permission    | Access    |
| ------------- | --------- |
| Control plane | No access |
| License       | No access |
