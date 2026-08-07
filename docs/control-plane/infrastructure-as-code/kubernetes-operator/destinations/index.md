
# Destination Resource

A `Destination` resource is the declarative equivalent of a
[destination app](../../../apps/destinations). It defines where Plakar Control
Plane can restore backup data.

```yaml
apiVersion: connector.plakar.io/v1alpha1
kind: Destination
metadata:
  name: recovery-database
spec:
  endpoint: db2.eu-west-3.rds.amazonaws.com
  protocol: postgres+aws
  integration:
    name: postgres
  fieldsFrom:
    - secretRef:
        name: postgres-recovery-credentials
```

The `endpoint`, `protocol`, and `integration` identify the destination resource
and specify which [integration](../../../resources) is responsible for writing
data to it.

The `fields` and `fieldsFrom` sections contain the configuration values required
by the integration. Values can either be specified directly using `value` or
read from a Kubernetes `Secret` or `ConfigMap` using `valueFrom`. If many values
come from the same `Secret` or `ConfigMap`, `fieldsFrom` can import them all at
once instead of defining each field individually. See the
[API reference](../../../references/kubernetes-operator#fieldsfromsource) for
more information.

After the resource is created, the corresponding destination is created in
Plakar Control Plane. Its UUID is exposed through `status.id`.

To run a one-off restore into this destination, see the
[Restore Resource](../restore).

## Inspecting destinations

Since `Destination` is an ordinary Kubernetes custom resource, `kubectl get` and
`kubectl describe` work on it the same way they do on any built-in Kubernetes
object:

```sh
$ kubectl get Destination
NAME                AGE
recovery-database   17m
```

```sh
$ kubectl describe Destination recovery-database
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
  Id:                      7f6e5d4c-3b2a-4190-8d7c-6b5a4c3d2e1f
  Observed Generation:     1
```

The `Tested` condition reflects the same connection check as the **Test
Connection** action described in
[destination app](../../../apps/destinations#testing-the-connection). It is run
automatically by the operator instead of manually from the web interface. A
`ConnectionVerified` reason means Plakar Control Plane successfully connected to
the destination using the resource's configuration and credentials.

