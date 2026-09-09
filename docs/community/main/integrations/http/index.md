
# HTTP(S)

The HTTP(S) integration allows Plakar to use an HTTP or HTTPS endpoint as a
Kloset store backend. Its used to connect to a Kloset store exposed by
`plakar server`. The integration is pre-installed in Plakar `v1.1.0` or later
and requires no additional setup. The integration provides one connector:

| Connector type    | Description                                                  |
| ----------------- | ------------------------------------------------------------ |
| Storage connector | Host a Kloset store on any HTTP or HTTPS accessible endpoint |

## Connectors

### Storage connector

The HTTP(S) storage connector uses an HTTP or HTTPS endpoint as the backend for
a Kloset store.

#### Configure

```bash
# Initialize a Kloset store at the HTTP endpoint
$ plakar at http://example.com/data create

# Back up a local directory to the store
$ plakar at http://example.com/data backup /var/www

# List snapshots in the store
$ plakar at http://example.com/data ls
```

When the endpoint requires a bearer token, for example a `plakar server` started
with `-token`, configure the store as an alias so the token is stored with it:

```bash
# Register the endpoint along with its token
$ plakar store add remote https://example.com/data auth_token=<token>

# Use the alias, the token is sent on every request
$ plakar at @remote ls
```

#### Options

| Option          | Required | Description                                                              |
| --------------- | -------- | ------------------------------------------------------------------------ |
| `location`      | Yes      | URL of the HTTP or HTTPS endpoint, for example `http://example.com/data` |
| `auth_token`    | No       | Bearer token sent in the `Authorization` header on every request         |
| `insecure`      | No       | Set to `true` to allow `auth_token` to be sent over plaintext HTTP       |
| `timeout`       | No       | Per-request timeout. Defaults to `5m`                                    |
| `tls_no_verify` | No       | Set to `true` to disable TLS certificate verification over HTTPS         |

The location can also be given directly on the command line, using the `http://`
or `https://` prefix as shown above.

## See also

- [Creating a Kloset Store](../guides/create-kloset-repository)
- [Serving a Kloset Store over the Network](../guides/serving-a-kloset-store-over-the-network)

