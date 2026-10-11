---
title: "Go Kloset SDK"
date: "2026-03-19T00:00:00Z"
weight: 3
summary: "Go SDK reference for building Plakar integrations."
aliases:
  - /docs/v1.1.0/references/sdk/
  - /docs/community/v1.1.0/references/sdk/
---

# Go Kloset SDK

The Go Kloset SDK is used to build Plakar integrations. An integration is a
package of one or more connectors:

- **Importer** - Reads data from a source during backup
- **Exporter** - Writes data to a destination during restore
- **Storage** - Stores a repository on a custom backend

The connector interfaces and helper types live in the
[kloset](https://github.com/PlakarKorp/kloset) module. The SDK turns an
implementation of one of those interfaces into an executable that Plakar can
run.

## Installation

```bash
go get github.com/PlakarKorp/go-kloset-sdk
go get github.com/PlakarKorp/kloset
```

## How integrations run

Each connector is a separate executable. Plakar starts it and talks to it over
gRPC on stdin and stdout. An integration that provides an importer, an exporter,
and a storage backend therefore ships three executables. A common layout keeps
the connector code in the package root and one `main` package per connector:

```
example/
├── connector.go
├── cmd/
│   ├── importer/main.go
│   ├── exporter/main.go
│   └── storage/main.go
├── manifest.yaml
└── Makefile
```

The [manifest](../commands/plakar-pkg-manifest.yaml) declares each executable,
the protocols it handles, and its location flags.

Because stdout carries the gRPC stream, writing to `os.Stdout` corrupts it. Log
to `os.Stderr` instead:

```go
fmt.Fprintf(os.Stderr, "debug: %s\n", msg)
```

## Entry points

Each executable calls one entry point from `main()`. The entry point serves the
connector until Plakar closes the connection or `ctx` is cancelled, then exits
the process.

```go
func EntrypointImporter(ctx context.Context, args []string, ctor importer.ImporterFn)
func EntrypointExporter(ctx context.Context, args []string, ctor exporter.ExporterFn)
func EntrypointStorage(ctx context.Context, args []string, ctor storage.StoreFn)
```

```go
package main

import (
  "context"
  "os"

  sdk "github.com/PlakarKorp/go-kloset-sdk"
  connector "github.com/yourorg/integration"
)

func main() {
  ctx := sdk.InterruptableContext(context.Background())
  sdk.EntrypointImporter(ctx, os.Args, connector.NewImporter)
}
```

`InterruptableContext` returns a context that is cancelled when the process
receives an interrupt signal, so the connector stops cleanly. Once the context
is cancelled, later interrupts are no longer caught.

```go
func InterruptableContext(ctx context.Context) context.Context
```

The entry points wrap the `Run*` functions. Call `Run*` directly to handle the
returned error instead of exiting the process. Call `Run*On` to serve the
connector on a listener you provide, for example in tests.

```go
func RunImporter(ctx context.Context, ctor importer.ImporterFn) error
func RunExporter(ctx context.Context, ctor exporter.ExporterFn) error
func RunStorage(ctx context.Context, ctor storage.StoreFn) error

func RunImporterOn(ctx context.Context, ctor importer.ImporterFn, listener net.Listener) error
func RunExporterOn(ctx context.Context, ctor exporter.ExporterFn, listener net.Listener) error
func RunStorageOn(ctx context.Context, ctor storage.StoreFn, listener net.Listener) error
```

## Connectors

Importers, exporters, and storage backends share a similar constructor and a
common set of methods. The sections below cover what they have in common. The
[Importers](#importers), [Exporters](#exporters), and [Storage](#storage)
sections cover what differs.

### Constructors

Plakar calls the constructor once when it starts the connector.

```go
type ImporterFn func(ctx context.Context, opts *connectors.Options, proto string, config map[string]string) (Importer, error)
type ExporterFn func(ctx context.Context, opts *connectors.Options, proto string, config map[string]string) (Exporter, error)
type StoreFn    func(ctx context.Context, proto string, config map[string]string) (Store, error)
```

- `ctx` - Context for cancellation
- `opts` - Runtime options from Plakar (importers and exporters only)
- `proto` - Protocol name
- `config` - Configuration map with `location` and other parameters

The `location` value always includes the protocol prefix, for example
`example:///var/backups`. For connectors with `FLAG_LOCALFS`, Plakar resolves a
relative path against its working directory before calling the constructor.

`opts` describes the environment Plakar runs in. `Excludes` is only set for
importers.

```go
type Options struct {
  Hostname        string
  OperatingSystem string
  Architecture    string
  CWD             string
  MaxConcurrency  int
  Excludes        []string
}
```

### Common methods

Every connector implements these methods:

| Method                   | Description                                                                                                           |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `Origin() string`        | Identifies the host and resource, using a path-like `host/resource` convention, for example `s3.example.com/mybucket` |
| `Type() string`          | Protocol name, for example `s3`                                                                                       |
| `Root() string`          | Root path within the location, for example `/`                                                                        |
| `Flags() location.Flags` | Location flags, see [Location flags](#location-flags)                                                                 |
| `Ping(ctx) error`        | Tests connectivity before the operation begins                                                                        |
| `Close(ctx) error`       | Releases resources after the operation completes                                                                      |

### Location flags

Location flags describe how a connector behaves. Return `0` for remote or
network locations. Combine flags with bitwise OR, for example
`location.FLAG_LOCALFS | location.FLAG_STREAM`.

Set the same flags in code, through `Register` and `Flags()`, and in the
`location_flags` list of the connector in the
[manifest](../commands/plakar-pkg-manifest.yaml).

| Flag                         | Manifest       | Applies to          | Description                                         |
| ---------------------------- | -------------- | ------------------- | --------------------------------------------------- |
| `location.FLAG_LOCALFS`      | `localfs`      | all                 | Local filesystem paths                              |
| `location.FLAG_FILE`         | `file`         | storage             | Repository stored in a single file                  |
| `location.FLAG_STREAM`       | `stream`       | importer            | `Import()` can only be called once                  |
| `location.FLAG_NEEDACK`      | `needack`      | importer            | Importer reads the `results` channel                |
| `location.FLAG_NOMERGE`      | `nomerge`      | importer            | Multiple locations cannot be merged in one snapshot |
| `location.FLAG_EXPORTXATTR`  | `exportxattr`  | exporter            | Exporter receives extended attribute records        |
| `location.FLAG_WALKDIRORDER` | `walkdirorder` | importer / exporter | Records are sent or expected in `fs.WalkDir` order  |

## Records

Importers and exporters exchange data with Plakar as records. A record describes
a file, a directory, an extended attribute, or an error on a path. During
backup, the importer sends records to Plakar. During restore, Plakar sends
records to the exporter, which answers each one with a result.

```go
type Record struct {
  Reader io.ReadCloser

  Pathname string
  Err      error

  IsXattr   bool
  XattrName string
  XattrType objects.Attribute

  Target             string
  FileInfo           objects.FileInfo
  ExtendedAttributes []string
  FileAttributes     uint32
}
```

A result reports whether a record was handled. `record.Ok()` and
`record.Error(err)` build one and close the record's reader. `record.Error(nil)`
reports success.

### Creating records

`NewRecord` creates a record for a file, directory, or symlink. Its content
reader is lazy: Plakar calls `read` only when it needs the content. `target` is
the symlink target and is empty for other files. `xattrs` lists the names of the
file's extended attributes and can be `nil`.

```go
func NewRecord(pathname, target string, fi objects.FileInfo, xattrs []string, read func() (io.ReadCloser, error)) *Record
```

`NewXattr` creates a record carrying the value of one extended attribute of
`pathname`. Send one for each name listed in the file's `xattrs`. `kind` is one
of `objects.AttributeExtended`, `objects.AttributeADS`, or
`objects.AttributeCustom`.

```go
func NewXattr(pathname, name string, kind objects.Attribute, read func() (io.ReadCloser, error)) *Record
```

`NewError` creates a record reporting that `pathname` could not be imported.

```go
func NewError(pathname string, err error) *Record
```

### File metadata

`objects.FileInfo` holds the metadata of a record. Fields that do not apply to
the source can be left at their zero value.

```go
type FileInfo struct {
  Lname      string
  Lsize      int64
  Lmode      fs.FileMode
  LmodTime   time.Time
  Ldev       uint64
  Lino       uint64
  Luid       uint64
  Lgid       uint64
  Lnlink     uint16
  Lusername  string
  Lgroupname string
  Flags      uint32
}
```

## Importers

Package `github.com/PlakarKorp/kloset/connectors/importer`.

```go
type Importer interface {
  Origin() string
  Type() string
  Root() string
  Flags() location.Flags
  Ping(ctx context.Context) error
  Import(ctx context.Context, records chan<- *connectors.Record, results <-chan *connectors.Result) error
  Close(ctx context.Context) error
}
```

`Import` walks the source and sends one record per file, directory, extended
attribute, or error. It must close `records` when it returns, so start with
`defer close(records)`.

A failure on a single path is reported with `connectors.NewError()`, and the
import continues. Return an error from `Import` only when the whole import
fails.

`results` is `nil` unless the importer sets `FLAG_NEEDACK`. With the flag set,
the importer receives a result for each record it sent.

```go
func (i *MyImporter) Import(ctx context.Context, records chan<- *connectors.Record, results <-chan *connectors.Result) error {
  defer close(records)

  info, err := os.Stat(path)
  if err != nil {
    records <- connectors.NewError(path, err)
    return nil
  }

  fi := objects.FileInfo{
    Lname:    filepath.Base(path),
    Lsize:    info.Size(),
    Lmode:    info.Mode(),
    LmodTime: info.ModTime(),
  }

  records <- connectors.NewRecord(path, "", fi, nil, func() (io.ReadCloser, error) {
    return os.Open(path)
  })

  return nil
}
```

## Exporters

Package `github.com/PlakarKorp/kloset/connectors/exporter`.

```go
type Exporter interface {
  Origin() string
  Type() string
  Root() string
  Flags() location.Flags
  Ping(ctx context.Context) error
  Export(ctx context.Context, records <-chan *connectors.Record, results chan<- *connectors.Result) error
  Close(ctx context.Context) error
}
```

`Export` receives records from Plakar and writes them to the destination. It
must send exactly one result per record and close `results` when it returns, so
start with `defer close(results)`.

Records include directories and symlinks, not only regular files. Records with
`Err` set carry no content. Extended attribute records, with `IsXattr` set, are
only sent when the exporter sets `FLAG_EXPORTXATTR`. An exporter that does not
handle a record type acknowledges it with `record.Ok()`.

```go
func (e *MyExporter) Export(ctx context.Context, records <-chan *connectors.Record, results chan<- *connectors.Result) error {
  defer close(results)

  for record := range records {
    if record.Err != nil || record.IsXattr || !record.FileInfo.Lmode.IsRegular() {
      results <- record.Ok()
      continue
    }

    _, err := io.Copy(destination, record.Reader)
    results <- record.Error(err)
  }

  return nil
}
```

## Storage

Package `github.com/PlakarKorp/kloset/connectors/storage`.

A storage backend holds a repository. Plakar stores the repository configuration
and a set of objects addressed by MAC (Message Authentication Code). Unlike
importers and exporters, the storage constructor does not receive
`*connectors.Options`.

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
  List(ctx context.Context, res StorageResource) ([]objects.MAC, error)
  Put(ctx context.Context, res StorageResource, mac objects.MAC, rd io.Reader) (int64, error)
  Get(ctx context.Context, res StorageResource, mac objects.MAC, rg *Range) (io.ReadCloser, error)
  Delete(ctx context.Context, res StorageResource, mac objects.MAC) error

  Close(ctx context.Context) error
}
```

| Method   | Description                                                                |
| -------- | -------------------------------------------------------------------------- |
| `Create` | Initializes a new repository with its configuration. Fails if one exists.  |
| `Open`   | Opens an existing repository and returns its configuration                 |
| `Mode`   | Returns capabilities, such as `storage.ModeRead \| storage.ModeWrite`      |
| `Size`   | Returns the total storage size in bytes. Can be costly on remote backends. |
| `List`   | Lists the MACs of all objects of a resource type                           |
| `Put`    | Stores an object and returns the number of bytes written                   |
| `Get`    | Retrieves an object, or only a range of it when `rg` is not `nil`          |
| `Delete` | Removes an object                                                          |

Objects are grouped by resource type:

- `storage.StorageResourcePackfile`
- `storage.StorageResourceState`
- `storage.StorageResourceLock`
- `storage.StorageResourceECCPackfile`
- `storage.StorageResourceECCState`

`Get` reads a partial object when given a range:

```go
type Range struct {
  Offset uint64
  Length uint32
}
```

`List`, `Put`, `Get`, and `Delete` can receive a storage flag through their
context, read with `storage.Flag(ctx)`. Plakar sets `storage.StorageHot` on
`Put` for packfiles it marks as hot. A store may ignore storage flags.

```go
if storage.Flag(ctx)&storage.StorageHot != 0 {
  // ...
}
```

## Packaging

Plakar installs integrations from a package, a `.ptar` archive holding the
manifest and every file it references. Packaging does not compile anything, so
build one executable per connector first:

```bash
go build -o example-importer ./cmd/importer
go build -o example-exporter ./cmd/exporter
go build -o example-storage ./cmd/storage
```

[`plakar pkg create`](../commands/plakar-pkg-create) then assembles the package
from the manifest and a semver version. The manifest file must be named
`manifest.yaml`, and every file it references must be in the same directory or a
subdirectory.

```bash
plakar pkg create manifest.yaml v1.0.0
```

The package is written to `<name>_<version>_<os>_<arch>.ptar` in the current
directory, for example `example_v1.0.0_linux_amd64.ptar`. The operating system
and architecture are those of the host. To package for another platform, set
`GOOS` and `GOARCH` for both the build and `plakar pkg create`.

[`plakar pkg add`](../commands/plakar-pkg-add) installs the package. It expects
a signed package by default. A local build is unsigned, so install it with
`-allow-unsigned`:

```bash
plakar pkg add -allow-unsigned ./example_v1.0.0_linux_amd64.ptar
```

See the [manifest reference](../commands/plakar-pkg-manifest.yaml) for the
manifest format.

## Complete example

See the
[example integration](https://github.com/PlakarKorp/integrations/tree/main/example)
for a connector implementing an importer, an exporter, and a storage backend.
