# Connectors

Stores, sources and destinations.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## List the connectors

`GET /api/v1/account/organizations/{id}/connectors`

Authentication: badge

Parameters:

- `type` (query, string, required): Connector kind.
- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `search` (query, string): Free-text search on connectors.
- `residency` (query, string): Only connectors in this country.
- `inventory_id` (query, string<uuid>): Only connectors of this inventory.
- `without_residency` (query, boolean): Only connectors without a residency. Not combinable with residency.
- `exclude_locked` (query, boolean): Exclude locked connectors.
- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Responses:

- `200` OK: `ConnectorConfigurationResponsePage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create a connector

`POST /api/v1/account/organizations/{id}/connectors`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Request body (application/json): `CreateConnectorRequest`

Responses:

- `200` OK: `UpdateConnectorResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create a connector from a form

`POST /api/v1/account/organizations/{id}/connectors/form`

Validates a configuration document against the protocol's form schema, merged with the inherited inventory and bundle values, and stores the connector's own values.

Authentication: badge

Parameters:

- `id` (path, string, required)

Request body (application/json): `SaveConnectorFormRequest`

Responses:

- `200` OK: `SaveConnectorFormResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get a connector

`GET /api/v1/connectors/{connector_id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `connector_id` (path, string, required)

Responses:

- `200` OK: `ConnectorConfigurationResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Update a connector

`POST /api/v1/connectors/{connector_id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `connector_id` (path, string, required)

Request body (application/json): `CreateConnectorRequest`

Responses:

- `200` OK: `UpdateConnectorResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Delete a connector

`DELETE /api/v1/connectors/{connector_id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `connector_id` (path, string, required)

Responses:

- `200` OK: `DeleteConnectorResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List what the caller may do on a connector

`GET /api/v1/connectors/{connector_id}/capabilities`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `connector_id` (path, string, required)

Responses:

- `200` OK: `ResourceCapabilitiesResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get a connector as form data

`GET /api/v1/connectors/{connector_id}/form`

Answers the connector's configuration document with its protocol's form schema. Keys the schema does not show are left out.

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `connector_id` (path, string, required)

Responses:

- `200` OK: `ConnectorFormResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Update a connector from a form

`POST /api/v1/connectors/{connector_id}/form`

Validates a configuration document against the connector's protocol form schema, merged with the inherited values, and stores a new revision. Stored keys the schema does not show are kept.

Authentication: badge

Parameters:

- `connector_id` (path, string, required)

Request body (application/json): `SaveConnectorFormRequest`

Responses:

- `200` OK: `SaveConnectorFormResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create the store behind a connector

`POST /api/v1/connectors/{connector_id}/stores/create`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `connector_id` (path, string, required)

Request body (application/json): `StoreCreateRequest`

Responses:

- `200` OK: `JobExecutionStatus`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Test a connector

`POST /api/v1/connectors/{connector_id}/test`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `connector_id` (path, string, required)

Responses:

- `200` OK: `JobExecutionStatus`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`
