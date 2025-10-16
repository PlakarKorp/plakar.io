---
title: "Release v1.0.5 — Refinements, Hooks & Build Improvements"
date: 2025-10-15T10:00:00+0100
authors:
- "nestor"
summary: "v1.0.5 is here! This release focuses on build improvements, UI updates, smarter pipelines, new hook capabilities, and various maintenance enhancements."
categories:
 - technology
 - backup
 - release
featured-scope:
 - hero-page
tags:
 - plakar
 - release
 - hooks
 - ui
 - build
 - backup
---

Hot on the heels of v1.0.4, we’re excited to ship **Plakar v1.0.5** — a release packed with **build refinements**, **pipeline tuning**, **hook support for backups**, and **smaller but meaningful quality-of-life updates** across the board.  

This version sets the stage for smoother integrations, better developer ergonomics, and more flexible automation.

---

## Get it now !

Instructions on how to download and install are available in the [Download](/download/v1.0.5/) section !

---

## Build & Packaging Improvements

We’ve improved the **build process** to make distribution cleaner and more robust:

- ✅ **Fixed Homebrew packaging** to ensure a smooth experience on macOS ([#1684](https://github.com/PlakarKorp/plakar/pull/1684))  
- 🪟 **Added Windows builds** for broader platform support ([#1685](https://github.com/PlakarKorp/plakar/pull/1685))  
- 📦 Multiple dependency bumps, including:
  - `golang.org/x/tools`, `golang.org/x/mod`
  - `google.golang.org/grpc`
  - `github.com/spf13/viper`
  - `github.com/charmbracelet/bubbletea`
  - `github.com/go-playground/validator/v10`

These changes ensure a more consistent, up-to-date development environment across all platforms.

---

## UI & Documentation Updates

- New **social links** and **documentation references** have been added ([#1706](https://github.com/PlakarKorp/plakar/pull/1706)).  
- **Plakar UI** has been synced to the latest `main@4a02561` revision ([#1710](https://github.com/PlakarKorp/plakar/pull/1710)), with simplified asset serving ([#1718](https://github.com/PlakarKorp/plakar/pull/1718)).  
- CI was fixed to properly update the UI as part of the build ([#1709](https://github.com/PlakarKorp/plakar/pull/1709)).  
- Manual pages were enhanced to better describe the `import` command ([#1730](https://github.com/PlakarKorp/plakar/pull/1730)).

Together, these improvements polish the interface and documentation, making Plakar more accessible and discoverable.

---

## Pipeline & Concurrency Tuning

Since turning backup into a **pipeline**, we’ve adjusted concurrency levels to better align with the new architecture ([#1713](https://github.com/PlakarKorp/plakar/pull/1713)).  

This change improves stability and resource usage during heavy operations, paving the way for further optimizations in future versions.

---

## Backup Hooks & Sync Enhancements

A key new feature in v1.0.5 is **hook support for backup commands**:

- Added **pre-hook** and **post-hook** CLI flags to `plakar backup` ([#1727](https://github.com/PlakarKorp/plakar/pull/1727))  
- Hooks now work seamlessly on **Windows** too ([#1741](https://github.com/PlakarKorp/plakar/pull/1741))  
- Added **fail hooks**, allowing users to trigger custom actions when backups fail ([#1743](https://github.com/PlakarKorp/plakar/pull/1743))  
- Introduced support for `passphrase_cmd` during sync operations ([#1744](https://github.com/PlakarKorp/plakar/pull/1744))

These additions unlock more powerful automation and integration scenarios, letting you plug Plakar more deeply into existing workflows.

---

## Maintenance & Internal Refinements

Other notable changes include:

- **Improved type safety** in `DecodeRPC` ([#1721](https://github.com/PlakarKorp/plakar/pull/1721))  
- Clearer messaging around **grace periods** ([#1717](https://github.com/PlakarKorp/plakar/pull/1717))  
- Better **login requirement clarifications** ([#1715](https://github.com/PlakarKorp/plakar/pull/1715))  
- Enhanced handling for **missing locations** ([#1716](https://github.com/PlakarKorp/plakar/pull/1716))  
- Removed unused code paths and simplified plugin arguments ([#1724](https://github.com/PlakarKorp/plakar/pull/1724), [#1726](https://github.com/PlakarKorp/plakar/pull/1726), [#1729](https://github.com/PlakarKorp/plakar/pull/1729))  
- Added a `cache-mem-size` parameter for finer cache control ([#1738](https://github.com/PlakarKorp/plakar/pull/1738))  
- Miscellaneous bug fixes, including proper error handling for missing stores ([#1725](https://github.com/PlakarKorp/plakar/pull/1725)) and filter overrides ([#1737](https://github.com/PlakarKorp/plakar/pull/1737))

These refinements make the codebase leaner, more predictable, and easier to maintain.

---

## New Contributors

A warm welcome to **[@pata27](https://github.com/pata27)**, who made their first contribution in [#1725](https://github.com/PlakarKorp/plakar/pull/1725) 🎉

---

## Full Changelog

👉 [v1.0.4...v1.0.5](https://github.com/PlakarKorp/plakar/compare/v1.0.4...v1.0.5)

---

This release may not be as headline-grabbing as v1.0.4, but it’s a **critical stepping stone** — tightening the bolts, refining workflows, and enabling more flexibility for power users.  

As always, feedback is welcome: try it out, break things, and tell us what happens!
