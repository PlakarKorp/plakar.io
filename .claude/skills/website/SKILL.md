---
name: website
description: >
  Conventions for working on the plakar.io Hugo website. Use this skill whenever
  modifying documentation, layouts, assets, integrations, configuration, or
  releasing a new documentation version.
---

# Working on plakar.io

This repository contains the **plakar.io** website, built with **Hugo** using
the **Blowfish** theme.

This skill documents the project conventions that should be followed when
working on the website.

---

# Theme Customization

## Never edit `themes/blowfish/`

The Blowfish theme is included as a git submodule.

Changes made inside `themes/blowfish/` will be lost when the submodule is
updated.

To customize the theme:

1. Check whether the template is already overridden under `layouts/`.
2. If not, copy the template into `layouts/` using the same relative path.
3. Modify the copy instead of the file inside `themes/blowfish/`.

Hugo automatically prefers templates in `layouts/` over those provided by the
theme.

---

# JavaScript

JavaScript is bundled using Hugo's asset pipeline.

Adding a file under `assets/js/` does **not** automatically include it in the
site.

## Global scripts

Global scripts belong in:

```
assets/js/main/
```

They are bundled from:

```
layouts/partials/extend-head.html
```

Use this location only for functionality required on every page.

## Documentation scripts

Documentation-only scripts belong in:

```
assets/js/docs/
```

They must be added to the bundles defined in both:

- `layouts/docs/list.html`
- `layouts/docs/single.html`

Adding the file alone is not enough.

If a script is only added to one template, documentation pages will behave
inconsistently.

---

# Assets

Reference images, icons, CSS and other assets using Hugo resources:

```go
resources.Get
```

Avoid hardcoded asset paths such as:

```
/img/logo.svg
```

Using Hugo resources enables fingerprinting and cache busting.

---

# Content Structure

## Community documentation

```
content/docs/community/
```

Community documentation is versioned.

Structure:

```
main/
v1.0.5/
v1.0.6/
v1.1.0/
...
```

`main` always tracks the development branch.

A new version directory is created **only for minor releases** (for example,
`v1.2.0`). Patch releases (such as `v1.2.1` or `v1.2.5`) reuse the existing
directory for that minor release.

Each released version contains the same general structure:

- quickstart
- guides
- explanations
- references
- integrations

The version selector is generated automatically from the directories under
`content/docs/community/`.

Version ordering is controlled by the `weight` field in each version's
`_index.md`.

---

## Control Plane documentation

```
content/docs/control-plane/
```

Control Plane documentation is **not versioned**.

---

## Marketing integrations

```
content/integrations/
```

These pages are marketing landing pages.

Their technical documentation normally lives under:

```
content/docs/community/{version}/integrations/
```

where `{version}` is either `main` (development) or a released documentation
version.

and is referenced using:

```
technical_documentation_link
```

### Integration guidelines

- New integrations only require technical documentation in `main`.
- Do not backport documentation unless explicitly requested.
- If an integration is simply another implementation of an existing connector,
  reuse the existing technical documentation instead of duplicating it.
- Base new integration pages on an existing one rather than inventing new front
  matter fields.
- Every integration requires an image:

```
assets/img/integrations/<name>.png
```

Without an image, the integration will not appear in the integrations grid.

---

## Blog posts

Blog posts live under:

```
content/posts/
```

Each post has its own directory.

Author information is stored under:

```
data/authors/
```

---

## Download pages

Download pages live under:

```
content/download/
```

Every released version, including patch releases, requires its own download
page.

Unlike documentation, download pages are **not** grouped by minor version.

---

# Releasing Documentation

Follow every step when publishing a new documentation version.

## 1. Determine the release type

### Minor release

Example:

```
v1.2.0
```

Create a new documentation directory under:

```
content/docs/community/
```

### Patch release

Example:

```
v1.2.3
```

Do **not** create another documentation directory.

Instead, update the existing documentation directory for that minor release,
which represents the entire release series.

---

## 2. Create or update documentation

For a new minor version:

- Copy the previous version directory.
- Regenerate the CLI command reference.
- Review every copied page and update any content that has changed.

Do not assume copied documentation is still correct.

---

## 3. Regenerate the command reference

Never edit CLI command documentation manually.

Run:

```bash
scripts/update-doc.sh <version> <git-tag>
```

This regenerates:

```
content/docs/community/<version>/references/commands/
```

---

## 4. Update version ordering

Documentation versions are ordered using the `weight` field in each version's
`_index.md`.

When introducing a new released version:

- assign the new version the appropriate weight
- adjust the weights of older versions accordingly

Otherwise the version selector will appear in the wrong order.

---

## 5. Update the latest version

Update:

```
config/_default/params.toml
```

Set:

```
latestVersion
```

to the latest released version.

---

## 6. Update the documentation redirect

Update:

```
content/docs/community/_index.md
```

Modify:

```
redirectTo
```

so it points to the latest documentation.

---

## 7. Update hardcoded version links

Search the repository for links referencing the previous documentation version.

Update any hardcoded version links that should now point to the latest release.

Do not rely on a fixed list of files—always search the repository.

---

## 8. Create a download page

Create:

```
content/download/<version>.md
```

using the latest release as a template.

Always use the actual release SHA256 checksums.

Never invent release metadata.

---

## 9. Verify the release

Run:

```bash
npm run dev
```

Verify:

- documentation version selector
- version ordering
- `/docs/community/` redirect
- homepage documentation links
- download page

Finally run:

```bash
npm run build
```

before merging so Pagefind indexes the new content.

---

# Development

Clone the repository:

```bash
git clone --recurse-submodules ...
```

If the repository was cloned without submodules:

```bash
git submodule update --init --recursive
```

Install dependencies in both:

- the repository root
- `themes/blowfish/`

Start the development server:

```bash
npm run dev
```

Build the site:

```bash
npm run build
```

Run GitHub Actions locally:

```bash
act push
```

Markdown is formatted with Prettier using the repository configuration.
