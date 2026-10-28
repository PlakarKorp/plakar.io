# PKI

Public keys that verify the tokens this control plane issues.

Generated from Plakar Control Plane v0.18. See [OpenAPI v1](https://www.plakar.io/docs/control-plane/references/openapi/v1/index.md) for the base URL, authentication and error format.


## List the public keys

`GET /api/v1/pki/keys`

Authentication: none

Responses:

- `200` OK: `JsonWebKeysResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`

## Get a public key

`GET /api/v1/pki/keys/{keyid}`

Authentication: none

Parameters:

- `keyid` (path, string, required)

Responses:

- `200` OK: `PublicKeyResponse`
- `400` Bad Request _(validation or deserialization error)_: `HTTPError`
- `500` Internal Server Error _(panics)_: `HTTPError`
- `default`
