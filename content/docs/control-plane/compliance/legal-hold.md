---
title: "Legal Hold"
date: "2026-09-09T00:00:00Z"
weight: 3
summary:
  "Lock restore points so they cannot be deleted while a hold is in place."
---

# Legal Hold

A **legal hold** prevents a restore point from being deleted while the hold is
in place. Use a hold when a restore point needs to be preserved beyond the
retention period defined by its [SLA policy](./policies), such as during
litigation or an audit.

A hold applies to an individual restore point. Unlike an SLA policy or
[data residency](./residency), which affect how resources and future operations
are handled, a legal hold protects a restore point that already exists.

## Placing a hold

Holds are applied manually to individual restore points. You can place a hold
from the restore points listed in the **Browse** tab of a
[store app](../../apps/stores#browsing-restore-points). The permissions required
to manage a hold depend on your [permissions](../../administration/permissions)
in the organization that owns the store.

![](../images/legal-hold-1.png)

{{< figure src="../images/legal-hold-2.png" alt="" class="mx-auto max-w-100" >}}

## What a hold does

A held restore point is excluded from pruning. When an [SLA policy](./policies)
determines that a restore point has reached the end of its retention period, PCP
skips it if a legal hold is in place.

The restore point therefore remains available until the hold is removed,
regardless of the retention period defined by the policy that created it.

## What a hold does not prevent

A legal hold is enforced by Plakar Control Plane, not by the store itself. The
stores Plakar Control Plane creates are ordinary Kloset stores, and a store can
be used from Plakar Control Plane and from the open source `plakar` CLI
interchangeably. Anyone holding the store passphrase can therefore delete a
restore point directly with `plakar`, whether or not a hold is in place.

A hold also has no effect on the underlying files. The objects or files the
store is made of can still be deleted by anyone with access to the bucket or the
filesystem holding them.

> [!NOTE]
>
> To prevent deletion below Plakar Control Plane, use what the storage itself
> provides, such as object lock on object storage or file permissions on a
> filesystem.
