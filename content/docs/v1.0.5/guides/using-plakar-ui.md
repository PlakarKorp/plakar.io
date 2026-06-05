---
title: "Using Plakar UI"
date: "2026-06-04T00:00:00Z"
weight: 10
summary:
  "Learn how to start and use the Plakar UI to browse snapshots, restore files,
  manage integrations, and view alerts."
---

# Using Plakar UI

The Plakar UI lets you browse snapshots, restore files, and manage integrations
from a browser. This guide walks you through starting the UI on a repository and
using its main features.

## Starting the UI

Run `plakar ui` on a Kloset repository to start the UI. If no Kloset store is
specified Plakar will launch the UI on the default store located at `~/.plakar`:

```sh
plakar at /var/backups ui
```

Plakar prints the address and authentication token, then opens your browser
automatically:

```txt
launching webUI at http://localhost:38119?plakar_token=bd179e88-8739-49d4-89b6-9e2a0595b9c8
```

The token is embedded in the URL so you do not need to copy or enter it
manually.

To listen on a specific address and port instead of a random one:

```sh
plakar at /var/backups ui -addr localhost:9090
```

To start the server without opening the browser, pass `-no-spawn`:

```sh
plakar at /var/backups ui -no-spawn
```

To allow the UI to be accessed from any origin, pass `-cors`. This sets the
`Access-Control-Allow-Origin` response headers:

```sh
plakar at /var/backups ui -cors
```

To disable the authentication token required to access the HTTP APIs, pass
`-no-auth`:

```sh
plakar at /var/backups ui -no-auth
```

## Using the UI

![](../images/plakar-ui-dashboard.png)

### Browsing and restoring snapshots

The UI lists all snapshots in the Kloset store. You can select a snapshot to
browse its contents. From inside a snapshot you can:

- **Previewing files**: view files directly in the browser.
- **Downloading a single file**: click on a file to download it directly.
- **Downloading a directory**: download a `.tar.gz` archive of a directory.
- **Downloading the entire snapshot**: download a `.tar.gz` archive of the
  snapshot

This covers the full restore workflow without needing the CLI.

![](../images/preview-snapshot-data.png)

### Logging in to your Plakar account

Installing integrations from the UI and alerting require the user to be logged
in. You can log in directly from the UI either using your email and receiving a
magic link or with your GitHub account.

Plakar provides pre-built integration packages as a convenience. Login is
required to prevent abuse on our servers. If you prefer not to log in, you can
build and install integration packages locally from source. See the
[Managing packages](../managing-packages/) and
[Logging in to Plakar](../logging-in-to-plakar/) guides for more details.

![](../images/login-with-plakar-ui.png)

### Managing integrations

Once you're logged in, you can install and uninstall integrations from the
integrations section of the UI.

![](../images/managing-integrations.png)

### Viewing alerts

Once you're logged in, alerting is enabled by default. You will automatically
receive reports whenever you run backups, restores, checks, or maintenance
tasks.

![](../images/viewing-alerts.png)

## See also

- [plakar ui](../references/commands/plakar-ui)
