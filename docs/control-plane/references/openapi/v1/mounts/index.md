# Mounts

Mounting a snapshot and browsing or downloading its files.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## Mount a snapshot

`POST /api/v1/mnt`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Request body (application/json): `MountRequest`

Responses:

- `200` OK: `MountResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get a mount

`GET /api/v1/mnt/{mount_id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `mount_id` (path, string, required)

Responses:

- `200` OK: `MountInfo`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Unmount a snapshot

`DELETE /api/v1/mnt/{mount_id}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `mount_id` (path, string, required)

Responses:

- `200` OK
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Browse a mounted snapshot

`GET /api/v1/mnt/{mount_id}/browse/{path}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `mount_id` (path, string, required)
- `path` (path, string, required): A path. It may contain slashes.

Responses:

- `200` The directory entries
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Download a mounted file

`GET /api/v1/mnt/{mount_id}/download/{path}`

The signature is the credential.

Authentication: none

Parameters:

- `signature` (query, string, required): Signature returned by the sign-url endpoint.
- `render` (query, string): How to render the file.
- `download` (query, boolean): Send the file as an attachment.
- `mount_id` (path, string, required)
- `path` (path, string, required): A path. It may contain slashes.

Responses:

- `200` The file, raw or rendered
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Sign a download URL for a mounted file

`POST /api/v1/mnt/{mount_id}/sign-url/{path}`

Authentication: badge

Parameters:

- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.
- `mount_id` (path, string, required)
- `path` (path, string, required): A path. It may contain slashes.

Responses:

- `200` The signature: `MountSignature`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`
