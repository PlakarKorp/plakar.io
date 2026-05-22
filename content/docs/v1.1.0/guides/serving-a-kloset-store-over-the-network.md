---
title: "Serving a Kloset Store over the Network"
date: "2026-03-16T00:00:00Z"
weight: 4
summary: "Expose a Kloset Store over HTTP using the plakar server command."
aliases:
  - /docs/v1.1.0/guides/what-is-plakar-server
  - /docs/v1.1.0/guides/serving-a-kloset-store-over-http
---

# Serving a Kloset Store over the Network

Plakar can expose a Kloset Store over HTTP using the `plakar server` command. This allows other machines to access the store over the network.

There are two main reasons to use `plakar server`:
* **Accessing a store over HTTP.** Some environments only expose storage over HTTP. For example, a NAS that is reachable over HTTP but not over SSH. In these cases, `plakar server` lets you bridge the gap by re-exposing a store through HTTP.
* **Protection against snapshot deletion.** By default, `plakar server` refuses delete operations. This is useful when multiple machines push backups to a shared store. If one of those machines is compromised, an attacker cannot use it to delete snapshots.

In all cases, clients still need the repository passphrase to access the store, and all snapshot data remains fully encrypted in transit.

## Starting an HTTP server

Assume you have a Kloset Store located at `/var/backups`. To expose it over HTTP, run:

```bash
$ plakar at /var/backups server
```

By default, `plakar server` listens on `http://localhost:9876`. You can then access
the store from any Plakar client:

```bash
$ plakar at http://localhost:9876 ls
```

## Listening on a different address

Use the `-listen` flag to change the listening address and port. To listen on all
interfaces on port `12345`:

```bash
$ plakar at /var/backups server -listen :12345
```

To listen on a specific address, for example `192.168.1.10`:

```bash
$ plakar at /var/backups server -listen 192.168.1.10:12345
```

Remote clients on the same network can then reach the store using:

```bash
$ plakar at http://192.168.1.10:12345 ls
```

## Enabling delete operations

Delete operations are disabled by default. To allow them explicitly:

```bash
$ plakar at /var/backups server -allow-delete
```

## Enabling HTTPS

`plakar server` can serve the store over HTTPS using a TLS certificate and private key:

```bash
$ plakar at /var/backups server \
  -listen :443 \
  -cert fullchain.pem \
  -key privkey.pem
```

Clients connect using:

```bash
$ plakar at https://backup.example.com ls
```

If either `-cert` or `-key` is missing, the server falls back to plain HTTP.

## Serving remote stores

`plakar server` can also expose non-local stores. For example, to expose an
SFTP-backed store over HTTP:

```bash
$ plakar at sftp://example.org server
```

## Limitations

- TLS certificates are not generated automatically. You must provide your own certificate and private key when enabling HTTPS.
