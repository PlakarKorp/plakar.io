---
title: "Creating a Custom Connector"
summary: "Step-by-step guide to implement and install your own Plakar connector (importer) in Go."
date: "2025-08-21"
last_reviewed: "2026-03-06"
last_reviewed_version: "v1.1.0"
weight: 7
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

This guide shows how to create a custom Plakar **Importer** connector in Go, build it, package it, and install it using the `plakar` CLI.

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

{{% notice style="warning" title="Writting to console" expanded="true" %}}
Never write to `os.Stdout`. Plakar communicates with the plugin over gRPC through stdin/stdout — any writes there corrupt the stream. Use `os.Stderr` for debug output instead.
{{% /notice %}}

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
version: v0.1.0

connectors:
  - type: importer
    executable: test-importer
    protocols:
      - test
    flags:
      - localfs
```

The `executable` value must match the binary name you produce in the build step. The `flags` list must reflect the `location.Flags` returned by your connector's `Flags()` method.

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
