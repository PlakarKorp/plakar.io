---
title: "Installation"
date: "2025-12-15T00:00:00Z"
weight: 2
summary: Install Plakar and verify your installation.
---

Several installation methods are available depending on your operating system. Choose the method that best suits your environment.

{{< tabs name="Installation Methods" >}}
{{% tab name="Debian/Ubuntu (APT)"%}}
  For Debian-based operating systems (such as Ubuntu or Debian), the easiest way is to use our APT repository.

  First, install necessary dependencies and add the repository's GPG key:

  ```bash
  sudo apt-get update
  sudo apt-get install -y curl gnupg2
  curl -fsSL https://packages.plakar.io/keys/plakar.gpg | sudo gpg --dearmor -o /usr/share/keyrings/plakar.gpg
  echo "deb [signed-by=/usr/share/keyrings/plakar.gpg] https://packages.plakar.io/deb stable main" | sudo tee /etc/apt/sources.list.d/plakar.list
  ```

  Then update the package list and install plakar:

  ```bash
  sudo apt-get update
  sudo apt-get install plakar
  ```
{{< /tab >}}
{{% tab name="RPM-based (DNF)" %}}
  For operating systems which use RPM-based packages (such as Fedora), the easiest way is to use our DNF repository.

  First, set up the repository:
  ```bash
  cat <<EOF | sudo tee /etc/yum.repos.d/plakar.repo
[plakar]
name=Plakar Repository
baseurl=https://packages.plakar.io/rpm/$(uname -m)/
enabled=1
gpgcheck=0
gpgkey=https://packages.plakar.io/keys/plakar.gpg
EOF
  ```

  Then install plakar with:
  ```bash
  sudo dnf install plakar
  ```
{{< /tab >}}
{{% tab name="macOS (Homebrew)" %}}
  The simplest way to install Plakar on macOS is with [Homebrew](https://brew.sh/).

  Ensure you have Homebrew installed, then add the Plakar tap and install Plakar with:
  ```bash
  brew install plakarkorp/tap/plakar
  ```

  *If you prefer not to use our tap, you can install from the default Homebrew repository instead with `brew install plakar`. Note that the version in the default repository may not always be the latest release.*

  macOS includes built-in protection against untrusted binaries. **To allow plakar to run, you will need to explicitly approve it in the Privacy & Security settings.**

  ![macOS Privacy and Security settings](../images/macos.png)

{{< /tab >}}

{{% tab name="Windows" %}}
  The simplest way to install Plakar on Windows is by downloading the pre-built package from the [Download page](https://github.com/PlakarKorp/plakar/releases).

  The downloaded package is simply an archive containing the executable. Copy this to anywhere on your system PATH, or run it directly from a shell where it is installed.

  ![Windows running plakar](../images/windows.png)

{{< /tab >}}

{{% tab name="Go Install" %}}
  To install using the Go toolchain, use `go install` with the version you want to install:
  ```bash
  go install "github.com/PlakarKorp/plakar@<version>"
  ```

  This will install the binary into your `$GOPATH/bin` directory, which you may need to add to your `$PATH` if it is not already there.
{{< /tab >}}

{{% tab name="Others" %}}
  ### Arch Linux
  Plakar is available on the Arch User Repository (AUR). If you use an AUR helper such as `yay`, you can install it with:
  ```bash
  yay -S plakar
  ```
  ### Other Platforms

  For other supported operating systems, or for an alternative to the methods mentioned above, it is possible to download pre-built binaries for different platforms and architectures from the [Download page](https://github.com/PlakarKorp/plakar/releases).

  These are in standard formats for the relevant platforms, so consult OS-specific documentation for how to install them.

{{< /tab >}}

{{< /tabs >}}

## Verifying the Installation

Verify the installation by running:
```bash
plakar version
```

This should return the expected version number, for example `plakar/v1.1.0`.

## Downloading Specific Versions

All release versions of **plakar** are available directly from GitHub on the project's [release page](https://github.com/PlakarKorp/plakar/releases).

For each release, check under the "Assets" section for a list of pre-built packages. They follow the naming convention `plakar_<version>_<os>_<arch>.<format>`.


## Installation Troubleshooting

If you encounter any issues during installation, or notice that this documentation is out of date:
* Ensure you are following the instructions for the correct version of plakar.
* Open an issue on the [GitHub issue tracker](https://github.com/PlakarKorp/plakar/issues).

## Next Steps: Getting Started

Now that you have plakar installed, we recommend proceeding to the [Quickstart guide](quickstart.md) to set up your first backup.
