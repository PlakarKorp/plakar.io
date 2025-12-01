---
date: "2025-09-02T00:00:00Z"
title: What is `plakar server`, and why should I use it?
summary: "Learn about the `plakar server` command, which creates an HTTP proxy on top of a Kloset store. This tutorial explains how it works, its use cases, and its limitations."
last_reviewed: "2025-09-02"
last_reviewed_version: "v1.0.3"
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

The `plakar server` command creates a proxy on top of a Kloset store.  
This proxy exposes the store over HTTP, allowing you to interact with it just like any other Plakar store.

## How it works

Assume you have a store at `/var/backups`. You can list its contents directly with:

```bash
plakar at /var/backups ls
```

If you start a proxy on this store:

```bash
plakar at /var/backups server
```

Plakar launches a server (by default on `http://localhost:9876`).

To interact with it over HTTP, first install the `http` integration:

```bash
plakar pkg add http
```

Then you can list snapshots from the proxy:

```bash
plakar at http://localhost:9876 ls
```

By default, the proxy does not allow delete operations for safety.  
If you want to enable them, pass the `-allow-delete` flag:

```bash
plakar at /var/backups server -allow-delete
```

For a full list of options, run:

```bash
plakar help server
```

## Use cases

The primary use case for `plakar server` is to expose a local Kloset store over HTTP.

For example, you could share a Kloset store hosted on a NAS, making it accessible via HTTP from other machines.

It is also possible to chain proxies. For instance, you can run:

```bash
plakar at http://<host>:<port> server -listen <host>:<newport>
```

This creates a new proxy pointing to the original one.

## Considerations and limitations

### No access to decrypted data

The proxy only exposes the encrypted store. Clients must provide the passphrase when running commands.

### No TLS support

The proxy does not support TLS natively. If you need secure connections, set up a reverse proxy (e.g., Nginx).

