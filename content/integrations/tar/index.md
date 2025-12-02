---
title: Tar
subtitle: Import content from tarball files, produce tarballs from snapshots and klosets
description: Import content from tarball files, produce tarballs from snapshots and klosets
technology_description: tar is a widespread archiving format with optionall compression, mostly found in UNIX systems.
categories:
  - source connector
  - viewer
tags:
- tar
stage: stable
date: 2025-05-13
---

# TAR Integration

## Overview

The **TAR integration** allows to import data into a Kloset from a tarball.
This integration is bundled with Plakar since 1.0.3.

## Configuration

The **TAR integration** does not require any special configuration.

## Example Usage

To back up, you can use the following commands which will copy the content of the stdio stream to a file named `passwd` within the snapshot:

```sh
$ plakar at /var/backups backup tgz:foobar.tar.gz
```

In case of a plain, non compressed tarball, use:

```sh
$ plakar at /var/backups backup tar:foobar.tar
```



See the [QuickStart guide](https://docs.plakar.io/en/quickstart/index.html) for more examples.

## Questions, Feedback, and Support

Found a bug? [Open an issue on GitHub](https://github.com/PlakarKorp/plakar/issues/new?title=Bug%20report%20on%20tar%20integration&body=Please%20provide%20a%20detailed%20description%20of%20the%20issue.%0A%0A**Plakar%20version**)

Join our [Discord community](https://discord.gg/uuegtnF2Q5) for real-time help and discussions.
