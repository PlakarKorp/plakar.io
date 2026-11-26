---
title: "Integrations and Classification"
date: "2026-11-25T00:00:00Z"
weight: 6
summary:
  "Installing integrations with plakar_integration, and declaring environments
  and data classes."
---

# Integrations and Classification

## Integrations

`plakar_integration` installs an [integration](../../../integrations) from the
catalog and makes that version the current one for its name.

```terraform
resource "plakar_integration" "s3" {
  name    = "s3"
  version = "v1.1.10"
}
```

Integrations belong to the whole deployment, not to an organization. Managing
them requires an API key whose application user holds the
[Platform Admin](../../../access-control/permissions/platform-admin) role. The
provider installs the given `version`, or the latest one in the catalog if no
version is provided.

> [!WARNING]+ Destroying an integration
>
> Destroying the resource uninstalls the integration for every organization,
> even when connectors still use it. Import the integrations already installed
> before the first apply, by the id of the installed version:
>
> ```shell
> terraform import plakar_integration.s3 5d2e8f1a-3c4b-4a7d-9e6f-1b2c3d4e5f60
> ```

## Environments and data classes

Each organization has a list of environments and a list of data classes, which
classify its apps. `plakar_environment` and `plakar_data_class` each declare one
name in those lists.

```terraform
resource "plakar_environment" "preprod" {
  name = "preprod"
}

resource "plakar_data_class" "contracts" {
  name = "contracts"
}
```

New organizations start with default names, such as the `production` environment
and the `personal_data` data class. To manage a name that already exists, such
as a default, import it instead of creating it:

```terraform
import {
  to = plakar_environment.production
  id = "production"
}

resource "plakar_environment" "production" {
  name = "production"
}
```

Destroying the resource removes the name from the organization. To import a name
from another organization, use `<organization_id>/<name>` as the import id.
