---
title: "SFTP"
date: "2026-06-18T00:00:00Z"
weight: 2
summary: "How to configure an SFTP resource in Plakar Control Plane."
---

# SFTP

SFTP resources represent remote machines accessible over SSH/SFTP. SFTP does not
support automatic inventory discovery in Plakar Control Plane. You need to set
up a [self-managed inventory](../../infrastructure/inventories/self-managed)
before adding an SFTP resource.

## Setting up a self-managed inventory

You can create a self-managed inventory to manage your SFTP resources by
providing a name for it. Read the
[self-managed inventory](../../infrastructure/inventories/self-managed)
documentation for more information.

## Adding SFTP as a resource

When using a self-managed inventory, you must register your resources manually
or import them from a CSV file.

To add an SFTP machine as a resource, use **Compute** as the `class`. SFTP
resources do not require a subclass. For the endpoint, use the IP address of the
target machine.

![](../images/add-sftp-resource.png)

## Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  subgraph Remote["Remote Machine"]
    Files["Filesystem<br/>Root path"]
  end

  subgraph Plakar["Plakar Control Plane"]
    Source["SFTP<br/>Source app"]
    Backup["Backup process<br/>Encrypt & deduplicate"]
  end

  Store["Kloset Store"]

  Source -->|"SSH/SFTP connection"| Files
  Files -->|"read files"| Backup
  Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart TD
  Store["Kloset Store"]

  subgraph Plakar["Plakar Control Plane"]
    Destination["SFTP<br/>Destination app"]
    Restore["Restore process"]
  end

  subgraph Remote["Remote Machine"]
    Files["Filesystem<br/>Root path"]
  end

  Store --> Restore
  Destination --> Restore
  Restore -->|"SSH/SFTP connection"| Files
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Configuration

SFTP resources can be configured using a source, store, or destination app. When
setting up the app, select `sftp` from the integration dropdown.

### Port

The TCP/UDP port number the SSH service is listening on. Defaults to `22`.

### Root

The absolute filesystem path to use as the root for backup operations. Defaults
to `/`.

### SSH Private Key

To authenticate with the remote machine, PCP uses SSH key-based authentication.
You need to generate a dedicated SSH keypair for PCP and add the public key to
the remote machine's authorized keys before configuring this field.

Once the public key is on the remote machine, copy the private key and use it
into this field. The key should be added in full including the header and footer
lines.

```txt
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

### Username

The SFTP username to authenticate as on the remote machine. This field cannot be
used if the hostname already includes a `user@host` format.

## Permissions

The SSH user configured for PCP must have read access to the paths being backed
up. For store or destination use, write access is also required. It is
recommended to create a dedicated user and keypair for Plakar Control Plane
rather than reusing personal credentials.
