# Install Plakar

Install the Plakar CLI on your machine and verify it works.

## Requirements

- A POSIX-compatible shell (Linux, macOS, WSL) or Windows PowerShell
- 1 GB free disk for the binary and a small test repository
- Network access to GitHub releases

## Steps

1. Install via the platform-appropriate path:
   - **Linux / macOS (Homebrew)**: `brew install plakarkorp/tap/plakar`
   - **Linux (binary)**: download from https://github.com/PlakarKorp/plakar/releases and place in `$PATH`
   - **Windows**: download the Windows release archive and add the binary to `PATH`
2. Verify the install:
   ```sh
   plakar version
   ```
   Expected output includes `plakar v1.x.x`.
3. Initialize a local Kloset repository to confirm end-to-end:
   ```sh
   plakar at /tmp/plakar-demo create
   plakar at /tmp/plakar-demo backup ~/Documents
   plakar at /tmp/plakar-demo ls
   ```

## Validate

`plakar version` exits 0 and `plakar at /tmp/plakar-demo ls` lists at least one snapshot.

## References

- Documentation: https://docs.plakar.io/
- Quickstart: https://www.plakar.io/docs/v1.0.6/quickstart/first-backup
- Source: https://github.com/PlakarKorp/plakar
