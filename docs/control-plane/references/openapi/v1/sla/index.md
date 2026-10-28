# SLA

SLA templates and contracts.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## List the SLAs

`GET /api/v1/account/organizations/{id}/slas`

Authentication: badge

Parameters:

- `search` (query, string): Free-text search on SLA names.
- `status` (query, string): Only SLAs in this state.
- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Responses:

- `200` OK: `GetSLAResponsePage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the SLA contracts

`GET /api/v1/account/organizations/{id}/slas/contracts`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Responses:

- `200` OK: `ContractListResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create an SLA contract

`POST /api/v1/account/organizations/{id}/slas/contracts`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Request body (application/json): `ContractCreateRequest`

Responses:

- `200` OK: `ContractCreateResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get an SLA contract

`GET /api/v1/account/organizations/{id}/slas/contracts/{contract_id}`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `contract_id` (path, string, required)

Responses:

- `200` OK: `ContractGetResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Delete an SLA contract

`DELETE /api/v1/account/organizations/{id}/slas/contracts/{contract_id}`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `contract_id` (path, string, required)

Responses:

- `200` OK: `ContractDeleteResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the resources an SLA would match

`GET /api/v1/account/organizations/{id}/slas/resources`

Authentication: badge

Parameters:

- `data_classes` (query, array[string]): Only resources of these data classes.
- `tags` (query, array[string]): Only resources with these tags.
- `search` (query, string): Free-text search on resources.
- `environment` (query, string): Only resources of this environment.
- `inventory` (query, string<uuid>): Only resources of this inventory.
- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Responses:

- `200` OK: `MatchingResourceEntryPage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## List the SLA templates

`GET /api/v1/account/organizations/{id}/slas/templates`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Responses:

- `200` OK: `TemplateListResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Create an SLA template

`POST /api/v1/account/organizations/{id}/slas/templates`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Request body (application/json): `TemplateCreateRequest`

Responses:

- `200` OK: `TemplateCreateResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get an SLA template

`GET /api/v1/account/organizations/{id}/slas/templates/{template_id}`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `template_id` (path, string, required)

Responses:

- `200` OK: `TemplateGetResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Update an SLA template

`POST /api/v1/account/organizations/{id}/slas/templates/{template_id}`

Deprecated: use PATCH on the same path.

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `template_id` (path, string, required)

Request body (application/json): `TemplatePatchRequest`

Responses:

- `200` OK: `TemplatePatchResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Update an SLA template

`PATCH /api/v1/account/organizations/{id}/slas/templates/{template_id}`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `template_id` (path, string, required)

Request body (application/json): `TemplatePatchRequest`

Responses:

- `200` OK: `TemplatePatchResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Delete an SLA template

`DELETE /api/v1/account/organizations/{id}/slas/templates/{template_id}`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `template_id` (path, string, required)

Responses:

- `200` OK: `TemplateDeleteResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`
