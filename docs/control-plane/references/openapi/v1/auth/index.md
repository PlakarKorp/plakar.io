# Auth

Sign-in, badges and second-factor challenges.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## Issue a new badge

`POST /api/v1/auth/badge`

Re-issues the caller's badge, for instance scoped to another organization.

Authentication: badge

Request body (application/json): `BadgeRequest`

Responses:

- `200` OK: `TokenResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Complete a login with a second factor

`POST /api/v1/auth/login/2fa`

Authentication: none

Request body (application/json): `Login2FARequest`

Responses:

- `200` OK: `TokenResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Log in with an API key

`POST /api/v1/auth/login/apikey`

Authentication: none

Request body (application/json): `LoginAPIKeyRequest`

Responses:

- `200` OK: `LoginAPIKeyResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Start the TOTP enrollment a login requires

`POST /api/v1/auth/login/enroll/totp`

Authentication: none

Request body (application/json): `LoginEnrollTOTPRequest`

Responses:

- `200` OK: `TOTPEnrollResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Confirm the TOTP enrollment a login requires

`POST /api/v1/auth/login/enroll/totp/confirm`

Authentication: none

Request body (application/json): `LoginEnrollTOTPConfirmRequest`

Responses:

- `200` OK: `LoginEnrollTOTPConfirmResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Log in with email and password

`POST /api/v1/auth/login/password`

Authentication: none

Request body (application/json): `LoginPasswordRequest`

Responses:

- `200` OK: `LoginPasswordResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Poll a pending login

`POST /api/v1/auth/poll/{token}`

Authentication: none

Parameters:

- `token` (path, string, required)

Responses:

- `200` OK: `TokenResponse`
- `202` The login is still pending
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`
