
## Why protecting etcd matters

etcd stores the entire state of a distributed system, e.g. in a Kubernetes
cluster, that means every workload, configuration, secret, and policy. Its
built-in replication handles partial failures well, but it has limits:

- **Quorum loss**: If too many nodes fail at once, etcd cannot recover without
  external intervention. Without a snapshot, the cluster state is gone.
- **Logical corruption**: A bad write, a botched upgrade, or a misconfigured
  operator can corrupt cluster state in ways that replication spreads rather
  than prevents.
- **No point-in-time recovery**: etcd does not natively provide a way to roll
  back to an earlier known-good state. Without snapshots, there is no recovery
  point to return to.

For any system that relies on etcd, an independent backup is the last line of
defense.

## What happens when etcd is lost?

In a Kubernetes cluster, losing etcd without a backup means losing everything
the API server knows about: deployments, services, secrets, namespaces, RBAC
policies, and custom resources. The underlying workloads may still be running,
but the cluster cannot manage, schedule, or recover them.

Rebuilding from scratch takes time and risks missing configuration that was
never captured in source control. A Plakar snapshot lets you restore the cluster
to a known state instead.

## How Plakar protects etcd

Plakar connects to one or more etcd nodes, takes a consistent snapshot of the
cluster, and stores it in a Kloset — encrypted, deduplicated, and independent of
the cluster itself.

Snapshots can be stored on any supported backend: local storage, S3-compatible
object storage, SFTP, or cold storage. Because Plakar snapshots are immutable,
they remain intact even if the cluster or its storage is compromised.

Restoring etcd from a Plakar snapshot uses the standard `etcdutl` recovery
workflow. Plakar retrieves the snapshot from the Kloset store and writes it to
disk, from where the native etcd tooling takes over.

