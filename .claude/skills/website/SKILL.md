---
name: website
description: >
  Conventions for working on the plakar.io Hugo website. Use this skill whenever
  modifying documentation, layouts, assets, integrations, configuration, or
  releasing a new documentation version.
---

# Working on plakar.io

Hugo site using the Blowfish theme, Tailwind CSS and Pagefind. For writing
style, use the `docs` skill.

## Theme

- Never edit `themes/blowfish/`. It is a git submodule and changes are lost on
  update. To change a template, copy it to the same path under `layouts/` and
  edit the copy. Check first whether `layouts/` already overrides it.
- Before new work, sync `main` with PlakarKorp and run
  `git submodule update --init --recursive`. If `git status` then shows
  `M themes/blowfish`, run it again. Bump the submodule only in a dedicated PR.

## JavaScript and assets

Files under `assets/js/` are not included automatically.

- Scripts needed on every page go in `assets/js/main/`, bundled from
  `layouts/partials/extend-head.html`.
- Docs-only scripts go in `assets/js/docs/` and must be added to the bundles in
  both `layouts/docs/list.html` and `layouts/docs/single.html`.

Load images, icons and CSS with `resources.Get`, never a hardcoded path such as
`/img/logo.svg`, so Hugo can fingerprint them.

## Content

| Path                                        | Notes                                                                                           |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `content/docs/community/<version>/`         | `main` tracks development. One directory per `major.minor`, e.g. `v1.1.0` covers every `v1.1.x` |
| `content/docs/control-plane/`               | Not versioned                                                                                   |
| `content/integrations/<name>.md`            | Marketing landing page, image at `assets/img/integrations/<name>.png`                           |
| `content/docs/community/main/integrations/` | Technical integration docs                                                                      |
| `content/posts/<date>/`                     | Blog posts, authors in `data/authors/`                                                          |
| `content/download/<version>.md`             | One page per release, patch releases included                                                   |

The version selector is built from the directories under
`content/docs/community/` and ordered by `weight` in each version's `_index.md`.

### Integrations

- Copy an existing integration page instead of inventing front matter. Link the
  technical docs with `links:` entries of `type: community` or
  `type: control-plane`.
- New integrations only need technical docs in `main`. Do not backport unless
  asked.
- If an integration is another implementation of an existing connector, reuse
  its technical docs.

## Releasing documentation

A new `major.minor` (`v1.2.0`, `v2.0.0`) gets a new directory. A patch release
(`v1.2.3`) updates the existing directory for its `major.minor`.

1. For a new `major.minor`, copy the previous version directory and review every
   page. Copied content is not assumed correct.
2. Regenerate the command reference with
   `scripts/update-cli-doc.sh <version> <git-tag>`. Never edit
   `references/commands/` by hand.
3. Set the new version's `weight` and shift the older ones.
4. Point `redirectTo` in `content/docs/community/_index.md` to the new version.
5. Search the repository for links to the previous version and update the ones
   that should follow the latest release.
6. Create `content/download/<version>.md` from the latest one, with the real
   SHA256 checksums. Never invent release metadata. The highest version is
   marked latest automatically.
7. Check the version selector, ordering, the `/docs/community/` redirect,
   homepage docs links and the download page with `npm run dev`, then run
   `npm run build` so Pagefind indexes the new content.

## Checks

Run before opening a PR: `npm run format`, `npm run codespell` and
`npm run check:links`. CI runs the link check and codespell on every PR.
