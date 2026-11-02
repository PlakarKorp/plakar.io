---
title: RouterOS

subtitle: Encrypted configuration backups for MikroTik RouterOS devices

description: >
  Back up the configuration of MikroTik RouterOS devices over SSH, as readable
  text exports or full system backups, and restore text exports to a device with
  an optional dry run.

technology_title:
  A router's configuration is the network, and it lives on one device

technology_description: >
  A RouterOS device holds the routing, firewall, VPN and interface configuration
  that a whole network depends on, often built up by hand over years. When the
  device fails, is reset, or is misconfigured, that configuration goes with it.
  Plakar adds an importer and an exporter for RouterOS, so the configuration can
  be captured over SSH, kept as encrypted, deduplicated snapshots away from the
  device, compared over time, and applied back to a device.

categories:
  - source
  - destination

seo_tags:
  - RouterOS backup
  - MikroTik backup
  - MikroTik configuration backup
  - network configuration backup
  - router disaster recovery
  - encrypted backup

links:
  - type: community
    url: /docs/community/main/integrations/routeros/

edition:
  - community

stage: alpha

author:
  - type: official
    name: Plakar

date: 2026-10-26

resource: RouterOS

image: img/integrations/routeros.png
---

## Why protecting RouterOS matters

A RouterOS device carries the configuration a network runs on: addresses,
routes, firewall rules, VPN tunnels and user accounts. That configuration is
often changed by hand, directly on the device, and rarely kept anywhere else.

- **One device, one copy**: the configuration lives on the device itself. A
  hardware failure, a reset or a lost device takes it away.
- **Changes are hard to follow**: edits made from the console leave no history,
  so it is hard to tell what changed and when.
- **Rebuilding takes time**: recreating a configuration from memory or partial
  notes is slow, and errors in it can take the network down.

## Security and Compromise

Access to a RouterOS device is controlled by its user accounts and the services
it exposes. If an account is compromised or a change goes wrong:

- **Network-wide impact**: a modified firewall, route or VPN configuration
  affects everything behind the device.
- **Silent changes**: an attacker can alter the configuration in ways that are
  hard to spot without a known good copy to compare against.
- **No recovery without a backup**: without a copy kept off the device, there is
  no reliable way back to the last good configuration.

Plakar keeps RouterOS configurations encrypted end-to-end and stored away from
the device, with a history of snapshots that can be compared and restored.

## How Plakar protects your RouterOS devices

Plakar integrates with RouterOS in two ways:

- **Source connector**: capture the configuration of a device over SSH, either
  as a readable `.rsc` text export or as a full system backup, and store it in
  an encrypted, deduplicated Kloset.
- **Destination connector**: apply a text export back to a device, with a dry
  run to check it first.

Instead of relying on the device as the only copy of its configuration, Plakar
gives you an independent, verifiable and encrypted history of how your network
is configured.
