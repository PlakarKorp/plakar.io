---
title: "General Settings"
date: "2026-07-03T00:00:00Z"
weight: 1
summary: "Configure your Plakar Control Plane instance from Settings > General."
---

# General Settings

The general settings page lets you check your instance's identity and version,
download diagnostic data, forward logs to Vector, and manage early-access
features.

![Plakar Control Plane general settings](../images/general-settings.png)

## Organization

Shows your organization's unique identifier.

## Current version

Shows the version of Plakar Control Plane currently running.

## Check for updates

Click **Check now** to verify whether a newer version of Plakar Control Plane is
available. See [Updating Control Plane](../updating-control-plane) for how to
install updates and, where needed, update the underlying deployment
infrastructure.

## Plakar Control Plane logs

Download Plakar Control Plane's own logs for diagnostics and troubleshooting.
Pick a date and click **Download** to get a `.log.gz` file containing that day's
logs.

## Plakar Control Plane database

Download a full dump of the Plakar Control Plane internal database, as `SQL`,
`GZIP`, or `ZIP`. Select the format and click **Download**.

## Vector

Forward Plakar Control Plane logs to a Vector instance you manage. Plakar
Control Plane runs its own internal Vector instance for local log processing;
this setting adds the instance you provide as an additional
[Vector sink](https://vector.dev/docs/reference/configuration/sinks/vector/), so
a copy of the logs is forwarded there rather than replacing local processing.

Enter the target instance's address as `host:port` and click **Update** to
apply.

## Email & SMTP

Configure the SMTP server used by Plakar Control Plane to send outgoing emails,
including notifications and other system-generated messages. See
[Email & SMTP](../email-and-smtp) for configuration details.

## Edge enrollment

Enable edge enrollment to allow new edge executors to register with your Plakar
Control Plane instance. Once enabled, you can generate or regenerate the
enrollment key used during the initial registration process. See
[Edges](../../infrastructure/edges) for more information.

## UI preview mode

Enable preview mode to access early features. They may be unpolished, but let
you explore them and give feedback before release.
