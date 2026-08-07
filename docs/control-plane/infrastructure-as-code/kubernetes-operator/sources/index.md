
# Source Resource

A `Source` resource is the declarative equivalent of a
[source app](../../../apps/sources). It defines a resource that Plakar Control
Plane can back up.

```yaml
apiVersion: connector.plakar.io/v1alpha1
kind: Source
metadata:
  name: production-database
spec:
  endpoint: db1.eu-west-3.rds.amazonaws.com
  protocol: postgres+aws
  integration:
    name: postgres
  environment: production
  dataClasses:
    - database
    - pii
  fieldsFrom:
    - secretRef:
        name: postgres-credentials
```

The `endpoint`, `protocol`, and `integration` identify the resource to be backed
up and specify which [integration](../../../resources) is responsible for
accessing it.

The `environment` and `dataClasses` fields provide metadata about the resource.
These values are used by the [policy engine](../../../operations/policies) when
evaluating which backup policies apply to the source.

The `fields` and `fieldsFrom` sections contain the configuration values required
by the integration. Values can either be specified directly using `value` or
read from a Kubernetes `Secret` or `ConfigMap` using `valueFrom`. If many values
come from the same `Secret` or `ConfigMap`, `fieldsFrom` can import them all at
once instead of defining each field individually. See the
[API reference](../../../references/kubernetes-operator#fieldsfromsource) for
more information.

After the resource is created, the corresponding source is created in Plakar
Control Plane. Its UUID is exposed through `status.id` and can be referenced by
a [ScheduleBackup](../scheduling) resource.

## Inspecting sources

Since `Source` is an ordinary Kubernetes custom resource, `kubectl get` and
`kubectl describe` work on it the same way they do on any built-in Kubernetes
object:

```sh
$ kubectl get Source
NAME                  AGE
production-database   42m
```

```sh
$ kubectl describe Source production-database
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
  Id:                      c1b2a3d4-1234-4a5b-9c8d-0e1f2a3b4c5d
  Observed Generation:     1
```

The `Tested` condition reflects the same connection check as the **Test
Connection** action described in
[source app](../../../apps/sources#testing-the-connection). It is run
automatically by the operator instead of manually from the web interface. A
`ConnectionVerified` reason means Plakar Control Plane successfully connected to
the source using the resource's configuration and credentials.

