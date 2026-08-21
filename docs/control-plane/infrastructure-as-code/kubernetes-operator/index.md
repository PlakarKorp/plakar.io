

# Kubernetes Operator

`plakar-operator` is a Kubernetes controller that lets you manage Plakar Control
Plane (PCP) using Kubernetes custom resources instead of the web interface. You
describe the [apps](../../apps) and [tasks](../../operations/scheduling/tasks)
you want as YAML, apply them with `kubectl apply`, and the operator reconciles
them by calling the real PCP API on your behalf.

The operator doesn't run PCP and doesn't move any backup data itself. It only
creates, updates, and reads objects through PCP's API. PCP itself does all the
_real work_ of doing the actual backup flows. The operator only needs network
access to PCP's API, regardless of where PCP is
[installed](../../intro/installation): as a virtual appliance on AWS, Exoscale,
or Scaleway, or on the same (or a different) Kubernetes cluster.

## Why use it

If you already manage your infrastructure as code such as Kubernetes manifests,
GitOps pipelines and so on, the operator lets you define backups the same way,
next to everything else, instead of switching to a separate UI to set them up.

## Prerequisites

- A running, [enrolled](../../intro/enrollment) PCP instance
- A PCP API key
- A Kubernetes cluster with access to that PCP instance's API endpoint

## Core concepts

The operator introduces two groups of custom resources, which map directly to
concepts you'll already know from the PCP web interface:

- **Plakar**: the operator's own configuration: which PCP instance to talk to
  and which credentials to use. See
  [Kubernetes operator installation](./installation).
- **Source, Store, Destination**: declarative equivalents of PCP's
  [source](../../apps/sources), [store](../../apps/stores), and
  [destination](../../apps/destinations) apps.
- **ScheduleBackup, ScheduleCheck, ScheduleSync**: declarative equivalents of
  the recurring backup, check, and sync tasks covered in
  [Scheduling](../../operations/scheduling).
- **Restore**: a one-off restore job from a `Store` into a `Destination`. See
  [Restore Resource](./restore).

Most resources report the ID PCP assigned them in `status.id`, alongside a set
of conditions (`Available`, `Progressing`, `Degraded`) describing reconciliation
state, similar to how `kubectl get` reports status on any other Kubernetes
object. `Plakar` itself only exposes conditions, since it isn't a PCP object.
Since these are ordinary Kubernetes custom resources, `kubectl get` and
`kubectl describe` work on them the same way they do on any built-in Kubernetes
object.

For the exhaustive field-by-field reference of every custom resource, see the
[Kubernetes Operator API Reference](../../references/kubernetes-operator).






## [Operator Installation](https://www.plakar.io/docs/control-plane/infrastructure-as-code/kubernetes-operator/installation/index.md)



## [Store Resource](https://www.plakar.io/docs/control-plane/infrastructure-as-code/kubernetes-operator/stores/index.md)



## [Source Resource](https://www.plakar.io/docs/control-plane/infrastructure-as-code/kubernetes-operator/sources/index.md)



## [Destination Resource](https://www.plakar.io/docs/control-plane/infrastructure-as-code/kubernetes-operator/destinations/index.md)



## [Restore Resource](https://www.plakar.io/docs/control-plane/infrastructure-as-code/kubernetes-operator/restore/index.md)



## [Scheduling](https://www.plakar.io/docs/control-plane/infrastructure-as-code/kubernetes-operator/scheduling/index.md)




