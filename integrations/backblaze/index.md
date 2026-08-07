
## Why Backblaze B2 is a natural fit for backup storage

Backblaze B2 was designed from the ground up as a storage platform for backup
and archive workloads. Combined with Plakar, it provides a complete backup
solution with strong cost and security properties:

- **Predictable, low costs**: B2 is significantly cheaper than AWS S3 or Google
  Cloud Storage, with no egress fees when used with supported partners. For
  large backup repositories, the cost difference is substantial.
- **S3-compatible API**: B2 speaks the S3 protocol natively, meaning Plakar's S3
  integration works out of the box with no special configuration.
- **Object Lock and immutability**: B2 supports Object Lock, providing
  write-once, read-many (WORM) storage that prevents backups from being modified
  or deleted — even by a compromised account.
- **Built-in replication**: B2 supports cross-region replication without egress
  fees, making it straightforward to maintain geographically distributed backup
  copies.

## What happens when backup storage credentials are compromised

B2 access is controlled by API keys with fine-grained permission scoping.
Despite this, credentials embedded in scripts or shared across services remain a
risk:

- **Total loss**: An attacker with a writable API key can delete or overwrite
  entire buckets through the S3-compatible API.
- **Ransomware**: Malicious actors can overwrite backup data with encrypted
  content, making it inaccessible without paying a ransom.
- **No recovery path**: Without an independent layer of protection, there is
  nothing to restore from if backup data is tampered with.

Plakar mitigates these risks by adding end-to-end encryption and immutable
snapshots on top of B2. Even if B2 credentials are compromised, Plakar's
encryption ensures backup data cannot be read or silently tampered with.

## How Plakar works with Backblaze B2

Backblaze B2 is supported through Plakar's S3 integration. All three connector
types are available:

- **Source Connector**: Take snapshots of a B2 bucket and store them in an
  independent Kloset Store.
- **Storage Connector**: Use a B2 bucket as the backend for a Kloset Store,
  storing encrypted and deduplicated snapshots from any source.
- **Destination Connector**: Restore verified snapshots back to a B2 bucket,
  whether the original or a different one entirely.

