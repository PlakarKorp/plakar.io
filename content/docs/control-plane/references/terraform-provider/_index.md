---
title: "Terraform Provider"
date: "2026-11-26T11:35:02Z"
weight: 2
summary:
  "Argument-by-argument reference for every resource and data source in the
  plakar Terraform provider."
---

# Terraform provider reference

This section lists every argument and attribute of every resource and data
source in the `plakarkorp/plakar` Terraform provider, version 0.11.1. For an
introduction to what these resources are and how to use them, see
[Terraform Provider](../../infrastructure-as-code/terraform).

## Provider

Manage Plakar backup configuration — stores, connectors and schedules — through
the Plakar management API.

### Example Usage

```terraform
provider "plakar" {
  api_url = "https://plakar.example.com" # or PLAKAR_API_URL
  api_key = var.plakar_api_key           # or PLAKAR_API_KEY
}
```

**Optional**

| Argument          | Type              | Description                                                                                           |
| ----------------- | ----------------- | ----------------------------------------------------------------------------------------------------- |
| `api_key`         | String, Sensitive | API key of a service account (pcp_ak_...). Falls back to PLAKAR_API_KEY.                              |
| `api_url`         | String            | Base URL of the Plakar management API, e.g. https://plakar.example.com. Falls back to PLAKAR_API_URL. |
| `organization_id` | String            | Organization to operate in, when different from the one the API key is bound to.                      |

## Resources and data sources

{{< children description="true" >}}
