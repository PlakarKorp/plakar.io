# Settings

Deployment and organization settings.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## List the organization settings

`GET /api/v1/account/organizations/{id}/settings`

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

## Update several organization settings

`POST /api/v1/account/organizations/{id}/settings`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Request body (application/json): `Settings`

Responses:

- `200` OK: `Settings`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the organization setting sections

`GET /api/v1/account/organizations/{id}/settings/sections`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Responses:

- `200` OK: `SectionsResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get an organization setting

`GET /api/v1/account/organizations/{id}/settings/{name}`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `name` (path, string, required)

Responses:

- `200` OK: `Settings`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Set an organization setting

`PUT /api/v1/account/organizations/{id}/settings/{name}`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `name` (path, string, required)

Request body (application/json): object

Responses:

- `200` OK: `Settings`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Delete an organization setting

`DELETE /api/v1/account/organizations/{id}/settings/{name}`

The section is inherited again.

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `name` (path, string, required)

Responses:

- `200` OK: `Settings`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get the effective value of an organization setting

`GET /api/v1/account/organizations/{id}/settings/{name}/effective`

The value the organization experiences, beside its own row, so a client can tell own, inherited and locked apart.

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `name` (path, string, required)

Responses:

- `200` OK: `EffectiveSetting`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Set how a setting section is handed down

`PUT /api/v1/account/organizations/{id}/settings/{name}/flags`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `name` (path, string, required)

Request body (application/json): `SettingFlagsRequest`

Responses:

- `200` OK: `Settings`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the deployment settings

`GET /api/v1/settings`

Authentication: badge

Responses:

- `200` OK: `Settings`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Update several deployment settings

`POST /api/v1/settings`

Authentication: badge

Request body (application/json): `Settings`

Responses:

- `200` OK: `Settings`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the deployment setting sections

`GET /api/v1/settings/sections`

Authentication: badge

Responses:

- `200` OK: `SectionsResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get a deployment setting

`GET /api/v1/settings/{name}`

Authentication: badge

Parameters:

- `name` (path, string, required)

Responses:

- `200` OK: `Settings`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Set a deployment setting

`PUT /api/v1/settings/{name}`

Authentication: badge

Parameters:

- `name` (path, string, required)

Request body (application/json): object

Responses:

- `200` OK: `Settings`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`
