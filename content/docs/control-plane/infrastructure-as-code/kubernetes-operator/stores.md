---
title: "Store Resource"
date: "2026-07-15T00:00:00Z"
weight: 2
summary: "Declaring a store app with the plakar-operator Store custom resource."
---

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
  endpoint: s3://my-backup-bucket
  protocol: s3
  integration:
    name: aws
    version: 1.1.2
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
