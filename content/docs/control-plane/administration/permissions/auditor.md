---
title: "Auditor"
date: "2026-09-08T00:00:00Z"
weight: 5
summary: "Reads everything in an organization and changes nothing."
---

# Auditor

The **Auditor** reads everything and changes nothing. Every permission in the
organization family and every resource class is held at the view level, so an
**Auditor** can inspect the organization, its members, its audit log, and all of
its resources without being able to alter any of them. It holds nothing in the
deployment family.

This is the role to grant for review and compliance work, where visibility is
the requirement and any ability to make a change is a liability.

## Organization

| Permission                      | Access |
| ------------------------------- | ------ |
| Organization                    | View   |
| Members                         | View   |
| Audit log                       | View   |
| Data residency                  | View   |
| Restore points legal holds      | View   |
| Inventory resources legal holds | View   |

## Resources

| Permission            | Access |
| --------------------- | ------ |
| Inventories           | View   |
| Apps                  | View   |
| Restore point data    | View   |
| Secret Providers      | View   |
| Integrations          | View   |
| Policies              | View   |
| Settings              | View   |
| Edges                 | View   |
| Configuration bundles | View   |
| Data classes          | View   |
| Environments          | View   |
| Schedules             | View   |

## Deployment

| Permission    | Access    |
| ------------- | --------- |
| Control plane | No access |
| License       | No access |
