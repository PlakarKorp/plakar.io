
# Serving a Kloset Store over the Network

Plakar can expose a Kloset Store over HTTP using the `plakar server` command.
This allows other machines to access the store over the network.

There are two main reasons to use `plakar server`:

- **Accessing a store over HTTP.** Some environments only expose storage over
  HTTP. For example, a NAS that is reachable over HTTP but not over SSH. In
  these cases, `plakar server` lets you bridge the gap by re-exposing a store
  through HTTP.
- **Protection against destructive maintenance operations.** By default,
  `plakar server` refuses to delete the underlying objects (states, packfiles,
  and locks) stored inside a store. This is useful when multiple machines push
  backups to a shared store: if one of those machines is compromised, an
  attacker cannot use it to permanently erase backup data.

  Note that this does _not_ prevent a client from marking a snapshot as deleted.
  In Plakar's model, deleting a snapshot doesn't remove anything by itself. It
  only pushes a new state that marks the snapshot as deleted, which from the
  store's point of view is an addition, not a removal. The actual data is only
  reclaimed later, when `plakar maintenance` runs. It's this reclamation step
  that `plakar server` blocks by default. If you need to stop a machine from
  even marking snapshots as deleted, don't push backups from it directly;
  instead pull the data from that machine using a trusted server (for example
  over SFTP). See
  [Should you push or pull backups](../../explanations/should-you-pull-or-push-backups)
  for more on this tradeoff, and
  [How Maintenance Works](../../explanations/how-maintenance-works) for the full
  picture of how deletion and reclamation work.

In all cases, clients still need the repository passphrase to access the store,
and all snapshot data remains fully encrypted in transit.

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Clients["Client Machines"]
    C1["backup / ls / restore"]
    C2["rm<br/>(marks snapshot deleted)"]
    C3["maintenance<br/>(reclaims storage space)"]
  end

  HTTP(["plakar server<br/>HTTP(S) endpoint"])
  Guard{"-allow-delete<br/>flag set?"}

  subgraph Store["Kloset Store"]
    Objects["States, packfiles, locks"]
  end

  C1 -->|"HTTP(S)"| HTTP
  C2 -->|"HTTP(S): push new state"| HTTP
  C3 -->|"HTTP(S): delete request"| HTTP

  HTTP -->|"non-destructive ops"| Objects
  HTTP -->|"destructive ops"| Guard
  Guard -->|"No (default): refused"| Blocked["Request rejected"]
  Guard -->|"Yes: -allow-delete"| Objects
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Starting an HTTP server

Assume you have a Kloset Store located at `/var/backups`. To expose it over
HTTP, run:

```bash
$ plakar at /var/backups server
```

By default, `plakar server` listens on `http://localhost:9876`. You can then
access the store from any Plakar client:

```bash
$ plakar at http://localhost:9876 ls
```

## Listening on a different address

Use the `-listen` flag to change the listening address and port. To listen on
all interfaces on port `12345`:

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

## Enabling destructive operations

By default, `plakar server` refuses to delete the underlying objects (states,
packfiles, and locks) stored inside a store. This is what happens during
`plakar maintenance`. To allow these destructive operations through the server
explicitly:

```bash
$ plakar at /var/backups server -allow-delete
```

## Enabling HTTPS

`plakar server` can serve the store over HTTPS using a TLS certificate and
private key:

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

Note that HTTPS doesn't add much protection here: as mentioned above, all
snapshot data is already fully encrypted end-to-end with the repository
passphrase, regardless of the transport. Plain HTTP does not expose your
backups. HTTPS is still worth enabling if you want to hide metadata like request
patterns from network observers, or if you're bridging environments that require
TLS for other reasons (e.g. a corporate proxy).

## Serving remote stores

`plakar server` can also expose non-local stores. For example, to expose an
SFTP-backed store over HTTP:

```bash
$ plakar at sftp://example.org server
```

## Limitations

- TLS certificates are not generated automatically. You must provide your own
  certificate and private key when enabling HTTPS.
- The server's delete protection guards against object-level removal (states,
  packfiles, locks) during maintenance. It does not prevent a client from
  marking snapshots as deleted, and there is currently no CLI-level way to
  restrict that. If a client must be prevented from doing even that, pull
  backups from it via a trusted machine instead of letting it push directly. See
  [How Maintenance Works](../../explanations/how-maintenance-works) for details
  on the grace period, packfile-level garbage collection, and checkpoints that
  govern when reclamation actually happens.

