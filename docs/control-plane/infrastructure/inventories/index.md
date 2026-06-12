

# Inventories

An inventory connects Plakar Control Plane to a provider and exposes a list of resources available for management. Resources are the individual entities you can back up, use as storage, or restore to, for example, EC2 instances, S3 buckets, and their equivalents across other supported cloud providers.

Once an inventory is connected, you can attach connectors to each resource. Plakar Control Plane supports three connector types:
* **Source** - the resource being backed up
* **Store** - where backups are stored
* **Destination** - where data is restored to

## Managed inventories

Managed inventories connect to a provider using credentials. Plakar Control Plane automatically discovers and classifies resources in your account.  

For example, in an AWS inventory:
* EC2 instances are classified as compute resources  
* S3 buckets are classified as storage resources  

Managed inventories are supported for:
* AWS  
* OVHcloud  
* Scaleway  
* Google Cloud  

## Self-managed inventories

Self-managed inventories allow you to add resources manually, either individually or in bulk. This approach is useful when:
* The infrastructure is not supported by managed inventories (e.g., a local MinIO instance)  
* You require full control over how resources are defined and managed  

## Provider-specific instructions






## [AWS](https://plakar.io/docs/control-plane/infrastructure/inventories/aws/index.md)



## [OVHcloud](https://plakar.io/docs/control-plane/infrastructure/inventories/ovhcloud/index.md)



## [Scaleway](https://plakar.io/docs/control-plane/infrastructure/inventories/scaleway/index.md)



## [Google Cloud](https://plakar.io/docs/control-plane/infrastructure/inventories/google-cloud/index.md)



## [Self Managed](https://plakar.io/docs/control-plane/infrastructure/inventories/self-managed/index.md)




