---
title: "Plakar v1.1.5 is out"
date: 2026-09-06T12:00:00+0100
authors:
  - "gilles"
summary:
  "plakar v1.1.5 is out: a security-focused patch release. Unencrypted stores
  are now refused unless you explicitly opt in, plugins are signature-checked
  at install time, and the HTTP store and server got hardened. Fully backward
  compatible, nothing to migrate."
categories:
  - announcement
  - release-notes
  - community
tags:
  - plakar
  - open-source
  - release
---

**plakar v1.1.5 is out !**

It is a patch release on the v1.1 series with one clear theme: **security
hardening**. No new store format, no migration, nothing to do on your side.
Upgrade and keep snapshotting.

Two changes deserve more than a bullet point though.

## Plaintext now requires your explicit consent

Plakar encrypts everything by default, and always has. But it also supports
unencrypted stores, and until now it would quietly work with one if that is
what the configuration said.

Starting with v1.1.5, **every command refuses to touch an unencrypted store**
unless `PLAKAR_INSECURE_PLAINTEXT` is set in the environment. Plaintext stores
still work, for testing, debugging, or the rare setup that genuinely wants
one, but you now have to say so, out loud, every time. A misconfiguration
becomes a loud failure.

If you run a plaintext store on purpose, add the variable to your environment
and carry on. Everyone else: this change is invisible, exactly as it should
be.

## Plugins are now signed

The package manager introduced in v1.1 made it trivial to extend plakar with
integrations.

As of v1.1.5, **packages are signature-checked at install time**. `plakar pkg
add` verifies the signature before anything lands on disk, and refuses
unsigned packages by default. If you are developing an integration or have a
reason to trust an unsigned package, `plakar pkg add -allow-unsigned` opts
out, explicitly, and only for that install.

Together with the new `-devel` flag on `plakar pkg add` and `plakar pkg show`,
this draws a clean line between the signed packages everyone installs and the
development tree integration authors work from.

## Also in this release

More hardening in the same spirit:

- `plakar server` accepts `-token` to require an Authorization Bearer token
  from clients, and now logs requests.
- The http and https stores gained `auth_token`, `insecure`, `timeout` and
  `tls_no_verify` options; sending a token over plaintext HTTP requires
  `insecure=true`, and https→http redirects are rejected. Details in
  [plakar-store(1)](/docs/community/v1.1.0/references/commands/plakar-store/#HTTP_AND_HTTPS_STORE_OPTIONS).
- `sync` no longer hands the peer passphrase down to the peer store connector,
  and restores are confined to the target directory.

And a solid batch of fixes: a FIFO no longer stalls a backup, restores bring
back file permissions and hardlinks correctly, the UI browses cold-storage
(Glacier) repositories again, and backup errors now report their real cause
instead of a bare cancellation. The full list is in the
[release notes](https://github.com/PlakarKorp/plakar/releases/tag/v1.1.5).

## Upgrading

Grab v1.1.5 from the [download page](/download/?version=v1.1.5) or through your
package manager. Existing stores keep working as-is: this release is fully
backward compatible with the v1.1 series.
