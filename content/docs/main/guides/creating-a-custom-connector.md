---
title: "Creating a custom connector"
date: "2026-04-16T00:00:00Z"
weight: 7
summary: "Step-by-step guide to implement and install your own Plakar connector (importer) in Go."
---

# Creating a custom connector

This guide shows how to create a custom Plakar **Importer** connector in Go, build it, package it, and install it using the `plakar` CLI.

## Why write a custom connector?

Plakar ships with connectors for common sources and storage backends. When you need to back up something that isn't supported out of the box such as an internal database thats not commonly used or a custom data source, you can write your own connector in Go and install it like any other package.

## What you will build

A minimal Importer connector that backs up a single hardcoded file. This is the simplest possible integration — once you understand the pattern, you can extend it to walk directories, read from APIs, or consume any other data source.

## Prerequisites

- Go 1.21 or later
- `plakar` installed and available in your `$PATH`

## 1. Set up the project

Create a new Go module for your plugin:

```bash
mkdir plakar-myimporter
cd plakar-myimporter
go mod init github.com/yourorg/plakar-myimporter
```

Install the two required dependencies:

```bash
go get github.com/PlakarKorp/kloset
go get github.com/PlakarKorp/go-kloset-sdk
```

Create the project structure:

```
plakar-myimporter/
├── connector.go
├── importer/
│   └── main.go
├── manifest.yaml
├── Makefile
├── go.mod
└── go.sum
```

## 2. Implement the connector

Create `connector.go`:

```go
package connector

import (
	"context"
	"io"
	"os"
	"path/filepath"

	"github.com/PlakarKorp/kloset/connectors"
	"github.com/PlakarKorp/kloset/connectors/importer"
	"github.com/PlakarKorp/kloset/location"
	"github.com/PlakarKorp/kloset/objects"
)

const FILE = "/home/user/Documents/notes.md"

func init() {
	importer.Register("test", location.FLAG_LOCALFS, NewImporter)
}

type testConnector struct{}

func NewImporter(ctx context.Context, opts *connectors.Options, proto string, config map[string]string) (importer.Importer, error) {
	return &testConnector{}, nil
}

func (f *testConnector) Root() string              { return filepath.Dir(FILE) }
func (f *testConnector) Origin() string            { return "localhost" }
func (f *testConnector) Type() string              { return "test" }
func (f *testConnector) Flags() location.Flags     { return location.FLAG_LOCALFS }
func (f *testConnector) Ping(_ context.Context) error  { return nil }
func (f *testConnector) Close(_ context.Context) error { return nil }

func (f *testConnector) Import(ctx context.Context, records chan<- *connectors.Record, results <-chan *connectors.Result) error {
	defer close(records)

	info, err := os.Stat(FILE)
	if err != nil {
		return err
	}

	fi := objects.FileInfo{
		Lname:    filepath.Base(FILE),
		Lsize:    info.Size(),
		Lmode:    info.Mode(),
		LmodTime: info.ModTime(),
		Ldev:     1,
	}

	records <- connectors.NewRecord(FILE, "", fi, nil, func() (io.ReadCloser, error) {
		return os.Open(FILE)
	})

	return nil
}
```

> [!WARNING]+ Writing to console
> Never write to `os.Stdout`. Plakar communicates with the plugin over gRPC through stdin/stdout — any writes there corrupt the stream. Use `os.Stderr` for debug output instead.

## 3. Create the entrypoint

Create `importer/main.go`:

```go
package main

import (
	"os"

	sdk "github.com/PlakarKorp/go-kloset-sdk"
	connector "github.com/yourorg/plakar-myimporter"
)

func main() {
	sdk.EntrypointImporter(os.Args, connector.NewImporter)
}
```

## 4. Write the manifest

Create `manifest.yaml`:

```yaml
name: test
display_name: Test
description: A minimal importer connector that backs up a single file.
homepage: https://github.com/yourorg/plakar-myimporter
license: ISC
api_version: v1.1.0
version: v0.1.0
tier: third-party
contact: mailto:you@example.com
tags: [filesystem]
connectors:
  - type: importer
    executable: test-importer
    protocols: [test]
    location_flags: [localfs]
    class: filesystem
    subclass: test
    validator: ./importer/schema.json
    args: []
    extra_files: []
```

Not all fields are required for every integration. `tags` is optional metadata used for discovery. Under each connector, `validator` is only needed if your connector accepts a configuration schema; `args` and `extra_files` can be omitted entirely if you have no additional arguments to pass to the executable or no supplementary files to bundle. A minimal connector entry needs only `type`, `executable` and `protocols`.

The `executable` value must match the binary name you produce in the build step. The `location_flags` list must reflect the `location.Flags` returned by your connector's `Flags()` method. Set `class` and `subclass` to values that best describe your data source — for a connector that reads from a local filesystem path, `filesystem` and your protocol name are appropriate choices.

## 5. Build the plugin

Create a `Makefile`:

```makefile
build:
	go build -o test-importer ./importer
```

Then build:

```bash
make build
```

## 6. Package and install

Package the plugin into a `.ptar` file:

```bash
plakar pkg create
```

Install it:

```bash
plakar pkg add test-v0.1.0.ptar
```

Verify the installation:

```bash
plakar pkg show
```

You should see `test` listed.

## 7. Use the connector

Back up using your new importer:

```bash
plakar at /var/backups backup test://
```

Because this connector uses a hardcoded file path, the location after `test://` is ignored — the importer always reads from `/home/user/Documents/notes.md`.

## Next steps

**Walking a directory** — instead of a hardcoded path, parse the location from the `config` map (`strings.TrimPrefix(config["location"], proto+"://")`) and use `filepath.WalkDir` to send a record for each file.

**Remote sources** — for connectors that talk to an API, use `0` as the flags value instead of `location.FLAG_LOCALFS`, and parse credentials and endpoints from the `config` map passed to your constructor.

**Streaming imports** — if your source cannot be replayed (e.g. reading from a pipe or tarball), add `location.FLAG_STREAM` to your flags. Plakar will disable the progress bar and call `Import` only once.

**Adding an Exporter or Storage backend** — implement the `Exporter` or `Store` interface, register it in `init()`, add a corresponding entrypoint directory, and add an entry to `manifest.yaml`.

See the [SDK reference](../../references/sdk) and the [integration example repository](https://github.com/PlakarKorp/integration-example) for the full interface definitions and a complete working implementation.
