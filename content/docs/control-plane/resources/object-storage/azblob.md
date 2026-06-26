---
title: "Azure Blob Storage"
date: "2026-06-18T00:00:00Z"
weight: 2
summary: "How to configure Azure Azblob resource in Plakar Control Plane."
---

# Azure Blob Storage

Azure Blob Storage resources represent container-based object storage hosted on
Microsoft Azure. Unlike S3-compatible providers, Azure Blob Storage does not
have a native integration with Plakar Control Plane's inventory discovery. You
need to set up a
[self-managed inventory](../../infrastructure/inventories/self-managed) before
adding an Azure Blob Storage resource.

## Setting up a self-managed inventory

You can create a self managed inventory to manage your Azure resources by just
providing a name for it, read the
[self managed invetory](../../infrastructure/inventories/self-managed)
documentation for more information.

## Adding Azure Blob Storage as a resource

When using a managed inventory, all resources are automatically discovered for
you, but for self managed inventory you'll have to register your resources
manually or import them from a CSV file.

To add Azure Blob Storage container as a resource, you need to use Object
Storage as `class` and Azblob as the `subclass`. For the endpoint you should use
the container name. Read the
[Getting your credentials from Azure](#getting-your-credentials-from-azure) on
where to get the container name.

![](../images/add-azblob-resource.png)

## Configuration

Azure Blob Storage resources can be configured using a source, store, or
destination app.

### Account Name

The name of the Azure Storage account, for example `mystorageaccount`.

### Account Key

The access key used to authenticate with the Azure Storage account.

### Connection String

Optional. The full Azure Blob Storage connection string, for example
`DefaultEndpointsProtocol=https;AccountName=mystorageaccount;AccountKey=...;EndpointSuffix=core.windows.net`.
When provided, this takes precedence over Account Name and Account Key.

### Endpoint

Optional. The Azure Blob service URL, for example
`https://mystorageaccount.blob.core.windows.net`. Only needed when connecting to
a non-standard endpoint such as Azurite for local development.

### No Auth

Optional. Disables authentication entirely. Only useful for public blobs or
local emulator setups such as Azurite. Should never be enabled in production.

## Getting your credentials from Azure

To use Azure Blob Storage, you first need to create a Storage Account and a
Resource Group for it. You can read more under
[Microsoft Storage Accounts](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview)
documentation.

You can create a Storage Container from your Storage Account under **Data
Storage -> Containers**. Use the name of the container as the endpoint when
setting up the resource in [step 2]()

![](../images/azure-create-container.png)

The other remaining credentials can be found under **Security + networking ->
Access Keys**

![](../images/azure-credentials.png)

## Permissions

Plakar Control Plane requires a set of Azure RBAC permissions to access your
Blob Storage containers. These permissions should be assigned to a security
principal which is a user, group, service principal, or managed identity that
Plakar Control Plane will use to authenticate. Azure RBAC roles can be assigned
at the subscription, resource group, storage account, or container level. See
the
[Microsoft Entra ID](https://learn.microsoft.com/en-us/azure/storage/blobs/assign-azure-role-data-access)
documentation for instructions on how to assign roles.

| Permission                                                                            |
| ------------------------------------------------------------------------------------- |
| `Microsoft.Storage/storageAccounts/listKeys/action`                                   |
| `Microsoft.Storage/storageAccounts/read`                                              |
| `Microsoft.Storage/storageAccounts/blobServices/containers/read`                      |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read`                |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write`               |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete`              |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read`           |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write`          |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/versions/read`       |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/versions/delete`     |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/versions/tags/read`  |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/versions/tags/write` |
