---
title: "CalDAV"
date: "2026-06-18T00:00:00Z"
weight: 21
summary: "Back up and restore CalDAV calendars with Plakar."
---

# CalDAV

The **CalDAV integration** enables backup and restoration of calendar data from
any CalDAV-compliant server. Calendar events are captured as `.ics` files and
stored in a Kloset store with encryption and deduplication.

Supported providers include Nextcloud, Fastmail, Google, Apple, and any
CalDAV-compliant server.

The CalDAV integration provides two connectors:

| Connector type            | Description                                                       |
| ------------------------- | ----------------------------------------------------------------- |
| **Source connector**      | Back up calendar events from a CalDAV server into a Kloset store. |
| **Destination connector** | Restore calendar events from a Kloset store to a CalDAV server.   |

## Installation

The CalDAV package can be installed using pre-built binaries or compiled from
source.

{{< tabs >}}

{{< tab label="Pre-built package" >}}

Pre-compiled packages are available for common platforms and provide the
simplest installation method.

> [!NOTE]+ Logging In
>
> Pre-built packages require Plakar authentication. See
> [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the CalDAV package:

```bash
$ plakar pkg add caldav
```

Verify installation:

```bash
$ plakar pkg list
```

{{< /tab >}} {{< tab label="Building from source" >}}

Source builds are useful when pre-built packages are unavailable or when
customization is required.

**Prerequisites:**

- Go toolchain compatible with your **Plakar** version

Build the package:

```bash
$ plakar pkg build caldav
```

A package archive will be created in the current directory (e.g.,
`caldav_v1.0.0_darwin_arm64.ptar`).

Install the package:

```bash
$ plakar pkg add ./caldav_v1.0.0_darwin_arm64.ptar
```

Verify installation:

```bash
$ plakar pkg list
```

{{< /tab >}} {{< /tabs >}}

To list, upgrade, or remove the package, see
[managing packages guide](../../guides/managing-packages/).

## Configuration

### Configuration options

| Option          | Description                                                                       |
| --------------- | --------------------------------------------------------------------------------- |
| `location`      | Required. CalDAV server URL, for example `caldav://cal.example.org`.              |
| `username`      | Required for most providers. Username to authenticate with.                       |
| `password`      | Required for most providers. Password or app-specific token to authenticate with. |
| `name`          | OAuth2 provider name, for example `google`, `microsoft`, or `apple`.              |
| `client_id`     | OAuth2 client ID. Required when using OAuth2 authentication.                      |
| `client_secret` | OAuth2 client secret. Required when using OAuth2 authentication.                  |

Providers that support basic authentication (Nextcloud, Fastmail, and most
self-hosted servers) only require `username` and `password`. Providers that
require OAuth2 (Google, Microsoft, Apple) require `name`, `client_id`, and
`client_secret` instead.

## Source connector

The source connector retrieves calendar events from a CalDAV server and stores
them as `.ics` files in a Kloset store with encryption and deduplication.

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

subgraph Source["CalDAV Server"]
  FS["Calendar Events"]
end

subgraph Plakar["Plakar"]
  Connector["Retrieve events via<br/>CalDAV"]
  Transform["Encrypt & deduplicate"]
  Connector --> Transform
end

Source --> Connector

Store["Kloset Store"]
Transform --> Store
{{< /mermaid >}}
<!-- prettier-ignore-end -->

Register the source and run a backup:

```bash
$ plakar source add my-caldav \
  caldav://cal.example.org \
  username=<YOUR_USERNAME> \
  password=<YOUR_PASSWORD>

$ plakar at /var/backups backup "@my-caldav"
```

## Destination connector

Restores calendar events from a Kloset store back to a CalDAV server.

<!-- prettier-ignore-start -->
{{< mermaid >}}
flowchart LR

Store["Kloset Store"]

subgraph Plakar["Plakar"]
  Transform["Decrypt & reconstruct"]
  Connector["Restore via<br/>CalDAV"]
  Transform --> Connector
end

Store --> Transform

subgraph Destination["CalDAV Server"]
  FS["Calendar Events"]
end

Connector --> Destination
{{< /mermaid >}}
<!-- prettier-ignore-end -->

Register the destination and restore a snapshot:

```bash
$ plakar destination add my-caldav-restore \
  caldav://cal.example.org \
  username=<YOUR_USERNAME> \
  password=<YOUR_PASSWORD>

$ plakar at /var/backups restore -to "@my-caldav-restore" <snapshot_id>
```

## Notes

- Calendar data is stored as standard `.ics` files, making snapshots portable
  across any CalDAV-compatible provider.
- For Google, Microsoft, and Apple, OAuth2 credentials must be configured when
  adding the source or destination.
- App-specific passwords are recommended over account passwords where supported
  by the provider.
