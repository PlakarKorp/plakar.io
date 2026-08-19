
# Operator Installation

The Plakar Kubernetes Operator lets you manage Plakar Control Plane (PCP)
resources declaratively using Kubernetes manifests. Once installed and connected
to a PCP instance, the operator reconciles Kubernetes custom resources with the
corresponding resources in PCP.

Each release publishes a container image to
[ghcr.io/plakarkorp/plakar-operator](ghcr.io/plakarkorp/plakar-operator) and a
Helm chart to `oci://ghcr.io/plakarkorp/charts/plakar-operator`. This requires
`kubectl` and `helm` on your machine, as well as administrative access to a
Kubernetes cluster.

{{< steps >}}

{{< step >}}

## Installing the Helm chart

Install the operator's CRDs and controller with Helm. Without `--version`, this
installs the latest published chart:

```sh
$ helm install plakar-operator \
  oci://ghcr.io/plakarkorp/charts/plakar-operator \
  --namespace plakar-operator-system \
  --create-namespace
```

To pin a specific version instead, add `--version <version>`.

To see which values the chart accepts:

```sh
$ helm show values oci://ghcr.io/plakarkorp/charts/plakar-operator
```

Once installed, verify that the operator is running:

```sh
$ kubectl get pods -n plakar-operator-system
```

{{< /step >}}

{{< step >}}

## Generating an API key

The operator authenticates to Plakar Control Plane using an **Application** user
and an associated API key. Application users are intended for non-human clients,
such as operators, automation, and other services that interact with the Plakar
Control Plane API.

See [Managing Users](../../../administration/users) for detailed instructions on
creating application users, assigning organizations, and generating API keys.

You'll use this API key in the next step when creating the Kubernetes Secret
used by the operator to authenticate with Plakar Control Plane.

{{< /step >}}

{{< step >}}

## Connecting to Plakar Control Plane

Once the operator is running, it needs to know which PCP instance to manage and
how to authenticate to it. The operator creates and manages its own inventory in
Plakar Control Plane automatically, so no manual inventory setup is required.

Start by storing the PCP API key in a Kubernetes Secret:

```sh
$ kubectl -n plakar-operator-system create secret generic plakar-credentials \
  --from-literal=apikey=<your-pcp-api-key>
```

The `Plakar` resource references the Secret by name only, so the Secret must
exist in the same namespace as the `Plakar` resource. In this guide, both are
created in the `plakar-operator-system` namespace.

Next, create a `Plakar` resource that references the Secret and your PCP
instance:

```yaml
apiVersion: task.plakar.io/v1alpha1
kind: Plakar
metadata:
  name: my-pcp
  namespace: plakar-operator-system
spec:
  plakarControlPlaneUrl: https://pcp.example.com
  apiKey:
    secretName: plakar-credentials
    key: apikey
```

Only one `Plakar` resource is active at a time per operator deployment. The
operator connects to a single Plakar Control Plane instance, and its
configuration is shared by every reconciler it runs. If several `Plakar`
resources exist, the oldest one by creation time wins. Any other `Plakar`
resource is left with an `Available` condition of `False` and a
`MultiplePlakarResources` reason instead of overwriting the active
configuration.

A rejected `Plakar` resource reports:

```text
Status:
  Conditions:
    Last Transition Time:  2026-07-15T10:14:02Z
    Message:               only one Plakar resource is supported; plakar-operator-system/my-pcp is already active
    Reason:                MultiplePlakarResources
    Status:                False
    Type:                  Available
```

> [!NOTE]+ Multiple `Plakar` resources
>
> Creating an additional `Plakar` resource does not fail. It is just never
> applied. If the active resource is later deleted, a previously rejected one
> only takes over the next time it is reconciled, for example after a spec edit
> or an operator restart.

Verify that the operator successfully connected to Plakar Control Plane:

```sh
$ kubectl -n plakar-operator-system describe plakar my-pcp
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

{{< /step >}}

{{< /steps >}}

