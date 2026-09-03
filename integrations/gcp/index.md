
## Why protecting your Google Cloud environment matters

Google Cloud projects grow continuously as resources are provisioned by
different teams, applications, and automation. That makes it easy for resources
to become difficult to track.

- **No built-in inventory discipline**: resources created by hand or by
  automation can drift out of sight, making it hard to know what's actually
  running, let alone what's protected.
- **Manual upkeep doesn't scale**: registering every resource and keeping track
  of changes by hand quickly falls behind as a Google Cloud project grows.
- **A compromised project can affect everything**: credentials with broad
  permissions can give an attacker access to multiple resources across the
  project at once.

## Security and Compromise

Access to Google Cloud resources is controlled through IAM roles and service
account keys. If those credentials leak or permissions are too broad, the impact
can extend well beyond a single resource:

- **Project-wide impact**: an attacker with sufficiently broad permissions can
  create, modify, or delete resources across the project.
- **Data loss and disruption**: compromised resources can be deleted,
  reconfigured, or used to access and exfiltrate data.
- **No clear view of what is affected**: without an up-to-date inventory, it is
  harder to determine which resources exist and what may have been impacted.

Plakar mitigates this by continuously discovering Google Cloud resources and
keeping their inventory synchronized.

## How Plakar protects your Google Cloud environment

Plakar integrates with Google Cloud in one way:

- **Inventory**: connect to a Google Cloud project and automatically discover
  the resources running in it, such as Cloud Storage buckets and CloudSQL
  instances, keeping that inventory synchronized as resources are created or
  removed.

Once discovered, resources can be protected with encrypted, deduplicated backups
and restores through their respective integrations.

