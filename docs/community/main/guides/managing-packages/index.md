
# Managing packages

Integration packages extend Plakar with connectors for cloud storage providers,
databases, and other systems. This guide covers the full lifecycle of a package:
installing, listing, upgrading, and removing.

Plakar ships intentionally clean with only base connectors such as the
filesystem connector. Plakar can be extended using integrations such as S3,
SFTP, PostgreSQL, or any other integration only when you need it, keeping the
base install small and dependency-free.

Integrations are also versioned independently from Plakar itself, so you can pin
a connector to a specific version or upgrade it without touching the rest of
your setup.

## List installed packages

To see which packages are currently installed:

```bash
$ plakar pkg show
```

> [!NOTE]+ Listing installed packages
>
> `plakar pkg show` is the preferred command for listing installed packages.
>
> The older `plakar pkg list` command remains supported as an alias for backward
> compatibility, so existing scripts and workflows continue to work. New
> documentation and examples use `plakar pkg show`.

## List available packages

Rather than what is installed, `-available` shows the prebuilt packages that can
be installed on the current system, which is how you discover what a given
platform and architecture can run before installing anything:

```bash
$ plakar pkg show -available
```

## Install a package

### Pre-built package

Pre-built packages are hosted on Plakar's infrastructure and require you to be
logged in to download them. If you are not logged in, `plakar pkg add` will fail
with an authentication error.

To log in:

```bash
$ plakar login
```

For CI pipelines or automated environments where interactive login is not
possible, see
[Logging In to Plakar](../../guides/logging-in-to-plakar/#non-interactive-login).

Once logged in, install a package by name from the official plugin registry
(e.g. the S3 integration):

```bash
$ plakar pkg add s3
```

To install a specific version:

```bash
$ plakar pkg add s3@v1.0.0
```

### Package signatures

Packages are signed, and Plakar expects a signature when installing one. A
package that carries no signature is rejected unless `-allow-unsigned` is passed
explicitly:

```bash
$ plakar pkg add -allow-unsigned ./my_custom_integration.ptar
```

This mainly applies to packages you built yourself or obtained outside the
official registry. Only use it for packages whose origin you trust.

### Development integrations

Integrations that are not yet stable are published to a separate devel tree
instead of the regular one. They are not listed or installed unless `-devel` is
passed:

```bash
$ plakar pkg show -available -devel
$ plakar pkg add -devel <integration>
```

### Building from source

If you are not logged in or prefer not to use pre-built packages, you can build
packages locally with `plakar pkg build`. This does not require a Plakar account
but does require a working Go toolchain and `make`.

```bash
$ plakar pkg build s3
```

On success, a `.ptar` archive is generated in the current directory. Install it
with:

```bash
$ plakar pkg add ./s3_v1.0.0_darwin_arm64.ptar
```

## Upgrade a package

To upgrade a specific package to the latest available version:

```bash
$ plakar pkg add -u s3
```

To upgrade all installed packages at once:

```bash
$ plakar pkg add -u
```

Upgrading preserves existing store, source, and destination configurations.

## Remove a package

```bash
$ plakar pkg rm s3
```

