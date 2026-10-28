# Invitations

Invitations to join an organization.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## List the pending invitations

`GET /api/v1/account/organizations/{id}/invitations`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Responses:

- `200` OK
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Invite someone into the organization

`POST /api/v1/account/organizations/{id}/invitations`

With auto_accept, the invitation is spent in the same call and the user is created.

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.

Request body (application/json): `OrganizationInviteRequest`

Responses:

- `200` OK: `OrganizationInviteResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Revoke an invitation

`DELETE /api/v1/account/organizations/{id}/invitations/{invitation_id}`

Authentication: badge

Parameters:

- `id` (path, string<uuid>, required): Organization ID, at or below the caller's.
- `invitation_id` (path, string, required)

Responses:

- `200` OK: `EmptyObject`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `401` Missing, invalid or expired credentials
- `403` The caller may not do this: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Accept an invitation

`POST /api/v1/invitations/accept`

The invitation token is the credential. The invitee may have no account yet.

Authentication: none

Request body (application/json): `AcceptInvitationRequest`

Responses:

- `200` OK: `AcceptInvitationResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`
