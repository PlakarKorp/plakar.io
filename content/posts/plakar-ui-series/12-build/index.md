---
title: "Plakar UI #12: The Build Process"
summary: "How we bundle and ship the Plakar UI — Vite, code splitting, environment configs, and what happens between writing code and serving it to users."
slug: "plakar-ui-build-process"
date: 2026-05-25T01:00:00+0000
authors:
  - "jcastets"
tags:
  - vite
  - build
  - frontend
  - plakar-ui
category: "technology"
series: ["The Plakar Frontend, Explained"]
series_order: 12
---

Throughout this series we've talked about what happens at runtime: how React renders components, how TanStack Query fetches data, how TanStack Router navigates between pages. But before any of that can happen, the source code — TypeScript, JSX, Tailwind CSS — has to be transformed into something a browser can actually run. That transformation is the build process.

## What the browser actually needs

Browsers don't understand TypeScript. They don't understand JSX. They don't understand `import` statements that reference local workspace packages like `@plakar-ui/ui`. They need plain JavaScript, plain CSS, and assets — all served from a URL.

The build process takes everything we've written and produces exactly that: a `dist/` folder of static files that a backend can serve. For the OSS version of Plakar, those files are embedded directly in the Go binary and served by `plakar ui`. There is no separate frontend deployment — the UI ships with the backend.

## Vite: the build tool

We use [Vite](https://vite.dev) as our build tool. Vite handles two things:

- **Development:** a dev server with hot module replacement (HMR). When you save a file, the browser updates in under a second without a full reload. TypeScript and JSX are transpiled on demand.
- **Production build:** `vite build` bundles the entire application into optimized static files. TypeScript is stripped, JSX is compiled to `React.createElement` calls, and all imports are resolved and bundled together.

The build command for each app is:

```bash
tsc -b && vite build
```

`tsc -b` runs the TypeScript compiler first — type-checking the entire project. If there are type errors, the build fails before Vite even starts. This is the gate: you cannot ship a build with type errors.

Then Vite takes over to produce the actual bundle.

## TypeScript: strict by default

Our shared TypeScript configuration enforces a strict set of rules across all packages:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  }
}
```

`strict: true` enables a collection of checks including `strictNullChecks` (you can't use a value that might be `null` without checking it first), `strictFunctionTypes`, and others. `noUnusedLocals` and `noUnusedParameters` mean that dead code is a compile error, not just a lint warning. These aren't optional — they apply to every package in the monorepo through the shared config in `packages/config/`.

## Code splitting

A naive bundler would produce one enormous JavaScript file containing the entire application. The browser would have to download all of it before rendering anything. With a UI that has dozens of routes, most of which a user will never visit in a single session, that's wasteful.

Vite splits the bundle automatically. TanStack Router's Vite plugin handles route-level code splitting:

```ts
tanstackRouter({
  target: "react",
  autoCodeSplitting: true,
})
```

With `autoCodeSplitting: true`, each route becomes its own chunk. When a user navigates to `/scheduling`, the browser downloads only the code for that route — not the code for `/inventories` or `/sources` or any other route they haven't visited. The initial bundle is small; additional chunks are fetched on demand as the user navigates.

## Tailwind CSS

Tailwind is integrated via its own Vite plugin:

```ts
import tailwindcss from "@tailwindcss/vite";
// ...
plugins: [tailwindcss()]
```

During development, Tailwind generates CSS on demand for whatever classes appear in the source files. In production, it scans all source files, collects every class that's actually used, and generates a single optimized CSS file containing only those classes. Unused utility classes are not included. The resulting CSS file is typically just a few kilobytes.

## Bundle analysis

One of the most useful things in the Vite config is a plugin that most people overlook:

```ts
import { visualizer } from "rollup-plugin-visualizer";

visualizer({
  filename: "stats.html",
  template: "flamegraph",
  gzipSize: true,
})
```

After every production build, Vite generates a `stats.html` file. Open it in a browser and you get an interactive flamegraph showing exactly which packages make up the bundle, how large each one is, and what percentage of the total they occupy. When the bundle grows unexpectedly, this is the first place to look. It's immediately clear if a dependency is pulling in something huge that shouldn't be there.

## The single-page application bootstrap

The entire application bootstraps from a single HTML file:

```html
<!doctype html>
<html lang="en" class="h-full">
  <head>
    <meta charset="UTF-8" />
    <title>Plakar Control Plane</title>
  </head>
  <body class="h-full">
    <div id="root" class="h-full"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

This is the entry point. The browser loads this HTML, which loads `main.tsx`, which sets up the QueryClient, the router, and mounts the React application into the `<div id="root">`. From that point on, navigation is handled entirely client-side — the server never needs to render anything.

In `main.tsx`, everything covered in this series comes together: the QueryClient is created with its retry and staleness policies, the router is created with the generated route tree and its context (queryClient, kloset API), and the root React component is rendered. It's about 100 lines of setup code that wires all the pieces together.

## How the UI ships with Plakar

When a user runs `plakar ui`, Plakar starts an HTTP server and serves the UI directly from the binary. The compiled HTML, JavaScript chunks, CSS, and assets are all embedded in the Go binary using Go's `embed` package. There is no CDN, no separate frontend server, no deployment step on the user's side — it just works out of the box.

To keep the embedded assets up to date, the Plakar repository has a GitHub Action that runs automatically. When triggered, it:

1. Checks out the `plakar-ui` repository
2. Runs `pnpm run build` to compile the OSS app
3. Copies the resulting `dist/` files into the appropriate directory in the Plakar Go repository
4. Opens a pull request with the updated compiled assets

A Plakar maintainer reviews and merges the PR. The next release of the Plakar binary automatically includes the latest UI. From a user's perspective, updating Plakar is enough — there is nothing frontend-specific to install or deploy.

This model is possible precisely because the output of the build is just static files. No server-side rendering, no Node.js runtime, no process to keep alive. The Go binary serves `index.html` for any route, and the browser takes it from there.

## Putting it all together

The full pipeline from source to production looks like this:

```
[plakar-ui repo] pnpm run build
  └── turbo build (for each package and the oss app)
        └── tsc -b          # type-check everything; fail fast on errors
        └── vite build      # bundle, split, optimize
              ├── TypeScript transpilation
              ├── JSX → React.createElement
              ├── Tailwind → optimized CSS
              ├── Route-level code splitting
              └── stats.html (bundle analysis)

[GitHub Action] copies dist/ → plakar repo, opens PR

[plakar repo] Go embeds the files → plakar ui serves them
```

---

That's the complete picture of how we build and ship Plakar's UI. From monorepo setup (article 1) through every library in the stack, to the build process that turns it all into something a browser can run and a Go binary can serve. We hope this series has given you a useful window into how modern frontend development works — and why, despite its complexity, the tooling genuinely makes building and maintaining a large UI more tractable than it used to be.
