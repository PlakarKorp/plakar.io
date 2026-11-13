
# LDAP

The LDAP integration backs up an LDAP directory, such as OpenLDAP, into a Kloset
store. It reads every entry under a base DN and stores them as a single LDIF
file.

The integration includes one connector:

| Connector type       | Description                                       |
| -------------------- | ------------------------------------------------- |
| **Source connector** | Back up the entries of an LDAP directory as LDIF. |

**Requirements**

- An LDAP server reachable from the machine running Plakar.
- A bind DN and password allowed to read the entries to back up.

**Typical use cases**

- Keeping versioned copies of a directory's users, groups and organizational
  units.
- Recovering entries that were deleted or modified by mistake.

## Installation

The LDAP integration is distributed as a pre-built package only. It has no
public source repository, so `plakar pkg build` cannot produce it. It remains
free to install with a Plakar account. See
[source availability](../../guides/managing-packages#source-availability) for
how this differs from the other integrations.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the LDAP package:

```bash
$ plakar pkg add ldap
```

Verify installation:

```bash
$ plakar pkg show
```

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages).

## How a backup works

Plakar binds to the server with the configured bind DN and searches the whole
subtree under the base DN. Every entry the bind DN can read is written to
`/dump.ldif` in the snapshot. Operational attributes, such as `createTimestamp`
or `entryUUID`, are not included.

There is no destination connector. To restore, restore `dump.ldif` to a local
directory and load it with the tools of your LDAP server, such as `ldapadd`.

## Configuration

The source connector supports three protocols, which differ in how the
connection is secured:

| Protocol        | Connection                                                      |
| --------------- | --------------------------------------------------------------- |
| `ldaps`         | TLS from the start, usually on port 636.                        |
| `ldap+starttls` | Plain LDAP, upgraded to TLS with StartTLS, usually on port 389. |
| `ldap`          | Cleartext. Refused unless `insecure=true` is set.               |

Both TLS protocols verify the server certificate against the host in `location`.

> [!WARNING]+ Cleartext Bind
>
> With `ldap` and `insecure=true`, the bind DN and password are sent in
> cleartext. Only use it on a trusted network.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Source["LDAP server"]
  Dir["Directory entries"]
end

Via["Search the base DN<br/>and export as LDIF"]

Plakar["Plakar"]

Store["Kloset Store"]

Dir --> Via --> Plakar --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

### Source configuration

| Option          | Required | Description                                                                                                                                               |
| --------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `location`      | Yes      | Server URL, such as `ldaps://ldap.example.com` or `ldap+starttls://ldap.example.com:389`.                                                                 |
| `bind_dn`       | Yes      | DN used to bind to the server, such as `cn=admin,dc=example,dc=com`.                                                                                      |
| `password`      | Yes      | Password of the bind DN.                                                                                                                                  |
| `base_dn`       | No       | DN of the subtree to back up. Defaults to the `dc=` components of `bind_dn`, such as `dc=example,dc=com`. Required when `bind_dn` has no `dc=` component. |
| `insecure`      | No       | Set to `true` to allow the `ldap` protocol and its cleartext bind. Defaults to `false`.                                                                   |
| `tls_no_verify` | No       | Skip TLS certificate verification. Defaults to `false`.                                                                                                   |

> [!WARNING]+ TLS Certificate Verification
>
> Setting `tls_no_verify=true` disables TLS certificate verification, so anyone
> on the network path can impersonate the LDAP server. Only use it in controlled
> environments with self-signed certificates on trusted networks.

### Example

```bash
# Configure the directory as a backup source
$ plakar source add mydir ldaps://ldap.example.com \
  bind_dn="cn=admin,dc=example,dc=com" password=<YOUR_PASSWORD>

# Back up the directory to a Kloset store
$ plakar at /var/backups backup "@mydir"

# Restore the LDIF file to a local directory
$ plakar at /var/backups restore -to /tmp/ldap-restore <snapshot_id>
```

## See also

- [Managing packages](../../guides/managing-packages)
- [LDIF format (RFC 2849)](https://www.rfc-editor.org/rfc/rfc2849)

