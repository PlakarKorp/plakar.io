---
title: "Key Manager"
date: "2026-09-22T00:00:00Z"
summary:
  "Manages the KMS or HSM integration behind secret providers. Coming soon."
weight: 17
---

# Key Manager

The **Key Manager** manages the KMS or HSM integration that secret providers
draw their key material from, including rotation and revocation. It runs no
backup and no restore.

> [!NOTE]
>
> This role is coming soon. It grants no access in any family today, so
> assigning it has no effect yet.

Rotation and revocation are not yet capabilities the permission model can
express, so there is no permission for this role to hold. It is named ahead of
them rather than approximated with the permissions that exist today.

That is also what keeps it separate from the [Secrets Admin](../secrets-admin).
The Secrets Admin defines the secret providers, while the Key Manager manages
the keys behind them. Granting it secret providers in full in the meantime would
make it a second Secrets Admin rather than a distinct role.

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
| Inventories           | No access |
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
