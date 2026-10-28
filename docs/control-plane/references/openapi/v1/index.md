

# OpenAPI v1

Version 1 of the PCP API is served under `/api/v1`. The pages below list every
endpoint it exposes, grouped the same way as in the OpenAPI document.

## Base URL

The API is served by each PCP instance, under the same host as the web
interface. Every path in this reference is relative to that host, so an instance
reachable at `https://pcp.example.com` serves `GET /api/v1/users` at
`https://pcp.example.com/api/v1/users`.

## Authentication

Most endpoints require a **badge**, a JWT that PCP issues when a user logs in.
The badge is sent in the `Authorization` header as a bearer token.

Automation obtains a badge with an API key belonging to an
[application user](../../../access-control/users#application-users). Exchanging
the key returns the badge in `token`:

```sh
$ curl -X POST https://pcp.example.com/api/v1/auth/login/apikey \
  -H "Content-Type: application/json" \
  -d '{"api_key": "pcp_ak_..."}'
```

```json
{
  "token": "eyJhbGciOi..."
}
```

Subsequent requests carry that token:

```sh
$ curl https://pcp.example.com/api/v1/account/me \
  -H "Authorization: Bearer eyJhbGciOi..."
```

What a badge can do is determined by the
[permissions](../../../access-control/permissions) its user holds in the
organization the badge is scoped to. A request outside those permissions returns
`403`.

A few endpoints use a different credential, and each one states which:

- **Edge token**: issued to an [edge](../../../edges) when it enrolls, and sent
  as a bearer token by that edge.
- **Agent token**: issued to an agent when it enrolls, and sent in the
  `Plakman-Agent-Token` header.

Endpoints marked **No authentication** accept anonymous requests.

## Errors

A request that fails returns a `4xx` or `5xx` status with a JSON body in the
same format for every endpoint. `status` repeats the HTTP status code, `title`
and `detail` describe the failure, and `errors` lists the individual problems
when a request fails validation, naming the offending parameter in `name` and
explaining it in `reason`.

{{< openapi-example version="v1" name="HTTPError" >}}

## Endpoints






## [System](https://www.plakar.io/docs/control-plane/references/openapi/v1/system/index.md)



## [Auth](https://www.plakar.io/docs/control-plane/references/openapi/v1/auth/index.md)



## [Bootstrap](https://www.plakar.io/docs/control-plane/references/openapi/v1/bootstrap/index.md)



## [Account](https://www.plakar.io/docs/control-plane/references/openapi/v1/account/index.md)



## [Organizations](https://www.plakar.io/docs/control-plane/references/openapi/v1/organizations/index.md)



## [Invitations](https://www.plakar.io/docs/control-plane/references/openapi/v1/invitations/index.md)



## [Groups](https://www.plakar.io/docs/control-plane/references/openapi/v1/groups/index.md)



## [Access](https://www.plakar.io/docs/control-plane/references/openapi/v1/access/index.md)



## [Users](https://www.plakar.io/docs/control-plane/references/openapi/v1/users/index.md)



## [Settings](https://www.plakar.io/docs/control-plane/references/openapi/v1/settings/index.md)



## [Audit](https://www.plakar.io/docs/control-plane/references/openapi/v1/audit/index.md)



## [Edge](https://www.plakar.io/docs/control-plane/references/openapi/v1/edge/index.md)



## [Agent](https://www.plakar.io/docs/control-plane/references/openapi/v1/agent/index.md)



## [Integrations](https://www.plakar.io/docs/control-plane/references/openapi/v1/integrations/index.md)



## [Connectors](https://www.plakar.io/docs/control-plane/references/openapi/v1/connectors/index.md)



## [Inventories](https://www.plakar.io/docs/control-plane/references/openapi/v1/inventories/index.md)



## [Resources](https://www.plakar.io/docs/control-plane/references/openapi/v1/resources/index.md)



## [Bundles](https://www.plakar.io/docs/control-plane/references/openapi/v1/bundles/index.md)



## [Classes](https://www.plakar.io/docs/control-plane/references/openapi/v1/classes/index.md)



## [Environments](https://www.plakar.io/docs/control-plane/references/openapi/v1/environments/index.md)



## [Residencies](https://www.plakar.io/docs/control-plane/references/openapi/v1/residencies/index.md)



## [SLA](https://www.plakar.io/docs/control-plane/references/openapi/v1/sla/index.md)



## [Scheduling](https://www.plakar.io/docs/control-plane/references/openapi/v1/scheduling/index.md)



## [Snapshots](https://www.plakar.io/docs/control-plane/references/openapi/v1/snapshots/index.md)



## [Kloset](https://www.plakar.io/docs/control-plane/references/openapi/v1/kloset/index.md)



## [Mounts](https://www.plakar.io/docs/control-plane/references/openapi/v1/mounts/index.md)



## [Secret providers](https://www.plakar.io/docs/control-plane/references/openapi/v1/secret-providers/index.md)



## [Journal](https://www.plakar.io/docs/control-plane/references/openapi/v1/journal/index.md)



## [Network](https://www.plakar.io/docs/control-plane/references/openapi/v1/network/index.md)



## [PKI](https://www.plakar.io/docs/control-plane/references/openapi/v1/pki/index.md)



## [Webhooks](https://www.plakar.io/docs/control-plane/references/openapi/v1/webhooks/index.md)




