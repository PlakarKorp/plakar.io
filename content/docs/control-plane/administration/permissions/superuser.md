---
title: "Superuser"
date: "2026-09-08T00:00:00Z"
weight: 1
summary: "Full access to every organization and to the instance itself."
---

# Superuser

The **Superuser** is the admin account created when the instance is first set
up, either during [enrollment](../../../intro/enrollment#admin-account) or
during
[air-gapped enrollment](../../../intro/air-gapped#organization-and-admin-account)
on instances without outbound connectivity.

It holds full access to every permission in all three families. Its resource
access is not restricted to a subset, it covers every resource of every class in
the organization.

The **Superuser** is the only role that reaches the deployment family. Because
the instance belongs to no organization, that access extends to every
organization hosted on it, and it is what allows the **Superuser** to change
[Control Plane settings](../../settings/control-plane) and manage the license.

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

| Permission    | Access |
| ------------- | ------ |
| Control plane | Full   |
| License       | Full   |
