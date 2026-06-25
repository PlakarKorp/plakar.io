
# One-off Tasks

A one-off task is a task that runs immediately without being attached to a
schedule. This is useful when you want to run an operation on demand, such as
triggering an immediate backup or restore a backup snapshot.

One-off tasks can be created directly from **Operations > Scheduling** or from
the various pages as a quick way to setup tasks. This includes:

- Each connector pages have quick actions to run tasks supported by the
  connector. See the [connectors documentation](../../connectors)
- When browsing snapshots in a store or a source you can quickly setup a restore
  or check task on each snapshot. See the
  [store connector](../../connectors/stores) and
  [source connector](../../connectors/sources) documentation

All of these lead to the same task UI. From there you can run the task
immediately as a one-off, or attach a schedule to it and have it run repeatedly.
See the [scheduler documentation](../scheduler) for details on attaching
schedules and monitoring job progress.

