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
$ plakar at /var/backups create
$ plakar at /var/backups backup notion:// token=$NOTION_API_TOKEN
```

To create the Kloset repository at ```/var/backups``` and back up your Notion content, assuming the following env variable ```NOTION_API_TOKEN``` contained your shared API token.



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
$ plakar at /var/backups restore -to notion:// token=$NOTION_API_TOKEN rootId=$NOTION_PAGE_ID <snapshot_id>
```

This command restores the Notion content from the specified snapshot to the Notion page with ID `$NOTION_PAGE_ID`, which again must be shared with the integration and have write access.
Considering you have a Plakar repository at `/var/backups` and a Notion valid token in the environment variable `$NOTION_API_TOKEN`.
<snapshot_id> is the ID of the snapshot you want to restore. use `plakar at /var/backups ls` to list available snapshots.


## Questions, Feedback, and Support

Found a bug? Suggestion? [Open an issue on GitHub](https://github.com/PlakarKorp/integration-notion/issues/new).

Join our [Discord community](https://discord.gg/xjkbsWgyDZ) for real-time help and discussions.
