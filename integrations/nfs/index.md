
## Why protecting NFS exports matters

An NFS export is rarely one team's data. It is mounted by application servers,
build agents, and user workstations at the same time, which means a single
export often holds the working state of an entire environment.

The protections usually assumed to be in place cover less than expected:

- **An export has no history**: NFS serves the current state of a directory tree
  and nothing else. A file overwritten by a job that ran with the wrong
  arguments is simply the file now.
- **Filer snapshots stay on the filer**: appliance snapshot schedules are useful
  for quick rollbacks, but they live on the same device as the export. A failed
  controller, a wiped aggregate, or a decommissioned appliance takes both.
- **Every client is a risk surface**: an export is only as safe as the least
  maintained machine that mounts it. One compromised or misconfigured client can
  damage data that dozens of well-managed systems depend on.
- **Deletions propagate instantly**: a mistaken recursive delete on a mounted
  path is not a local mistake. It removes the data for every client at once.

For shared storage this central to daily operations, the export needs a copy
that does not depend on the appliance serving it.

## What happens when an export is compromised

NFS authorization is built on numeric user and group IDs supplied by the client.
The server generally trusts what it is told, and access is controlled by which
hosts are allowed to mount which exports.

If a client is compromised or an export is left too permissive:

- **Claimed identity is granted identity**: a host that can reach a permissive
  export can present whatever user ID it likes and read or write files as that
  user.
- **Ransomware at mount speed**: malware on one client encrypts files across
  every export that client has mounted, well beyond the machine it landed on.
- **Root access to the tree**: an export configured with `no_root_squash` hands
  full control of the exported data to root on any permitted client.
- **Nothing to roll back to**: once the live export and the appliance snapshots
  are both gone, there is no independent copy to recover from.

Plakar mitigates this by reading exports over NFS into a Kloset stored outside
the file server. If the export or the appliance serving it is compromised, the
snapshot history stays intact and recoverable.

## How Plakar secures your NFS exports

Plakar uses NFSv3 directly, with no kernel mount and no need for root privileges
or mount capability on the host, so it can back up an export from wherever it
runs:

- **Source Connector**: walk an entire export or a single subtree, capturing
  files and directories with their size, mode, ownership, and modification time.
  Plakar encrypts and deduplicates the contents before writing them to a Kloset
  Store, independent of the server the export came from.
- **Destination Connector**: restore a verified snapshot to the original export,
  a replacement appliance, or a different environment, recreating the directory
  hierarchy and file contents.

This makes it possible to:

- Back up NAS appliances and Unix file servers without mounting anything or
  running as root
- Present a specific user and group ID to the server, so backups run with
  exactly the access they need
- Migrate shared storage to new hardware by restoring a snapshot onto the
  replacement
- Protect home directories and project trees that no single team has taken
  responsibility for

Plakar also lets you browse, search, and verify a snapshot before restoring, so
recovering one deleted directory does not mean restoring an entire export.

Instead of trusting an export to the appliance that serves it, Plakar gives you
an independent, encrypted, and verifiable history of the shared storage your
infrastructure depends on.

