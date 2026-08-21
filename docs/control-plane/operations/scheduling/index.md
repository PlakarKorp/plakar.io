

# Scheduling

Plakar Control Plane supports three ways to schedule backup operations:

- **Manual scheduler**: create tasks manually from the UI and attach one or more
  schedules to run them on a recurring basis
- **Policy scheduler**: policies automatically schedule tasks based on SLA rules
  defined for your sources
- **User schedulers**: each
  [Application user](../../administration/users#application-users) can have its
  own scheduler, created and managed through the Plakar Control Plane API using
  that user's API key

All three trigger the same types of tasks. The
[manual scheduler](./manual-scheduler) gives you direct control from the UI over
when and how tasks run, the [policy scheduler](./policy-scheduler) automates
scheduling based on the protection requirements defined in your policies, and
[user schedulers](./user-schedulers) let external clients manage their own
schedules independently through the API.


Backup, check, and sync tasks can also be scheduled declaratively from
Kubernetes using the
[Kubernetes Operator](../../infrastructure-as-code/kubernetes-operator), which
is currently the primary example of a user scheduler.





## [Scheduled Tasks](https://www.plakar.io/docs/control-plane/operations/scheduling/tasks/index.md)



## [One-off Tasks](https://www.plakar.io/docs/control-plane/operations/scheduling/one-off-tasks/index.md)



## [Manual Scheduler](https://www.plakar.io/docs/control-plane/operations/scheduling/manual-scheduler/index.md)



## [Policy Scheduler](https://www.plakar.io/docs/control-plane/operations/scheduling/policy-scheduler/index.md)



## [User Schedulers](https://www.plakar.io/docs/control-plane/operations/scheduling/user-schedulers/index.md)



## [Job History](https://www.plakar.io/docs/control-plane/operations/scheduling/job-history/index.md)




