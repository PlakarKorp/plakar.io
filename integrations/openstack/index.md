
## Why protecting OpenStack matters

OpenStack projects often hold many servers and volumes created by different
teams and automation, spread across several regions. The cloud runs them, but it
does not keep track of what is protected or keep a copy of them outside itself.

- **Resources spread across regions**: servers and volumes created in different
  regions and by different tools are hard to keep track of, and harder to know
  are protected.
- **Snapshots stay in the cloud**: Cinder snapshots and Glance images are stored
  in the same cloud and project as the data they copy, so they are lost along
  with it.
- **No independent recovery path**: without a copy stored outside the cloud,
  there is nothing to restore from if a server or volume is lost, corrupted or
  deliberately destroyed.

## Security and Compromise

Access to an OpenStack project is controlled by the credentials and roles
granted in Keystone. If a credential leaks or its roles are too broad:

- **Project-wide impact**: an attacker with access to the project can affect
  every server and volume in it, in every region the credential reaches.
- **Data loss at the resource level**: servers and volumes can be deleted,
  encrypted or exfiltrated together with their snapshots.
- **No recovery without a backup**: without a backup stored independently of the
  cloud, there is no way to undo the damage, only to rebuild from scratch.

Plakar mitigates this by keeping OpenStack backups encrypted end-to-end and
stored outside the cloud, so a compromised project does not put its own backup
history at risk.

## How Plakar protects your OpenStack environment

Plakar integrates with OpenStack in three ways:

- **Inventory**: connect to an OpenStack project and discover its Nova servers,
  Cinder volumes, Glance images, Swift containers and Trove databases in every
  region the credential can reach.
- **Source connector**: capture a Nova server with its root disk and attached
  volumes, or a single Cinder volume, and store it in an encrypted, deduplicated
  Kloset, independent of the cloud it runs in.
- **Destination connector**: restore a server or a volume to the same project or
  another one. Disks come back as new Cinder volumes, either attached to an
  existing server, to a new server, or left detached.

Instead of relying on copies kept inside the cloud, Plakar gives you an
independent, verifiable and encrypted backup history for the OpenStack
infrastructure your business runs on.

