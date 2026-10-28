# Scheduling

Schedulers, tasks and the jobs they produce.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## List the jobs

`GET /api/v1/scheduling/jobs`

Authentication: badge

Parameters:

- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `resource_type` (query, string): Which side resource_id matches.
- `task_status` (query, string): Only jobs in this state.
- `task_type` (query, string): Only jobs of this task type.
- `task_id` (query, string<uuid>): Only jobs of this task.
- `resource_id` (query, string<uuid>): Only jobs touching this connector.
- `actor` (query, string): Scheduler to address. default: tasks created through the UI or the API. policy: tasks created by SLA policies, and their jobs. custom: tasks of integrations that drive the scheduler, such as Kubernetes; deprecated in favor of user:<uuid>. user: the caller's personal scheduler; 404 until POST /scheduling/scheduler creates it. user:<uuid>: the personal scheduler of another user; needs view access on schedulers.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Responses:

- `200` OK: `SchedulingJobPage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get the log of a job

`GET /api/v1/scheduling/jobs/{job_id}/log`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `job_id` (path, string<uuid>, required): Job ID, as listed by GET /scheduling/jobs.

Responses:

- `200` The job log
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get the state of a job

`GET /api/v1/scheduling/jobs/{job_id}/state`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `job_id` (path, string<uuid>, required): Job ID, as listed by GET /scheduling/jobs.

Responses:

- `200` OK: `State`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get a scheduler

`GET /api/v1/scheduling/scheduler`

Authentication: badge

Parameters:

- `actor` (query, string): Scheduler to address. default: tasks created through the UI or the API. policy: tasks created by SLA policies, and their jobs. custom: tasks of integrations that drive the scheduler, such as Kubernetes; deprecated in favor of user:<uuid>. user: the caller's personal scheduler; 404 until POST /scheduling/scheduler creates it. user:<uuid>: the personal scheduler of another user; needs view access on schedulers.
- `revision` (query, integer): Revision to load. 0 is the current one.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Responses:

- `200` OK: `SchedulerResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create the personal scheduler of the caller

`POST /api/v1/scheduling/scheduler`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Responses:

- `200` OK: `SchedulerResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Delete the personal scheduler of the caller

`DELETE /api/v1/scheduling/scheduler`

Authentication: badge

Parameters:

- `actor` (query, string): Only user is accepted.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Responses:

- `200` OK
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get the access control of a scheduler

`GET /api/v1/scheduling/scheduler/access`

Authentication: badge

Parameters:

- `actor` (query, string): Scheduler to address. default: tasks created through the UI or the API. policy: tasks created by SLA policies, and their jobs. custom: tasks of integrations that drive the scheduler, such as Kubernetes; deprecated in favor of user:<uuid>. user: the caller's personal scheduler; 404 until POST /scheduling/scheduler creates it. user:<uuid>: the personal scheduler of another user; needs view access on schedulers.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Responses:

- `200` OK: `AccessResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Set the access control of a scheduler

`PUT /api/v1/scheduling/scheduler/access`

Authentication: badge

Parameters:

- `actor` (query, string): Scheduler to address. default: tasks created through the UI or the API. policy: tasks created by SLA policies, and their jobs. custom: tasks of integrations that drive the scheduler, such as Kubernetes; deprecated in favor of user:<uuid>. user: the caller's personal scheduler; 404 until POST /scheduling/scheduler creates it. user:<uuid>: the personal scheduler of another user; needs view access on schedulers.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Request body (application/json): `AccessRequest`

Responses:

- `200` OK: `AccessResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Cancel a job

`POST /api/v1/scheduling/scheduler/jobs/cancel/{job_id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `job_id` (path, string<uuid>, required): Job ID, as listed by GET /scheduling/jobs.

Responses:

- `200` OK: `SchedulerJobCancelResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the jobs around now

`GET /api/v1/scheduling/scheduler/jobs/nearby`

Authentication: badge

Parameters:

- `actor` (query, string): Scheduler to address. default: tasks created through the UI or the API. policy: tasks created by SLA policies, and their jobs. custom: tasks of integrations that drive the scheduler, such as Kubernetes; deprecated in favor of user:<uuid>. user: the caller's personal scheduler; 404 until POST /scheduling/scheduler creates it. user:<uuid>: the personal scheduler of another user; needs view access on schedulers.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Responses:

- `200` OK: `SchedulingNearby`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the planned jobs

`GET /api/v1/scheduling/scheduler/jobs/planned`

Authentication: badge

Parameters:

- `actor` (query, string): Scheduler to address. default: tasks created through the UI or the API. policy: tasks created by SLA policies, and their jobs. custom: tasks of integrations that drive the scheduler, such as Kubernetes; deprecated in favor of user:<uuid>. user: the caller's personal scheduler; 404 until POST /scheduling/scheduler creates it. user:<uuid>: the personal scheduler of another user; needs view access on schedulers.
- `revision` (query, integer): Scheduler revision. 0 is the current one.
- `t0` (query, string<date-time>): Start of the window. Defaults to now.
- `t1` (query, string<date-time>): End of the window.
- `count` (query, integer): Maximum number of jobs.
- `task_id` (query, string<uuid>): Only this task.
- `resource_id` (query, string<uuid>): Only tasks touching this connector.
- `task_type` (query, string): Only tasks of this type.
- `resource_type` (query, string): Which side resource_id matches.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Responses:

- `200` OK: `SchedulingPlannedJobs`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Export the job journal

`GET /api/v1/scheduling/scheduler/journal`

Authentication: badge

Parameters:

- `since` (query, string<date-time>, required): Export the jobs since this time.
- `actor` (query, string): Scheduler to address. default: tasks created through the UI or the API. policy: tasks created by SLA policies, and their jobs. custom: tasks of integrations that drive the scheduler, such as Kubernetes; deprecated in favor of user:<uuid>. user: the caller's personal scheduler; 404 until POST /scheduling/scheduler creates it. user:<uuid>: the personal scheduler of another user; needs view access on schedulers.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Responses:

- `200` The jobs, as CSV
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get the roles of a scheduler

`GET /api/v1/scheduling/scheduler/roles`

Authentication: badge

Parameters:

- `actor` (query, string): Scheduler to address. default: tasks created through the UI or the API. policy: tasks created by SLA policies, and their jobs. custom: tasks of integrations that drive the scheduler, such as Kubernetes; deprecated in favor of user:<uuid>. user: the caller's personal scheduler; 404 until POST /scheduling/scheduler creates it. user:<uuid>: the personal scheduler of another user; needs view access on schedulers.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Responses:

- `200` OK: `SchedulerRolesResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Set the roles of a scheduler

`PUT /api/v1/scheduling/scheduler/roles`

Authentication: badge

Parameters:

- `actor` (query, string): Scheduler to address. default: tasks created through the UI or the API. policy: tasks created by SLA policies, and their jobs. custom: tasks of integrations that drive the scheduler, such as Kubernetes; deprecated in favor of user:<uuid>. user: the caller's personal scheduler; 404 until POST /scheduling/scheduler creates it. user:<uuid>: the personal scheduler of another user; needs view access on schedulers.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Request body (application/json): `SchedulerRolesRequest`

Responses:

- `200` OK: `SchedulerRolesResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Run a one-off task

`POST /api/v1/scheduling/scheduler/run`

Authentication: badge

Parameters:

- `actor` (query, string): Scheduler to address. default: tasks created through the UI or the API. policy: tasks created by SLA policies, and their jobs. custom: tasks of integrations that drive the scheduler, such as Kubernetes; deprecated in favor of user:<uuid>. user: the caller's personal scheduler; 404 until POST /scheduling/scheduler creates it. user:<uuid>: the personal scheduler of another user; needs view access on schedulers.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Request body (application/json): `TaskRunRequest`

Responses:

- `200` OK: `TaskRunResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get a one-off task

`GET /api/v1/scheduling/scheduler/run/{at_id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `at_id` (path, string, required)

Responses:

- `200` OK: `TaskRunResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the tasks of a scheduler

`GET /api/v1/scheduling/scheduler/tasks`

Authentication: badge

Parameters:

- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `type` (query, array[string]): Only tasks of these types.
- `actor` (query, string): Scheduler to address. default: tasks created through the UI or the API. policy: tasks created by SLA policies, and their jobs. custom: tasks of integrations that drive the scheduler, such as Kubernetes; deprecated in favor of user:<uuid>. user: the caller's personal scheduler; 404 until POST /scheduling/scheduler creates it. user:<uuid>: the personal scheduler of another user; needs view access on schedulers.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Responses:

- `200` OK: `TaskResponsePage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Add a task

`POST /api/v1/scheduling/scheduler/tasks`

Authentication: badge

Parameters:

- `actor` (query, string): Scheduler to address. default: tasks created through the UI or the API. policy: tasks created by SLA policies, and their jobs. custom: tasks of integrations that drive the scheduler, such as Kubernetes; deprecated in favor of user:<uuid>. user: the caller's personal scheduler; 404 until POST /scheduling/scheduler creates it. user:<uuid>: the personal scheduler of another user; needs view access on schedulers.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Request body (application/json): `TaskRequest`

Responses:

- `200` OK: `TaskResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Edit a task

`POST /api/v1/scheduling/scheduler/tasks/{task_id}`

Authentication: badge

Parameters:

- `actor` (query, string): Scheduler to address. default: tasks created through the UI or the API. policy: tasks created by SLA policies, and their jobs. custom: tasks of integrations that drive the scheduler, such as Kubernetes; deprecated in favor of user:<uuid>. user: the caller's personal scheduler; 404 until POST /scheduling/scheduler creates it. user:<uuid>: the personal scheduler of another user; needs view access on schedulers.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `task_id` (path, string, required)

Request body (application/json): `TaskRequest`

Responses:

- `200` OK: `SchedulerResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Delete a task

`DELETE /api/v1/scheduling/scheduler/tasks/{task_id}`

Authentication: badge

Parameters:

- `actor` (query, string): Scheduler to address. default: tasks created through the UI or the API. policy: tasks created by SLA policies, and their jobs. custom: tasks of integrations that drive the scheduler, such as Kubernetes; deprecated in favor of user:<uuid>. user: the caller's personal scheduler; 404 until POST /scheduling/scheduler creates it. user:<uuid>: the personal scheduler of another user; needs view access on schedulers.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `task_id` (path, string, required)

Responses:

- `200` OK
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Run a task now

`POST /api/v1/scheduling/scheduler/tasks/{task_id}/run`

Authentication: badge

Parameters:

- `actor` (query, string): Scheduler to address. default: tasks created through the UI or the API. policy: tasks created by SLA policies, and their jobs. custom: tasks of integrations that drive the scheduler, such as Kubernetes; deprecated in favor of user:<uuid>. user: the caller's personal scheduler; 404 until POST /scheduling/scheduler creates it. user:<uuid>: the personal scheduler of another user; needs view access on schedulers.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `task_id` (path, string, required)

Responses:

- `200` OK: `TaskRunResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the personal schedulers

`GET /api/v1/scheduling/scheduler/users`

Authentication: badge

Parameters:

- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Responses:

- `200` OK: `SchedulerUserEntryPage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`
