---
title: "member"
date: "2026-11-26T12:13:20Z"
weight: 13
summary: "Manage the members of a Plakar organization."
---

# member

Written `plakarkorp.plakar.member` in a task.

Manage the members of a Plakar organization.

Adds people and service accounts to an organization, and removes them.

A membership carries no permission — what a member may do is a grant, managed
with `plakarkorp.plakar.grant`.

Adding a person goes through the admin invitation path. A brand-new address gets
an account with a one-time generated password, returned once in
`generated_password`; an address that already has an account simply gains the
membership.

A service account (`service=true`) is an application user — no email, no
interactive login; its address is minted server-side. Mint its API key in the
Plakar UI (an application user cannot mint its own).

Removing a member removes the membership, not the person's account.

## Examples

```yaml
- name: Alice belongs to the Lyon tenant
  plakarkorp.plakar.member:
    organization: Lyon
    email: alice@example.com
    name: Alice
  register: alice

- name: Relay the one-time password when an account was just created
  ansible.builtin.debug:
    msg: "initial password: {{ alice.generated_password }}"
  when: alice.account_created | default(false)

- name: A service account for the nightly automation
  plakarkorp.plakar.member:
    organization: Lyon
    name: nightly-automation
    service: true

- name: Alice leaves
  plakarkorp.plakar.member:
    organization: Lyon
    email: alice@example.com
    state: absent
```

## Options

| Option            | Type | Required | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ---- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api_key`         | str  | No       |           | API key of a service account, as minted by the Plakar API (`pcp_ak_...`). API keys authenticate without a second factor and are bound to one organization. The service account must hold a role in the organization (the `operator` role suffices for running backups and restores); without a grant the API answers with empty lists rather than errors. Falls back to the `PLAKAR_API_KEY` environment variable. |
| `api_url`         | str  | No       |           | Base URL of the Plakar management API, for example `https://plakar.example.com`. Falls back to the `PLAKAR_API_URL` environment variable.                                                                                                                                                                                                                                                                          |
| `email`           | str  | No       |           | Email address of the person. The playbook's key for people.                                                                                                                                                                                                                                                                                                                                                        |
| `name`            | str  | No       |           | Display name. The playbook's key for service accounts, which have no address; optional decoration for people.                                                                                                                                                                                                                                                                                                      |
| `organization`    | str  | No       |           | Name of the organization the membership belongs to. Defaults to the API key's own organization.                                                                                                                                                                                                                                                                                                                    |
| `organization_id` | str  | No       |           | UUID of the organization to operate in, when different from the one the API key is bound to. The badge is re-scoped once per organization and cached for the duration of the task.                                                                                                                                                                                                                                 |
| `service`         | bool | No       | `false`   | Add an application user rather than a person.                                                                                                                                                                                                                                                                                                                                                                      |
| `state`           | str  | No       | `present` | Whether the membership should exist. One of `present`, `absent`.                                                                                                                                                                                                                                                                                                                                                   |
| `timeout`         | int  | No       | `30`      | Timeout in seconds for each individual API request (not for job completion; the action modules have `wait_timeout` for that).                                                                                                                                                                                                                                                                                      |
| `validate_certs`  | bool | No       | `true`    | Whether to validate TLS certificates when talking to the API.                                                                                                                                                                                                                                                                                                                                                      |

## Returns

| Key                  | Type | Returned                                  | Description                                                                                                                                                                                                                                                                                                    |
| -------------------- | ---- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `account_created`    | bool | on creation                               | Whether a brand-new account was registered for the address.                                                                                                                                                                                                                                                    |
| `generated_password` | str  | on creation                               | The one-time must-change password the server minted for a brand-new account. Shown exactly once — relay it or lose it. `null` when the address already had an account. A service account gets one too, but it is inert — an application user has no interactive login, and mints its API key in the Plakar UI. |
| `member`             | dict | when the membership exists or was created | The member acted on (user_id, email, account, name, is_service).                                                                                                                                                                                                                                               |
