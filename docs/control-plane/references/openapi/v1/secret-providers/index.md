# Secret providers

External secret providers.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## List the secret providers

`GET /api/v1/account/organizations/{id}/secret_providers`

Authentication: badge

Parameters:

- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `search` (query, string): Free-text search on secret providers.
- `secret_provider_id` (query, string<uuid>): Only this secret provider.
- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Responses:

- `200` OK: `GetSecretProviderResponsePage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create a secret provider

`POST /api/v1/account/organizations/{id}/secret_providers`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Request body (application/json): `CreateSecretProviderRequest`

Responses:

- `200` OK: `CreateSecretProviderResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create a secret provider from a form

`POST /api/v1/account/organizations/{id}/secret_providers/form`

Validates a configuration document against the provider's form schema and stores it.

Authentication: badge

Parameters:

- `id` (path, string, required)

Request body (application/json): `SaveSecretProviderFormRequest`

Responses:

- `200` OK: `SaveSecretProviderFormResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get a secret provider

`GET /api/v1/secret_providers/{id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `revision` (query, integer): Revision to load. 0 is the latest.
- `id` (path, string, required)

Responses:

- `200` OK: `GetSecretProviderResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Update a secret provider

`PUT /api/v1/secret_providers/{id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `id` (path, string, required)

Request body (application/json): `UpdateSecretProviderRequest`

Responses:

- `200` OK: `UpdateSecretProviderResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Delete a secret provider

`DELETE /api/v1/secret_providers/{id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `id` (path, string, required)

Responses:

- `200` OK: `DeleteSecretProviderResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List what the caller may do on a secret provider

`GET /api/v1/secret_providers/{id}/capabilities`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `id` (path, string, required)

Responses:

- `200` OK: `ResourceCapabilitiesResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get a secret provider as form data

`GET /api/v1/secret_providers/{id}/form`

Answers the provider's configuration document with its form schema.

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `revision` (query, integer): Revision to load. 0 is the latest.
- `id` (path, string, required)

Responses:

- `200` OK: `SecretProviderFormResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Update a secret provider from a form

`POST /api/v1/secret_providers/{id}/form`

Validates a configuration document against the provider's form schema and stores a new revision. Stored keys the schema does not show are kept.

Authentication: badge

Parameters:

- `id` (path, string, required)

Request body (application/json): `SaveSecretProviderFormRequest`

Responses:

- `200` OK: `SaveSecretProviderFormResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Test a secret provider

`GET /api/v1/secret_providers/{id}/test`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `id` (path, string, required)

Responses:

- `200` OK: `TestSecretProviderResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`
