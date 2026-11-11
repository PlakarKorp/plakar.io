# System

Service discovery, health, diagnostics and updates.

Generated from Plakar Control Plane v0.20. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## Describe the deployment

`GET /api/v1/`

Returns the version and, to a caller who may read the control plane, the deployment quota and usage.

Authentication: none

Responses:

- `200` OK: `RootResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get the appliance hardware specs

`GET /api/v1/appliance/specs`

Returns the CPU, memory, disks and data filesystem of the host, as reported by the orkestrator. Anonymous until the instance is enrolled, then a badge is required. The CPU, memory and disks are only returned to a caller who may read the control plane. Answers 501 when the orkestrator does not provide them.

Authentication: none

Responses:

- `200` OK: `ApplianceSpecs`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Download a database dump

`GET /api/v1/database/dump`

Authentication: badge

Parameters:

- `format` (query, string): Dump encoding.

Responses:

- `200` The database dump
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get the debug log state

`GET /api/v1/debuglog`

Authentication: badge

Responses:

- `200` OK: `DebugLogState`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Turn the debug log on or off

`PUT /api/v1/debuglog`

Authentication: badge

Request body (application/json): `DebugLogRequest`

Responses:

- `200` OK: `DebugLogState`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Check whether an update is available

`GET /api/v1/has-update`

Authentication: badge

Responses:

- `200` OK: `HasUpdateResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Ping the control plane

`POST /api/v1/janitor/ping`

Always answers. The janitor's ping task polls it.

Authentication: none

Responses:

- `200` OK: `JanitorPingResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Replace the instance license

`PUT /api/v1/license`

Installs a freshly issued offline license. It must verify against the builtin offline keys and be minted for the enrolled organization. Owner only.

Authentication: badge

Request body (application/json): `LicenseUpdateRequest`

Responses:

- `200` OK: `License`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Download the daemon log for a day

`GET /api/v1/logs`

Authentication: badge

Parameters:

- `date` (query, string<date-time>): Day whose log to return. Defaults to today.

Responses:

- `200` The gzipped daemon log
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Enroll a replica

`POST /api/v1/replication/enroll`

Exchanges the replication enrollment key in the body for a per-replica bearer token, returned once. Refused with 409 when the replica's schema version is not the primary's.

Authentication: none

Request body (application/json): `ReplicationEnrollRequest`

Responses:

- `200` OK: `ReplicationEnrollResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Generate a replication enrollment key

`POST /api/v1/replication/enrollment-key/generate`

Writes a fresh key into the replication settings section and returns the section. Read and clear it through the settings endpoints.

Authentication: badge

Responses:

- `200` OK: `Settings`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Promote this replica

`POST /api/v1/replication/promote`

Turns this passive slave into the active control plane: binds the instance identity to this instance's key and stamps the promotion. One-way. The daemon must then be restarted to boot active. Refused with 409 when not enrolled, never swept, or already promoted.

Authentication: badge

Responses:

- `200` OK: `ReplicationPromotion`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the enrolled replicas

`GET /api/v1/replication/replicas`

Authentication: badge

Parameters:

- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.

Responses:

- `200` OK: `ReplicaEntryPage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Revoke a replica

`DELETE /api/v1/replication/replicas/{replica_id}`

The replica's token stops authenticating at once; the slave itself is untouched.

Authentication: badge

Parameters:

- `replica_id` (path, string, required)

Responses:

- `204` No Content
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the replicated tables

`GET /api/v1/replication/tables`

The sweep's table of contents: every replicated table with its key columns, and the primary's schema version.

Authentication: replica

Responses:

- `200` OK: `ReplicationTablesResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Read a page of a replicated table

`GET /api/v1/replication/tables/{name}`

Rows as JSON objects, ordered by key. next_offset is set while another page follows.

Authentication: replica

Parameters:

- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `name` (path, string, required)

Responses:

- `200` OK: `ReplicationRowsResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get the safe mode state

`GET /api/v1/safe-mode`

Authentication: badge

Responses:

- `200` OK: `SafeModeState`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Turn safe mode on or off

`PUT /api/v1/safe-mode`

Authentication: badge

Request body (application/json): `SafeModeRequest`

Responses:

- `200` OK: `SafeModeState`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Update the control plane to the latest version

`POST /api/v1/update`

Authentication: badge

Request body (application/json): `UpdateRequest`

Responses:

- `200` OK: `UpdateResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Check liveness

`GET /health`

Authentication: none

Responses:

- `200` OK
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Check readiness

`GET /health/ready`

Answers 503 while the database does not.

Authentication: none

Responses:

- `200` Ready
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `503` Not ready
- `default`

## Check replication

`GET /health/replication`

Reports the replication role and sync freshness.

Authentication: none

Responses:

- `200` OK: `EmptyObject`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`
