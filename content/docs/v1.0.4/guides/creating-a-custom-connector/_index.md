---
title: "Creating a Custom Connector"
summary: "Step-by-step guide to implement and install your own Plakar connector (storage, importer, or exporter) in Go."
date: "2025-08-21"
last_reviewed: "2026-01-30"
last_reviewed_version: "v1.1.0"
weight: 7
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

This guide shows how to create a **custom Plakar connector** in Go, build it,
package it, and install it using the `plakar` CLI.

## What you will build

A minimal **Exporter** connector that restores snapshot contents to disk.

The same workflow applies to Importer or Storage connectors, but this guide
focuses on Exporter.

## 1. Choose the connector type

Plakar supports three connector types:

- **Store** – where backups are stored
- **Importer** – where data is read from
- **Exporter** – where data is written to

In this guide, you will implement an **Exporter**.
