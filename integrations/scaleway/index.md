
## Why protecting Scaleway matters

Scaleway Instances and Block Storage volumes are often provisioned, scaled, and
torn down quickly. That speed makes them easy to run and just as easy to lose
track of. Scaleway runs the underlying infrastructure, but it does not discover,
secure, or recover your data for you.

- **No built-in inventory discipline**: Instances and volumes created by
  different people or automation can drift out of sight, making it hard to know
  what's actually running, let alone what's protected.
- **Access credentials are scattered by default**: API keys used to manage a
  Scaleway project are often stored inconsistently across scripts, tools, and
  team members.
- **No independent recovery path**: without a snapshot stored outside the
  project, there is nothing to restore from if an Instance or volume is lost,
  corrupted, or deliberately destroyed.
- **Secrets are just as exposed**: Secret Manager centralizes credentials, but a
  deleted or overwritten secret is gone unless a copy exists outside the service
  itself.
- **A single point of failure for a lot of infrastructure**: because entire
  fleets of Instances can live in one project, a compromised project can affect
  everything running in it at once.

## Security and Compromise

Access to a Scaleway project is controlled by API keys tied to the account or
IAM application managing it. If those credentials leak or permissions are too
broad:

- **Project-wide impact**: an attacker with API access can affect every Instance
  and volume in the project, not just one system.
- **Ransomware and data loss at the resource level**: compromised Instances or
  volumes can be encrypted, deleted, or exfiltrated in a single coordinated
  action.
- **Compromised secrets compound the problem**: if the credentials used to
  manage resources are the same ones exposed in a breach, there is no clean way
  to regain control.
- **No recovery without a snapshot**: without a backup stored independently of
  the project, there is no way to undo the damage, only to rebuild from scratch.

Plakar mitigates this by keeping Scaleway snapshots encrypted end-to-end and
stored outside the project itself, so a compromised project doesn't put its own
backup history at risk.

## How Plakar protects your Scaleway environment

Plakar integrates with Scaleway in four ways:

- **Inventory**: connect to a Scaleway project and automatically discover the
  resources running in it, such as object storage, compute instances, block
  storage volumes and the secret manager keeping that inventory synchronized as
  resources are created or removed.
- **Secret provider**: by default, Plakar Control Plane stores its secrets
  directly in its own database. Scaleway Secret Manager can instead be
  configured as an external secret provider, so those secrets are managed by
  Scaleway rather than stored in Control Plane itself.
- **Source connector**: capture a snapshot of an instance, a block storage
  volume, or the secrets held in Scaleway secret manager, and store it in an
  encrypted, deduplicated Kloset, independent of the project it runs in.
- **Destination connector**: restore a snapshot back into its original project
  or a different Scaleway project whether is a compute instance, a block storage
  volume, or Secret Manager, whichever the snapshot came from.

Instead of relying on Scaleway's own platform resilience, Plakar gives you an
independent, verifiable, and encrypted backup history for the Scaleway
infrastructure your business runs on, including the secrets that keep it
running.

