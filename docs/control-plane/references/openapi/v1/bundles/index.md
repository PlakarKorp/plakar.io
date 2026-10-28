# Bundles

Bundles of resources, per organization or inventory.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## List the organization bundles

`GET /api/v1/account/organizations/{id}/bundles`

Authentication: badge

Parameters:

- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `integration_id` (query, string<uuid>): Only bundles of this integration.
- `environment` (query, string): Only bundles of this environment.
- `tags` (query, array[string]): Only bundles with these tags.
- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Responses:

- `200` OK: `OrgBundleResponsePage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create an organization bundle

`POST /api/v1/account/organizations/{id}/bundles`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Request body (application/json): `CreateOrgBundleRequest`

Responses:

- `200` OK: `OrgBundleResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create an organization bundle from a form

`POST /api/v1/account/organizations/{id}/bundles/form`

Validates the configuration against the protocol's draft form schema, required fields dropped, and stores it.

Authentication: badge

Parameters:

- `id` (path, string, required)

Request body (application/json): `SaveBundleFormRequest`

Responses:

- `200` OK: `SaveBundleFormResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get an organization bundle

`GET /api/v1/account/organizations/{id}/bundles/{bundle_id}`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `bundle_id` (path, string, required)

Responses:

- `200` OK: `OrgBundleResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Update an organization bundle

`PUT /api/v1/account/organizations/{id}/bundles/{bundle_id}`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `bundle_id` (path, string, required)

Request body (application/json): `CreateOrgBundleRequest`

Responses:

- `200` OK: `OrgBundleResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Delete an organization bundle

`DELETE /api/v1/account/organizations/{id}/bundles/{bundle_id}`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `bundle_id` (path, string, required)

Responses:

- `200` OK: `DeleteOrgBundleResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get an organization bundle as form data

`GET /api/v1/account/organizations/{id}/bundles/{bundle_id}/form`

Answers the bundle's configuration with its protocol's draft form schema.

Authentication: badge

Parameters:

- `id` (path, string, required)
- `bundle_id` (path, string, required)

Responses:

- `200` OK: `BundleFormResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Update an organization bundle from a form

`POST /api/v1/account/organizations/{id}/bundles/{bundle_id}/form`

Validates the configuration against the protocol's draft form schema and stores it. Legacy bundles answer 409.

Authentication: badge

Parameters:

- `id` (path, string, required)
- `bundle_id` (path, string, required)

Request body (application/json): `SaveBundleFormRequest`

Responses:

- `200` OK: `SaveBundleFormResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the inventory bundles

`GET /api/v1/bundles/inventories/{inventory_id}`

Authentication: badge

Parameters:

- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `integration_id` (query, string<uuid>): Only bundles of this integration.
- `environment` (query, string): Only bundles of this environment.
- `tags` (query, array[string]): Only bundles with these tags.
- `inventory_id` (path, string, required)

Responses:

- `200` OK: `InventoryBundleResponsePage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create an inventory bundle

`POST /api/v1/bundles/inventories/{inventory_id}`

Authentication: badge

Parameters:

- `inventory_id` (path, string, required)

Request body (application/json): `CreateInventoryBundleRequest`

Responses:

- `200` OK: `InventoryBundleResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create an inventory bundle from a form

`POST /api/v1/bundles/inventories/{inventory_id}/form`

Validates the configuration against the protocol's draft form schema, required fields dropped, and stores it.

Authentication: badge

Parameters:

- `inventory_id` (path, string, required)

Request body (application/json): `SaveBundleFormRequest`

Responses:

- `200` OK: `SaveBundleFormResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get an inventory bundle

`GET /api/v1/bundles/inventories/{inventory_id}/{bundle_id}`

Authentication: badge

Parameters:

- `inventory_id` (path, string, required)
- `bundle_id` (path, string, required)

Responses:

- `200` OK: `InventoryBundleResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Update an inventory bundle

`PUT /api/v1/bundles/inventories/{inventory_id}/{bundle_id}`

Authentication: badge

Parameters:

- `inventory_id` (path, string, required)
- `bundle_id` (path, string, required)

Request body (application/json): `CreateInventoryBundleRequest`

Responses:

- `200` OK: `InventoryBundleResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Delete an inventory bundle

`DELETE /api/v1/bundles/inventories/{inventory_id}/{bundle_id}`

Authentication: badge

Parameters:

- `inventory_id` (path, string, required)
- `bundle_id` (path, string, required)

Responses:

- `200` OK: `DeleteInventoryBundleResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get an inventory bundle as form data

`GET /api/v1/bundles/inventories/{inventory_id}/{bundle_id}/form`

Answers the bundle's configuration with its protocol's draft form schema.

Authentication: badge

Parameters:

- `inventory_id` (path, string, required)
- `bundle_id` (path, string, required)

Responses:

- `200` OK: `BundleFormResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Update an inventory bundle from a form

`POST /api/v1/bundles/inventories/{inventory_id}/{bundle_id}/form`

Validates the configuration against the protocol's draft form schema and stores it. Legacy bundles answer 409.

Authentication: badge

Parameters:

- `inventory_id` (path, string, required)
- `bundle_id` (path, string, required)

Request body (application/json): `SaveBundleFormRequest`

Responses:

- `200` OK: `SaveBundleFormResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`
