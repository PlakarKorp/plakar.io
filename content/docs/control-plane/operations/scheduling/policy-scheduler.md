---
title: "Policy Scheduler"
date: "2026-06-25T00:00:00Z"
weight: 4
summary: "How policies automatically schedule tasks in Plakar Control Plane."
---

# Policy Scheduler

The policy scheduler automatically creates backup schedules based on the rules
defined in your policies.

When creating a policy, you define:

- How many backups are required within a given time period
- How long backups should be retained
- Which environment and data class the policy applies to
- Which store to use for storing the backups

Once the policy is active, Plakar Control Plane looks at all source apps and
finds those whose environment and data class match the policy. All matching
sources are automatically scheduled according to the rules defined in the
policy.

The policy scheduler is read-only. Schedules are fully managed by the policies
engine and cannot be manually edited or overridden from the scheduler. To change
how sources are scheduled, update the policy itself.

See the [policies documentation](../../policies) for details on creating and
managing policies. See the [job history documentation](../job-history) for
details on monitoring jobs triggered by the policy scheduler.
