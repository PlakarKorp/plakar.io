---
title: "SDK"
weight: 4
date: "2025-07-07"
summary: "Learn how to implement a Plakar Integration (Source, Destination, or Storage) in Go, and use the SDK to run it. This guide covers interfaces, implementation, packaging, and installation."
---

This guide explains **how to implement a Plakar Integration** (Source, Destination, or Storage) in Go, and how to use the provided **SDK** to run it.

## 📌 What is a Plakar Plugin?

A Plakar Plugin is an external binary that implements one of the **Plakar interfaces**:

- **Storage**: Provides the implementation of a storage for backups
- **Importer**: Provides an implementation to import from a source into plakar
- **Exporter**: Provides an implementation to export from plakar to a destination

## ✅ Step 1 — Implement the Interface

Each plugin **must implement the right interface** from the Plakar source tree.

---

### Store Interface


```go
type Store interface {
	Create(ctx context.Context, config []byte) error
	Open(ctx context.Context) ([]byte, error)
	Location() string
	Mode() Mode
	Size() int64

	GetStates() ([]objects.MAC, error)
	PutState(mac objects.MAC, rd io.Reader) (int64, error)
	GetState(mac objects.MAC) (io.Reader, error)
	DeleteState(mac objects.MAC) error

	GetPackfiles() ([]objects.MAC, error)
	PutPackfile(mac objects.MAC, rd io.Reader) (int64, error)
	GetPackfile(mac objects.MAC) (io.Reader, error)
	GetPackfileBlob(mac objects.MAC, offset uint64, length uint32) (io.Reader, error)
	DeletePackfile(mac objects.MAC) error

	GetLocks() ([]objects.MAC, error)
	PutLock(lockID objects.MAC, rd io.Reader) (int64, error)
	GetLock(lockID objects.MAC) (io.Reader, error)
	DeleteLock(lockID objects.MAC) error

	Close() error
}
```

By implementing the `Store` interface,
an integration can provide access to a new data source for fetching and creating backups.



`Create` method creates a new storage backend with the provided configuration.

`Open` method opens an existing storage backend and returns its configuration.

`Location` method returns the storage location (e.g., file path, URL).

`Mode` method returns the storage mode (e.g., read, write).

`Size` method returns the size of the storage backend.

For managing states, packfiles, and locks, the following methods are defined:
- `GetXs`: Retrieves all Xs from the storage.
- `PutX`: Stores a X in the storage, returning the size of the stored data.
- `GetX`: Retrieves a specific X from the storage.
- `DeleteX`: Deletes a specific X from the storage.


`GetPackfileBlob`: Retrieves a specific blob from a packfile, given an offset and length.

`Close` method is called to clean up resources after the storage operation is complete.


---

### Importer Interface


```go
type Importer interface {
	Origin() string
	Type() string
	Root() string
	Scan() (<-chan *ScanResult, error)
	Close() error
}

type ScanResult struct {
	Record *ScanRecord
	Error  *ScanError
}

type ScanRecord struct {
	Reader io.ReadCloser
	Pathname           string
	Target             string
	FileInfo           objects.FileInfo
	ExtendedAttributes []string
	FileAttributes     uint32
	IsXattr            bool
	XattrName          string
	XattrType          objects.Attribute
}

type ScanError struct {
	Pathname string
	Err      error
}
```

By implementing the `Importer` interface,
an integration can provide storage of backups on any backend that supports listing, storing and fetching byte streams.

Interface: [`plakarkorp/kloset/snapshot/importer/importer.go`](https://github.com/PlakarKorp/kloset/blob/main/snapshot/importer/importer.go)

`Scan` method returns a channel of `*ScanResult`, which contains the results of the scan operation.

If the `ScanResult` contains a `Record`, it means the scan was successful for that file. `Record` includes the file's metadata and a reader to access its content (Reader).

If it contains an `Error`, it indicates a problem encountered during the scan.

`Origin` method returns the host or source of the data being imported.

`Type` method returns the name of the importer type (e.g., "fs", "s3", "notion").

`Root` method returns the root directory of the data being imported.

`close` method returns called to clean up resources after the import operation is complete.


---


```go
type Exporter interface {
	Root() string
	CreateDirectory(pathname string) error
	StoreFile(pathname string, fp io.Reader, size int64) error
	SetPermissions(pathname string, fileinfo *objects.FileInfo) error
	Close() error
}
```

### Exporter Interface

Path: [`plakarkorp/kloset/snapshot/exporter/exporter.go`](https://github.com/PlakarKorp/kloset/blob/main/snapshot/exporter/exporter.go)


`Root` method returns the root directory where files will be stored.

`CreateDirectory` method creates a directory at the specified pathname.

`StoreFile` method stores a file at the specified pathname, reading from the provided `io.Reader`.

`SetPermissions` method sets the file permissions based on the provided `FileInfo`.

`Close` method is called to clean up resources after the export operation is complete.


## 🛠️ Step 2 — Write Your Implementation

Example: Implementing an **Exporter**:

```go
package myexporter

import (
	"io"
	"os"
	"path/filepath"

	"github.com/PlakarKorp/kloset/objects"
)

struct MyExporter struct {
    rootDir string
}

func NewMyExporter(ctx context.Context, opts *exporter.Options, name string, config map[string]string) (exporter.Exporter, error) {
	return &MyExporter{
		rootDir: config["location"], // Location where files will be restored
	}, nil
}

type MyExporter struct {
	root string
}

func (l *MyExporter) Root() string {
	return l.root
}

func (l *MyExporter) CreateDirectory(pathname string) error {
	return os.MkdirAll(filepath.Join(l.root, pathname), 0755)
}

func (l *MyExporter) StoreFile(pathname string, fp io.Reader, size int64) error {
	f, err := os.Create(filepath.Join(l.root, pathname))
	if err != nil {
		return err
	}
	defer f.Close()

	_, err = io.CopyN(f, fp, size)
	return err
}

func (l *MyExporter) SetPermissions(pathname string, fileinfo *objects.FileInfo) error {
	return os.Chmod(filepath.Join(l.root, pathname), fileinfo.Mode())
}

func (l *MyExporter) Close() error {
	return nil
}
```

## 🚀 Step 3 — Make a `main` function

For the plugin to be executable, you need a `main` function that uses the SDK to run your plugin.

```go
package main

import (
	"context"
	
	"github.com/PlakarKorp/go-kloset-sdk"

    // Import your implementation package based on the plugin type
	"myexporter"
    // or
    "myimporter"
    // or
    "mystorage"
)

func main() {
    // Use the correct SDK function based on your plugin type
    // For Exporter: sdk.RunExporter()
    // For Importer: sdk.RunImporter()
    // For Storage: sdk.RunStorage()

    // Example for Exporter
	if err := sdk.RunExporter(myexporter.NewMyExporter); err != nil {
		panic(err)
	}
}
```

## 🧪 Step 4 — Create a Makefile

To being integrate your plugin in the Plakar system, you need to create a `Makefile` that builds your plugin binary.
Add the following rules in your Makefile but only the ones that you have implemented (Exporter, Importer, and/or Storage): 

```makefile
all: exporter importer storage

importer:
    go build -o myimporter -v ./importer

exporter:
    go build -o myexporter -v ./exporter

storage:
    go build -o mystorage -v ./storage
```

## 🏗️ Step 5 — Add a `Manifest.yaml`

To integrate your plugin with Plakar, you need to create a `Manifest.yaml` file in the root of your plugin directory. This file describes your plugin and its capabilities.

```yaml
name: my-plugin-name
description: A brief description of your plugin
version: 1.0.0
connectors:
  - type: importer
    executable: myimporter
    protocols: [my-plugin]
 - type: exporter
    executable: myexporter
    protocols: [my-plugin]
  - type: storage
    executable: mystorage
    protocols: [my-plugin]
```

The `protocols` field specifies the protocols your plugin supports (e.g., `notion`, `fs`, `s3`). It will be used by Plakar cli to determine which plugins to use for specific operations.

## 🏁 Step 6 — Create the plugin pkg

To create the plugin package, you need to run the following command in the root of your plugin directory:

Your `Manifest.yaml` file should be in the same directory as your Makefile.

```bash
./plakar pkg create <path-to-your-manifest.yaml>
```

From this line, an ptar file will be created in the current directory.

## 📦 Step 7 — Install the ptar file

To install your plugin, you can use the Plakar CLI:

```bash
plakar pkg install <path-to-your-plugin.ptar>
```

You can check if your plugin is well installed by running:

```bash
plakar version
```

If your plugin is installed correctly, you should see it listed in the output.

Now you can use your plugin with Plakar commands, such as a classical plakar connector, if you don't how to use it, you can check the Plakar documentation for more information on how to use connectors.
