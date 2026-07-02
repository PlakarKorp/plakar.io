---
name: website
description:
  Conventions and gotchas for working on the plakar.io Hugo site — where
  JS/assets go, how content is structured, and (most importantly) how to release
  a new docs version without missing a step. Consult this whenever a task
  touches layouts/, assets/, content/, config/, or scripts/ in this repo —
  especially "add a new integration," "release/bump/publish the docs for
  vX.Y.Z," or "add a script/JS feature to the site."
---

# Working on plakar.io

This is a Hugo static site. It uses the **Blowfish** theme, pulled in as a git
submodule at `themes/blowfish` (upstream: `nunocoracao/blowfish`). Tailwind CSS
is compiled separately from Hugo. Search is powered by Pagefind.

Most everyday content edits don't need this doc — a new blog post, or tweaking
an existing page's copy, is easiest to figure out by opening a sibling file and
copying its shape. This doc covers the two things that _aren't_ obvious from
doing that: where the theme's boundaries are, and how to release a new docs
version, which touches several files that don't look related at first glance.

## Don't edit `themes/blowfish/` directly

It's a submodule that tracks an upstream repo, so anything changed there gets
lost on the next update. If you need different behavior from the theme, add a
file to the root `layouts/` folder at the same relative path — Hugo lets a root
layout override a theme layout with the same path, and that's the supported way
to customize Blowfish.

Before adding a new override, check we're not already overriding that file. The
current list of overrides is short on purpose: `404.html`,
`_default/_markup/render-heading.html`, `_default/baseof.html`,
`_default/term.html`, `_default/terms.html`, `index.html`,
`partials/series/series_base.html`, `shortcodes/tabs.html`.

Everything else under `layouts/` — `docs/`, `integrations/`,
`control-plane-docs/`, `solutions/`, and so on — isn't an override at all.
Blowfish doesn't know about these sections; they're ours. Adding new ones is
completely normal.

## Where JS and other assets go

JS lives under `assets/js/`, split into two groups by where it should load:

- `assets/js/main/*.js` — loads on **every page**. Bundled from
  `layouts/partials/extend-head.html`.
- `assets/js/docs/*.js` — loads only on **docs pages**. Bundled from the
  `{{ define "scripts" }}` block in `layouts/docs/list.html` _and_
  `layouts/docs/single.html` — both files build their own bundle, so a new docs
  script has to be added to both, not just one.

Scripts aren't loaded as plain `<script src="...">` tags — they're built into a
bundle through Hugo's asset pipeline. So a new script does nothing until it's
added to the right bundle's file list, and adding it to the wrong one leaks a
docs-only feature onto the marketing pages (or the reverse).

The same idea applies to images, icons, and CSS under `assets/`: reference them
with `resources.Get` rather than a hardcoded path like `/img/logo.svg`, so Hugo
can fingerprint and process them. See
`layouts/partials/common/header/header-corporate.html` for an example.

## How content is organized

- **`content/docs/community/{main, v1.0.5, v1.0.6, v1.1.0, ...}/`** — the
  versioned Community/OSS docs. `main` tracks the dev branch. Each version
  folder has the same shape: `quickstart/`, `guides/`, `references/`,
  `explanations/`, `integrations/`. The sidebar's version switcher just reads
  the list of folders here — no template changes needed to add one. Each
  version's `_index.md` has a `weight` field that controls its sort order in
  that list (more on this in the release checklist below).

- **`content/docs/control-plane/`** — the Control Plane (enterprise) docs. This
  one is _not_ versioned — just a single tree.

- **`content/integrations/*.md`** — the marketing landing page for each
  integration. It's a separate thing from the technical how-to doc, which
  usually lives at `content/docs/community/main/integrations/<name>.md` and is
  linked via the `technical_documentation_link` field. A couple of things worth
  knowing before writing one of these:
  - New integrations only need a technical doc in `main`. Don't copy it into the
    older version folders unless someone asks for that.
  - If the integration is really just a different flavor of an existing
    connector (for example, an S3-compatible service like MinIO), don't write a
    whole new technical doc — point `technical_documentation_link` at the
    existing one instead. That's exactly what `minio.md` does; it links to
    `s3.md` rather than duplicating it.
  - Base the front matter and headings on the closest existing example rather
    than inventing new fields.
  - Every integration needs a matching image at
    `assets/img/integrations/<name>.png`, or it won't show up in the
    integrations grid.

- **`content/posts/YYYY-MM-DD.../`** — blog posts, one folder per post. Author
  info lives in `data/authors/*.json`.

- **`content/download/<version>.md`** — one file per _released_ version,
  including patch releases. So unlike the docs tree (where `v1.1.0/` covers the
  whole `v1.1.x` line), there's a separate `v1.1.0.md`, `v1.1.2.md`,
  `v1.1.3.md`, and `v1.1.4.md` here. More on this below too.

## Releasing a new docs version

This is the workflow most likely to get done halfway, because a few of the steps
live in `config/` and `layouts/` — nowhere near the docs content itself, so
they're easy to forget. When someone asks you to set up docs for a new Plakar
release, work through this list:

1. **Figure out if it's a new minor version or a patch.** A new minor version
   (say, `v1.2.0` coming after `v1.1.x`) gets its own new folder under
   `content/docs/community/`. A patch of the current minor (say, `v1.1.5` after
   `v1.1.4`) does _not_ — it just updates the existing `v1.1.0/` folder in
   place, since that folder represents the whole `v1.1.x` line (its `_index.md`
   title literally says `"latest: vX.Y.Z"`).

2. **If it's a new minor version, start from a copy.** Copy the previous minor's
   folder as a starting point. Then regenerate the command reference (see
   below), and skim through the copied `quickstart/`, `guides/`,
   `explanations/`, and `integrations/` pages for anything that's changed —
   copying only gives you the right structure, not up-to-date content.

3. **Re-weight every version folder, not just the new one.** The sidebar sorts
   by each `_index.md`'s `weight` field — lower numbers sort first. Adding a new
   latest version means every existing version needs to shift down by one. Today
   it's `main=1, v1.1.0=2, v1.0.6=3, v1.0.5=4`; after adding `v1.2.0` at
   `weight: 2`, the others become `3`, `4`, and `5`. Skip this step and the new
   version ends up sorted _below_ an older one.

4. **Bump `latestVersion`** in `config/_default/params.toml`, under `[docs]`.

5. **Point the redirect at the new version.** Update `redirectTo` in
   `content/docs/community/_index.md`.

6. **Search for hardcoded links to the old version** instead of trusting a fixed
   list — new hardcoded links can turn up anywhere over time. Right now that's a
   quickstart URL in `config/_default/menus.en.toml` and two spots in
   `layouts/index.html` (the homepage's call-to-action links), but confirm with
   a search rather than assuming that's still the full list (swap in whatever
   the previous latest version actually was).

7. **Add a download page.** Create `content/download/<version>.md`, modeled on
   the most recent one that exists. This happens for every released version,
   including patches. Use the real SHA256 checksums from the release artifacts —
   never make these up.

8. **Check your work.** Run `npm run dev` and look at the docs sidebar order,
   the `/docs/community/` redirect, the homepage CTA links, and the new download
   page. Before merging, run `npm run build` once so Pagefind picks up the new
   pages in search.

### Generating the command reference

Don't hand-write the CLI command docs. Run:

```sh
scripts/update-doc.sh <version> <git-tag>
```

It clones that tag of `PlakarKorp/plakar`, pulls the man pages out, and
regenerates `content/docs/community/<version>/references/commands/`.

## Day-to-day dev commands

- First clone: `git clone --recurse-submodules ...`. Already cloned without
  submodules? Run `git submodule update --init --recursive`.
- Install dependencies in **two** places: `themes/blowfish/` and the repo root
  (`npm install` in each).
- `npm run dev` — starts the Hugo server and the Tailwind watcher together.
- `npm run build` — builds Tailwind, then Hugo, then runs Pagefind, in that
  order.
- `act push` — runs the GitHub Actions CI locally.
- Markdown gets formatted by Prettier (`proseWrap: always`, 80-character width —
  see `.prettierrc`).
