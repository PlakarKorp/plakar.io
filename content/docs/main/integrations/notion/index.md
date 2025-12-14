---
title: Notion Integration documentation
description: Backup content from your Notion workspace directly into Plakar — fast, structured, and API-driven.
technology_description: This integration uses the Notion API to retrieve structured JSON representations of your workspace and pages.
categories:
- integrations
tags:
- notion
stage: "beta"
date: 2025-07-07
---

## Overview

The **Notion integration** allows you to back up and restore your Notion pages or entire workspace into a Plakar repository using the official Notion API.

All content is fetched via the API and stored as structured JSON, including page metadata, content blocks, and hierarchical relationships.

# Backup

## Configuration

- A valid [**Notion API token**](https://www.notion.com/my-integrations) (`ntn_xxx`)
- The integration must be **shared with each page** you want to back up
  → See [Notion’s developer guide](https://developers.notion.com/docs/getting-started#step-1-create-an-integration) for how to create and share integrations

## Example Usage

```sh
$ plakar source add mynotion location=notion:// token=$NOTION_API_TOKEN
$ plakar at @kloset backup @mynotion
```

To create a source called `mynotion` and back it up in the specified
kloset.


# Restore

## Configuration

- A valid [**Notion API token**](https://www.notion.com/my-integrations) (`ntn_xxx`)
- A valid **Notion Page ID** where you want to restore the content, **shared with the integration** with **write access**
  → See [Notion’s developer guide](https://developers.notion.com/docs/getting-started#step-1-create-an-integration) for how to create and share integrations.

To get id of a Notion page, you can open the page in your browser and copy the ID from the URL. It looks like a long alphanumeric string.
```
https://www.notion.so/MyNotionPageName-1234567890abcdef1234567890abcdef
```
Here the ID is `1234567890abcdef1234567890abcdef`.

## Example Usage

```sh
$ plakar destination add mynotion location=notion:// token=$NOTION_API_TOKEN
$ plakar destination set mynotion rootId=$NOTION_PAGE_ID
$ plakar at @kloset restore -to notion:// <snapshot_id>
```

This command creates a destination called `mynotion` associated with
the integration token, then sets the `rootID` parameter, and finally
restores the `<snapshot_id>` content to it.

Use [`plakar ls`](../../commands/plakar-ls/) to list available
snapshots.


## Questions, Feedback, and Support

Found a bug? Suggestion? [Open an issue on
GitHub](https://github.com/PlakarKorp/integration-notion/issues/new).

Join our [Discord community](https://discord.gg/xjkbsWgyDZ) for
real-time help and discussions.
