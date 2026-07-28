---
title: "Operator Installation"
date: "2026-07-15T00:00:00Z"
weight: 1
summary:
  "Install the plakar-operator into a Kubernetes cluster and connect it to a
  Plakar Control Plane instance."
---

# Operator Installation

The Plakar Kubernetes Operator lets you manage Plakar Control Plane (PCP)
resources declaratively using Kubernetes manifests. Once installed and connected
to a PCP instance, the operator reconciles Kubernetes custom resources with the
corresponding resources in PCP.

`plakar-operator` does not yet have a published container image. For now, you'll
build the operator image yourself and push it to a container registry that your
Kubernetes cluster can access.

This requires Go, Docker, and `kubectl` on your machine, as well as
administrative access to a Kubernetes cluster. See the
[project README](https://github.com/PlakarKorp/plakar-operator#prerequisites)
for the supported tool versions.

> [!NOTE]+
>
> A published container image on `ghcr.io` and a Helm chart are planned for a
> future release. Once available, installation will no longer require building
> and publishing the image manually.

Clone the
[plakar-operator repository](https://github.com/PlakarKorp/plakar-operator),
then build the operator image and push it to a container registry that your
cluster can access:

```sh
make docker-build docker-push IMG=<some-registry>/plakar-operator:tag
```

The registry must be reachable by your Kubernetes cluster, since it will pull
the image when the operator is deployed.

Next, install the operator's Custom Resource Definitions (CRDs). These define
the Kubernetes resource types that the operator watches and manages.

```sh
make install
```

Deploy the operator, pointing it to the image you just pushed:

```sh
make deploy IMG=<some-registry>/plakar-operator:tag
```

> [!NOTE]+
>
> If deployment fails with RBAC errors, ensure you're authenticated as a cluster
> administrator or have sufficient permissions to create the required roles and
> role bindings.

Verify that the operator is running:

```sh
kubectl get pods -n plakar-operator-system
```

## Generating an API key

The operator authenticates to Plakar Control Plane using an **Application** user
and an associated API key. Application users are intended for non-human clients,
such as operators, automation, and other services that interact with the Plakar
Control Plane API.

See [Managing Users](../../../administration/users) for detailed instructions on
creating application users, assigning organizations, and generating API keys.

You'll use this API key in the next step when creating the Kubernetes Secret
used by the operator to authenticate with Plakar Control Plane.

## Creating an inventory

The operator creates and manages resources inside a Plakar Control Plane
inventory. Create a new **Self-managed** inventory for the operator to use.

You can give the inventory any name, for example `kube`. Once the inventory has
been created, open its details page and copy the **Inventory UUID**. You'll need
this value when configuring the operator in the next step.

![Copying the inventory UUID](../images/operator-inventory-uuid.png)

It's recommended to dedicate this inventory to the operator. This keeps
operator-managed resources separate from resources created manually through the
Plakar Control Plane web interface.

> [!NOTE]+ Creating Inventories
>
> A future version of the operator will be able to create and manage its own
> inventory automatically. When that becomes available, this manual step will no
> longer be required.

## Connecting to Plakar Control Plane

Once the operator is running, it needs to know which PCP instance to manage and
how to authenticate to it.

Start by storing the PCP API key in a Kubernetes Secret:

```sh
kubectl -n plakar-operator-system create secret generic plakar-credentials \
  --from-literal=apikey=<your-pcp-api-key>
```

The `Plakar` resource references the Secret by name only, so the Secret must
exist in the same namespace as the `Plakar` resource. In this guide, both are
created in the `plakar-operator-system` namespace.

Next, create a `Plakar` resource that references the Secret, your PCP instance,
and the inventory UUID:

```yaml
apiVersion: task.plakar.io/v1alpha1
kind: Plakar
metadata:
  name: my-pcp
  namespace: plakar-operator-system
spec:
  plakarControlPlaneUrl: https://pcp.example.com
  inventoryUUID: 11111111-2222-3333-4444-555555555555
  apiKey:
    secretName: plakar-credentials
    key: apikey
```

You'll typically create one `Plakar` resource for each Plakar Control Plane
instance you want the operator to manage.

Verify that the operator successfully connected to Plakar Control Plane:

```sh
kubectl -n plakar-operator-system describe plakar my-pcp
```

A successful connection reports an `Available` condition with a status of `True`
and a message similar to:

```text
Status:
  Conditions:
    Last Transition Time:  2026-07-15T10:13:32Z
    Message:               Configuration successfully loaded
    Reason:                ConfigurationLoaded
    Status:                True
    Type:                  Available
```
