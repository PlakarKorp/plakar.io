# Snapshots

Snapshots recorded against a source or a store.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## List the snapshots of a source

`GET /api/v1/snapshots/source/{source_id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `source_id` (path, string, required)

Responses:

- `200` OK: `SnapshotSourceEntryPage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get a snapshot of a source

`GET /api/v1/snapshots/source/{source_id}/{snapshot_id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `source_id` (path, string, required)
- `snapshot_id` (path, string, required)

Responses:

- `200` OK: `SnapshotSourceEntry`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the snapshots of a store

`GET /api/v1/snapshots/store/{store_id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `store_id` (path, string, required)

Responses:

- `200` OK: `SnapshotStoreEntryPage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Preview a prune of a store

`POST /api/v1/snapshots/store/{store_id}/prune/preview`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `store_id` (path, string, required)

Request body (application/json): `TaskConfigRequest`

Responses:

- `200` OK: `PrunePreviewResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Prune a store

`POST /api/v1/snapshots/store/{store_id}/prune/run`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `actor` (query, string): Scheduler to address. default: tasks created through the UI or the API. policy: tasks created by SLA policies, and their jobs. custom: tasks of integrations that drive the scheduler, such as Kubernetes; deprecated in favor of user:<uuid>. user: the caller's personal scheduler; 404 until POST /scheduling/scheduler creates it. user:<uuid>: the personal scheduler of another user; needs view access on schedulers.
- `store_id` (path, string, required)

Request body (application/json): `TaskConfigRequest`

Responses:

- `200` OK: `PruneRunResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get a snapshot of a store

`GET /api/v1/snapshots/store/{store_id}/{snapshot_id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `store_id` (path, string, required)
- `snapshot_id` (path, string, required)

Responses:

- `200` OK: `SnapshotStoreEntry`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Update a snapshot in a store

`PATCH /api/v1/snapshots/store/{store_id}/{snapshot_id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `store_id` (path, string, required)
- `snapshot_id` (path, string, required)

Request body (application/json): `SnapshotPatchRequest`

Responses:

- `200` OK: `SnapshotStoreEntry`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the stores holding a snapshot

`GET /api/v1/snapshots/{snapshot_id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `snapshot_id` (path, string, required)

Responses:

- `200` OK: `SnapshotStoreEntriesResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Update a snapshot in every store

`PATCH /api/v1/snapshots/{snapshot_id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `snapshot_id` (path, string, required)

Request body (application/json): `SnapshotPatchRequest`

Responses:

- `200` OK: `SnapshotStoreEntriesResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`
