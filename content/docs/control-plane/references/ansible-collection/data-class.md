---
title: "data_class"
date: "2026-11-26T12:13:20Z"
weight: 4
summary: "Manage the data classes of a Plakar organization."
---

# data_class

Written `plakarkorp.plakar.data_class` in a task.

Manage the data classes of a Plakar organization.

Adds a data class to an organization, or removes it. Data classes are the names
a source connector can carry in its `data_classes`, and the Classification page
lists them.

A new organization comes with `personal_data`, `sensitive_personal_data`,
`health_records`, `cardholder_data`, `financial_records`, `employee_records`,
`audit_logs`, `intellectual_property`, `business_data` and `system_state`.

Names are kept exactly as written, case and spaces included, so `Payroll` and
`payroll` are two data classes. A name is its own identity; there is nothing to
update.

## Examples

```yaml
- name: A data class of our own
  plakarkorp.plakar.data_class:
    name: payroll

- name: A source that carries it
  plakarkorp.plakar.connector:
    name: HR database
    type: source
    data_classes: [payroll, employee_records]

- name: The organization holds no cardholder data
  plakarkorp.plakar.data_class:
    name: cardholder_data
    state: absent
```

## Options

| Option            | Type | Required | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ---- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`         | str  | No       |           | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`         | str  | No       |           | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `name`            | str  | Yes      |           | Name of the data class.                                                                                                                                                                                                                                                                                                                                                                                            |
| `organization_id` | str  | No       |           | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `state`           | str  | No       | `present` | Whether the data class should exist. `absent` removes the name for the whole organization. One of `present`, `absent`.                                                                                                                                                                                                                                                                                             |
| `timeout`         | int  | No       | `30`      | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `validate_certs`  | bool | No       | `true`    | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |

## Returns

| Key          | Type | Returned                                   | Description                               |
| ------------ | ---- | ------------------------------------------ | ----------------------------------------- |
| `data_class` | dict | when the data class exists, or was removed | The data class acted on, with its `name`. |
