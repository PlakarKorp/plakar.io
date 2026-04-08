---
title: "Installation"
date: "2025-12-15T00:00:00Z"
weight: 2
summary: Install Plakar and verify your installation.
---

Several installation methods are available depending on your operating system. Choose the method that best suits your environment.

{{% notice style="info" title="Developer Version" expanded="true" %}}
Plakar v1.1.0 is still a beta release and it can only be installed from source. Only stable versions have distributed assests that can be installed using other OS specific methods
{{% /notice %}}

To build Plakar from source. You will need:
- [Go (Golang)](https://go.dev/doc/install)
- `make` (available by default on most Linux distributions; on macOS, install the Xcode command line tools with `xcode-select --install`; on Windows, use [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) or a tool like [GnuWin32 Make](https://gnuwin32.sourceforge.net/packages/make.htm))

Clone the repository and run `make`:
```bash
git clone https://github.com/PlakarKorp/plakar.git
cd plakar
make
```

This produces a `plakar` binary in the current directory.

To build a specific release version, check out the corresponding tag before running `make`:
```bash
git checkout v1.1.0
make
```

## Verifying the Installation

Verify the installation by running:
```bash
plakar version
```

This should return the expected version number, for example `plakar/v1.1.0`.

## Downloading Specific Versions

All release versions of **plakar** are available directly from GitHub on the project's [release page](/download).

For each release, check under the "Assets" section for a list of pre-built packages. They follow the naming convention `plakar_<version>_<os>_<arch>.<format>`.


## Installation Troubleshooting

If you encounter any issues during installation, or notice that this documentation is out of date:
* Ensure you are following the instructions for the correct version of plakar.
* Open an issue on the [GitHub issue tracker](https://github.com/PlakarKorp/plakar/issues).

## Next Steps: Getting Started

Now that you have plakar installed, we recommend proceeding to the [Quickstart guide](first-backup.md) to set up your first backup.
