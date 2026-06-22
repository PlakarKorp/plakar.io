---
title: "Managing IAM Roles and Service Accounts"
date: "2026-06-21T00:00:00Z"
weight: 1
summary:
  "How to create Google Cloud IAM custom roles, service accounts, and service
  account keys for use with Plakar Control Plane."
---

# Managing IAM Roles and Service Accounts

Plakar Control Plane requires permissions to access Google Cloud services in
different situations. For example, when using Google Cloud Storage, Plakar
Control Plane needs permission to read from and write to buckets. Credentials
are also used by
[Google Cloud Inventory](../../../infrastructure/inventories/gcp) to discover
resources in your project, and by integrations to manage different resources.

In Google Cloud, access is managed through IAM roles assigned to service
accounts. A custom role defines the exact permissions granted, and a service
account acts as the identity that holds that role. A service account key is then
generated and used by external services such as Plakar Control Plane to
authenticate against Google Cloud APIs.

This guide walks through creating a custom IAM role, creating a service account,
assigning the role to it, and generating a service account key.

## Creating a Custom Role

The first step is to create a custom IAM role with the permissions required by
the Google Cloud service you want Plakar to use.

The exact permissions depend on the feature you are configuring. For example,
the [Google Cloud inventory](../../../infrastructure/inventories/gcp)
documentation lists the permissions required to discover Google Cloud resources,
while the [GCS resource](../../../resources/object-storage/gcs) documentation
lists the permissions required to use a Cloud Storage bucket as a source, store,
or destination.

To create a custom role, open **IAM & Admin > Roles** in the Google Cloud
Console and click **Create Custom Role** under the **Custom** roles tab. Provide
a name and description for the role. You'll also need to select a role launch
stage. The launch stage indicates the maturity of the role and is for
organizational tracking purposes only — it does not affect what the role can
do. For a role used with Plakar Control Plane, select **General Availability**.
Then add the required permissions. You can search for permissions by name to
find the ones you need.

After adding the required permissions, click **Create** to save the role.

{{< figure src="../images/create-google-cloud-role.png" class="mx-auto max-w-100" >}}

![](../images/adding-permissions-to-role.png)

## Creating a Service Account

After creating the custom role, create a service account to act as the identity
Plakar Control Plane will use when accessing Google Cloud services.

To create a service account, open **IAM & Admin > Service Accounts** in the
Google Cloud Console and click **Create Service Account**. Provide a name and
description for the service account, then click **Create and Continue**.

{{< figure src="../images/creating-service-account.png" class="mx-auto max-w-100" >}}

On the next step, assign the custom role created in the previous step to the
service account. Click **Select a role**, then under **Custom** you can find the
custom role we created before.

{{< figure src="../images/assigning-role-to-service-account.png" class="mx-auto max-w-100" >}}

Click **Done** to finish creating the service account.

## Generating a Service Account Key

After creating the service account and assigning the role, generate a key for
the service account. This key is what Plakar Control Plane uses to authenticate
with Google Cloud APIs.

To generate a key, open the service account details page by clicking on the
service account in **IAM & Admin > Service Accounts**. Go to the **Keys** tab
and click **Add Key > Create new key**.

Select **JSON** as the key type and click **Create**. Google Cloud will generate
the key and download it to your machine as a JSON file.

> [!WARNING]+
>
> The JSON key file is only available at the time of creation. Store it securely
> before leaving the page, and treat it as you would any other sensitive
> credential.
