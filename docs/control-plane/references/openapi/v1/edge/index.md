# Edge

Edge enrollment and the edge work channel.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## List the edge pools

`GET /api/v1/account/organizations/{id}/edge-pools`

Authentication: badge

Parameters:

- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `search` (query, string): Case-insensitive match on the pool name.
- `enrollment` (query, string): Only pools whose enrollment is open, or closed.
- `empty` (query, boolean): Only pools holding no edge, or only pools holding some.
- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Responses:

- `200` OK: `EdgePoolResponsePage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create an edge pool

`POST /api/v1/account/organizations/{id}/edge-pools`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Request body (application/json): `CreateEdgePoolRequest`

Responses:

- `200` OK: `EdgePoolResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get an edge pool

`GET /api/v1/account/organizations/{id}/edge-pools/{pool_id}`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `pool_id` (path, string, required)

Responses:

- `200` OK: `EdgePoolResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Delete an edge pool

`DELETE /api/v1/account/organizations/{id}/edge-pools/{pool_id}`

Refused with 409 while the pool still holds edges.

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `pool_id` (path, string, required)

Responses:

- `200` OK
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Close enrollment into an edge pool

`DELETE /api/v1/account/organizations/{id}/edge-pools/{pool_id}/enrollment-key`

Clears the pool's enrollment key. Edges already enrolled are kept.

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `pool_id` (path, string, required)

Responses:

- `200` OK
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Generate an edge pool enrollment key

`POST /api/v1/account/organizations/{id}/edge-pools/{pool_id}/enrollment-key/generate`

Opens enrollment into the pool with a fresh key, returned once. The previous key stops working.

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `pool_id` (path, string, required)

Responses:

- `200` OK: `EdgePoolEnrollmentKeyResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Generate an edge enrollment key

`POST /api/v1/account/organizations/{id}/edge/enrollment-key/generate`

Writes a fresh key into the edge settings section. Read and clear it through the settings endpoints.

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Responses:

- `200` OK: `Settings`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the enrolled edges

`GET /api/v1/account/organizations/{id}/edges`

Authentication: badge

Parameters:

- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `pool_id` (query, string<uuid>): Only edges in this pool.
- `no_pool` (query, boolean): Only edges in no pool. Cannot be combined with pool_id.
- `search` (query, string): Case-insensitive match on edge name or hostname.
- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Responses:

- `200` OK: `EdgeEntryPage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get an enrolled edge

`GET /api/v1/account/organizations/{id}/edges/{edge_id}`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `edge_id` (path, string, required)

Responses:

- `200` OK: `EdgeEntry`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Put an edge in a pool

`PUT /api/v1/account/organizations/{id}/edges/{edge_id}/pool`

Moves the edge out of the pool it was in, if any. The edge and the pool must belong to the organization.

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `edge_id` (path, string, required)

Request body (application/json): `AssignEdgePoolRequest`

Responses:

- `200` OK
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Take an edge out of its pool

`DELETE /api/v1/account/organizations/{id}/edges/{edge_id}/pool`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `edge_id` (path, string, required)

Responses:

- `200` OK
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Enroll an edge

`POST /api/v1/edge/enroll`

Exchanges the shared enrollment key in the body for a per-edge token. No other credential is needed.

Authentication: none

Request body (application/json): `EdgeEnrollRequest`

Responses:

- `200` OK: `EdgeEnrollResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Download a connector package for the edge platform

`GET /api/v1/edge/packages/{name}/{version}`

Authentication: edge

Parameters:

- `os` (query, string, required): Target operating system.
- `arch` (query, string, required): Target architecture.
- `name` (path, string, required)
- `version` (path, string, required)

Responses:

- `200` The connector package
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Wait for work

`POST /api/v1/edge/poll`

Long-polls for the next piece of work for the calling edge.

Authentication: edge

Request body (application/json): `EdgePollRequest`

Responses:

- `200` A piece of work: `EdgeWorkItem`
- `204` No work arrived before the hold expired
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Enroll an edge into a pool

`POST /api/v1/edge/pools/enroll`

Exchanges an edge pool's enrollment key for a per-edge token. The edge joins that pool.

Authentication: none

Request body (application/json): `EdgePoolEnrollRequest`

Responses:

- `200` OK: `EdgeEnrollResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Reply to a piece of work

`POST /api/v1/edge/{work_id}/reply`

Authentication: edge

Parameters:

- `work_id` (path, string, required)

Request body (application/json): `EdgeReply`

Responses:

- `204` No Content
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`
