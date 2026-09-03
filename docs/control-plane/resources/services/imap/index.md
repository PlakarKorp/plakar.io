
# IMAP

The IMAP integration allows Plakar Control Plane to back up and restore
mailboxes on any remote server reachable over IMAP. Plakar connects to the mail
server and reads or writes messages directly under the configured mailbox.

## Inventory Management

Currently no
[managed inventory](../../infrastructure/inventories#managed-inventories) has
the capability of discovering IMAP resources. You need to set up a
[self-managed inventory](../../infrastructure/inventories/self-managed) before
adding an IMAP resource.

### Adding IMAP as a resource

When using a self-managed inventory, you must register your resources manually
or import them from a CSV file.

To add an IMAP server as a resource, register it with no `class` or `subclass`.
For the endpoint, use the hostname or IP address of the mail server. See
[resources documentation](../../resources) for more information on how to set up
resources on a self-managed inventory.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Remote["IMAP Server"]
    Mailbox["Mailbox"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["IMAP<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"IMAP connection"| Mailbox
  Mailbox -->|"read messages"| Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  Store["Kloset Store"]

  subgraph Plakar["Plakar Control Plane"]
    Destination["IMAP<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph Remote["IMAP Server"]
    Mailbox["Mailbox"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"IMAP connection"| Mailbox
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Shared configuration

The following settings are available when configuring a source or destination
app.

- **Io Timeout**: Idle timeout for each IMAP socket operation, as a Go duration
  (e.g. `2m`, `30s`). A stalled server operation is aborted after this,
  preventing a hung backup or restore. Defaults to `2m`.
- **Password**: Required. IMAP password.
- **Tls**: TLS mode used to connect to the IMAP server. Defaults to `starttls`.
- **Tls No Verify**: Disable TLS certificate verification. Dangerous; use only
  for testing.
- **Username**: Required. IMAP username.

