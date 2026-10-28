# Agent

Endpoints agents call to claim and report on work.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## List the pending one-off tasks

`GET /api/v1/agent/at/tasks`

Authentication: agent

Parameters:

- `from` (query, integer<int64>, required): Only tasks due from this time, in unix seconds.
- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.

Responses:

- `200` OK
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get a connector configuration

`GET /api/v1/agent/configurations/{configuration_id}`

Authentication: agent

Parameters:

- `configuration_id` (path, string, required)

Responses:

- `200` OK: `Configuration`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Check the quotas

`POST /api/v1/agent/janitor/check-quotas`

Authentication: agent

Responses:

- `200` OK: `CheckQuotasResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Convert configurations stored as rows

`POST /api/v1/agent/janitor/configurations/convert`

Converts a batch of rows-only connectors and secret providers to documents at their current revision.

Authentication: agent

Request body (application/json): `ConvertLegacyConfigurationsRequest`

Responses:

- `200` OK: `ConvertLegacyConfigurationsResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Deliver the pending mails

`POST /api/v1/agent/janitor/mails/deliver`

Authentication: agent

Responses:

- `200` OK: `DeliverMailsResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Delete the expired OAuth tokens and codes, and the ended grants

`POST /api/v1/agent/janitor/oauth/purge`

Authentication: agent

Responses:

- `200` OK: `PurgeOAuthResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Apply the SLA schedule plan

`POST /api/v1/agent/janitor/sla-schedule-plan/apply`

Authentication: agent

Responses:

- `200` OK: `ApplySLASchedulePlanResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Rebuild the SLA schedule plan

`POST /api/v1/agent/janitor/sla-schedule-plan/rebuild`

Authentication: agent

Responses:

- `200` OK: `RebuildSLASchedulePlanResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the janitor tasks

`GET /api/v1/agent/janitor/tasks`

Authentication: agent

Responses:

- `200` OK
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Register a janitor task

`POST /api/v1/agent/janitor/tasks`

Authentication: agent

Request body (application/json): `TaskRegistration`

Responses:

- `200` OK: `TaskEntry`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Start a janitor run

`POST /api/v1/agent/janitor/tasks/{task_id}/runs/start`

Authentication: agent

Parameters:

- `task_id` (path, string, required)

Responses:

- `200` OK: `RunStart`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Finish a janitor run

`POST /api/v1/agent/janitor/tasks/{task_id}/runs/{run_id}/finish`

Authentication: agent

Parameters:

- `task_id` (path, string, required)
- `run_id` (path, string, required)

Request body (application/json): `RunResult`

Responses:

- `200` OK: `TaskEntry`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Fold the usage rollup

`POST /api/v1/agent/janitor/usage-rollup/fold`

Authentication: agent

Responses:

- `200` OK: `FoldUsageRollupResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Synchronise the vector configuration

`POST /api/v1/agent/janitor/vector-config/sync`

Authentication: agent

Responses:

- `200` OK: `VectorSyncResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Deliver the pending webhooks

`POST /api/v1/agent/janitor/webhooks/deliver`

Authentication: agent

Responses:

- `200` OK: `DeliverWebhooksResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the running jobs

`GET /api/v1/agent/jobs`

Authentication: agent

Responses:

- `200` OK
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Queue a job

`POST /api/v1/agent/jobs`

Authentication: agent

Request body (application/json): `Job`

Responses:

- `200` OK: `Job`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Mark a job canceled

`POST /api/v1/agent/jobs/{job_id}/cancel`

Authentication: agent

Parameters:

- `job_id` (path, string, required)

Request body (application/json): `JobResult`

Responses:

- `200` OK: `Job`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Mark a job failed

`POST /api/v1/agent/jobs/{job_id}/fail`

Authentication: agent

Parameters:

- `job_id` (path, string, required)

Request body (application/json): `JobResult`

Responses:

- `200` OK: `Job`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Mark a job started

`POST /api/v1/agent/jobs/{job_id}/start`

Authentication: agent

Parameters:

- `job_id` (path, string, required)

Responses:

- `200` OK: `Job`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Mark a job succeeded

`POST /api/v1/agent/jobs/{job_id}/succeed`

Authentication: agent

Parameters:

- `job_id` (path, string, required)

Request body (application/json): `JobResult`

Responses:

- `200` OK: `Job`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Report job progress

`POST /api/v1/agent/jobs/{job_id}/update`

Authentication: agent

Parameters:

- `job_id` (path, string, required)

Request body (application/json): `JobUpdateRequest`

Responses:

- `200` OK: `Job`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the schedulers

`GET /api/v1/agent/schedulers`

Authentication: agent

Parameters:

- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.

Responses:

- `200` OK: `SchedulerEntryPage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get a scheduler

`GET /api/v1/agent/schedulers/{scheduler_id}`

Authentication: agent

Parameters:

- `revision` (query, integer, required): Scheduler revision to return the tasks of.
- `scheduler_id` (path, string, required)

Responses:

- `200` OK
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Record a snapshot of a source

`POST /api/v1/agent/snapshots/source/{source_id}/snapshot`

Authentication: agent

Parameters:

- `source_id` (path, string, required)

Request body (application/json): `SnapshotSourceSetSnapshotRequest`

Responses:

- `200` OK
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Record a prune of a store

`POST /api/v1/agent/snapshots/store/{store_id}/prune`

Authentication: agent

Parameters:

- `store_id` (path, string, required)

Request body (application/json): `StorePruneSnapshotsRequest`

Responses:

- `200` OK
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Record snapshots removed from a store

`POST /api/v1/agent/snapshots/store/{store_id}/rm`

Authentication: agent

Parameters:

- `store_id` (path, string, required)

Request body (application/json): `StoreRmSnapshotsRequest`

Responses:

- `200` OK
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Record the snapshots of a store

`POST /api/v1/agent/snapshots/store/{store_id}/snapshots`

Authentication: agent

Parameters:

- `store_id` (path, string, required)

Request body (application/json): `StoreSetSnapshotsRequest`

Responses:

- `200` OK
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get a task

`GET /api/v1/agent/tasks/{task_id}`

Authentication: agent

Parameters:

- `task_id` (path, string, required)

Responses:

- `200` OK: `Task`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`
