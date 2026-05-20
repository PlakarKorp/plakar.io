---
title: "Serving a Kloset Store over the Network"
date: "2026-03-16T00:00:00Z"
weight: 4
summary: "Expose a Kloset Store over HTTP using the plakar server command."
aliases:
  - /docs/v1.0.5/guides/what-is-plakar-server
  - /docs/v1.0.5/guides/serving-a-kloset-store-over-http
---

# Serving a Kloset Store over the Network

Plakar can expose a Kloset Store over HTTP using the `plakar server` command. This allows other machines to access the store remotely over the network.

By default, a Kloset Store is only accessed locally. Serving it over HTTP lets other machines back up to or restore from the same store without copying data around. This is useful when the store lives on a NAS, a dedicated backup server, or any machine you want to use as a centralized backup target.

This guide shows how to start an HTTP server for a Kloset Store and access it from another Plakar client.

## Starting an HTTP server

Assume you have a Kloset Store located at `/var/backups`. You can interact with it locally using commands like:

```bash
$ plakar at /var/backups ls
```

By default, plakar server listens on `http://localhost:9876`. To expose this store over HTTP, start the server by running:

```bash
$ plakar at /var/backups server
```

## Accessing the store over HTTP

In Plakar `v1.0.6` and earlier, the HTTP integration must first be installed before HTTP stores can be accessed.

Install the HTTP integration using:

```bash
$ plakar pkg add http
```

You can now access the store through its HTTP address:

```bash
$ plakar at http://localhost:9876 ls
```

All standard read operations work exactly as they do with a local store.

## Listening on a different address

The `-listen` flag can be used to change the listening address and port. For example, to listen on all network interfaces on port `12345`:

```bash
$ plakar at /var/backups server -listen :12345
```

To listen on a specific address and port. In this example, the local machine IP address is `192.168.1.10`:

```bash
$ plakar at /var/backups server -listen 192.168.1.10:12345
```

Local clients can access the store using:

```bash
$ plakar at http://localhost:12345 ls
```

Remote clients on the same network can access the store using:

```bash
$ plakar at http://192.168.1.10:12345 ls
```

You can determine your local IP address using standard operating system networking tools such as `ip addr`, `ifconfig`, or `ipconfig`.

## Enabling delete operations

For safety, delete operations are disabled by default when serving a store over HTTP. If you explicitly want to allow deletions, start the server with:

```bash
$ plakar at /var/backups server -allow-delete
```

## Serving remote stores

`plakar server` can also expose non-local stores. For example, to expose an SFTP-backed store over HTTP:

```bash
$ plakar at sftp://example.org server
```

This can be useful for bridging environments or re-exposing stores through a different transport layer.

## Typical use cases

Serving a Kloset Store over HTTP is useful when:
* Exposing a store hosted on a NAS to other machines
* Accessing a local store from remote systems
* Centralizing backups for multiple clients
* Bridging environments without copying data
* Re-exposing remote stores through HTTP

## Limitations

* The server exposes only the encrypted store. Clients must still provide the correct passphrase when accessing it.
* Native HTTPS support is not available in Plakar v1.0.6 and earlier. If encryption in transit is required, use a reverse proxy such as Nginx.
* When a hostname resolves to multiple IP addresses, `plakar server` only binds to one of them, preferably IPv4.
