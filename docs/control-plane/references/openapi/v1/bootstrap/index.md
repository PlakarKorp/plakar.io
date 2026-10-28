# Bootstrap

First-run setup of a fresh control plane.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## Get the bootstrap account

`GET /api/v1/bootstrap/account`

Authentication: none

Responses:

- `200` OK: `AccountMeResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Enroll the control plane

`POST /api/v1/bootstrap/enroll`

Authentication: none

Request body (application/json): `BootstrapEnrollRequest`

Responses:

- `200` OK: `TokenResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Enroll the control plane from a license

`POST /api/v1/bootstrap/enroll/license`

Authentication: none

Request body (application/json): `BootstrapEnrollLicenseRequest`

Responses:

- `200` OK: `TokenResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Preview a license

`POST /api/v1/bootstrap/enroll/license/preview`

Verifies a license and reports what it describes. Nothing is persisted.

Authentication: none

Request body (application/json): `BootstrapLicensePreviewRequest`

Responses:

- `200` OK: `BootstrapLicensePreview`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Enroll the control plane offline

`POST /api/v1/bootstrap/enroll/offline`

Authentication: none

Request body (application/json): `BootstrapEnrollOfflineRequest`

Responses:

- `200` OK: `TokenResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Preview an offline enrollment

`POST /api/v1/bootstrap/enroll/offline/preview`

Runs the offline enrollment validation and reports what it would create. Nothing is persisted.

Authentication: none

Request body (application/json): `BootstrapEnrollOfflineRequest`

Responses:

- `200` OK: `BootstrapEnrollOfflinePreview`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Start a bootstrap login

`POST /api/v1/bootstrap/login`

Authentication: none

Request body (application/json): `BootstrapLoginRequest`

Responses:

- `200` OK: `LoginResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Poll a bootstrap login

`POST /api/v1/bootstrap/login/poll`

Authentication: none

Request body (application/json): `BootstrapLoginPollRequest`

Responses:

- `200` OK: `TokenResponse`
- `202` The login is still pending
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the organizations available to enroll

`GET /api/v1/bootstrap/organizations`

Authentication: none

Responses:

- `200` OK
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create an organization to enroll

`POST /api/v1/bootstrap/organizations`

Authentication: none

Request body (application/json): `BootstrapOrganizationCreateRequest`

Responses:

- `200` OK: `OrganizationResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`
