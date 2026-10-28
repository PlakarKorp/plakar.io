# Audit

Audit logs and signed attestations.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## List audit log entries

`GET /api/v1/organizations/{id}/audit-logs`

Authentication: badge

Parameters:

- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `since` (query, string<date-time>): Only entries at or after this time.
- `until` (query, string<date-time>): Only entries at or before this time.
- `events` (query, string): Comma-separated event names. A name also matches its dot-suffixed descendants.
- `actor_user_id` (query, string<uuid>): Only entries by this user.
- `target_user_id` (query, string<uuid>): Only entries about this user.
- `id` (path, string, required)

Responses:

- `200` OK: `AuditLogEntryPage`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Export the audit log

`GET /api/v1/organizations/{id}/audit-logs/export`

Authentication: badge

Parameters:

- `since` (query, string<date-time>): Only entries at or after this time.
- `until` (query, string<date-time>): Only entries at or before this time.
- `events` (query, string): Comma-separated event names. A name also matches its dot-suffixed descendants.
- `actor_user_id` (query, string<uuid>): Only entries by this user.
- `target_user_id` (query, string<uuid>): Only entries about this user.
- `after_seq` (query, integer<int64>): Resume after this chain sequence number. Not combinable with the filters or with csv.
- `format` (query, string): Export format.
- `id` (path, string, required)

Responses:

- `200` The audit log, in the requested format
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get the key that signs audit exports

`GET /api/v1/organizations/{id}/audit-logs/signing-key`

Authentication: badge

Parameters:

- `id` (path, string, required)

Responses:

- `200` OK: `AuditLogSigningKey`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Export the legal hold attestation

`GET /api/v1/organizations/{id}/legal-hold/export`

Authentication: badge

Parameters:

- `format` (query, string): Export format.
- `id` (path, string, required)

Responses:

- `200` The signed attestation, in the requested format
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get the key that signs legal hold attestations

`GET /api/v1/organizations/{id}/legal-hold/signing-key`

Authentication: badge

Parameters:

- `id` (path, string, required)

Responses:

- `200` OK: `LegalHoldSigningKey`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Export the residency attestation

`GET /api/v1/organizations/{id}/residency/export`

Authentication: badge

Parameters:

- `format` (query, string): Export format.
- `id` (path, string, required)

Responses:

- `200` The signed attestation, in the requested format
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get the key that signs residency attestations

`GET /api/v1/organizations/{id}/residency/signing-key`

Authentication: badge

Parameters:

- `id` (path, string, required)

Responses:

- `200` OK: `ResidencySigningKey`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`
