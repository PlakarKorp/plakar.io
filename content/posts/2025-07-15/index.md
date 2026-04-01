---
title: "go-kloset-sdk is live!"
summary: "want to craft a ptar archive but you don't need a full-fledged backup solution ? here comes kapsul, our ptar-specific tool, providing all you need from building to restoring and inspecting."
slug: "go-kloset-sdk-is-live"
date: 2025-07-15T20:00:00+0100
authors:
  - "gilles"
tags:
  - plakar
  - ptar
  - backups
  - archive
  - kapsul
category: "technology"
---

Can't really say it’s been that long... but we’re back with exciting new features 😄

## What's an integration ?

Integrations in `plakar` are designed to make backups easier by extending its ability to handle new resources.

They can:

- Provide **storage connectors** (e.g. host a Kloset store on S3, FS, etc.)
- Provide **source connectors** (e.g. import from FTP, IMAP, local FS…)
- Provide **destination connectors** (e.g. restore to SFTP, IMAP, etc.)

You can mix and match them however you like. Backup your local filesystem to S3, restore it to a remote SFTP — no sweat.

> Bonus: We plan to expand integrations even further — think snapshot **data analyzers** (GDPR tagging, email detection…), **custom data viewers** (SQL query explorers!), and more.

Integrations are intentionally lightweight — some of ours were built in under an hour with fewer than 100 lines of Go.

We’re committed to keeping the barrier to entry low, so anyone can create their own with ease — whether you're contributing open source integrations to help grow the plakar ecosystem, or building commercial ones to monetize your work.

## Attention

This feature only works on our development branch for the time being, you can give it a try by installing our latest devel release:

```sh
$ go install github.com/PlakarKorp/plakar@v1.0.3-devel.455ca52
```

## Introducing go-kloset-sdk

We’ve made writing integrations simple — but handling the underlying plumbing for plugins (like GRPC over socketpairs, IPC management, and process orchestration)... not so much. It’s messy, error-prone, and frankly, not something most developers want to deal with.

That’s where `go-kloset-sdk` steps in.

This SDK abstracts all the hard parts. It lets you:

- Write integrations exactly like the builtins
- Package them as standalone plugins with no boilerplate
- Convert *existing* builtins into plugins effortlessly

[Go Kloset SDK GitHub](https://github.com/PlakarKorp/go-kloset-sdk)

It’s still evolving (interface changes may happen), but **you can use it right now** to build powerful plugins without the headache.

## Writing an Integration: Quick Guide

### 1. Implement the Connector Interface

Example: A simple FTP source connector:

```go
func NewFTPImporter(...) (importer.Importer, error)
func (p *FTPImporter) Close() error

// produce the full list of resources to backup
func (p *FTPImporter) Scan() (<-chan *importer.ScanResult, error)

// provide a ReadCloser to a specific resource 
func (p *FTPImporter) NewReader(string) (io.ReadCloser, error)
```

That’s really it. Connect to the resource, expose the data.

### 2. Implement the Connector Interface

Second step is to write a `main.go` that registers the implementation to the SDK:

```go
package main

import (
	"fmt"
	"os"

	"github.com/PlakarKorp/go-kloset-sdk/sdk"
	"github.com/PlakarKorp/integration-ftp/importer"
)

func main() {
	if len(os.Args) != 1 {
		fmt.Printf("Usage: %s\n", os.Args[0])
		os.Exit(1)
	}

	err := sdk.RunImporter(importer.NewFTPImporter);
    if err != nil {
		panic(err)
	}
}
```

### 3. Describe it in a Manifest

```yaml
name: ftp
description: ftp importer
version: 0.1.0
connectors:
- type: importer
  executable: ftpImporter
  homepage: https://github.com/PlakarKorp/integration-ftp
  license: ISC
  protocols: [ftp]
```

### 4. Build the Package

```sh
$ go build -o ftpImporter ./plugin/importer
$ plakar pkg create manifest.yaml
```

You’ll get a `ftp-v0.1.0.ptar` you can install:

```sh
$ plakar pkg add ftp-v0.1.0.ptar
```

And voilà — `ftp://` becomes a fully-supported import source in your setup.

## Say Hello to the IMAP Integration

To celebrate the SDK release, we’re also launching a new [IMAP integration](/integrations/imap)!

![](integration-imap.png)

[IMAP Integration GitHub](https://github.com/PlakarKorp/integration-imap)

It's still early-stage and doesn’t yet support custom AUTH providers, but it already lets you:

### Backup your email:

```sh
$ plakar source add IMAPsrc imap://imap.mydomain.com:143 \
  username=myuser password=mypassword tls=starttls
$ plakar backup @IMAPsrc
```

### Restore your email:

```sh
$ plakar destination add IMAPdst imap://imap.alsomydomain.com:143 \
  username=alsomyuser password=alsomypassword tls=starttls
$ plakar restore -to @IMAPdst <snapid> 
```

Full instructions are available in the integration’s README — we’d love your feedback!

## What's next ?

We’re not done yet — this is just the start.

Expect two more integrations this week, and more in the coming weeks. We already know what’s dropping _tomorrow_ and _Friday_... but we’re keeping it a surprise for now 😏

> ⭐ Star us on [GitHub](https://github.com/PlakarKorp/plakar), join our community on [Discord](https://discord.com/invite/uqdP9Wfzx3), and be part of shaping the future of plakar.

See you tomorrow!

— The Plakar Team
