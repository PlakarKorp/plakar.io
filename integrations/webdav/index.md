
## Why protecting WebDAV remotes matters

WebDAV-based platforms like Nextcloud are often the primary store for documents,
photos, and shared files in self-hosted environments. But convenient access is
not the same as data protection:

- **Sync propagates deletions**: Sync clients mirror every change, including
  accidental deletions and overwrites, across all connected devices instantly.
- **No independent snapshot history**: WebDAV platforms typically offer limited
  or no versioning. Once a file is overwritten or deleted, recovery depends on
  whatever the platform provides which is often nothing.
- **Single point of failure**: A failed upgrade, a corrupted database, or a
  ransomware attack on the server can take down everything at once, with no
  independent recovery path.

For self-hosted storage that teams and individuals depend on daily, an
independent backup layer is not optional.

## What happens when a WebDAV server is compromised

Access to WebDAV remotes is controlled by usernames and passwords, often shared
across devices and applications. If credentials are leaked:

- **Total loss**: An attacker with valid credentials can delete or overwrite
  every file on the remote through standard WebDAV operations.
- **Ransomware**: Malicious actors can replace file contents with encrypted
  versions, making data inaccessible without paying a ransom.
- **No recovery path**: Without an independent backup stored outside the WebDAV
  server, there is nothing to restore from.

Plakar mitigates these risks by storing snapshots in an isolated Kloset,
encrypted end-to-end and independent of the WebDAV server itself.

## How Plakar protects your WebDAV remotes

Plakar integrates with any WebDAV-compatible service over TLS-encrypted
connections:

- **Source Connector**: Take snapshots of any WebDAV remote, capturing file
  content, directory structure, and metadata. Plakar encrypts and deduplicates
  the content before saving it to a trusted Kloset Store.
- **Destination Connector**: Restore verified snapshots back to any WebDAV
  remote, whether the original server or a different host entirely.

Compatible services include Nextcloud, ownCloud, and any server implementing the
WebDAV protocol.

