---
title: "Overview"
date: "2026-04-14T00:00:00Z"
weight: 1
summary: "An introduction to Plakar Enterprise, its core concepts, and how to get started."
---

# Overview

Plakar Enterprise is a self-hosted backup management system built on top of the open-source [Plakar](https://github.com/PlakarKorp/plakar). It brings everything Plakar is good at like deduplication, encryption, independent snapshots, flexible connectors and adds the tooling companies need to manage backups at scale: a full web interface, centralized scheduling, inventory and resource management, and more.

It is packaged as a virtual appliance you deploy in your own infrastructure, so your data never leaves your environment.

## Who it's for?

Plakar Enterprise is designed for companies that need reliable, auditable backups across multiple resources and environments, and for the sysadmins and DevOps engineers responsible for keeping that running.

## How it works?

You deploy Plakar Enterprise as a virtual appliance on AWS, OVHcloud, or your own infrastructure. From there, you connect it to your providers through inventories, configure what gets backed up and where, and set schedules. Everything is managed from the web interface.

When you first deploy, you go through an enrollment step that registers your instance with `plakar.io`. This retrieves your license and sets up billing reporting. No backup data is ever transferred, only the consumption metrics needed for billing.

## Core concepts

* **Inventories** connect Plakar Enterprise to a provider and expose the list of resources available to back up. Managed inventories sync automatically; self-managed ones let you enter resources manually.

* **Connectors** are the individual sources, stores, and destinations attached to a resource. A source is what gets backed up, a store is where backups are kept, and a destination is where data gets restored to.

* **Secret providers** let you store credentials securely in an external manager like AWS Secrets Manager or HashiCorp Vault.

* **Scheduling** defines when backup, restore, sync, and check jobs run. The scheduler handles concurrency automatically.

## What's next

* [Installation](#)
* [Enrollment and billing](#)
