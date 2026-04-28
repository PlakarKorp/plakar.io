# What's plakar ?

`plakar` is a **free** and [opensource](https://github.com/PlakarKorp/plakar) utility to create
**distributed**, **versioned** **backups** with **compression**, **encryption** and data **deduplication**.

With a very clear goal to simplify backups,
it is designed to be **straightforward** to use.
It requires a few seconds to install and only a few minutes to get backups set up and running:
creating a backup is as simple as typing `plakar backup` and restoring as simple as typing `plakar restore`.

`plakar` is written in [Golang](https://go.dev),
developed primarily on [macOS](https://www.apple.com/macos/) and [OpenBSD](https://www.OpenBSD.org),
tested on several [Linux](https://fr.wikipedia.org/wiki/Linux) systems,
and should work on most modern Unix-like system.


## How does it work ?

**Data collection:** Plakar scans and collects data from specified sources, such as directories or files, that need to be backed up.

**Deduplication:** As it processes data, Plakar identifies and removes duplicate chunks of data. This means only unique data is stored, reducing the overall storage requirements.

**Compression:** The unique data chunks are then compressed to save even more space.

**Encryption:** After compression, the data is encrypted to ensure security and privacy. This step makes sure that only authorized users can access the backed-up data.

**Storage Management:** Plakar stores the processed data in a structured repository. It keeps track of metadata and versions, allowing users to efficiently access, restore, and manage backups.

**Restoration:** When needed, Plakar can restore files or directories from the backup repository. Since it knows the structure and contents of each backup, it can quickly rebuild the requested data.

This design makes Plakar efficient in terms of storage and performance, while also providing strong data security and integrity.


## License

It is distributed under the OpenBSD license, as follows:

```text
Copyright (c) 2021 Gilles Chehade <gilles@poolp.org>

Permission to use, copy, modify, and distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

Or put simpler:
do whatever you want with it as long as you retain this copyright,
and use at your own risks.


## Current state

At this stage of development,
it is not yet suitable for production but can definitely be used for testing and validation purposes.


## Requirements

It requires Go 1.23.3 or higher.


## Installation

Until a first version is released and packaged,
`plakar` may be installed via the following methods.


### Go installer

```sh
go install github.com/PlakarKorp/plakar@latest
```


## Discussions

Discussions and questions regarding the project can take place at [Github discussions](https://github.com/orgs/PlakarKorp/discussions),
or on the [Discord channel](https://discord.gg/uuegtnF2Q5).
