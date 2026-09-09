
# IMAP

IMAP (Internet Message Access Protocol) is a standard email protocol used by
mail clients to retrieve messages from a mail server over TCP/IP. The IMAP
integration includes two connectors:

| Connector type            | Description                                                       |
| ------------------------- | ----------------------------------------------------------------- |
| **Source connector**      | Back up mailbox contents from an IMAP server into a Kloset store. |
| **Destination connector** | Restore mailbox snapshots to an IMAP server.                      |

**Requirements**

- An IMAP account with read access for backup, and write access for restore.

**Typical use cases**

- Long-term archival and audit of email hosted on IMAP servers, including
  folders, metadata, and attachments.
- Restoring mailbox snapshots to any compatible IMAP destination, preserving
  folder structure and message integrity.
- Backing up a single mailbox (and its sub-mailboxes) rather than an entire
  account.

**Compatibility**

- Works with standard IMAP servers, including self-hosted and enterprise
  environments. Verified end-to-end against Dovecot.

## Installation

The IMAP integration is distributed as a Plakar package.

{{< tabs >}}

{{< tab label="Pre-built package" >}}

Pre-compiled packages are available for common platforms and provide the
simplest installation method.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the IMAP package:

```bash
$ plakar pkg add imap
```

Verify installation:

```bash
$ plakar pkg show
```

{{< /tab >}}

{{< tab label="Building from source" >}}

Source builds are useful when pre-built packages are unavailable or when
customization is required.

**Prerequisites:**

- Go toolchain compatible with your **Plakar** version

Build the package:

```bash
$ plakar pkg build imap
```

A package archive will be created in the current directory (e.g.,
`imap_v1.0.0_darwin_arm64.ptar`).

Install the package:

```bash
$ plakar pkg add ./imap_v1.0.0_darwin_arm64.ptar
```

Verify installation:

```bash
$ plakar pkg show
```

{{< /tab >}}

{{< /tabs >}}

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages/).

## Connectors

The IMAP package provides two connectors: a source connector for backing up
mailbox contents over IMAP, and a destination connector for restoring mailbox
snapshots over IMAP.

### Source connector

The Plakar IMAP package provides a source connector to back up mailbox contents
reachable over IMAP.

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Source["IMAP Server"]
  FS["Mailbox"]
end

Plakar["Plakar"]

Via["Retrieve messages via<br/>IMAP source connector"]

Store["Kloset Store"]

FS --> Via --> Plakar --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Configure

```bash
# Configure an IMAP source connector
$ plakar source add myIMAPsrc imap://imap.mydomain.com:143 \
  username=myuser \
  password=mypassword \
  tls=starttls

# Back up the mailbox
$ plakar at /var/backups backup "@myIMAPsrc"

# Back up only a specific folder (and its sub-folders)
$ plakar source add myArchive imap://imap.mydomain.com/Archive \
  username=myuser password=mypassword tls=starttls
$ plakar at /var/backups backup "@myArchive"
```

#### Options

These options can be set when configuring the source connector with
`plakar source add` or `plakar source set`:

| Option          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `location`      | `imap://[user[:password]@]host[:port][/mailbox]`. Port defaults to `993` for TLS and `143` otherwise. An optional trailing path scopes the backup to a single mailbox and its sub-mailboxes, e.g. `imap://host/Archive` backs up `Archive` and everything nested under it, leaving the rest of the account untouched. Nested folders use `/` regardless of the server's hierarchy delimiter, and a mailbox name containing `/` must be percent-encoded (`%2F`). |
| `username`      | Username to log in with. Overrides the URI user.                                                                                                                                                                                                                                                                                                                                                                                                                |
| `password`      | Password to log in with. Overrides the URI password.                                                                                                                                                                                                                                                                                                                                                                                                            |
| `tls`           | TLS mode: `starttls` (default), `tls`, or `no-tls`.                                                                                                                                                                                                                                                                                                                                                                                                             |
| `tls_no_verify` | Skip server certificate verification when `true`. Dangerous; testing only.                                                                                                                                                                                                                                                                                                                                                                                      |
| `io_timeout`    | Idle timeout for each IMAP socket operation, as a Go duration (e.g. `2m`, `30s`). Defaults to `2m`. A stalled or failed message-body fetch is retried once on a fresh connection before being recorded as a per-message error, so a transient throttle is recovered transparently.                                                                                                                                                                              |

### Destination connector

The Plakar IMAP package provides a destination connector to restore mailbox
snapshots to an IMAP server.

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

Store["Kloset Store"]

Plakar["Plakar"]

Via["Push messages via<br/>IMAP destination connector"]

subgraph Destination["IMAP Server"]
  FS["Mailbox"]
end

Store --> Plakar --> Via --> FS
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Configure

```bash
# Configure an IMAP destination connector
$ plakar destination add myIMAPdst imap://imap.alsomydomain.com:143 \
  username=alsomyuser password=alsomypassword tls=starttls

# Restore the snapshot to the destination
$ plakar at /var/backups restore -to "@myIMAPdst" <snapshot_id>
```

#### Options

These options can be set when configuring the destination connector with
`plakar destination add` or `plakar destination set`:

| Option          | Description                                                                                                                                                                                                                |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `location`      | `imap://[user[:password]@]host[:port]`. Port defaults to `993` for TLS and `143` otherwise. Any trailing mailbox path is ignored by the destination connector; restored mailboxes are recreated according to the snapshot. |
| `username`      | Username to log in with. Overrides the URI user.                                                                                                                                                                           |
| `password`      | Password to log in with. Overrides the URI password.                                                                                                                                                                       |
| `tls`           | TLS mode: `starttls` (default), `tls`, or `no-tls`.                                                                                                                                                                        |
| `tls_no_verify` | Skip server certificate verification when `true`. Dangerous; testing only.                                                                                                                                                 |
| `io_timeout`    | Idle timeout for each IMAP socket operation, as a Go duration (e.g. `2m`, `30s`). Defaults to `2m`.                                                                                                                        |

## Behavior

- Folder hierarchy is preserved across servers even when source and destination
  use different hierarchy delimiters (for example Dovecot's `.` vs `/`). Each
  mailbox segment is percent-encoded into the snapshot path, so a folder named
  `Work/Notes` or `Reçus` round-trips intact.
- Message flags (`\Seen`, `\Answered`, `\Flagged`, `\Draft`, `\Deleted`, and
  keywords such as `$Junk`) are encoded into each message's file name and
  re-applied on restore. The session-only `\Recent` flag is intentionally
  dropped.
- Messages are fetched with `BODY.PEEK`, so a backup never alters the source
  mailbox.
- On restore, missing mailboxes (and their parents) are created automatically.

## Limitations and scope

**What is captured during backup**

- Messages within the scoped mailbox (or the entire account when no mailbox path
  is given), including folder structure and flags.

**What is not captured**

- Server-side configuration outside the mailbox contents (e.g., server settings,
  ACLs)
- The session-only `\Recent` flag

