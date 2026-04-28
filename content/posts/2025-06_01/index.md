---
title: "Plakar v1.0.2 was released: mostly S3 improvements !"
date: 2025-06-03 08:00:00 +0100
authors:
- "gilles"
summary: "Plakar v1.0.2 adds an automatic security check for new critical releases. It also fixes relative-path resolution when using an agent, plus delivers dramatic S3 performance and memory improvements for faster, more reliable backups."
categories:
 - release-notes
featured-scope:
 - hero-page
tags:
 - plakar
 - kloset
 - backups
---

Hello everyone,

Today we’re shipping a small minor release: `v1.0.2`.

It brings an automatic security-update checker,
fixes a relative-path bug when using your agent,
and delivers a 60× speed boost + lower memory usage on S3 backups.

Since many of you rely on S3 daily, we couldn’t wait until a larger release—here’s how to grab it.

--- 
Via Go:

```sh
$ go install github.com/PlakarKorp/plakar@v1.0.2
```

Via installer:

```sh
$ curl https://plakar.io/install.sh | sh
Downloading plakar 1.0.2 signature file...
Downloading plakar 1.0.2 release file...
Downloading plakar 1.0.2 public key...
Verifying plakar 1.0.2 signature...
Signature Verified
plakar-1.0.2.tar.gz: OK
Extracting plakar 1.0.2 release...
Installing plakar 1.0.2...
```

--- 
## What's in that release ?

Nothing too big but four fixes,
two being interesting enough for our community that we want them available to all as soon as possible.


### Security check

Plakar can now check the [releases atom feed](https://plakar.io/api/releases.atom) of our project and warn you if a newer release carries a `reliability` or `security` fix that you should **_really_** install.

![That's if you feel adventurous :-)](nestorjones.png)

We think it's a good option to have for most users,
but if you're not comfortable with this check,
you can turn it off permanently using `plakar -disable-security-check` and live on your own adventurous path.




### Fix for relative pathnames through agent

We spotted a small bug when using relative paths _for a repository_ through the agent.

Plakar has no problem resolving relative paths for backups,
however if the path of the repository was relative **_AND_** the CLI was executed from a directory different from the agent,
then the CWD was incorrectly resolved and the relative path resolution failed.

For example, `plakar at ./foobar backup` could mean `/tmp/foobar` on the CLI but `~gilles/foobar` on the agent.

This is now fixed !

### S3 speed improvements

We have identified a better way for our importer to iterate over "directories" in S3 buckets.

Long story short,
in S3 there's no concept of directories:
we use the `/` character as a path separator and pretend that it creates nested objects when they are really flat at the top level.

What we had initially overlooked is that the MinIO client supports a recursive listing option,
which handles the prefix-based “directory” emulation more efficiently than our custom logic.
This drastically improves the performances of listing resources.

In his test case,
he observed an impressive `x60` performance boost on a backup over S3,
reducing a backup that took **~14 minutes** to **~13 seconds**.

This by itself was worthy of a minor release :-)


### S3 memory improvements

One of our users,
[@anbcorp](https://github.com/Anbcorp) reported an OOM kill when doing backups.

We setup a few tests and quickly identified that it only affected the S3 storage backend,
but oddly enough it didn't trigger on my machine or that of another developer.
It only took a few minutes of profiling to figure out what was happening:

When we do not know the size of a file,
the `minio` client library does a big allocation (512MB).
The problem is that not only do we not know the size of some files before they are pushed,
but we also parallelize quite a bit,
leading the client library to perform a lot of big allocations.

This isn't an issue when you have a few number of cores (low parallelism) or a large amount of memory (can handle the big allocations),
but if you have a large number of cores and low memory (that was @anbcorp's case),
you end up parallelizing a large number of huge allocations until you get terminated.

This only affects one specific call in the storage backend,
which is the only one where we don't know the size of files and use heavy parallelization,
but we found a fix that solves this issue and manages to avoid the code path that does the big allocations.

This was confirmed to fix the issue,
and was also by itself a good reason to make a minor release.


--- 

## What's next ?

We'll be talking about the capabilities of PTAR,
our own archiving format,
very soon on this blog.

Stay tuned !


--- 

## Community

Want to help us ?

- <a class="github-button" href="https://github.com/PlakarKorp/plakar" data-color-scheme="no-preference: light; light: light; dark: light;" data-icon="octicon-star" aria-label="Star PlakarKorp/plakar on GitHub">Star</a> us on Github (yes, it matters !)

- Join our developers and users on [Discord](https://discord.gg/uuegtnF2Q5)

Special thanks to all early users, contributors, and supporters who have helped shape this first release—your involvement has been invaluable!

