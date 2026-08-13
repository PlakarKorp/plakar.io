
# Kubernetes Operator API reference

This page lists every field on every custom resource defined by . For an
introduction to what these resources are and how to use them, see
[Kubernetes Operator](../../infrastructure-as-code/kubernetes-operator).

## Packages

- [connector.plakar.io/v1alpha1](#connectorplakariov1alpha1)
- [task.plakar.io/v1alpha1](#taskplakariov1alpha1)

## connector.plakar.io/v1alpha1

Package v1alpha1 contains API Schema definitions for the connector v1alpha1 API
group.

### Resource Types

- [Destination](#destination)
- [Source](#source)
- [Store](#store)

#### Destination

Destination is the Schema for the destinations API

| Field                                                                                                              | Description                                                     | Default | Validation            |
| ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | ------- | --------------------- |
| `apiVersion` _string_                                                                                              | `connector.plakar.io/v1alpha1`                                  |         |                       |
| `kind` _string_                                                                                                    | `Destination`                                                   |         |                       |
| `metadata` _[ObjectMeta](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#objectmeta-v1-meta)_ | Refer to Kubernetes API documentation for fields of `metadata`. |         | Optional: \{\} <br /> |
| `spec` _[DestinationSpec](#destinationspec)_                                                                       | spec defines the desired state of Destination                   |         | Required: \{\} <br /> |
| `status` _[DestinationStatus](#destinationstatus)_                                                                 | status defines the observed state of Destination                |         | Optional: \{\} <br /> |

#### DestinationSpec

DestinationSpec defines the desired state of Destination

_Appears in:_

- [Destination](#destination)

| Field                                                             | Description                                                                                                                                                                                                               | Default | Validation            |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------- |
| `endpoint` _string_                                               | The Destination endpoint                                                                                                                                                                                                  |         | Required: \{\} <br /> |
| `protocol` _string_                                               | protocol is the protocol being used in the integration                                                                                                                                                                    |         | Required: \{\} <br /> |
| `integration` _[Integration](#integration)_                       | Integration specifies the integration to use.                                                                                                                                                                             |         | Required: \{\} <br /> |
| `fieldsFrom` _[FieldsFromSource](#fieldsfromsource) array_        | FieldsFrom imports all keys from a list of ConfigMaps or Secrets as fields.<br />Sources are merged in order; later entries override earlier ones.<br />Explicit Fields entries override any key imported via FieldsFrom. |         | Optional: \{\} <br /> |
| `fields` _object (keys:string, values:[FieldValue](#fieldvalue))_ | Fields are the parameters passed to the integration for this destination.<br />Each value may be a literal string or a reference to a key in a<br />ConfigMap or Secret. Fields take precedence over FieldsFrom.          |         | Optional: \{\} <br /> |

#### DestinationStatus

DestinationStatus defines the observed state of Destination.

_Appears in:_

- [Destination](#destination)

| Field                                                                                                                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Default | Validation                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------- |
| `id` _string_                                                                                                            | DestinationID is the created destination id on plakman.                                                                                                                                                                                                                                                                                                                                                                                                                               |         | Pattern: `^[0-9a-fA-F]\{8\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{12\}$` <br /> |
| `observedGeneration` _integer_                                                                                           | observedGeneration is the most recent generation of this resource's<br />spec that the controller has fully processed against plakman.                                                                                                                                                                                                                                                                                                                                                |         | Optional: \{\} <br />                                                                                     |
| `conditions` _[Condition](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#condition-v1-meta) array_ | conditions represent the current state of the Destination resource.<br />Each condition has a unique type and reflects the status of a specific aspect of the resource.<br />Standard condition types include:<br />- "Available": the resource is fully functional<br />- "Progressing": the resource is being created or updated<br />- "Degraded": the resource failed to reach or maintain its desired state<br />The status of each condition is one of True, False, or Unknown. |         | Optional: \{\} <br />                                                                                     |

#### FieldKeySelector

FieldKeySelector selects a single key from a ConfigMap or Secret.

_Appears in:_

- [FieldValueFrom](#fieldvaluefrom)

| Field                | Description                                                                                                       | Default | Validation            |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- | ------- | --------------------- |
| `name` _string_      | Name of the ConfigMap or Secret.                                                                                  |         | Required: \{\} <br /> |
| `key` _string_       | Key is the key within the ConfigMap or Secret.                                                                    |         | Required: \{\} <br /> |
| `optional` _boolean_ | Optional specifies whether the reference must resolve.<br />If true, a missing object or key is silently ignored. |         | Optional: \{\} <br /> |

#### FieldValue

FieldValue holds either a literal string value or a reference to one stored in a
ConfigMap or Secret. Exactly one of Value or ValueFrom should be set.

_Appears in:_

- [DestinationSpec](#destinationspec)
- [SourceSpec](#sourcespec)
- [StoreSpec](#storespec)

| Field                                           | Description                                              | Default | Validation            |
| ----------------------------------------------- | -------------------------------------------------------- | ------- | --------------------- |
| `value` _string_                                | Value is a literal string value.                         |         | Optional: \{\} <br /> |
| `valueFrom` _[FieldValueFrom](#fieldvaluefrom)_ | ValueFrom references a value from a ConfigMap or Secret. |         | Optional: \{\} <br /> |

#### FieldValueFrom

FieldValueFrom references a single key in a ConfigMap or Secret. Exactly one of
the fields must be set.

_Appears in:_

- [FieldValue](#fieldvalue)

| Field                                                     | Description                                     | Default | Validation            |
| --------------------------------------------------------- | ----------------------------------------------- | ------- | --------------------- |
| `secretKeyRef` _[FieldKeySelector](#fieldkeyselector)_    | SecretKeyRef selects a key from a Secret.       |         | Optional: \{\} <br /> |
| `configMapKeyRef` _[FieldKeySelector](#fieldkeyselector)_ | ConfigMapKeyRef selects a key from a ConfigMap. |         | Optional: \{\} <br /> |

#### FieldsFromSource

FieldsFromSource imports all keys from a ConfigMap or a Secret as fields.
Exactly one of ConfigMapRef or SecretRef must be set.

_Appears in:_

- [DestinationSpec](#destinationspec)
- [SourceSpec](#sourcespec)
- [StoreSpec](#storespec)

| Field                                                          | Description                                                           | Default | Validation            |
| -------------------------------------------------------------- | --------------------------------------------------------------------- | ------- | --------------------- |
| `configMapRef` _[LocalObjectReference](#localobjectreference)_ | ConfigMapRef references a ConfigMap whose data is imported as fields. |         | Optional: \{\} <br /> |
| `secretRef` _[LocalObjectReference](#localobjectreference)_    | SecretRef references a Secret whose data is imported as fields.       |         | Optional: \{\} <br /> |

#### Integration

_Appears in:_

- [DestinationSpec](#destinationspec)
- [SourceSpec](#sourcespec)
- [StoreSpec](#storespec)

| Field           | Description      | Default | Validation            |
| --------------- | ---------------- | ------- | --------------------- |
| `name` _string_ | Integration name |         | Required: \{\} <br /> |

#### LocalObjectReference

LocalObjectReference names an object in the same namespace.

_Appears in:_

- [FieldsFromSource](#fieldsfromsource)

| Field           | Description           | Default | Validation            |
| --------------- | --------------------- | ------- | --------------------- |
| `name` _string_ | Name of the referent. |         | Required: \{\} <br /> |

#### Source

Source is the Schema for the sources API

| Field                                                                                                              | Description                                                     | Default | Validation            |
| ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | ------- | --------------------- |
| `apiVersion` _string_                                                                                              | `connector.plakar.io/v1alpha1`                                  |         |                       |
| `kind` _string_                                                                                                    | `Source`                                                        |         |                       |
| `metadata` _[ObjectMeta](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#objectmeta-v1-meta)_ | Refer to Kubernetes API documentation for fields of `metadata`. |         | Optional: \{\} <br /> |
| `spec` _[SourceSpec](#sourcespec)_                                                                                 | spec defines the desired state of Source                        |         | Required: \{\} <br /> |
| `status` _[SourceStatus](#sourcestatus)_                                                                           | status defines the observed state of Source                     |         | Optional: \{\} <br /> |

#### SourceSpec

SourceSpec defines the desired state of Source

_Appears in:_

- [Source](#source)

| Field                                                             | Description                                                                                                                                                                                                               | Default | Validation            |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------- |
| `endpoint` _string_                                               | The Source endpoint                                                                                                                                                                                                       |         | Required: \{\} <br /> |
| `protocol` _string_                                               | protocol is the protocol being used in the integration                                                                                                                                                                    |         | Required: \{\} <br /> |
| `integration` _[Integration](#integration)_                       | Integration specifies the integration to use.                                                                                                                                                                             |         | Required: \{\} <br /> |
| `fieldsFrom` _[FieldsFromSource](#fieldsfromsource) array_        | FieldsFrom imports all keys from a list of ConfigMaps or Secrets as fields.<br />Sources are merged in order; later entries override earlier ones.<br />Explicit Fields entries override any key imported via FieldsFrom. |         | Optional: \{\} <br /> |
| `fields` _object (keys:string, values:[FieldValue](#fieldvalue))_ | Fields are the parameters passed to the integration for this source.<br />Each value may be a literal string or a reference to a key in a<br />ConfigMap or Secret. Fields take precedence over FieldsFrom.               |         | Optional: \{\} <br /> |
| `dataClasses` _string array_                                      | dataClass is the data classes associated with the source.                                                                                                                                                                 |         | Optional: \{\} <br /> |
| `environment` _string_                                            | Environment is the data class.                                                                                                                                                                                            |         | Optional: \{\} <br /> |

#### SourceStatus

SourceStatus defines the observed state of Source.

_Appears in:_

- [Source](#source)

| Field                                                                                                                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Default | Validation                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------- |
| `id` _string_                                                                                                            | SourceID is the created source id on plakman.                                                                                                                                                                                                                                                                                                                                                                                                                                    |         | Pattern: `^[0-9a-fA-F]\{8\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{12\}$` <br /> |
| `observedGeneration` _integer_                                                                                           | observedGeneration is the most recent generation of this resource's<br />spec that the controller has fully processed against plakman.                                                                                                                                                                                                                                                                                                                                           |         | Optional: \{\} <br />                                                                                     |
| `conditions` _[Condition](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#condition-v1-meta) array_ | conditions represent the current state of the Source resource.<br />Each condition has a unique type and reflects the status of a specific aspect of the resource.<br />Standard condition types include:<br />- "Available": the resource is fully functional<br />- "Progressing": the resource is being created or updated<br />- "Degraded": the resource failed to reach or maintain its desired state<br />The status of each condition is one of True, False, or Unknown. |         | Optional: \{\} <br />                                                                                     |

#### Store

Store is the Schema for the stores API

| Field                                                                                                              | Description                                                     | Default | Validation            |
| ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | ------- | --------------------- |
| `apiVersion` _string_                                                                                              | `connector.plakar.io/v1alpha1`                                  |         |                       |
| `kind` _string_                                                                                                    | `Store`                                                         |         |                       |
| `metadata` _[ObjectMeta](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#objectmeta-v1-meta)_ | Refer to Kubernetes API documentation for fields of `metadata`. |         | Optional: \{\} <br /> |
| `spec` _[StoreSpec](#storespec)_                                                                                   | spec defines the desired state of Store                         |         | Required: \{\} <br /> |
| `status` _[StoreStatus](#storestatus)_                                                                             | status defines the observed state of Store                      |         | Optional: \{\} <br /> |

#### StoreSpec

StoreSpec defines the desired state of Store

_Appears in:_

- [Store](#store)

| Field                                                             | Description                                                                                                                                                                                                               | Default | Validation            |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------- |
| `endpoint` _string_                                               | The Store endpoint                                                                                                                                                                                                        |         | Required: \{\} <br /> |
| `protocol` _string_                                               | protocol is the protocol being used in the integration                                                                                                                                                                    |         | Required: \{\} <br /> |
| `integration` _[Integration](#integration)_                       | Integration specifies the integration to use.                                                                                                                                                                             |         | Required: \{\} <br /> |
| `fieldsFrom` _[FieldsFromSource](#fieldsfromsource) array_        | FieldsFrom imports all keys from a list of ConfigMaps or Secrets as fields.<br />Sources are merged in order; later entries override earlier ones.<br />Explicit Fields entries override any key imported via FieldsFrom. |         | Optional: \{\} <br /> |
| `fields` _object (keys:string, values:[FieldValue](#fieldvalue))_ | Fields are the parameters passed to the integration for this store.<br />Each value may be a literal string or a reference to a key in a<br />ConfigMap or Secret. Fields take precedence over FieldsFrom.                |         | Optional: \{\} <br /> |

#### StoreStatus

StoreStatus defines the observed state of Store.

_Appears in:_

- [Store](#store)

| Field                                                                                                                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Default | Validation                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------- |
| `id` _string_                                                                                                            | StoreID is the created store id on plakman.                                                                                                                                                                                                                                                                                                                                                                                                                                     |         | Pattern: `^[0-9a-fA-F]\{8\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{12\}$` <br /> |
| `observedGeneration` _integer_                                                                                           | observedGeneration is the most recent generation of this resource's<br />spec that the controller has fully processed against plakman.                                                                                                                                                                                                                                                                                                                                          |         | Optional: \{\} <br />                                                                                     |
| `conditions` _[Condition](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#condition-v1-meta) array_ | conditions represent the current state of the Store resource.<br />Each condition has a unique type and reflects the status of a specific aspect of the resource.<br />Standard condition types include:<br />- "Available": the resource is fully functional<br />- "Progressing": the resource is being created or updated<br />- "Degraded": the resource failed to reach or maintain its desired state<br />The status of each condition is one of True, False, or Unknown. |         | Optional: \{\} <br />                                                                                     |

## task.plakar.io/v1alpha1

Package v1alpha1 contains API Schema definitions for the task v1alpha1 API
group.

### Resource Types

- [Plakar](#plakar)
- [Restore](#restore)
- [ScheduleBackup](#schedulebackup)
- [ScheduleCheck](#schedulecheck)
- [ScheduleSync](#schedulesync)
- [TaskRun](#taskrun)

#### APIKeyRef

_Appears in:_

- [PlakarSpec](#plakarspec)

| Field                 | Description                | Default | Validation            |
| --------------------- | -------------------------- | ------- | --------------------- |
| `secretName` _string_ | Name of the Secret         |         | Required: \{\} <br /> |
| `key` _string_        | Key within the Secret data |         | Required: \{\} <br /> |

#### ConnectorRef

_Appears in:_

- [RestoreSpec](#restorespec)
- [ScheduleBackupSpec](#schedulebackupspec)
- [ScheduleCheckSpec](#schedulecheckspec)
- [ScheduleSyncSpec](#schedulesyncspec)

| Field                | Description                                                                                                        | Default | Validation            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ | ------- | --------------------- |
| `name` _string_      | Name is the name of the backing connector.                                                                         |         | Required: \{\} <br /> |
| `namespace` _string_ | Namespace is the namespace where to find the backing<br />connector. If not set, the current namespace is assumed. |         | Optional: \{\} <br /> |

#### Plakar

Plakar is the Schema for the plakars API

| Field                                                                                                              | Description                                                     | Default | Validation            |
| ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | ------- | --------------------- |
| `apiVersion` _string_                                                                                              | `task.plakar.io/v1alpha1`                                       |         |                       |
| `kind` _string_                                                                                                    | `Plakar`                                                        |         |                       |
| `metadata` _[ObjectMeta](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#objectmeta-v1-meta)_ | Refer to Kubernetes API documentation for fields of `metadata`. |         | Optional: \{\} <br /> |
| `spec` _[PlakarSpec](#plakarspec)_                                                                                 | spec defines the desired state of Plakar                        |         | Required: \{\} <br /> |
| `status` _[PlakarStatus](#plakarstatus)_                                                                           | status defines the observed state of Plakar                     |         | Optional: \{\} <br /> |

#### PlakarSpec

PlakarSpec defines the desired state of Plakar

_Appears in:_

- [Plakar](#plakar)

| Field                              | Description                                                                                                                                                          | Default | Validation                                                                                                                     |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `plakarControlPlaneUrl` _string_   | The URL for the Plakar Control Plane instance.                                                                                                                       |         | Format: uri <br />Required: \{\} <br />                                                                                        |
| `inventoryUUID` _string_           | The UUID of the inventory dedicated to the operator.<br />If unset, the operator creates a self-managed inventory and<br />records its UUID in status.inventoryUUID. |         | Pattern: `^[0-9a-fA-F]\{8\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{12\}$` <br />Optional: \{\} <br /> |
| `apiKey` _[APIKeyRef](#apikeyref)_ | API key.                                                                                                                                                             |         | Required: \{\} <br />                                                                                                          |

#### PlakarStatus

PlakarStatus defines the observed state of Plakar.

_Appears in:_

- [Plakar](#plakar)

| Field                                                                                                                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Default | Validation                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `conditions` _[Condition](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#condition-v1-meta) array_ | conditions represent the current state of the Plakar resource.<br />Each condition has a unique type and reflects the status of a specific aspect of the resource.<br />Standard condition types include:<br />- "Available": the resource is fully functional<br />- "Progressing": the resource is being created or updated<br />- "Degraded": the resource failed to reach or maintain its desired state<br />The status of each condition is one of True, False, or Unknown. |         | Optional: \{\} <br />                                                                                                          |
| `inventoryUUID` _string_                                                                                                 | The UUID of the inventory dedicated to the operator, either<br />mirrored from spec.inventoryUUID or created by the operator<br />when spec.inventoryUUID was left unset. Once set, it is never<br />regenerated.                                                                                                                                                                                                                                                                |         | Pattern: `^[0-9a-fA-F]\{8\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{12\}$` <br />Optional: \{\} <br /> |

#### Restore

Restore is the Schema for the restores API.

| Field                                                                                                              | Description                                                     | Default | Validation            |
| ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | ------- | --------------------- |
| `apiVersion` _string_                                                                                              | `task.plakar.io/v1alpha1`                                       |         |                       |
| `kind` _string_                                                                                                    | `Restore`                                                       |         |                       |
| `metadata` _[ObjectMeta](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#objectmeta-v1-meta)_ | Refer to Kubernetes API documentation for fields of `metadata`. |         | Optional: \{\} <br /> |
| `spec` _[RestoreSpec](#restorespec)_                                                                               | spec defines the desired state of Restore                       |         | Required: \{\} <br /> |
| `status` _[RestoreStatus](#restorestatus)_                                                                         | status defines the observed state of Restore                    |         | Optional: \{\} <br /> |

#### RestoreSpec

RestoreSpec defines the desired state of Restore.

_Appears in:_

- [Restore](#restore)

| Field                                         | Description                                                                                                                                                                                                                                                                                                                            | Default | Validation            |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------- |
| `store` _[ConnectorRef](#connectorref)_       | Store is the connector where the backup to restore from lives.                                                                                                                                                                                                                                                                         |         | Required: \{\} <br /> |
| `destination` _[ConnectorRef](#connectorref)_ | Destination is the connector where the data will be restored to.                                                                                                                                                                                                                                                                       |         | Required: \{\} <br /> |
| `snapshotID` _string_                         | SnapshotID pins the restore to a specific snapshot. Mutually<br />exclusive with Latest.                                                                                                                                                                                                                                               |         | Optional: \{\} <br /> |
| `latest` _boolean_                            | Latest instructs plakman to restore the most recent snapshot when<br />true. Mutually exclusive with SnapshotID.                                                                                                                                                                                                                       |         | Optional: \{\} <br /> |
| `edgeTags` _string array_                     | EdgeTags selects a remote edge to run this restore by tag match:<br />all listed tags must be present on the edge. Omitted/empty matches<br />any online edge, preferring one over local execution; if none are<br />online it falls back to running locally. A populated list that<br />matches no online edge fails the run instead. |         | Optional: \{\} <br /> |

#### RestoreStatus

RestoreStatus defines the observed state of Restore.

_Appears in:_

- [Restore](#restore)

| Field                                                                                                                    | Description                                                                            | Default | Validation            |
| ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | ------- | --------------------- |
| `atID` _string_                                                                                                          | AtID is the at-job identifier returned by plakman when the restore<br />was submitted. |         | Optional: \{\} <br /> |
| `conditions` _[Condition](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#condition-v1-meta) array_ | conditions represent the current state of the Restore resource.                        |         | Optional: \{\} <br /> |

#### ScheduleBackup

ScheduleBackup is the Schema for the schedulebackups API

| Field                                                                                                              | Description                                                     | Default | Validation            |
| ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | ------- | --------------------- |
| `apiVersion` _string_                                                                                              | `task.plakar.io/v1alpha1`                                       |         |                       |
| `kind` _string_                                                                                                    | `ScheduleBackup`                                                |         |                       |
| `metadata` _[ObjectMeta](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#objectmeta-v1-meta)_ | Refer to Kubernetes API documentation for fields of `metadata`. |         | Optional: \{\} <br /> |
| `spec` _[ScheduleBackupSpec](#schedulebackupspec)_                                                                 | spec defines the desired state of ScheduleBackup                |         | Required: \{\} <br /> |
| `status` _[ScheduleBackupStatus](#schedulebackupstatus)_                                                           | status defines the observed state of ScheduleBackup             |         | Optional: \{\} <br /> |

#### ScheduleBackupSpec

ScheduleBackupSpec defines the desired state of ScheduleBackup

_Appears in:_

- [ScheduleBackup](#schedulebackup)

| Field                                    | Description                                                                                                                                                                                                                                                                                                                          | Default | Validation                                               |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- | -------------------------------------------------------- |
| `periodicity` _integer_                  | Periodicity is the interval in second for the operation.                                                                                                                                                                                                                                                                             |         | Minimum: 1 <br />Required: \{\} <br />                   |
| `source` _[ConnectorRef](#connectorref)_ | Source is the UUID of the source                                                                                                                                                                                                                                                                                                     |         | Required: \{\} <br />                                    |
| `store` _[ConnectorRef](#connectorref)_  | Store is the UUID of the store                                                                                                                                                                                                                                                                                                       |         | Required: \{\} <br />                                    |
| `edgeTags` _string array_                | EdgeTags selects a remote edge to run this task by tag match: all<br />listed tags must be present on the edge. Omitted/empty matches any<br />online edge, preferring one over local execution; if none are<br />online it falls back to running locally. A populated list that<br />matches no online edge fails the task instead. |         | Optional: \{\} <br />                                    |
| `historyLimit` _integer_                 | HistoryLimit caps the number of TaskRun objects kept for this<br />schedule. Older runs are pruned once the limit is exceeded.<br />Defaults to 5 when unset. Maximum is 20.                                                                                                                                                         |         | Maximum: 20 <br />Minimum: 1 <br />Optional: \{\} <br /> |

#### ScheduleBackupStatus

ScheduleBackupStatus defines the observed state of ScheduleBackup.

_Appears in:_

- [ScheduleBackup](#schedulebackup)

| Field                                                                                                                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Default | Validation                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------- |
| `id` _string_                                                                                                            | ID is the created backup task id on plakman.                                                                                                                                                                                                                                                                                                                                                                                                                                             |         | Pattern: `^[0-9a-fA-F]\{8\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{12\}$` <br /> |
| `conditions` _[Condition](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#condition-v1-meta) array_ | conditions represent the current state of the ScheduleBackup resource.<br />Each condition has a unique type and reflects the status of a specific aspect of the resource.<br />Standard condition types include:<br />- "Available": the resource is fully functional<br />- "Progressing": the resource is being created or updated<br />- "Degraded": the resource failed to reach or maintain its desired state<br />The status of each condition is one of True, False, or Unknown. |         | Optional: \{\} <br />                                                                                     |

#### ScheduleCheck

ScheduleCheck is the Schema for the schedulechecks API

| Field                                                                                                              | Description                                                     | Default | Validation            |
| ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | ------- | --------------------- |
| `apiVersion` _string_                                                                                              | `task.plakar.io/v1alpha1`                                       |         |                       |
| `kind` _string_                                                                                                    | `ScheduleCheck`                                                 |         |                       |
| `metadata` _[ObjectMeta](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#objectmeta-v1-meta)_ | Refer to Kubernetes API documentation for fields of `metadata`. |         | Optional: \{\} <br /> |
| `spec` _[ScheduleCheckSpec](#schedulecheckspec)_                                                                   | spec defines the desired state of ScheduleCheck                 |         | Required: \{\} <br /> |
| `status` _[ScheduleCheckStatus](#schedulecheckstatus)_                                                             | status defines the observed state of ScheduleCheck              |         | Optional: \{\} <br /> |

#### ScheduleCheckSpec

ScheduleCheckSpec defines the desired state of ScheduleCheck

_Appears in:_

- [ScheduleCheck](#schedulecheck)

| Field                                   | Description                                                                                                                                                                                                                                                                                                                          | Default | Validation                                               |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- | -------------------------------------------------------- |
| `periodicity` _integer_                 | Periodicity is the interval in second for the operation.                                                                                                                                                                                                                                                                             |         | Minimum: 1 <br />Required: \{\} <br />                   |
| `store` _[ConnectorRef](#connectorref)_ | Store is the store to check.                                                                                                                                                                                                                                                                                                         |         | Required: \{\} <br />                                    |
| `edgeTags` _string array_               | EdgeTags selects a remote edge to run this task by tag match: all<br />listed tags must be present on the edge. Omitted/empty matches any<br />online edge, preferring one over local execution; if none are<br />online it falls back to running locally. A populated list that<br />matches no online edge fails the task instead. |         | Optional: \{\} <br />                                    |
| `historyLimit` _integer_                | HistoryLimit caps the number of TaskRun objects kept for this<br />schedule. Older runs are pruned once the limit is exceeded.<br />Defaults to 5 when unset. Maximum is 20.                                                                                                                                                         |         | Maximum: 20 <br />Minimum: 1 <br />Optional: \{\} <br /> |

#### ScheduleCheckStatus

ScheduleCheckStatus defines the observed state of ScheduleCheck.

_Appears in:_

- [ScheduleCheck](#schedulecheck)

| Field                                                                                                                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Default | Validation                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------- |
| `id` _string_                                                                                                            | ID is the created check task id on plakman.                                                                                                                                                                                                                                                                                                                                                                                                                                             |         | Pattern: `^[0-9a-fA-F]\{8\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{12\}$` <br /> |
| `conditions` _[Condition](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#condition-v1-meta) array_ | conditions represent the current state of the ScheduleCheck resource.<br />Each condition has a unique type and reflects the status of a specific aspect of the resource.<br />Standard condition types include:<br />- "Available": the resource is fully functional<br />- "Progressing": the resource is being created or updated<br />- "Degraded": the resource failed to reach or maintain its desired state<br />The status of each condition is one of True, False, or Unknown. |         | Optional: \{\} <br />                                                                                     |

#### ScheduleSync

ScheduleSync is the Schema for the schedulesyncs API

| Field                                                                                                              | Description                                                     | Default | Validation            |
| ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | ------- | --------------------- |
| `apiVersion` _string_                                                                                              | `task.plakar.io/v1alpha1`                                       |         |                       |
| `kind` _string_                                                                                                    | `ScheduleSync`                                                  |         |                       |
| `metadata` _[ObjectMeta](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#objectmeta-v1-meta)_ | Refer to Kubernetes API documentation for fields of `metadata`. |         | Optional: \{\} <br /> |
| `spec` _[ScheduleSyncSpec](#schedulesyncspec)_                                                                     | spec defines the desired state of ScheduleSync                  |         | Required: \{\} <br /> |
| `status` _[ScheduleSyncStatus](#schedulesyncstatus)_                                                               | status defines the observed state of ScheduleSync               |         | Optional: \{\} <br /> |

#### ScheduleSyncSpec

ScheduleSyncSpec defines the desired state of ScheduleSync

_Appears in:_

- [ScheduleSync](#schedulesync)

| Field                                              | Description                                                                                                                                                                                                                                                                                                                          | Default | Validation                                               |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- | -------------------------------------------------------- |
| `periodicity` _integer_                            | Periodicity is the interval in second for the operation.                                                                                                                                                                                                                                                                             |         | Minimum: 1 <br />Required: \{\} <br />                   |
| `sourceStore` _[ConnectorRef](#connectorref)_      | SourceStore is the store to sync from.                                                                                                                                                                                                                                                                                               |         | Required: \{\} <br />                                    |
| `destinationStore` _[ConnectorRef](#connectorref)_ | DestinationStore is the store to sync to.                                                                                                                                                                                                                                                                                            |         | Required: \{\} <br />                                    |
| `edgeTags` _string array_                          | EdgeTags selects a remote edge to run this task by tag match: all<br />listed tags must be present on the edge. Omitted/empty matches any<br />online edge, preferring one over local execution; if none are<br />online it falls back to running locally. A populated list that<br />matches no online edge fails the task instead. |         | Optional: \{\} <br />                                    |
| `historyLimit` _integer_                           | HistoryLimit caps the number of TaskRun objects kept for this<br />schedule. Older runs are pruned once the limit is exceeded.<br />Defaults to 5 when unset. Maximum is 20.                                                                                                                                                         |         | Maximum: 20 <br />Minimum: 1 <br />Optional: \{\} <br /> |

#### ScheduleSyncStatus

ScheduleSyncStatus defines the observed state of ScheduleSync.

_Appears in:_

- [ScheduleSync](#schedulesync)

| Field                                                                                                                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Default | Validation                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------- |
| `id` _string_                                                                                                            | ID is the created sync task id on plakman.                                                                                                                                                                                                                                                                                                                                                                                                                                             |         | Pattern: `^[0-9a-fA-F]\{8\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{4\}-[0-9a-fA-F]\{12\}$` <br /> |
| `conditions` _[Condition](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#condition-v1-meta) array_ | conditions represent the current state of the ScheduleSync resource.<br />Each condition has a unique type and reflects the status of a specific aspect of the resource.<br />Standard condition types include:<br />- "Available": the resource is fully functional<br />- "Progressing": the resource is being created or updated<br />- "Degraded": the resource failed to reach or maintain its desired state<br />The status of each condition is one of True, False, or Unknown. |         | Optional: \{\} <br />                                                                                     |

#### TaskRef

TaskRef identifies the schedule resource that owns this run.

_Appears in:_

- [TaskRunSpec](#taskrunspec)

| Field           | Description                                                                                          | Default | Validation            |
| --------------- | ---------------------------------------------------------------------------------------------------- | ------- | --------------------- |
| `name` _string_ | Name is the name of the parent schedule resource.                                                    |         | Required: \{\} <br /> |
| `kind` _string_ | Kind is the kind of the parent schedule resource<br />(ScheduleBackup, ScheduleSync, ScheduleCheck). |         | Required: \{\} <br /> |

#### TaskRun

TaskRun is a virtual record of a single execution of a scheduled task, mirroring
state from the plakman control plane.

| Field                                                                                                              | Description                                                                  | Default | Validation            |
| ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ------- | --------------------- |
| `apiVersion` _string_                                                                                              | `task.plakar.io/v1alpha1`                                                    |         |                       |
| `kind` _string_                                                                                                    | `TaskRun`                                                                    |         |                       |
| `metadata` _[ObjectMeta](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#objectmeta-v1-meta)_ | Refer to Kubernetes API documentation for fields of `metadata`.              |         | Optional: \{\} <br /> |
| `spec` _[TaskRunSpec](#taskrunspec)_                                                                               | spec identifies the execution; it is set once at creation and never mutated. |         | Required: \{\} <br /> |
| `status` _[TaskRunStatus](#taskrunstatus)_                                                                         | status reflects the observed execution state.                                |         | Optional: \{\} <br /> |

#### TaskRunSpec

TaskRunSpec defines the (immutable) identity of a single execution.

_Appears in:_

- [TaskRun](#taskrun)

| Field                           | Description                                                    | Default | Validation            |
| ------------------------------- | -------------------------------------------------------------- | ------- | --------------------- |
| `taskRef` _[TaskRef](#taskref)_ | TaskRef references the parent schedule that produced this run. |         | Required: \{\} <br /> |
| `jobID` _string_                | JobID is the plakman job UUID for this execution.              |         | Required: \{\} <br /> |

#### TaskRunStatus

TaskRunStatus reflects the observed state of the execution as reported by the
plakman control plane.

_Appears in:_

- [TaskRun](#taskrun)

| Field                                                                                                                    | Description                                                                                                  | Default | Validation            |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | ------- | --------------------- |
| `phase` _string_                                                                                                         | Phase is the current lifecycle phase of the execution:<br />queued, running, canceled, succeeded, or failed. |         | Optional: \{\} <br /> |
| `scheduledAt` _[Time](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#time-v1-meta)_                | ScheduledAt is the time the execution was scheduled to run.                                                  |         | Optional: \{\} <br /> |
| `startedAt` _[Time](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#time-v1-meta)_                  | StartedAt is the time the execution actually started.                                                        |         | Optional: \{\} <br /> |
| `stoppedAt` _[Time](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#time-v1-meta)_                  | StoppedAt is the time the execution finished (success or failure).                                           |         | Optional: \{\} <br /> |
| `conditions` _[Condition](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.36/#condition-v1-meta) array_ | conditions represent the current state of the TaskRun resource.                                              |         | Optional: \{\} <br /> |

