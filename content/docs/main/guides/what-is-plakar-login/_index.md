---
date: "2025-09-02T00:00:00Z"
title: Unlocking Features with plakar login
summary: "Learn about the benefits of logging in with `plakar login`, including installing pre-built packages and enabling alerting for better usability and monitoring."
last_reviewed: "2025-12-08"
last_reviewed_version: "v1.0.6"
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

By default, Plakar works without requiring you to create an account or log in. You can back up and restore your data with just a few commands, no external services involved.

However, logging in with `plakar login` unlocks optional features that improve usability and monitoring.

As of today, logging in is useful for two main reasons:

1. Installing pre-built packages from our servers (e.g., integrations such as S3, SFTP, rclone).
2. Enabling alerting (to receive status dashboards and notifications if something goes wrong).

More features may require login in the future.

## Why log in?

### 1. Install pre-built packages

Starting with Plakar v1.0.3, you can extend Plakar with integrations, for example:
* S3
* SFTP
* rclone

These integrations can be:
* Built from source (requires a toolchain), or
* Installed as pre-built packages through the UI or CLI.

Installing the pre-built packages stored on our storage servers requires that you are logged in.

### 2. Alerting

When logged in and alerting is enabled, Plakar sends non-sensitive metadata to the Plakar servers each time you run a backup, restore, sync, or maintenance.

This metadata powers the reporting system, which provides a dashboard in the UI and sends you email notifications.

Your backup contents are never sent to Plakar.

This ensures you’ll be notified promptly if something fails — especially useful for individuals and small teams without dedicated monitoring.

## How to log in

### Using the UI

1. Run `plakar ui`.
2. Click the Login button.
3. Go to the Settings page to enable alerting and email reporting.

### Using the CLI

* Log in with GitHub: `plakar login -github` or with email: `plakar login -email myemail@domain.com`
* After logging in, enable alerting with: `plakar service enable alerting` and `plakar service set alerting report.email=true`.