# Inventories

Inventories and their synchronisation.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## List the inventories

`GET /api/v1/account/organizations/{id}/inventories`

Authentication: badge

Parameters:

- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `search` (query, string): Free-text search on inventories.
- `type` (query, string): Only inventories of this type, such as aws or self-managed.
- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Responses:

- `200` OK: `InventoryListResultPage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create an inventory

`POST /api/v1/account/organizations/{id}/inventories`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Request body (application/json): `InventoryGenericCreateRequest`

Responses:

- `200` OK: `InventoryCreateResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create an AWS inventory

`POST /api/v1/account/organizations/{id}/inventories/aws`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Request body (application/json): `InventoryAWSCreate`

Responses:

- `200` OK: `InventoryCreateResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create a GCP inventory

`POST /api/v1/account/organizations/{id}/inventories/gcp`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Request body (application/json): `InventoryGCPCreate`

Responses:

- `200` OK: `InventoryCreateResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create a Kubernetes inventory

`POST /api/v1/account/organizations/{id}/inventories/k8s`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Request body (application/json): `InventoryK8SCreate`

Responses:

- `200` OK: `InventoryCreateResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create an OpenShift inventory

`POST /api/v1/account/organizations/{id}/inventories/openshift`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Request body (application/json): `InventoryOpenshiftCreate`

Responses:

- `200` OK: `InventoryCreateResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create an OpenStack inventory

`POST /api/v1/account/organizations/{id}/inventories/openstack`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Request body (application/json): `InventoryOpenStackCreate`

Responses:

- `200` OK: `InventoryCreateResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create an OVH inventory

`POST /api/v1/account/organizations/{id}/inventories/ovh`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Request body (application/json): `InventoryOVHCreate`

Responses:

- `200` OK: `InventoryCreateResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create a Scaleway inventory

`POST /api/v1/account/organizations/{id}/inventories/scaleway`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Request body (application/json): `InventoryScalewayCreate`

Responses:

- `200` OK: `InventoryCreateResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create a self-managed inventory

`POST /api/v1/account/organizations/{id}/inventories/self-managed`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Request body (application/json): `InventorySelfManagedCreate`

Responses:

- `200` OK: `InventoryCreateResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create a VMware inventory

`POST /api/v1/account/organizations/{id}/inventories/vmware`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Request body (application/json): `InventoryVMWareCreate`

Responses:

- `200` OK: `InventoryCreateResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get the backup coverage of the inventories

`GET /api/v1/inventories/coverage`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Responses:

- `200` OK: `InventoryCoverage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get an inventory

`GET /api/v1/inventories/{inventory_id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `inventory_id` (path, string, required)

Responses:

- `200` OK: `InventoryGetResult`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Update an inventory

`POST /api/v1/inventories/{inventory_id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `inventory_id` (path, string, required)

Request body (application/json): `InventoryPutRequest`

Responses:

- `200` OK: `InventoryGetResult`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Delete an inventory

`DELETE /api/v1/inventories/{inventory_id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `inventory_id` (path, string, required)

Responses:

- `200` OK: `InventoryDeleteResult`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List what the caller may do on an inventory

`GET /api/v1/inventories/{inventory_id}/capabilities`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `inventory_id` (path, string, required)

Responses:

- `200` OK: `ResourceCapabilitiesResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the resource classes

`GET /api/v1/inventories/{inventory_id}/classes`

Deprecated: use GET /resource_classes.

Authentication: badge

Parameters:

- `inventory_id` (path, string, required)

Responses:

- `200` OK: `GetInventoryClassTree`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Set the residency of an inventory

`PATCH /api/v1/inventories/{inventory_id}/residency`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `inventory_id` (path, string, required)

Request body (application/json): `InventoryResidency`

Responses:

- `200` OK: `InventoryResidency`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Synchronise an inventory

`GET /api/v1/inventories/{inventory_id}/sync`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `inventory_id` (path, string, required)

Responses:

- `200` OK: `InventorySyncTaskResult`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`
