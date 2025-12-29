---
title: Notion
summary: Back up and restore your Notion workspace with Plakar.
date: "2025-12-29T00:00:00Z"
---

{{% notice style="warning" title="This integration is not yet stable" expanded="true" %}}
This integration is currently in beta and has not yet reached a stable release. Do not rely on it for production use cases yet.

See the section "Limitations and considerations" below for more details.
{{% /notice %}}

The **Notion integration** allows you to back up and restore your Notion pages or entire workspace into a Kloset store using the official Notion API.

All content is fetched via the API and stored as structured JSON, including page metadata, content blocks, and hierarchical relationships.

The Notion integration package for Plakar provides two connectors:

| Connector type               | Description |
| ---------------------------- | ----------- |
| ✅ **Source connector**      | Back up a Notion workspace into a Kloset store. |
| ✅ **Destination connector** | Restore a Notion workspace from a Kloset store. |

---

## Installation

The Notion Plakar package can be installed either by downloading a pre-built package or by building it from source.

{{< tabs name="Installation Methods" >}}
{{% tab name="Pre-built package" %}}
Plakar provides pre-compiled packages for common platforms. This is the simplest installation method and is suitable for most users.

**Note:** Installing pre-built packages requires authentication with Plakar. See [Login to Plakar to unlock features](../../guides/what-is-plakar-login/).

Install the Notion package:
```bash
$ plakar pkg add notion
```

Verify the installation:

```bash
$ plakar pkg list
```
{{< /tab >}}

{{% tab name="Building from source" %}}
Building from source is useful if you cannot use pre-built packages.

**Prerequisites**

* A working Go toolchain compatible with your version of Plakar.

Build the Notion package:

```bash
$ plakar pkg build notion
```

On success, a package archive is generated in the current directory, for example `notion_v1.0.0_darwin_arm64.ptar`.

Install the generated package:

```bash
$ plakar pkg add ./notion_v1.0.0_darwin_arm64.ptar
```

Verify the installation:

```bash
$ plakar pkg list
```
{{< /tab >}}

{{% tab name="Reinstalling or upgrading" %}}
To check whether the Notion package is already installed:

```bash
$ plakar pkg list
```

To upgrade to the latest available version, remove the existing package and reinstall it:

```bash
$ plakar pkg rm notion
$ plakar pkg add notion
```

This preserves existing store, source, and destination configurations.
{{< /tab >}}
{{< /tabs >}}

---

## Connectors

The Notion package provides a source and a destination connector.

### Source connector

The Notion workspace is fetched from the Notion API and stored as structured JSON in a Kloset store, including page metadata, content blocks, and hierarchical relationships.

{{< mermaid >}}
flowchart LR

subgraph Source[<b>Notion</b>]
  fs@{ shape: cloud, label: "data" }
end

subgraph Plakar[<b>Plakar</b>]
  Connector@{ shape: rect, label: "<small>Retrieve data via</small><br><b>Notion source connector</b>" }
  Transform@{ shape: rect, label: "<small>Transform data as a structured JSON document</small>" }

  Connector --> Transform
end

Source --> Connector

Store@{ shape: cyl, label: "Kloset Store" }

Transform --> Store

%% Apply classes
class Source sourceBox
class Plakar brandBox
class Store storeBox

%% Classes definitions
classDef sourceBox fill:#ffe4e6,stroke:#cad5e2,stroke-width:1px
classDef brandBox fill:#524cff,color:#ffffff
classDef storeBox fill:#dbeafe,stroke:#cad5e2,stroke-width:1px

linkStyle default stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
{{< /mermaid >}}

#### Requirements

* A valid [**Notion API token**](https://www.notion.com/my-integrations) (`ntn_xxx`)
* The integration must be **shared with each page** you want to back up. See [Notion’s developer guide](https://developers.notion.com/docs/getting-started#step-1-create-an-integration) for how to create and share integrations.

#### Configure

```bash
# Create a Notion source configuration
$ plakar source add mynotion location=notion:// token=$NOTION_API_TOKEN

# Back up the Notion workspace to the Kloset store on the filesystem
$ plakar at /var/backups backup "@mynotion"
```

#### Options

These options can be set when configuring the source connector with `plakar source add` or `plakar source set`:

| Option     | Purpose                                                             |
| ---------- | ------------------------------------------------------------------- |
| `location` | **mandatory**: Must be set to the string `notion://` |
| `token` | **mandatory**: Your Notion API token (`ntn_xxx`) |

### Destination connector

The destination connector fetches data from the structured JSON stored by the source connector, and pushes it to the Notion API to recreate pages and content blocks.

{{< mermaid >}}
flowchart LR

Store@{ shape: cyl, label: "Kloset Store" }

subgraph Plakar[<b>Plakar</b>]
  Transform@{ shape: rect, label: "<small>Reconstruct data from structured JSON document</small>" }
  Connector@{ shape: rect, label: "<small>Restore data via</small><br><b>Notion destination connector</b>" }

  Transform --> Connector
end

Store --> Transform

subgraph Destination[<b>Notion</b>]
  fs@{ shape: cloud, label: "data" }
end

Connector --> Destination

%% Apply classes
class Destination destinationBox
class Plakar brandBox
class Store storeBox

%% Classes definitions
classDef destinationBox fill:#d0fae5,stroke:#cad5e2,stroke-width:1px
classDef brandBox fill:#524cff,color:#ffffff
classDef storeBox fill:#dbeafe,stroke:#cad5e2,stroke-width:1px

linkStyle default stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
{{< /mermaid >}}

#### Requirements

* A valid [**Notion API token**](https://www.notion.com/my-integrations) (`ntn_xxx`) with permission to create pages and blocks in the target workspace.

#### Configure

```bash
# Create a Notion destination configuration
$ plakar destination add mynotion location=notion:// token=$NOTION_API_TOKEN

# Set the rootID option to specify the Notion Page ID where to restore the content
$ plakar destination set mynotion rootID=$NOTION_PAGE_ID

# Restore the snapshot to the Notion workspace
$ plakar at /var/backups restore -to "@mynotion" <snapshot_id>
```

#### Options

These options can be set when configuring the destination connector with `plakar destination add` or `plakar destination set`:

| Option     | Purpose                                                             |
| ---------- | ------------------------------------------------------------------- |
| `location` | **mandatory**: Must be set to the string `notion://` |
| `token`    | **mandatory**: Your Notion API token (`ntn_xxx`) with permission to create pages and blocks in the target workspace, and shared with the target parent page
| `rootID`   | **mandatory**: Notion Page ID under which restored content will be created |

Note: check the URL to get the `rootID` parameter. For example, in the URL `https://www.notion.so/MyNotionPageName-1234567890abcdef1234567890abcdef` the `rootID` is `1234567890abcdef1234567890abcdef`.

---

### Limitations and considerations

* The destination connector is currently under development and requires more love and testing to work.
* The source connector is not able to back up certain types of objects (such as images). Do not rely on this integration in production yet.