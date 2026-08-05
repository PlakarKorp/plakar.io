---
title: "Source Resource"
date: "2026-07-15T00:00:00Z"
weight: 3
summary: "Define a source using the plakar-operator Source custom resource."
---

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
