---
title: "Integrations and Classification"
date: "2026-11-26T00:00:00Z"
weight: 6
summary:
  "Installing integrations with the integration module, and declaring
  environments and data classes."
---

# Integrations and Classification

## Integrations

The `integration` module installs an [integration](../../../integrations) from
the catalog and makes that version the current one.

```yaml
- name: Install Vault
  plakarkorp.plakar.integration:
    name: vault
    version: v1.1.13
```

Integrations belong to the whole deployment, not to an organization. Managing
them requires an API key whose application user holds the
[Platform Admin](../../../access-control/permissions/platform-admin) role. The
module installs the given `version`, or the latest one in the catalog if no
version is provided. An integration that is already installed stays on its
current version.

> [!WARNING]+ Uninstalling an integration
>
> `state: absent` uninstalls every installed version of the integration from the
> deployment. The stores and connectors that use it stop working.

## Environments and data classes

Each organization has a list of environments and a list of data classes, which
classify its apps. The `environment` and `data_class` modules each add one name
to those lists, or remove it with `state: absent`.

```yaml
- name: A pre-production environment
  plakarkorp.plakar.environment:
    name: preprod

- name: A data class of our own
  plakarkorp.plakar.data_class:
    name: payroll
```

Always write the `environment` module by its full name,
`plakarkorp.plakar.environment`. Ansible reads the short name as its
`environment` task keyword.

New organizations start with default names, such as the `production` environment
and the `personal_data` data class. Removing a name removes it from the whole
organization.
