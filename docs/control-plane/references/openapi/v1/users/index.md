# Users

User administration and API keys.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## Set the password of a user

`PUT /api/v1/account/organizations/{id}/users/{user_id}/password`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `user_id` (path, string, required)

Request body (application/json): `UpdateUserPasswordRequest`

Responses:

- `200` OK: `UpdateUserPasswordResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the users

`GET /api/v1/users`

Authentication: badge

Parameters:

- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `search` (query, string): Free-text search on users.
- `isService` (query, boolean): Only service accounts, or only people.

Responses:

- `200` OK: `UserResponsePage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create a user

`POST /api/v1/users`

Deprecated: use POST /account/organizations/{id}/invitations with auto_accept.

Authentication: badge

Request body (application/json): `CreateUserRequest`

Responses:

- `200` OK: `CreateUserResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get a user

`GET /api/v1/users/{user_id}`

Authentication: badge

Parameters:

- `user_id` (path, string, required)

Responses:

- `200` OK: `UserResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Update a user

`PUT /api/v1/users/{user_id}`

Authentication: badge

Parameters:

- `user_id` (path, string, required)

Request body (application/json): `UpdateUserRequest`

Responses:

- `200` OK: `UserResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Delete a user

`DELETE /api/v1/users/{user_id}`

Deprecated: use DELETE /account/organizations/{id}/members/{user_id}.

Authentication: badge

Parameters:

- `user_id` (path, string, required)

Responses:

- `200` OK: `DeleteUserResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the API keys of a user

`GET /api/v1/users/{user_id}/api-keys`

Authentication: badge

Parameters:

- `user_id` (path, string, required)

Responses:

- `200` OK: `APIKeyListResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create an API key

`POST /api/v1/users/{user_id}/api-keys`

Authentication: badge

Parameters:

- `user_id` (path, string, required)

Request body (application/json): `AddAPIKeyRequest`

Responses:

- `200` OK: `AddAPIKeyResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Revoke an API key

`DELETE /api/v1/users/{user_id}/api-keys/{key_id}`

Authentication: badge

Parameters:

- `user_id` (path, string, required)
- `key_id` (path, string, required)

Responses:

- `200` OK: `RevokeAPIKeyResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`
