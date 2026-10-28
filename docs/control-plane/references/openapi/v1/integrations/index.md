# Integrations

The integration catalogue and installed integrations.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## Get an integration by name and version

`GET /api/v1/integration/{name}/{version}`

Authentication: badge

Parameters:

- `type` (query, string): Connector type to resolve the protocols for.
- `name` (path, string, required)
- `version` (path, string, required)

Responses:

- `200` OK: `GetIntegrationResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the integrations of a connector type

`GET /api/v1/integrations`

Authentication: badge

Parameters:

- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `name` (query, string): Only integrations with this name.
- `type` (query, string, required): Connector type.
- `urn_id` (query, string<uuid>): Only integrations compatible with this resource.

Responses:

- `200` OK: `GetIntegrationsResponsePage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the available integrations

`GET /api/v1/integrations/available`

Authentication: badge

Parameters:

- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `support` (query, string): Only integrations supporting this connector kind.
- `search` (query, string): Free-text search on name and display name.
- `installation_status` (query, string): Only integrations in this state.
- `type` (query, array[string]): Only integrations of these types.

Responses:

- `200` OK: `ExtendedIntegrationPage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get an available integration

`GET /api/v1/integrations/available/{name}`

Authentication: badge

Parameters:

- `name` (path, string, required)

Responses:

- `200` OK: `ExtendedIntegration`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the integration catalog

`GET /api/v1/integrations/catalog`

Authentication: badge

Parameters:

- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.

Responses:

- `200` OK: `AvailableIntegrationPage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the versions of an integration

`GET /api/v1/integrations/catalog/{name}/versions`

Authentication: badge

Parameters:

- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `name` (path, string, required)

Responses:

- `200` OK: `AvailableIntegrationPage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the installed integrations

`GET /api/v1/integrations/installed`

Authentication: badge

Parameters:

- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `name` (query, string): Only integrations of exactly this name.
- `current` (query, boolean): Only the current version of each integration, or only the others.

Responses:

- `200` OK: `InstalledIntegrationPage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Install an integration

`POST /api/v1/integrations/installed`

Authentication: badge

Request body (application/json): `IntegrationInstallRequest`

Responses:

- `200` OK: `IntegrationInstallResponse`
- `201` Installed: `IntegrationInstallResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Install an integration and make it current

`POST /api/v1/integrations/installed/current`

Authentication: badge

Request body (application/json): `IntegrationInstallRequest`

Responses:

- `200` OK: `IntegrationInstallResponse`
- `201` Installed: `IntegrationInstallResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get an installed integration

`GET /api/v1/integrations/installed/{id}`

Authentication: badge

Parameters:

- `id` (path, string, required)

Responses:

- `200` OK: `InstalledIntegration`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Uninstall an integration

`DELETE /api/v1/integrations/installed/{id}`

Authentication: badge

Parameters:

- `id` (path, string, required)

Responses:

- `200` OK
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Make an installed version current

`PUT /api/v1/integrations/installed/{id}/current`

Authentication: badge

Parameters:

- `id` (path, string, required)

Responses:

- `200` OK
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Summarise an installed integration

`GET /api/v1/integrations/installed/{id}/summary`

Authentication: badge

Parameters:

- `id` (path, string, required)

Responses:

- `200` OK: `InstalledIntegrationSummary`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get the form schemas of an integration

`GET /api/v1/integrations/schema/{id}`

Answers one JSON Schema per protocol, derived from the integration's validator. With a resource, properties the inventory or a matching bundle provides are annotated with x-inventory-value or x-bundle-value.

Authentication: badge

Parameters:

- `type` (query, string, required): Connector type.
- `urn_id` (query, string<uuid>): Resource to resolve the protocols, inventory values and bundles against.
- `environment` (query, string): Environment to resolve the protocols against.
- `draft` (query, boolean): Answer the draft form a bundle uses: nothing required, nothing suggested.
- `id` (path, string, required)

Responses:

- `200` OK: `GetIntegrationSchemaResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get an integration

`GET /api/v1/integrations/{id}`

Authentication: badge

Parameters:

- `type` (query, string, required): Connector type.
- `urn_id` (query, string<uuid>): Resource to resolve the protocols against.
- `environment` (query, string): Environment to resolve the protocols against.
- `id` (path, string, required)

Responses:

- `200` OK: `GetIntegrationResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`
