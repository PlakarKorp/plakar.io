
## Why protecting OVHcloud Public Cloud matters

Public Cloud instances are often provisioned, scaled, and torn down quickly.
That speed makes them easy to run and just as easy to lose track of. OVHcloud
runs the underlying infrastructure, but it does not discover, secure, or recover
your data for you.

- **No built-in inventory discipline**: instances created by and or by
  automation can drift out of sight, making it hard to know what's actually
  running, let alone what's protected.
- **Access credentials are scattered by default**: API keys and application
  credentials used to manage a Public Cloud project are often stored
  inconsistently across scripts, tools, and team members.
- **No independent recovery path**: without a snapshot stored outside the
  project, there is nothing to restore from if an instance is lost, corrupted,
  or deliberately destroyed.
- **A single point of failure for a lot of infrastructure**: because entire
  fleets of instances can live in one project, a compromised project can affect
  everything running in it at once.

## Security and Compromise

Access to an OVHcloud Public Cloud project is controlled by API credentials tied
to the account or application managing it. If those credentials leak or
permissions are too broad:

- **Project-wide impact**: an attacker with API access can affect every instance
  in the project, not just one system.
- **Ransomware and data loss at the instance level**: compromised instances can
  be encrypted, deleted, or exfiltrated in a single coordinated action.
- **Compromised secrets compound the problem**: if the credentials used to
  manage instances are the same ones exposed in a breach, there is no clean way
  to regain control.
- **No recovery without a snapshot**: without a backup stored independently of
  the project, there is no way to undo the damage, only to rebuild from scratch.

Plakar mitigates this by keeping OVHcloud snapshots encrypted end-to-end and
stored outside the Public Cloud project itself, so a compromised project doesn't
put its own backup history at risk.

## How Plakar protects your OVHcloud Public Cloud environment

Plakar integrates with OVHcloud Public Cloud in four ways:

- **Inventory**: connect to a Public Cloud project and automatically discover
  the resources running in it such as compute instances and object storage,
  keeping that inventory synchronized as resources are created or removed.
- **Secret provider**: manage the secrets used to access your OVHcloud resources
  directly through Control Plane, backed by OVHcloud's own secret store, instead
  of keeping credentials scattered across scripts and tools.
- **Source Connector**: capture a snapshot of a compute instance and store it in
  an encrypted, deduplicated Kloset, independent of the Public Cloud project it
  runs in.
- **Destination Connector**: restore a snapshot back into its original project,
  a different Public Cloud project, or a freshly provisioned instance.

Instead of relying on OVHcloud's own platform resilience, Plakar gives you an
independent, verifiable, and encrypted backup history for the Public Cloud
infrastructure your business runs on.

