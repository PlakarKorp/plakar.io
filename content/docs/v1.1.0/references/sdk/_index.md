---
date: "2026-02-24T00:00:00Z"
title: "SDK"
last_reviewed: "2026-02-24"
last_reviewed_version: "v1.1.0"
summary: "Go SDK reference for building Plakar integrations"
weight: 3
---
*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

## Overview

The Go Kloset SDK enables building Plakar integrations as standalone plugins. Plugins communicate with Plakar over gRPC through stdin/stdout and can provide:

- **Importers** - Read data from sources (used during backup)
- **Exporters** - Write data to destinations (used during restore)
- **Storage** - Custom storage backends for repositories

## Installation

```bash
go get github.com/PlakarKorp/go-kloset-sdk
```

## Entry Points

### EntrypointImporter

```go
func EntrypointImporter(args []string, constructor ImporterConstructor)
```

Entry point for importer plugins. Call from `main()`.

**Example:**
```go
package main

import (
  "os"
  sdk "github.com/PlakarKorp/go-kloset-sdk"
  connector "github.com/yourorg/integration"
)

func main() {
  sdk.EntrypointImporter(os.Args, connector.NewImporter)
}
```

### EntrypointExporter

```go
func EntrypointExporter(args []string, constructor ExporterConstructor)
```

Entry point for exporter plugins.

**Example:**
```go
package main

import (
  "os"
  sdk "github.com/PlakarKorp/go-kloset-sdk"
  connector "github.com/yourorg/integration"
)

func main() {
  sdk.EntrypointExporter(os.Args, connector.NewExporter)
}
```

### EntrypointStorage

```go
func EntrypointStorage(args []string, constructor StoreConstructor)
```

Entry point for storage backend plugins.

**Example:**
```go
package main

import (
  "os"
  sdk "github.com/PlakarKorp/go-kloset-sdk"
  connector "github.com/yourorg/integration"
)

func main() {
  sdk.EntrypointStorage(os.Args, connector.NewStore)
}
```

## Importer Interface

### Registration

```go
func Register(protocol string, flags location.Flags, constructor Constructor)
```

Register an importer. Call in `init()`.

**Example:**
```go
func init() {
  importer.Register("myprotocol", 0, NewImporter)
}
```

### Constructor

```go
type Constructor func(
  ctx context.Context,
  opts *connectors.Options,
  proto string,
  config map[string]string,
) (Importer, error)
```

**Parameters:**
- `ctx` - Context for cancellation
- `opts` - Configuration options (excludes, hostname, max concurrency)
- `proto` - Protocol name
- `config` - Configuration map with `location` and other parameters

### Interface Methods

```go
type Importer interface {
  Root() string
  Origin() string
  Type() string
  Flags() location.Flags
  Ping(ctx context.Context) error
  Import(ctx context.Context, records chan<- *connectors.Record, results <-chan *connectors.Result) error
  Close(ctx context.Context) error
}
```

#### Root

Returns the root path being imported.

#### Origin

Returns the origin/source identifier (e.g., hostname, bucket name).

#### Type

Returns the protocol name.

#### Flags

Returns location flags describing characteristics:

- `0` - Remote/network sources
- `location.FLAG_LOCALFS` - Local filesystem
- `location.FLAG_STREAM` - Single-use import (disables progress bar)
- `location.FLAG_NEEDACK` - Reads from results channel

Combine with bitwise OR: `location.FLAG_LOCALFS | location.FLAG_STREAM`

#### Ping

Tests source connectivity before import begins.

#### Import

Main import function. Sends file records through channel.

**Important:**
- Always `defer close(records)` at start
- Ignore `results` unless `FLAG_NEEDACK` is set

**Example:**
```go
func (i *MyImporter) Import(ctx context.Context, records chan<- *connectors.Record, results <-chan *connectors.Result) error {
  defer close(records)

  info, _ := os.Stat(path)
  fi := objects.FileInfo{
    Lname:    filepath.Base(path),
    Lsize:    info.Size(),
    Lmode:    info.Mode(),
    LmodTime: info.ModTime(),
    Ldev:     1,
  }

  records <- connectors.NewRecord(path, "", fi, nil, func() (io.ReadCloser, error) {
    return os.Open(path)
  })

  return nil
}
```

#### Close

Cleanup function called after import completes.

## Exporter Interface

### Registration

```go
func Register(protocol string, flags location.Flags, constructor Constructor)
```

Register an exporter. Call in `init()`.

### Constructor

```go
type Constructor func(
  ctx context.Context,
  opts *connectors.Options,
  proto string,
  config map[string]string,
) (Exporter, error)
```

### Interface Methods

```go
type Exporter interface {
  Root() string
  Origin() string
  Type() string
  Flags() location.Flags
  Ping(ctx context.Context) error
  Export(ctx context.Context, records <-chan *connectors.Record, results chan<- *connectors.Result) error
  Close(ctx context.Context) error
}
```

Methods are identical to Importer except for `Export()`.

#### Export

Receives records from channel and processes them.

**Important:**
- Always `defer close(results)` at start
- Send result for each record: `record.Ok()` or `record.Error(err)`
- `record.Ok()` and `record.Error()` close the reader automatically

**Example:**
```go
func (e *MyExporter) Export(ctx context.Context, records <-chan *connectors.Record, results chan<- *connectors.Result) error {
  defer close(results)

  for record := range records {
    if record.Reader != nil {
      // Process record content
      io.Copy(destination, record.Reader)
    }

    results <- record.Ok()
  }

  return nil
}
```

## Storage Interface

### Registration

```go
func Register(protocol string, flags location.Flags, constructor Constructor)
```

Register a storage backend. Call in `init()`.

### Constructor

```go
type Constructor func(
  ctx context.Context,
  proto string,
  config map[string]string,
) (Store, error)
```

Note: Storage constructor does not receive `*connectors.Options`.

### Interface Methods

```go
type Store interface {
  Create(ctx context.Context, config []byte) error
  Open(ctx context.Context) ([]byte, error)
  Ping(ctx context.Context) error
  
  Origin() string
  Type() string
  Root() string
  Flags() location.Flags
  
  Mode(ctx context.Context) (Mode, error)
  Size(ctx context.Context) (int64, error)
  List(ctx context.Context, StorageResource) ([]objects.MAC, error)
  Put(ctx context.Context, StorageResource, objects.MAC, io.Reader) (int64, error)
  Get(ctx context.Context, StorageResource, objects.MAC, *Range) (io.ReadCloser, error)
  Delete(ctx context.Context, StorageResource, objects.MAC) error
  
  Close(ctx context.Context) error
}
```

#### Create

Initializes a new repository with configuration data.

#### Open

Opens an existing repository and returns its configuration.

#### Mode

Returns storage capabilities: `storage.ModeRead | storage.ModeWrite`

#### Size

Returns total storage size in bytes.

#### List

Lists objects of a given resource type:
- `storage.StorageResourcePackfile`
- `storage.StorageResourceState`
- `storage.StorageResourceLock`

#### Put

Stores an object identified by MAC (Message Authentication Code).

#### Get

Retrieves an object by MAC. Optional range parameter for partial reads.

#### Delete

Removes an object by MAC.

## Helper Types

### connectors.Options

```go
type Options struct {
  Excludes       []string
  Hostname       string
  MaxConcurrency int
}
```

### connectors.Record

```go
func NewRecord(
  pathname string,
  target string,
  fi objects.FileInfo,
  xattrs map[string][]byte,
  contentReader func() (io.ReadCloser, error),
) *Record
```

Creates a file record with lazy-loading content reader.

**Parameters:**
- `pathname` - Full file path
- `target` - Symlink target (empty for regular files)
- `fi` - File metadata
- `xattrs` - Extended attributes (can be nil)
- `contentReader` - Function to open file content

### objects.FileInfo

```go
type FileInfo struct {
  Lname    string
  Lsize    int64
  Lmode    fs.FileMode
  LmodTime time.Time
  Ldev     uint64
}
```

## Important Notes

### Do Not Write to Stdout

Plugins communicate via gRPC over stdin/stdout. Writing to `os.Stdout` corrupts the stream. Always use `os.Stderr` for logging:

```go
fmt.Fprintf(os.Stderr, "debug: %s\n", msg)
```

### Location Flags

Set flags in both code (registration and `Flags()` method) and manifest:

| Flag | Manifest | Description |
|------|----------|-------------|
| `location.FLAG_LOCALFS` | `localfs` | Local filesystem paths |
| `location.FLAG_FILE` | `file` | Single-file storage |
| `location.FLAG_STREAM` | `stream` | Single-use import |
| `location.FLAG_NEEDACK` | `needack` | Reads results channel |

## Complete Example

See the [integration example repository](https://github.com/PlakarKorp/integration-example) for an integration implementation with importer, exporter, and storage connectors.
