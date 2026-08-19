
## Why protecting VMware workloads matters

Virtual machines running on vSphere often carry as much responsibility as the
physical servers they replaced. They host applications, databases, and services
that a business depends on every day. VMware's own tools are built to keep those
machines running, not to give you an independent copy to fall back on when
something goes wrong at the data level rather than the hardware level.

Relying on vSphere's built-in resilience alone leaves some real gaps:

- **High availability isn't backup**: features that restart a VM on another host
  after a hardware failure do nothing to help when the VM's own data has been
  deleted, corrupted, or encrypted.
- **Snapshots aren't independent**: native VM snapshots typically live on the
  same storage as the VM itself, so whatever takes down the underlying datastore
  takes the snapshot down with it.
- **Mistakes and updates happen at scale**: a bad script, a misapplied template,
  or a failed update can affect many virtual machines simultaneously, faster
  than anyone can react manually.
- **No cross-environment recovery path**: without a backup stored outside the
  virtual environment, there's no way to bring a VM back on different hardware,
  in a different datacenter, or with a different provider.

For workloads this central to daily operations, virtualization needs an
independent, off-platform backup behind it, not just resilience within the
platform itself.

## What happens when vSphere access is compromised

Access to a VMware environment is controlled by administrative accounts on
vCenter or ESXi. Because those accounts can manage every virtual machine in the
environment at once, they're a high-value target and a single compromised
account can affect everything running on that infrastructure.

If vSphere credentials are leaked or misused:

- **Fleet-wide impact**: an attacker with vCenter access can affect every VM it
  manages, not just one system.
- **Ransomware at the infrastructure level**: entire virtual machines, including
  their disks and configuration, can be encrypted or deleted in a single
  coordinated action.
- **Snapshot deletion**: an attacker with sufficient access can remove native
  VMware snapshots along with the VMs they belong to, closing off the most
  obvious recovery path.
- **No recovery without an independent copy**: without a backup stored outside
  the vSphere environment, there's no way to undo the damage — only to rebuild
  from scratch.

Plakar mitigates this by keeping VM backups encrypted end-to-end and stored in a
Kloset Store independent of the vSphere environment they came from, so a
compromised vCenter account doesn't put the backup history at risk.

## How Plakar secures your VMware environment

Plakar integrates with VMware in three ways:

- **Inventory**: connect to a vCenter Server or a vSphere-based cloud platform
  (such as an OVHcloud Hosted Private Cloud) and automatically discover the
  virtual machines running in it, keeping that inventory synchronized as
  machines are added or removed.
- **Source Connector**: capture an encrypted, deduplicated backup of a
  discovered virtual machine, independent of the storage it normally runs on.
- **Destination Connector**: restore a verified backup back to its original
  environment, a different vSphere environment, or an entirely different
  provider.

This makes it possible to:

- Automatically discover and track every virtual machine across a VMware
  environment, without manually maintaining a list
- Back up virtual machines without disrupting the services running on them
- Keep backup access separate from the vCenter credentials used for day-to-day
  administration
- Recover a virtual machine to a known-good state, on the same infrastructure or
  entirely new infrastructure

Plakar also tracks backup coverage across your inventory, so it's easy to see at
a glance which virtual machines are protected and which aren't.

Instead of relying solely on vSphere's own resilience features, Plakar gives you
an independent, verifiable, and encrypted backup history for the virtual
machines your business runs on.

