
# Store Resource

A `Store` resource is the declarative equivalent of a
[store app](../../../apps/stores). It defines where Plakar Control Plane stores
backup data.

```yaml
apiVersion: connector.plakar.io/v1alpha1
kind: Store
metadata:
  name: production-s3
spec:
  endpoint: bucket1.s3.eu-west-3.amazonaws.com
  protocol: s3
  integration:
    name: aws
  fields:
    region:
      value: eu-west-1
    accessKey:
      valueFrom:
        secretKeyRef:
          name: aws-credentials
          key: accessKey
    secretAccessKey:
      valueFrom:
        secretKeyRef:
          name: aws-credentials
          key: secretAccessKey
```

The `endpoint` and `protocol` identify the storage location, just as you would
when configuring a store app through the Plakar Control Plane web interface. The
`integration` specifies which [integration](../../../resources) manages the
selected protocol.

The `fields` section contains the configuration values required by the
integration. Values can either be specified directly using `value` or read from
a Kubernetes `Secret` or `ConfigMap` using `valueFrom`. Referencing Secrets
allows sensitive information, such as access keys, to remain outside the
resource manifest.

If many configuration values come from the same `Secret` or `ConfigMap`, you can
use `fieldsFrom` to import them all at once instead of defining each field
individually. See the
[API reference](../../../references/kubernetes-operator#fieldsfromsource) for
more information.

After the resource is created, the corresponding store is created in Plakar
Control Plane. Its UUID is exposed through `status.id` and can be referenced by
[ScheduleBackup](../scheduling), [ScheduleCheck](../scheduling), and
[ScheduleSync](../scheduling) resources.

## Inspecting Stores

Since `Store` is an ordinary Kubernetes custom resource, `kubectl get` and
`kubectl describe` work on it the same way they do on any built-in Kubernetes
object:

```sh
$ kubectl get Store
NAME       AGE
s3bucket   111m
```

```sh
$ kubectl describe Store s3bucket
...
Status:
  Conditions:
    Last Transition Time:  2026-08-07T08:10:31Z
    Message:               Underlying connector updated at plakar control-plane
    Reason:                Updated
    Status:                True
    Type:                  Available
    Last Transition Time:  2026-08-07T08:10:31Z
    Message:               connector is reachable
    Reason:                ConnectionVerified
    Status:                True
    Type:                  Tested
  Id:                      ba8191e7-d02d-431b-8ca4-3a1c3a26a406
  Observed Generation:     1
```

The `Tested` condition reflects the same connection check as the **Test
Connection** action described in
[store app](../../../apps/stores#testing-and-initializing). It is run
automatically by the operator instead of manually from the web interface. A
`ConnectionVerified` reason means Plakar Control Plane successfully connected to
the store using the resource's configuration and credentials.

