# Account

The calling user's own account and second factors.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## List the second factors of the calling user

`GET /api/v1/account/2fa`

Authentication: badge

Responses:

- `200` OK: `TwoFactorListResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Start a TOTP enrollment

`POST /api/v1/account/2fa/totp`

Authentication: badge

Request body (application/json): `TOTPRotateRequest`

Responses:

- `200` OK: `TOTPEnrollResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Disable TOTP

`DELETE /api/v1/account/2fa/totp`

Authentication: badge

Request body (application/json): `TOTPConfirmRequest`

Responses:

- `204` No Content
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Confirm a TOTP enrollment

`POST /api/v1/account/2fa/totp/confirm`

Authentication: badge

Request body (application/json): `TOTPConfirmRequest`

Responses:

- `200` OK: `TOTPConfirmResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Rotate the calling API key

`POST /api/v1/account/api-keys/rotate`

Authentication: badge

Request body (application/json): `RotateAPIKeyRequest`

Responses:

- `200` OK: `RotateAPIKeyResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get the calling user

`GET /api/v1/account/me`

Authentication: badge

Responses:

- `200` OK: `AccountMeResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the groups of the calling user

`GET /api/v1/account/me/groups`

Authentication: badge

Responses:

- `200` OK: `MyGroupsResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`
