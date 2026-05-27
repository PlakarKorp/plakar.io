---
title: "The Plakar UI, Explained for Backend Developers: An Introduction"
summary: "Why this series exists, who it's for, and what it covers: a high-level guide to the Plakar UI stack written by the UI team for the rest of Plakar."
slug: "plakar-ui-series-intro"
date: 2026-05-25T13:00:00+0000
authors:
  - "jcastets"
tags:
  - plakar-ui
  - frontend
category: "technology"
series: ["Plakar UI, Explained for Backend Developers"]
series_order: 0
---

At Plakar, work is roughly split across a few teams. Core works on Kloset and the backup engine. The API team owns the control plane. Integrations builds the connectors. And then there's us, the UI team.

In practice, the boundaries are loose. Everyone touches a bit of everything. But most of the time, each team lives in a different world. The core and API teams live in Go. We live in TypeScript.

That difference is bigger than it sounds. Go and modern frontend development don't share much mental real estate. If you've ever opened `plakar-ui` and seen `pnpm-workspace.yaml`, `turbo.json`, twelve `package.json` files, and enough `node_modules` to make `du -sh` cry — you know what I mean. Maybe you quietly closed the tab and went back to the thing you actually needed to fix.

That's fine. That's why we're writing this.

## Who this is for

Developers at Plakar who work outside the UI. If you know Go, understand systems, and haven't spent much time on the frontend, this series is for you.

We're not going to explain what a variable is. We're going to explain why the repo is structured the way it is, what each piece of the stack is actually solving, and why we made the choices we did.

We also realized, while writing this, that the frontend-backend gap isn't unique to us. Lots of teams end up with a similar split. So we decided to publish the series publicly. We're already building open-source software. Writing down the reasoning behind our decisions seemed like the obvious next step.

## What we cover

One piece at a time:

- **pnpm and Turborepo** — how the monorepo is structured and how builds stay fast
- **React** — what the component model is actually solving
- **TypeScript** — the two things that make it worth using, explained from a Go angle
- **Zod** — why TypeScript alone isn't enough at API boundaries
- **TanStack Query** — server state, caching, and request lifecycle management
- **TanStack Form** — forms without the boilerplate
- **React Aria Components** — the accessibility layer under our component library
- **TanStack Table** — headless tables with sorting, filtering, and pagination
- **TanStack Router** — type-safe routing with compile-time link checking
- **Storybook** — developing and documenting components in isolation
- **Testing strategy** — what we test, how, and where we stop
- **Build process** — from TypeScript source to something a browser can actually run

## What this is not

Not a tutorial. We're not walking you through setting up your first React project.

We're explaining how *we* work — the patterns, the tradeoffs, the things we tried before settling on what's in the repo now. If you want to go deeper on any of it, the docs for every tool in this stack are genuinely good. Think of this as the "why we use it" layer, sitting on top of the "how it works" layer they already provide.

Ready? Start with [pnpm and Turborepo](/posts/2026-05-25/plakar-ui-pnpm-turborepo/).
