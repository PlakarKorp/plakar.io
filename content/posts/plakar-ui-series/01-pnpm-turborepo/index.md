---
title: "Plakar UI #1: pnpm and Turborepo"
summary: "How and why we set up the Plakar UI as a monorepo using pnpm for strict dependency management and Turborepo for fast, cached task orchestration."
slug: "plakar-ui-pnpm-turborepo"
date: 2026-05-25T12:00:00+0000
authors:
  - "jcastets"
tags:
  - pnpm
  - turborepo
  - monorepo
  - plakar-ui
category: "technology"
series: ["Plakar UI Explained to My Backend Colleagues"]
series_order: 1
---

## How we got here

The Plakar UI didn't start as a monorepo. It started as a single repository: one app, one codebase, serving the UI for the open-source version of Plakar. Life was simple.

Then we started working on the Plakar Control Plane — a separate product that needed its own UI. The control plane has different pages, different workflows, and a different look and feel. But it shares a lot with the OSS version: the same design system, the same buttons, the same form components, the same data tables, the same API client patterns.

We understood immediately that keeping two separate repositories would mean duplicating components and inevitably letting them drift apart — fix a bug in one, forget to port it to the other; improve keyboard navigation in a dropdown, do it twice. We'd seen that movie before. So from the start, we went with a **monorepo**: a single repository containing multiple packages and applications.

## What is a monorepo?

A monorepo is exactly what it sounds like: one repository, multiple projects. Instead of having `plakar-ui-oss` and `plakar-ui-plakman` as separate repositories, we have a single `plakar-ui` repository that contains both apps, plus the shared packages they both depend on.

Here's what our structure looks like:

```
plakar-ui/
├── apps/
│   ├── oss/          # UI for the open-source Plakar
│   └── plakman/      # UI for the Plakar Control Plane
├── packages/
│   ├── ui/           # Pure presentational component library (~50+ components)
│   ├── common/       # Shared business logic, API clients, domain components
│   └── config/       # Shared ESLint and TypeScript configurations
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

`packages/ui` is our design system: buttons, inputs, modals, badges, tables — all the atomic building blocks. It has no knowledge of Plakar's business logic whatsoever.

`packages/common` is where the Plakar-specific shared logic lives: API clients, domain-specific components (like a "repository list" component), and shared hooks.

`packages/config` holds shared configuration for the tools we use across all packages, like ESLint and TypeScript settings. Without this, every package would have its own config files that inevitably drift out of sync.

Both `apps/oss` and `apps/plakman` depend on these packages. When we improve a component in `packages/ui`, both apps benefit immediately. When we fix a bug in an API helper in `packages/common`, both apps get the fix.

## pnpm: why not just use npm?

JavaScript has npm (Node Package Manager) built in. It's the default, it works, and most tutorials use it. So why switch?


**Strict node_modules — the main reason we switched.** npm has a notorious behavior called "phantom dependencies": because it flattens all nested dependencies into the top-level `node_modules` folder, your code can accidentally import a package you never explicitly declared as a dependency but that happens to be there because some other package depends on it. In a monorepo this gets worse — packages can silently depend on things declared only in a sibling package.

Concretely: imagine you import `lodash` somewhere in your code and it works fine because some other dependency happens to pull it in. Months later, that other dependency removes its `lodash` dependency in a patch update. Your build breaks, but nothing in *your* package.json changed. You spend an hour figuring out why.

pnpm's `node_modules` structure is strict — you can only import what you've explicitly declared as a dependency in your own `package.json`. Phantom dependencies are a compile error, not a runtime surprise. In a monorepo with multiple apps and shared packages, this discipline is essential.

**Speed.** pnpm is significantly faster than npm for installs, both because of a content-addressable store (packages stored once on disk, referenced by hard links) and because of how it handles concurrency. In a monorepo with many packages, install time adds up.

**Security.** pnpm also ships with supply-chain security features that npm lacks out of the box. Our `pnpm-workspace.yaml` configures several of them:

- `trustPolicy: no-downgrade` — install scripts can only run for packages explicitly approved, and approvals can't be silently downgraded by a dependency update
- `blockExoticSubdeps: true` — blocks dependencies from exotic registries (GitHub URLs, git refs) that bypass normal registry vetting
- `minimumReleaseAge: 10080` — packages must be at least 7 days old before they can be installed, giving the community time to catch malicious publishes before they hit production

These are opt-in in pnpm. They don't exist in npm at all.

**The lockfile.** pnpm's lockfile (`pnpm-lock.yaml`) records the full dependency graph, not just the flattened result, which makes it more reliable and easier to reason about.

To tell pnpm which directories are workspace packages, you use `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

That's it. pnpm now knows that any directory under `apps/` or `packages/` is a workspace package, and it will link them together automatically. When `apps/oss` lists `@plakar-ui/ui` as a dependency, pnpm links it directly to `packages/ui` instead of downloading it from a registry.

## Turborepo: making the monorepo fast

Having a monorepo means running commands across multiple packages. When you run `build`, you need to build `packages/ui` first, then `packages/common` (which depends on `ui`), and only then `apps/oss` and `apps/plakman`. When you run tests, you want to run them in all packages. Managing this by hand is tedious.

Turborepo is a task runner designed specifically for monorepos. You define your tasks in `turbo.json`, and Turborepo figures out the right order to run them, runs what it can in parallel, and caches the results.

Here's a simplified version of our `turbo.json`:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^test", "^check-ts", "^lint"],
      "outputs": ["dist/**"]
    },
    "test": {},
    "lint": {},
    "check-ts": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

The `^` prefix in `dependsOn` is the key piece. `"dependsOn": ["^build"]` means "before running `build` in this package, run `build` in all packages this one depends on". So when you run `turbo build`, Turborepo automatically resolves the dependency graph and builds everything in the right order.

**Caching** is where Turborepo really shines. It hashes the inputs to each task (source files, dependencies, environment variables) and caches the output. If nothing has changed since the last run, it replays the cached result instantly instead of running the task again. This means that on a large monorepo, if you change one file in `apps/oss`, Turborepo knows it only needs to re-lint and re-check `apps/oss` — all the packages that haven't changed get their results from cache.

**Parallel execution** is the other big win. Since Turborepo knows the dependency graph, it can run independent tasks in parallel. If `apps/oss` and `apps/plakman` don't depend on each other, their tests run at the same time.

The `dev` task has `"cache": false` because we don't want to cache development servers — they're long-running processes, not one-shot tasks with outputs.

## Putting it together

When a developer on our team runs `pnpm run dev`, here is what happens:

1. Turborepo looks at the task graph.
2. It starts the dev servers for `apps/oss` and `apps/plakman` in parallel (since they don't depend on each other).
3. Both apps resolve `@plakar-ui/ui` and `@plakar-ui/common` directly from the local `packages/` directories via pnpm workspace links.
4. Any change to a file in `packages/ui` is picked up immediately by both running dev servers.

When they run `pnpm run check` (which runs lint, TypeScript checking, formatting, and tests):

1. Turborepo builds the task graph, respecting `dependsOn` declarations.
2. `packages/ui` and `packages/common` are checked first (since the apps depend on them).
3. Once those pass, `apps/oss` and `apps/plakman` are checked in parallel.
4. Tasks that haven't changed since the last run are served from cache and show as already-passed instantly.

That last point is worth emphasizing: on a clean run after a small change, `pnpm run check` across the entire monorepo takes a few seconds because most of it is cached. Without Turborepo, every check would run from scratch every time.

---

This setup — pnpm for package management and Turborepo for task orchestration — is the foundation everything else in this blog series is built on. Next up, we'll talk about React: why it exists, what problems it solves, and why it's a fundamentally different way of thinking about UI compared to the HTML + CSS model most backend developers are familiar with.
