# Journal

Activity journal summaries.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## Summarise the journal

`GET /api/v1/journal/summary`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `days` (query, integer): Look-back window in days.

Responses:

- `200` OK: `JournalSummary`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Summarise the journal day by day

`GET /api/v1/journal/summary/daily`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `days` (query, integer): Number of days.

Responses:

- `200` OK: `JournalSummaries`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`
