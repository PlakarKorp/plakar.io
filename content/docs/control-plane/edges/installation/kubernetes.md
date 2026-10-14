---
title: "Kubernetes"
date: "2026-07-13T00:00:00Z"
weight: 2
summary: "Deploy edges on Kubernetes with the plakar-edge Helm chart."
---

# Installing an Edge on Kubernetes

Each release provides a container image and Helm chart:

```text
ghcr.io/plakarkorp/plakar-edge
oci://ghcr.io/plakarkorp/charts/plakar-edge
```

The Helm chart runs each edge as an independent StatefulSet replica. Each
replica receives its own identity when it enrolls with the Control Plane.

The edge stores its identity and package cache on persistent storage. This is
important because restarting a pod should not cause it to enroll as a new edge.

Each replica also has a stable hostname, which is used as its edge name by
default.

## Store the enrollment key

Store the enrollment key in a Kubernetes Secret rather than putting it directly
in the Helm values:

```sh
$ kubectl create secret generic plakar-edge-enroll-key \
  --from-literal=enroll-key=<enrollment-key>
```

The chart references the Secret by name, keeping the enrollment key out of
`values.yaml`, rendered manifests, and Helm history.

## Install the chart

For example, to run three edges:

```sh
$ helm install my-edges oci://ghcr.io/plakarkorp/charts/plakar-edge \
  --set controlPlane=https://plakman.example.com \
  --set organization=<organization-id> \
  --set enrollKey.secretName=plakar-edge-enroll-key \
  --set replicaCount=3
```

Each replica enrolls independently and appears as a separate edge in the Control
Plane.

Without `--version`, Helm installs the latest published chart. To pin a release,
specify the chart version:

```sh
--version <version>
```

The chart automatically uses the image version associated with the selected
chart release.

## Configure the chart

The main values for an edge deployment are:

| Value                          | Default                          | Description                                                                                     |
| ------------------------------ | -------------------------------- | ----------------------------------------------------------------------------------------------- |
| `controlPlane`                 | `""`                             | Base URL of the Plakar Control Plane. Required.                                                 |
| `organization`                 | `""`                             | Identifier of the organization the edges should join. Required.                                 |
| `enrollKey.secretName`         | `""`                             | Existing Secret containing the enrollment key. Required.                                        |
| `enrollKey.secretKey`          | `enroll-key`                     | Key containing the enrollment key inside the Secret.                                            |
| `replicaCount`                 | `1`                              | Number of independent edges to run.                                                             |
| `tags`                         | `""`                             | Tags reported by every edge.                                                                    |
| `pollHold`                     | `""`                             | Long-poll duration. An empty value uses the binary default.                                     |
| `persistence.size`             | `5Gi`                            | Storage allocated to each edge.                                                                 |
| `persistence.storageClassName` | `""`                             | StorageClass used for the edge volume. An empty value uses the cluster default.                 |
| `persistence.mountPath`        | `/data`                          | Mount point for the edge's persistent data.                                                     |
| `image.repository`             | `ghcr.io/plakarkorp/plakar-edge` | Edge container image repository.                                                                |
| `image.tag`                    | `""`                             | Edge image tag. An empty value uses the chart's application version.                            |
| `scripts.configMapName`        | `""`                             | Existing ConfigMap whose entries are the [hook scripts](../../hooks). Empty refuses every hook. |
| `scripts.mountPath`            | `/scripts`                       | Mount point of the hook scripts, passed to the edge as `-scripts-dir`.                          |

The chart also supports standard Kubernetes scheduling and resource settings
such as `resources`, `serviceAccount`, `nodeSelector`, `tolerations`, and
`affinity`.

To see all available values:

```sh
$ helm show values oci://ghcr.io/plakarkorp/charts/plakar-edge
```
