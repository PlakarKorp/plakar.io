# Kloset

Browsing a store and the snapshots inside it.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## List the importer types in a store

`GET /api/v1/kloset/{repouuid}/repository/importer-types`

Authentication: badge

Parameters:

- `repouuid` (path, string<uuid>, required): The store connector.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Responses:

- `200` OK
- `401` Missing, invalid or expired credentials
- `default`

## Get information about a store

`GET /api/v1/kloset/{repouuid}/repository/info`

Authentication: badge

Parameters:

- `repouuid` (path, string<uuid>, required): The store connector.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Responses:

- `200` OK: `RepositoryInfoResponseItem`
- `401` Missing, invalid or expired credentials
- `default`

## Find the snapshots holding a pathname

`GET /api/v1/kloset/{repouuid}/repository/locate-pathname`

Authentication: badge

Parameters:

- `repouuid` (path, string<uuid>, required): The store connector.
- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `importerType` (query, string): Only snapshots of this importer type.
- `importerOrigin` (query, string): Only snapshots of this origin.
- `importerDirectory` (query, string): Only snapshots of this directory.
- `resource` (query, string): Pathname to locate.
- `sort` (query, string): Comma-separated sort keys. Prefix a key with - to sort in descending order.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Responses:

- `200` OK: `TimelineLocationList`
- `401` Missing, invalid or expired credentials
- `default`

## List the snapshots in a store

`GET /api/v1/kloset/{repouuid}/repository/snapshots`

Authentication: badge

Parameters:

- `repouuid` (path, string<uuid>, required): The store connector.
- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `importer` (query, string): Only snapshots of this importer type.
- `since` (query, string): Only snapshots taken since this time or duration.
- `sort` (query, string): Comma-separated sort keys. Prefix a key with - to sort in descending order.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Responses:

- `200` OK: `SnapshotEntryList`
- `401` Missing, invalid or expired credentials
- `default`

## Sign a URL to read a file from a snapshot

`POST /api/v1/kloset/{repouuid}/snapshot/reader-sign-url/{snapshot_path}`

Authentication: badge

Parameters:

- `snapshot_path` (path, string, required)
- `repouuid` (path, string<uuid>, required): The store connector.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Responses:

- `200` OK
- `401` Missing, invalid or expired credentials
- `default`

## Read a file from a snapshot

`GET /api/v1/kloset/{repouuid}/snapshot/reader/{snapshot_path}`

Authentication: none

Parameters:

- `snapshot_path` (path, string, required)
- `repouuid` (path, string<uuid>, required): The store connector.
- `signature` (query, string): Signature from the reader-sign-url endpoint. Without it, a badge is required.
- `download` (query, boolean): Send the file as an attachment.
- `render` (query, string): How to render the file.

Responses:

- `200` The file
- `default`

## List the children of a snapshot directory

`GET /api/v1/kloset/{repouuid}/snapshot/vfs/children/{snapshot_path}`

Authentication: badge

Parameters:

- `snapshot_path` (path, string, required)
- `repouuid` (path, string<uuid>, required): The store connector.
- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `sort` (query, string): Comma-separated sort keys. Prefix a key with - to sort in descending order.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Responses:

- `200` OK: `EntryList`
- `401` Missing, invalid or expired credentials
- `default`

## List the chunks of a snapshot file

`GET /api/v1/kloset/{repouuid}/snapshot/vfs/chunks/{snapshot_path}`

Authentication: badge

Parameters:

- `snapshot_path` (path, string, required)
- `repouuid` (path, string<uuid>, required): The store connector.
- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Responses:

- `200` OK: `ChunkList`
- `401` Missing, invalid or expired credentials
- `default`

## Download prepared snapshot files as an archive

`GET /api/v1/kloset/{repouuid}/snapshot/vfs/downloader-sign-url/{id}`

Authentication: none

Parameters:

- `repouuid` (path, string<uuid>, required): The store connector.
- `id` (path, string, required)
- `name` (query, string): Archive name, without the extension.
- `format` (query, string): Archive format.

Responses:

- `200` The file
- `default`

## Prepare a download of snapshot files

`POST /api/v1/kloset/{repouuid}/snapshot/vfs/downloader/{snapshot_path}`

Authentication: badge

Parameters:

- `snapshot_path` (path, string, required)
- `repouuid` (path, string<uuid>, required): The store connector.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Request body (application/json): `DownloadQuery`

Responses:

- `200` OK
- `401` Missing, invalid or expired credentials
- `default`

## List the errors recorded under a snapshot path

`GET /api/v1/kloset/{repouuid}/snapshot/vfs/errors/{snapshot_path}`

Authentication: badge

Parameters:

- `snapshot_path` (path, string, required)
- `repouuid` (path, string<uuid>, required): The store connector.
- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `sort` (query, string): Comma-separated sort keys. Prefix a key with - to sort in descending order.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Responses:

- `200` OK: `ErrorItemList`
- `401` Missing, invalid or expired credentials
- `default`

## Search the files of a snapshot

`GET /api/v1/kloset/{repouuid}/snapshot/vfs/search/{snapshot_path}`

Authentication: badge

Parameters:

- `snapshot_path` (path, string, required)
- `repouuid` (path, string<uuid>, required): The store connector.
- `offset` (query, integer): Number of items to skip.
- `limit` (query, integer): Maximum number of items to return.
- `pattern` (query, string): Pattern the names must match.
- `recursive` (query, boolean): Search the subdirectories too.
- `mime` (query, array[string]): Only files of these MIME types. At most 20.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Responses:

- `200` OK: `EntryPage`
- `401` Missing, invalid or expired credentials
- `default`

## Get a file or directory of a snapshot

`GET /api/v1/kloset/{repouuid}/snapshot/vfs/{snapshot_path}`

Authentication: badge

Parameters:

- `snapshot_path` (path, string, required)
- `repouuid` (path, string<uuid>, required): The store connector.
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Responses:

- `200` OK: `EntryItem`
- `401` Missing, invalid or expired credentials
- `default`

## Get the header of a snapshot

`GET /api/v1/kloset/{repouuid}/snapshot/{snapshot}`

Authentication: badge

Parameters:

- `repouuid` (path, string<uuid>, required): The store connector.
- `snapshot` (path, string, required)
- `organization_id` (query, string<uuid>): Organization to act on, at or below the caller's. Defaults to the caller's.

Responses:

- `200` OK: `HeaderItem`
- `401` Missing, invalid or expired credentials
- `default`
