
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

[Data residency](../../compliance/residency) narrows this further. A matching
source is only scheduled when it and the policy's store carry the same
residency, so the scheduler never creates a schedule that would send backup data
to another country.

The scheduler owns the schedules it creates and keeps them in line with what the
policy currently matches. Residency is part of that evaluation, so changing the
residency of an inventory or a resource does not require editing the policy. The
scheduler works out what needs to change and updates its schedules, dropping
those whose source and store no longer share a residency and creating those that
now qualify.

The policy scheduler is read-only. Schedules are fully managed by the policies
engine and cannot be manually edited or overridden from the scheduler. To change
how sources are scheduled, update the policy itself.

See the [policies documentation](../../compliance/policies) for details on
creating and managing policies. See the
[job history documentation](../job-history) for details on monitoring jobs
triggered by the policy scheduler.

