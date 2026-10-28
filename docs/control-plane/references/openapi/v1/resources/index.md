# Resources

Resources tracked by inventories.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## List the resources with the backups of their sources

`GET /api/v1/account/organizations/{id}/backups/resources`

Authentication: badge

Parameters:

- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `search` (query, string): Free-text search on resources.
- `class` (query, array[string]): Only resources of these classes.
- `exclude_class` (query, array[string]): Exclude resources of these classes.
- `inventory_id` (query, array[string<uuid>]): Only resources of these inventories.
- `connector_type` (query, string): Only resources with at least one ready connector of this type.
- `policy` (query, string): Only resources whose every ready source is scheduled by a policy, or those with at least one that is not. A resource without a ready source is not covered.
- `sort` (query, string): last_backup lists first the resource whose stalest source was backed up longest ago; name sorts by name. Default: class, then name.
- `facets` (query, boolean): Also count the resources per inventory and per policy coverage.
- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Responses:

- `200` OK: `ResourcePage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get a resource with the backups of its sources

`GET /api/v1/account/organizations/{id}/backups/resources/{urn_id}`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `urn_id` (path, string, required)

Responses:

- `200` OK: `Resource`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the resources of every inventory

`GET /api/v1/inventories/resources`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `search` (query, string): Free-text search on resources.
- `class` (query, array[string]): Only resources of these classes.
- `exclude_class` (query, array[string]): Exclude resources of these classes.
- `inventory_id` (query, array[string<uuid>]): Only resources of these inventories.

Responses:

- `200` OK: `ResourceEntryPage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the resources of an inventory

`GET /api/v1/inventories/{inventory_id}/resources`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `search` (query, string): Free-text search on resources.
- `class` (query, array[string]): Only resources of these classes.
- `exclude_class` (query, array[string]): Exclude resources of these classes.
- `inventory_id` (path, string, required)

Responses:

- `200` OK: `ResourceEntryPage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Add a resource

`POST /api/v1/inventories/{inventory_id}/resources`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `inventory_id` (path, string, required)

Request body (application/json): `InventoryEntry`

Responses:

- `200` OK: `ResourceEntry`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Add resources in bulk

`POST /api/v1/inventories/{inventory_id}/resources/bulk`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `inventory_id` (path, string, required)

Request body (application/octet-stream): string<binary>

Responses:

- `200` OK
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get a resource

`GET /api/v1/inventories/{inventory_id}/resources/{urn_id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `inventory_id` (path, string, required)
- `urn_id` (path, string, required)

Responses:

- `200` OK: `ResourceGetResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Update a resource

`POST /api/v1/inventories/{inventory_id}/resources/{urn_id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `inventory_id` (path, string, required)
- `urn_id` (path, string, required)

Request body (application/json): `ResourcePutRequest`

Responses:

- `200` OK: `ResourceEntry`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Exclude a resource from coverage, or include it again

`PATCH /api/v1/inventories/{inventory_id}/resources/{urn_id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `inventory_id` (path, string, required)
- `urn_id` (path, string, required)

Request body (application/json): `CoverageExclusionFlag`

Responses:

- `200` OK: `CoverageExclusionFlag`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Delete a resource

`DELETE /api/v1/inventories/{inventory_id}/resources/{urn_id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `inventory_id` (path, string, required)
- `urn_id` (path, string, required)

Responses:

- `200` OK: `ResourceDeleteResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the endpoints of a resource

`GET /api/v1/inventories/{inventory_id}/resources/{urn_id}/endpoints`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `inventory_id` (path, string, required)
- `urn_id` (path, string, required)

Responses:

- `200` OK: `GetResourceEndpoints`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Lock or unlock a resource

`PATCH /api/v1/inventories/{inventory_id}/resources/{urn_id}/lock`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `inventory_id` (path, string, required)
- `urn_id` (path, string, required)

Request body (application/json): `ResourceLock`

Responses:

- `200` OK: `ResourceLock`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Set the residency of a resource

`PATCH /api/v1/inventories/{inventory_id}/resources/{urn_id}/residency`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `inventory_id` (path, string, required)
- `urn_id` (path, string, required)

Request body (application/json): `InventoryResidency`

Responses:

- `200` OK: `InventoryResidency`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`
