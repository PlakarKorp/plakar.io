---
title: "Plakar UI Explained to My Backend Colleagues: Introduction"
summary: "Why this series exists, who it's for, and what it covers — a high-level guide to the Plakar UI stack written by the UI team for everyone else at Plakar."
slug: "plakar-ui-series-intro"
date: 2026-05-25T13:00:00+0000
authors:
  - "jcastets"
tags:
  - plakar-ui
  - frontend
category: "technology"
series: ["Plakar UI Explained to My Backend Colleagues"]
series_order: 0
---

At Plakar, work is loosely split across three areas. The **core team** works on Plakar and Kloset — the backup engine, the storage layer, the protocols. The **plugin team** builds the connectors and integrations that extend what Plakar can talk to. And the **UI team** builds the web interfaces: the open-source UI and the Control Plane.

These boundaries are not rigid. Someone from the core team will sometimes open a PR on the UI. Someone from the UI team will sometimes need to understand a backend detail to make something work. But day to day, each area lives in a different world — different tools, different mental models, different problems.

This series is an attempt to bridge that gap, in one specific direction: from the UI team outward.

## Who this is for

If you work on the core or the plugin side and have ever opened the `plakar-ui` repository, you've probably seen `pnpm-workspace.yaml`, `turbo.json`, a `tsconfig.json` for each package, and enough `node_modules` folders to fill a small country. Maybe you quietly closed the tab. That's fair. Modern frontend development has a reputation — partly deserved, partly not — for being opaque to people who didn't grow up with it.

This series is for you.

More specifically, it's written for **developers who know Go and understand systems** but haven't spent much time on the frontend. We're not going to explain what a variable is. We're going to explain why we have twelve `package.json` files, what TanStack Query is actually solving, and why we reach for Zod on every API call.

It's also intended as a reference for **people joining the UI team**. When you come on board, we'd like you to be able to read through this series and come away with a clear picture of not just *what* the stack is, but *why* it is the way it is. Decisions that might look arbitrary usually have a reason — this is where we've written those reasons down.

## What we cover

The series walks through the tools and libraries that make up the Plakar UI, one at a time:

- **pnpm and Turborepo** — how the monorepo is structured, why we chose pnpm over npm, and how Turborepo keeps builds fast
- **React** — why the component model exists and what problems it actually solves
- **TypeScript** — the two features that make it genuinely worth using, explained to a Go developer
- **Zod** — why TypeScript alone isn't enough, and how we validate data at API boundaries
- **TanStack Query** — how we manage server state, caching, and the full lifecycle of every HTTP request
- **TanStack Form** — how we handle forms without drowning in boilerplate
- **React Aria Components** — the accessibility layer under our component library, and why building it from scratch would be a mistake
- **TanStack Table** — headless data tables with sorting, filtering, and pagination
- **TanStack Router** — type-safe routing that catches broken links at compile time
- **Storybook** — how we develop and document components in isolation
- **Testing strategy** — what we test, how, and where we draw the line
- **The build process** — how the code goes from source to something a browser can run

## What this is not

This is not a tutorial. We're not going to walk you through building your first React app or setting up a new TypeScript project from scratch. There are excellent resources for that online.

What we're trying to do is explain how *we* work — the specific patterns we've settled on, the tradeoffs we've made, and the problems we've run into. The goal is not to teach you React in general, but to give you enough context to understand what's happening in *our* codebase specifically.

If after reading this you find yourself curious and want to go deeper on any of the tools, the official documentation for all of them is excellent. Consider this series the "why we use it" companion to their "how it works" docs.

Ready to dive in? Start with [pnpm and Turborepo](/posts/2026-05-25/plakar-ui-pnpm-turborepo/).
