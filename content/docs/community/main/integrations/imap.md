---
title: "IMAP"
date: "2026-09-02T00:00:00Z"
weight: 24
summary: "Back up and restore mailboxes over IMAP."
---

# IMAP

The IMAP integration backs up mailbox contents from an IMAP server into a Kloset
store and restores them to an IMAP server. IMAP (Internet Message Access
Protocol) is a standard email protocol used by mail clients to retrieve messages
from a mail server over TCP/IP.

The integration includes two connectors:

| Connector type            | Description                                                       |
| ------------------------- | ----------------------------------------------------------------- |
| **Source connector**      | Back up mailbox contents from an IMAP server into a Kloset store. |
| **Destination connector** | Restore mailbox snapshots to an IMAP server.                      |

**Requirements**

- An IMAP account with read access for backup, and write access for restore.

**Typical use cases**

- Long-term archival and audit of email hosted on IMAP servers, including
  folders, metadata and attachments.
- Restoring mailbox snapshots to any compatible IMAP destination, preserving
  folder structure and message integrity.
- Backing up a single mailbox and its sub-mailboxes rather than an entire
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
$ plakar pkg add -allow-unsigned ./imap_v1.0.0_darwin_arm64.ptar
```

Verify installation:

```bash
$ plakar pkg show
```

{{< /tab >}}

{{< /tabs >}}

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages/).

## How a backup works

A backup captures the messages of the whole account, or of a single mailbox and
everything nested under it when the `location` ends with a mailbox path. The
rest of the account is left untouched. Messages are fetched with `BODY.PEEK`, so
a backup never alters the source mailbox.

Folder hierarchy is preserved across servers even when source and destination
use different hierarchy delimiters, for example Dovecot's `.` and `/`. Each
mailbox segment is percent-encoded into the snapshot path, so a folder named
`Work/Notes` or `Reçus` round-trips intact.

Message flags (`\Seen`, `\Answered`, `\Flagged`, `\Draft`, `\Deleted`, and
keywords such as `$Junk`) are encoded into each message's file name and
re-applied on restore. The session-only `\Recent` flag is intentionally dropped.

## How a restore works

A restore recreates mailboxes according to the snapshot. Missing mailboxes and
their parents are created automatically. Any mailbox path in the destination
`location` is ignored.

## Configuration

#### Backup flow

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

#### Restore flow

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

### Shared configuration

The following options apply to both source and destination connectors. They are
set with `plakar source add` or `plakar destination add`, and changed with
`plakar source set` or `plakar destination set`.

| Option          | Required    | Description                                                                                         |
| --------------- | ----------- | --------------------------------------------------------------------------------------------------- |
| `username`      | Conditional | Username to log in with. Overrides the URI user. Required when the URI has no user.                 |
| `password`      | Conditional | Password to log in with. Overrides the URI password. Required when the URI has no password.         |
| `tls`           | No          | TLS mode: `starttls` (default), `tls`, or `no-tls`.                                                 |
| `tls_no_verify` | No          | Skip server certificate verification when `true`. Dangerous. Use for testing only.                  |
| `io_timeout`    | No          | Idle timeout for each IMAP socket operation, as a Go duration (e.g. `2m`, `30s`). Defaults to `2m`. |

### Source configuration

The source `location` can end with a mailbox path to scope the backup. For
example, `imap://host/Archive` backs up `Archive` and everything nested under
it. Nested folders use `/` regardless of the server's hierarchy delimiter, and a
mailbox name containing `/` must be percent-encoded (`%2F`).

During a backup, a stalled or failed message-body fetch is retried once on a
fresh connection before being recorded as a per-message error. A transient
throttle is therefore recovered transparently.

| Option     | Required | Description                                                                                           |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `location` | Yes      | `imap://[user[:password]@]host[:port][/mailbox]`. Port defaults to `993` for TLS and `143` otherwise. |

### Destination configuration

| Option     | Required | Description                                                                                                                       |
| ---------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `location` | Yes      | `imap://[user[:password]@]host[:port]`. Port defaults to `993` for TLS and `143` otherwise. Any trailing mailbox path is ignored. |

### Example

Back up an account, or a single folder and its sub-folders:

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

Restore a snapshot:

```bash
# Configure an IMAP destination connector
$ plakar destination add myIMAPdst imap://imap.alsomydomain.com:143 \
  username=alsomyuser password=alsomypassword tls=starttls

# Restore the snapshot to the destination
$ plakar at /var/backups restore -to "@myIMAPdst" <snapshot_id>
```

## Limitations and scope

A backup captures the messages within the scoped mailbox, or the entire account
when no mailbox path is given, including folder structure and flags.

A backup does not capture:

- Server-side configuration outside the mailbox contents, such as server
  settings or ACLs.
- The session-only `\Recent` flag.
