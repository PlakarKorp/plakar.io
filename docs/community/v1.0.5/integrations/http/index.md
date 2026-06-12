
# HTTP

The HTTP integration allows Plakar to use an HTTP endpoint as a Kloset store backend. Its used to connect to a Kloset store exposed by `plakar server`.

The HTTP integration provides one connector:

| Connector type    | Description                                         |
| ----------------- | --------------------------------------------------- |
| Storage connector | Host a Kloset store on any HTTP accessible endpoint |

## Installation

In Plakar `v1.0.5` and earlier, the HTTP integration must be installed before HTTP stores can be accessed.

{{< tabs >}}
{{< tab label="Pre-built package" >}}

Pre-compiled packages are available for common platforms and provide the simplest installation method.

> [!NOTE]+ Logging In
> Pre-built packages require Plakar authentication. See [Logging in to Plakar](../../guides/logging-in-to-plakar) for details.

Install the SFTP package:

```bash
$ plakar pkg add http
```

Verify installation:

```bash
$ plakar pkg list
```

{{< /tab >}}
{{< tab label="Building from source" >}}

Source builds are useful when pre-built packages are unavailable or when customization is required.

**Prerequisites:**

- Go toolchain compatible with your **Plakar** version

Build the package:

```bash
$ plakar pkg build http
```

A package archive will be created in the current directory (e.g., `http_v1.0.0_darwin_arm64.ptar`).

Install the package:

```bash
$ plakar pkg add ./http_v1.0.0_darwin_arm64.ptar
```

Verify installation:

```bash
$ plakar pkg list
```

{{< /tab >}}
{{< /tabs >}}

To list, upgrade, or remove the package, see [managing packages guide](../../guides/managing-packages/).

## Connectors

### Storage connector

The HTTP storage connector uses an HTTP endpoint as the backend for a Kloset store.

#### Configure

```bash
# Initialize a Kloset store at the HTTP endpoint
$ plakar at http://example.com/data create

# Back up a local directory to the store
$ plakar at http://example.com/data backup /var/www

# List snapshots in the store
$ plakar at http://example.com/data ls
```

#### Options

| Option     | Required | Description                                                     |
| ---------- | -------- | --------------------------------------------------------------- |
| `location` | Yes      | URL of the HTTP endpoint, for example `http://example.com/data` |

## See also

- [Serving a Kloset Store over the Network](../guides/serving-a-kloset-store-over-the-network)

