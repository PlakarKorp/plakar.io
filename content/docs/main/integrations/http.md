---
title: "HTTP(S)"
date: "2026-05-21T00:00:00Z"
weight: 3
summary: "Install and configure the HTTP(S) integration for Plakar."
---

# HTTP(S)

The HTTP(S) integration allows Plakar to use an HTTP or HTTPS endpoint as a Kloset store backend. This is useful when storage is only accessible over HTTP. For example, a NAS or self-hosted object store exposed over HTTP, or when using `plakar server` to expose a Kloset store over the network.

The HTTP(S) integration is pre-installed in Plakar `v1.1.0` and later and requires no additional setup. The integration provides one connector:

| Connector type | Description |
|---|---|
| Storage connector | Host a Kloset store on any HTTP or HTTPS accessible endpoint |

## Connectors

### Storage connector

The HTTP(S) storage connector uses an HTTP or HTTPS endpoint as the backend for a Kloset store.

#### Configure

```bash
# Initialize a Kloset store at the HTTP endpoint
$ plakar at http://example.com/data create

# Back up a local directory to the store
$ plakar at http://example.com/data backup /var/www

# List snapshots in the store
$ plakar at http://example.com/data ls
```

#### Options

| Option | Required | Description |
|---|---|---|
| `location` | Yes | URL of the HTTP or HTTPS endpoint, for example `http://example.com/data` |

## See also

* [Serving a Kloset Store over the Network](../guides/serving-a-kloset-store-over-the-network)
