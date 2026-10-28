# System

Service discovery, health, diagnostics and updates.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


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
