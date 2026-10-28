# Access

Roles, grants and class-level access control.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## List the grants

`GET /api/v1/account/organizations/{id}/access`

Authentication: badge

Parameters:

- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `search` (query, string): Free-text search on grants.
- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Responses:

- `200` OK: `GrantResponsePage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create a grant

`POST /api/v1/account/organizations/{id}/access`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Request body (application/json): `GrantRequest`

Responses:

- `200` OK: `GrantResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get a grant

`GET /api/v1/account/organizations/{id}/access/{grant_id}`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `grant_id` (path, string, required)

Responses:

- `200` OK: `GrantResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Update a grant

`PUT /api/v1/account/organizations/{id}/access/{grant_id}`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `grant_id` (path, string, required)

Request body (application/json): `UpdateGrantRequest`

Responses:

- `200` OK: `GrantResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Revoke a grant

`DELETE /api/v1/account/organizations/{id}/access/{grant_id}`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `grant_id` (path, string, required)

Responses:

- `200` OK: `EmptyObject`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get the access control of a class

`GET /api/v1/account/organizations/{id}/classes/{subject}/access`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `subject` (path, string, required)

Responses:

- `200` OK: `AccessResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Set the access control of a class

`PUT /api/v1/account/organizations/{id}/classes/{subject}/access`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `subject` (path, string, required)

Request body (application/json): `AccessRequest`

Responses:

- `200` OK: `AccessResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the roles

`GET /api/v1/roles`

Authentication: badge

Parameters:

- `category` (query, string): Only roles of this category.

Responses:

- `200` OK
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get a role

`GET /api/v1/roles/{role_name}`

Authentication: badge

Parameters:

- `role_name` (path, string, required)

Responses:

- `200` OK: `RoleResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`
