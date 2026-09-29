---
title: "v1"
date: "2026-09-24T00:00:00Z"
weight: 1
summary: "Every endpoint of version one of the Plakar Control Plane API."
cascade:
  - _target:
      kind: page
    layout: api-tag
---

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
[application user](../../../administration/users#application-users). Exchanging
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
[permissions](../../../administration/permissions) its user holds in the
organization the badge is scoped to. A request outside those permissions returns
`403`.

A few endpoints use a different credential, and each one states which:

- **Edge token**: issued to an [edge](../../../infrastructure/edges) when it
  enrolls, and sent as a bearer token by that edge.
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

{{< children description="true" >}}
