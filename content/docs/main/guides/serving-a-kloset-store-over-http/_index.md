---
date: "2025-09-02T00:00:00Z"
title: Serving a Kloset Store over HTTP
summary: Expose a Kloset Store over HTTP using the plakar server command.
last_reviewed: "2026-01-30"
last_reviewed_version: "v1.1.0"
weight: 4
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

Plakar can expose a Kloset Store over HTTP using the `plakar server` command. This allows other machines to access the store remotely.

This guide shows how to start an HTTP server for a Kloset Store and access it
from another Plakar client.

## Starting an HTTP server

Assume you have a Kloset Store located at `/var/backups`. You can interact with it locally using commands like:

```bash
plakar at /var/backups ls
```

By default, Plakar listens on `http://localhost:9876`. To expose this store over HTTP, start the server by running:

```bash
plakar at /var/backups server
```

## Accessing the store over HTTP

To use a Kloset Store over HTTP, install the HTTP integration:

```bash
plakar pkg add http
```

You can now access the store via its HTTP address:

```bash
plakar at http://localhost:9876 ls
```

All standard read operations work exactly as they do with a local store.

## Enabling delete operations

For safety, delete operations are disabled by default when serving a store over HTTP. If you explicitly want to allow deletions, start the server with:

```bash
plakar at /var/backups server -allow-delete
```

## Typical use cases

Serving a Kloset Store over HTTP is useful when:
- Exposing a store hosted on a NAS to other machines
- Accessing a local store from a remote system
- Bridging environments without copying data

## Limitations
- The server exposes only the **encrypted store**. Clients must provide the passphrase when accessing it.
- TLS is not supported natively. If encryption in transit is required, use a reverse proxy such as Nginx.
