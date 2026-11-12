---
title: "LDAP"
date: "2026-11-12T00:00:00Z"
weight: 2
summary: "How to configure an LDAP directory resource in Plakar Control Plane."
---

# LDAP

The LDAP integration allows Plakar Control Plane to back up an LDAP directory,
such as OpenLDAP. Each backup reads every entry under a base DN and stores them
as a single `dump.ldif` file in the snapshot. Operational attributes, such as
`createTimestamp` or `entryUUID`, are not included.

There is no LDAP destination app. To restore, restore `dump.ldif` with a
file-restore destination app and load it with the tools of your LDAP server,
such as `ldapadd`.

## Inventory Management

Currently no [managed inventory](../../inventories#managed-inventories) has the
capability of discovering LDAP directories. You must configure a
[self-managed inventory](../../inventories/self-managed) before adding an LDAP
resource.

### Adding an LDAP resource

When using a self-managed inventory, you must register resources manually or
import them from a CSV file. For the endpoint, use the hostname or IP address of
the LDAP server, followed by the port when it is not the default, such as
`ldap.example.com:1636`. An LDAP resource has no class or subclass. See the
[resources documentation](../../resources) for more information on configuring
resources in a self-managed inventory.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Source["LDAP server"]
  Dir["Directory entries"]
end

subgraph Plakar["Plakar Control Plane"]
  App["LDAP<br/>Source app"]
  Backup["Backup process<br/>Encrypt & deduplicate"]
end

Store["Kloset Store"]

Dir -->|"Search the base DN<br/>and export as LDIF"| App
App --> Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Protocols

The source app supports three protocols, which differ in how the connection is
secured:

- **`ldaps`**: TLS from the start, usually on port 636.
- **`ldap+starttls`**: Plain LDAP, upgraded to TLS with StartTLS, usually on
  port 389.
- **`ldap`**: Cleartext. Backups with this protocol are refused, since the bind
  DN and password would be sent unencrypted. Use `ldaps` or `ldap+starttls`.

Both TLS protocols verify the server certificate against the resource's
endpoint.

## Source configuration

The following settings are available when configuring a source app, with all
three protocols.

- **Bind Dn**: Required. DN used to bind to the server, such as
  `cn=admin,dc=example,dc=com`. It must be allowed to read the entries to back
  up.
- **Password**: Required. Password of the bind DN.
- **Base Dn**: DN of the subtree to back up. Defaults to the `dc=` components of
  **Bind Dn**, such as `dc=example,dc=com`. Required when **Bind Dn** has no
  `dc=` component.
- **Tls No Verify**: Skip TLS certificate verification. Disabled by default.

> [!WARNING]+ TLS Certificate Verification
>
> Enabling **Tls No Verify** disables TLS certificate verification, so anyone on
> the network path can impersonate the LDAP server. Only use it in controlled
> environments with self-signed certificates on trusted networks.
