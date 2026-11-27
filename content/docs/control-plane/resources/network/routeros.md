---
title: "RouterOS"
date: "2026-11-27T00:00:00Z"
weight: 1
summary:
  "How to configure a MikroTik RouterOS resource in Plakar Control Plane."
---

# RouterOS

The RouterOS integration allows Plakar Control Plane to back up the
configuration of a MikroTik RouterOS device and restore it to a device. It
reaches the device over SSH, so no agent has to be installed on it.

> [!NOTE]+ Alpha
>
> The RouterOS integration is in alpha. Its settings and behaviour can still
> change between releases.

A backup asks the device to write its configuration to a file, downloads the
file over SFTP, stores it in the Kloset store, and deletes it from the device.
The protocol of the source app decides which form is backed up:

- **`routeros+export`**: A text export of the configuration, as a `.rsc` script
  of the commands that rebuild it. It can be reviewed, compared between
  snapshots, and applied to another device.
- **`routeros+backup`**: A system backup of the device, as a binary `.backup`
  file.

A restore uses the `routeros` protocol. It uploads a text export to the device
and runs `/import` on it. The destination app restores only text exports backed
up with `routeros+export`.

## Inventory Management

Currently no [managed inventory](../../inventories#managed-inventories) has the
capability of discovering RouterOS devices. You must configure a
[self-managed inventory](../../inventories/self-managed) before adding a
RouterOS resource.

### Adding a RouterOS resource

When using a self-managed inventory, you must register resources manually or
import them from a CSV file. For the endpoint, use the hostname or IP address of
the device, followed by the SSH port when it is not the default port `22`, such
as `192.168.88.1:2222`. A RouterOS resource has no class or subclass. See the
[resources documentation](../../resources) for more information on configuring
resources in a self-managed inventory.

The RouterOS user must be allowed to connect over SSH, run the export or backup
commands, and read and write files on the device.

#### Backup flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Source["RouterOS device"]
  Config["Configuration"]
end

subgraph Plakar["Plakar Control Plane"]
  App["RouterOS<br/>Source app"]
  Backup["Backup process<br/>Encrypt & deduplicate"]
end

Store["Kloset Store"]

Config -->|"Export or system backup<br/>over SSH"| App
App --> Backup --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

#### Restore flow

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

Store["Kloset Store"]

subgraph Plakar["Plakar Control Plane"]
  Restore["Restore process"]
  App["RouterOS<br/>Destination app"]
end

subgraph Destination["RouterOS device"]
  Config["Configuration"]
end

Store --> Restore --> App
App -->|"Upload the text export<br/>and run /import"| Config
{{< /mermaid >}}
<!-- prettier-ignore-end -->

## Host key verification

Plakar Control Plane verifies the host key of the device before it sends the
password. Set **Host Key** to the key of the device, as a public key or a
`known_hosts` line. For example, `ssh-keyscan -t ed25519 192.168.88.1` prints a
`known_hosts` line for the device. A device whose key does not match is refused.

> [!WARNING]+ Ignoring the host key
>
> Enabling **Insecure Ignore Host Key** accepts any host key. Anyone on the
> network path can then impersonate the device and collect the password sent to
> it. Prefer setting **Host Key**.

## Shared configuration

The following settings are available when configuring a source or destination
app.

- **User**: The SSH user.
- **Password**: The password of the SSH user.
- **Host Key**: The host key of the device. See
  [Host key verification](#host-key-verification).
- **Insecure Ignore Host Key**: Accept any host key. Disabled by default.

## Destination configuration

The following extra setting is available when configuring a destination app.

- **Dry Run**: Check the text export on the device without applying it. Disabled
  by default. Use it to validate a restore before running it for real.
