---
title: "Plakar UI: Conclusion"
summary: "Wrapping up the series — what we covered, the common thread running through every tool choice, and what comes next."
slug: "plakar-ui-series-conclusion"
date: 2026-05-25T00:00:00+0000
authors:
  - "jcastets"
tags:
  - plakar-ui
  - frontend
category: "technology"
series: ["The Plakar Frontend, Explained"]
series_order: 13
---

In progress. Check back soon for the full article!

<!-- Thirteen articles later, we've covered a lot of ground.

We started with the monorepo setup — pnpm keeping dependencies honest, Turborepo making builds fast. We looked at React and why the component model is a genuine improvement over the HTML + CSS model it replaced. We covered TypeScript's type system and Zod's runtime validation, and how the two together close a gap that neither can close alone. We went through the TanStack family — Query for server state, Form for forms, Table for data grids, Router for type-safe navigation. We looked at React Aria Components as the accessibility foundation for the component library, Storybook as the development environment for components in isolation, the testing strategy, and finally the build pipeline that turns all of it into something a Go binary can embed and serve.

## The common thread

Looking back at the whole stack, there is a pattern.

Every tool we chose solves a problem that is real, concrete, and painful to handle yourself. TanStack Query exists because managing the full lifecycle of an HTTP request — loading states, caching, deduplication, background refetching, cache invalidation — is genuinely hard and the naive approach fails in production. Zod exists because TypeScript can't protect you from what comes in over the network. React Aria exists because accessible interactive components are deceptively complex and the browser doesn't give you much for free.

None of these are trends we followed for the sake of it. Each one replaced something messier — a pile of `useState` calls, an `as User` cast, a hand-rolled dropdown that didn't work with a keyboard.

The other pattern: we lean on libraries that solve the hard general problem, so we can focus on what's specific to Plakar. We didn't write a form library. We didn't write a router. We didn't write a table. We wrote a backup and restore UI that happens to use those things.

## What this series is not the end of

A series like this can only be a snapshot. The frontend ecosystem moves, and the stack will evolve. A tool may be replaced, a new problem will surface, a better solution will appear. What we hope stays stable is the reasoning — the habit of asking "what specific problem does this solve?" before adding a dependency.

If something in the stack changes significantly, we'll update the relevant article or add a new one. If you join the UI team and find that something here no longer reflects how things work, that's a sign the docs need updating — and updating them is a meaningful first contribution.

## If you have questions

If you've read this far and something is still unclear — a decision that seems wrong, a tool you think we should be using, a concept that wasn't explained well — reach out. The goal of this series was to make the UI less opaque, not to have the last word.

And if you're joining the UI team: welcome. We hope this series gave you a useful starting point. The rest is in the code. -->
