---
date: "2025-09-02T00:00:00Z"
title: Login to Plakar to unlock features
summary: Logging in is optional but enables additional features such as pre-built package installation and alerting. See how to log in from the CLI, UI, or on a non-interactive system (CI).
last_reviewed: "2025-12-08"
last_reviewed_version: "v1.0.6"
weight: 60
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

By default, Plakar works without requiring you to create an account. You can back up and restore your data with just a few commands, without depending on external services.

Logging in unlocks additional features. **These features are entirely opt-in.**

## Why log in?

As of today, logging in is useful for two main reasons:

1. **Installing pre-built packages** from Plakar's servers (integrations such as S3, SFTP, rclone).
2. **Enabling alerting**, which provides reporting dashboards and email notifications.

More features may require login in the future.

### 1. Install pre-built packages

Plakar provides multiple integrations, such as:

* S3
* SFTP
* rclone

[But also many others](/integrations).

You can build these integrations from source or install the pre-built versions hosted on Plakar's servers using the UI or `plakar pkg add`.

### 2. Alerting

When logged in and alerting is enabled, Plakar sends non-sensitive metadata to Plakar's servers whenever you run backup, restore, sync, or maintenance operations.

This metadata powers:

* A reporting dashboard in the UI  
* Email notifications about backup status  

Backup data is never sent to Plakar.

Alerting notifies you quickly if something breaks — especially useful for individuals and small teams without dedicated monitoring.

## How to log in

### Using the UI

1. Run `plakar ui`.
2. Click the **Login** button.
3. Open **Settings** to enable alerting and email reporting.

### Using the CLI

Log in using GitHub or email:

```bash
plakar login -github
plakar login -email myemail@domain.com
```

After logging in, enable alerting *(optional)*:

```bash
plakar service enable alerting
plakar service set alerting report.email=true
```

### Non-interactive login (CI, SSH, automation)

While this version allows generating authentication tokens, the CLI cannot consume them. Support for token-based non-interactive login was introduced after the release of v1.0.6.

This workflow is supported in the development branch and will be available in the next Plakar release. You can view the non-interactive login flow in the development branch documentation [here](../../../main/guides/what-is-plakar-login).
