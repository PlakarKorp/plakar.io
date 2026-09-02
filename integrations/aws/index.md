
## Why protecting your AWS environment matters

AWS accounts grow continuously as resources are provisioned by different teams,
applications, and automation. That makes it easy for resources and the
credentials used to access them to become difficult to track.

- **No built-in inventory discipline**: resources created by hand or by
  automation can drift out of sight, making it hard to know what's actually
  running, let alone what's protected.
- **Access credentials are scattered by default**: API keys and application
  credentials used to manage AWS resources are often stored inconsistently
  across scripts, tools, and team members.
- **Manual upkeep doesn't scale**: registering every resource and keeping track
  of changes by hand quickly falls behind as an AWS account grows.
- **A compromised account can affect everything**: credentials with broad
  permissions can give an attacker access to multiple resources across the
  account at once.

## Security and Compromise

Access to AWS resources is controlled through IAM identities, roles, and
credentials. If those credentials leak or permissions are too broad, the impact
can extend well beyond a single resource:

- **Account-wide impact**: an attacker with sufficiently broad permissions can
  create, modify, or delete resources across the account.
- **Data loss and disruption**: compromised resources can be deleted,
  reconfigured, or used to access and exfiltrate data.
- **Compromised credentials compound the problem**: if the credentials used to
  manage AWS resources are exposed alongside the systems they protect, an
  attacker can continue moving through the environment.
- **No clear view of what is affected**: without an up-to-date inventory, it is
  harder to determine which resources exist and what may have been impacted.

Plakar mitigates this by continuously discovering AWS resources and keeping
their inventory synchronized, while allowing secrets to remain managed through
AWS Secrets Manager rather than being stored directly in Control Plane.

## How Plakar protects your AWS environment

Plakar integrates with AWS in two ways:

- **Inventory**: connect to an AWS account and automatically discover the
  resources running in it, keeping that inventory synchronized as resources are
  created or removed.
- **Secret provider**: manage the secrets used by Plakar Control Plane through
  AWS Secrets Manager instead of storing them in the Control Plane database,
  keeping sensitive credentials under AWS's own secret management system.

These capabilities work independently of each other. You can use AWS inventory
for resource discovery without changing how secrets are stored, use AWS Secrets
Manager as the external secret provider without enabling inventory, or use both
together.

