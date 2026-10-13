---
title: "Creating a custom integration"
date: "2026-04-16T00:00:00Z"
weight: 7
summary:
  "Step-by-step guide to implement and install your own Plakar integration in
  Go."
aliases:
  - /docs/main/guides/creating-a-custom-integration/
  - /docs/main/guides/creating-a-custom-connector/
  - /docs/community/main/guides/creating-a-custom-connector/
---

# Creating a custom integration

This guide shows how to create a custom Plakar integration in Go, build it,
package it, and install it using the `plakar` CLI.

An integration is a package of one or more connectors. An importer connector
reads data from a source during backup, an exporter connector writes it to a
destination during restore, and a storage connector hosts a repository.

## Why write a custom integration?

Plakar ships with integrations for common sources and storage backends. When you
need to back up something that isn't supported out of the box, such as an
internal database or a custom data source, you can write your own integration in
Go and install it like any other package.

## What you will build

An integration with a single importer connector that backs up one hardcoded
file. Once you understand the pattern, you can extend it to walk directories,
read from APIs, or consume any other data source.

The guide follows the layout of the
[example integration](https://github.com/PlakarKorp/integrations/tree/main/example),
which also implements an exporter and a storage backend.

## Prerequisites

- Go 1.25 or later
- `plakar` installed and available in your `$PATH`

{{< steps >}}

{{< step >}}

## Set up the project

Create a new Go module for your integration:

```bash
mkdir plakar-example
cd plakar-example
go mod init github.com/yourorg/plakar-example
```

Install the two required dependencies:

```bash
go get github.com/PlakarKorp/go-kloset-sdk
go get github.com/PlakarKorp/kloset
```

Create the project structure:

```
.
├── connector.go        # Connector implementation
├── cmd/
│   └── importer/
│       └── main.go     # Importer entry point
├── manifest.yaml       # Manifest describing the integration
├── Makefile            # Build and packaging targets
├── go.mod
└── go.sum
```

{{< /step >}}

{{< step >}}

## Implement the connector

Create `connector.go`:

```go
package connector

import (
	"context"
	"io"
	"os"
	"path/filepath"

	"github.com/PlakarKorp/kloset/connectors"
	"github.com/PlakarKorp/kloset/location"
	"github.com/PlakarKorp/kloset/connectors/importer"
	"github.com/PlakarKorp/kloset/objects"
)

const FILE = "/home/user/Documents/notes.md"

type testConnector struct{}

func NewImporter(ctx context.Context, opts *connectors.Options, proto string, config map[string]string) (importer.Importer, error) {
	return &testConnector{}, nil
}

func (f *testConnector) Root() string                  { return filepath.Dir(FILE) }
func (f *testConnector) Origin() string                { return "localhost" }
func (f *testConnector) Type() string                  { return "example" }
func (f *testConnector) Flags() location.Flags         { return location.FLAG_LOCALFS }
func (f *testConnector) Ping(_ context.Context) error  { return nil }
func (f *testConnector) Close(_ context.Context) error { return nil }

func (f *testConnector) Import(ctx context.Context, records chan<- *connectors.Record, results <-chan *connectors.Result) error {
	defer close(records)

	info, err := os.Stat(FILE)
	if err != nil {
		records <- connectors.NewError(FILE, err)
		return nil
	}

	fi := objects.FileInfo{
		Lname:    filepath.Base(FILE),
		Lsize:    info.Size(),
		Lmode:    info.Mode(),
		LmodTime: info.ModTime(),
	}

	records <- connectors.NewRecord(FILE, "", fi, nil, func() (io.ReadCloser, error) {
		return os.Open(FILE)
	})

	return nil
}
```

`FLAG_LOCALFS` tells Plakar the location is a local filesystem path. A file that
cannot be read is reported with `connectors.NewError()` rather than failing the
whole backup.

> [!WARNING]+ Writing to the console
>
> Never write to `os.Stdout`. Plakar communicates with the connector over gRPC
> through stdin and stdout, so any writes there corrupt the stream. Use
> `os.Stderr` for debug output instead.

{{< /step >}}

{{< step >}}

## Create the entry point

Create `cmd/importer/main.go`:

```go
package main

import (
	"context"
	"os"

	sdk "github.com/PlakarKorp/go-kloset-sdk"
	connector "github.com/yourorg/plakar-example"
)

func main() {
	ctx := sdk.InterruptableContext(context.Background())
	sdk.EntrypointImporter(ctx, os.Args, connector.NewImporter)
}
```

`InterruptableContext` cancels the context when the process receives an
interrupt, so the connector stops cleanly.

{{< /step >}}

{{< step >}}

## Write the manifest

Create `manifest.yaml`:

```yaml
name: example
description: A minimal integration that backs up a single file.
homepage: https://github.com/yourorg/plakar-example
license: ISC
connectors:
  - type: importer
    executable: ./example-importer
    protocols: [example]
    location_flags: [localfs]
```

The manifest describes the integration and each connector it contains. The
`executable` value must match the binary produced in the build step. The
`location_flags` list must match the flags returned by the connector's `Flags()`
method.

See the [manifest reference](../../references/commands/plakar-pkg-manifest.yaml)
for the optional fields.

{{< /step >}}

{{< step >}}

## Build the integration

Create a `Makefile`:

```makefile
GO      = go
PLAKAR  = plakar
VERSION = v1.0.0

all: build

build:
	${GO} build -o example-importer ./cmd/importer

package: build
	rm -f example_${VERSION}_*.ptar
	${PLAKAR} pkg create ./manifest.yaml ${VERSION}

uninstall:
	-${PLAKAR} pkg rm example

install: package
	${PLAKAR} pkg add -allow-unsigned ./example_${VERSION}_*.ptar

reinstall: uninstall install

clean:
	rm -f example-importer example_${VERSION}*.ptar

.PHONY: all build package uninstall install reinstall clean
```

{{< /step >}}

{{< step >}}

## Package and install

Package and install the integration in one step:

```bash
make install
```

This builds the binary, runs `plakar pkg create` to produce
`example_v1.0.0_<os>_<arch>.ptar`, and installs it with `plakar pkg add`. A
local build is unsigned, so the `install` target passes `-allow-unsigned`.

To update an existing installation:

```bash
make reinstall
```

This removes the previously installed package with `plakar pkg rm` before
installing the new one.

Verify the installation:

```bash
plakar pkg show
```

You should see `example` listed.

{{< /step >}}

{{< step >}}

## Use the integration

Back up using your new importer:

```bash
plakar at /var/backups backup example://
```

Because this importer uses a hardcoded file path, the location after
`example://` is ignored. The importer always reads from
`/home/user/Documents/notes.md`.

{{< /step >}}

{{< /steps >}}

## Next steps

**Walking a directory.** Instead of a hardcoded path, parse the location from
the `config` map (`strings.TrimPrefix(config["location"], proto+"://")`) and use
`filepath.WalkDir` to send a record for each file.

**Remote sources.** For connectors that talk to an API, use `0` as the flags
value instead of `location.FLAG_LOCALFS`, and parse credentials and endpoints
from the `config` map passed to your constructor.

**Streaming imports.** If your source cannot be replayed, such as a pipe, add
`location.FLAG_STREAM` to your flags. Plakar then calls `Import` only once.

**Adding exporter or storage connectors.** Implement the `Exporter` or `Store`
interface, add an entry point under `cmd/`, and add a connector entry to
`manifest.yaml`.

See the [SDK reference](../../references/go-kloset-sdk) for the full interface
definitions and the
[example integration](https://github.com/PlakarKorp/integrations/tree/main/example)
for a working importer, exporter, and storage backend.
