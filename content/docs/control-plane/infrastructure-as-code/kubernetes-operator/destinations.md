---
title: "Destination Resource"
date: "2026-07-15T00:00:00Z"
weight: 4
summary:
  "Define a destination using the plakar-operator Destination custom resource."
---

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
    version: 1.1.0
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

At present, the Kubernetes operator does not provide a `ScheduleRestore` custom
resource. Creating a `Destination` resource only registers it as a valid restore
target in Plakar Control Plane. Restore operations must still be initiated
through the web interface or API.
