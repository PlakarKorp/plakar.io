
# Organizations and Access

Under an owner's key, a playbook declares
[organizations](../../../administration/organizations) beneath its own, who
belongs to them, and what those members may do. Three modules cover it:
`organization`, `member` and `grant`.

Membership and permission are separate, which is why the modules are separate.
`member` puts a person or a service account in an organization, and `grant`
gives that member a role. A member with no grant can sign in and reach nothing.

```yaml
- name: Stand up a tenant with its people and permissions
  hosts: localhost
  gather_facts: false
  tasks:
    - plakarkorp.plakar.organization:
        name: Lyon

    - plakarkorp.plakar.member:
        organization: Lyon
        email: alice@example.com
        name: Alice
      register: alice

    - plakarkorp.plakar.grant:
        organization: Lyon
        subject: alice@example.com
        role: auditor
```

## People and service accounts

A `member` task with an `email` manages a person. When that address has no
account yet, one is created and the module returns a one-time password in
`generated_password`, alongside `account_created`. An address that already has
an account gains the membership, and no password is returned.

The password is returned once and cannot be read again, so the play has to relay
it:

```yaml
- ansible.builtin.debug:
    msg: "Alice's initial password: {{ alice.generated_password }}"
  when: alice.account_created | default(false)
```

A service account is declared with `service: true` and no address. Its API key
is minted from the web interface, because an
[application user](../../../administration/users#application-users) cannot mint
its own:

```yaml
- plakarkorp.plakar.member:
    organization: Lyon
    name: nightly-automation
    service: true

- plakarkorp.plakar.grant:
    organization: Lyon
    subject: nightly-automation
    role: operator
```

`subject` takes the email address of a person or the name of a service account.

## Roles

`role` names a role from the server's catalogue. The standard set is `owner`,
`administrator`, `operator` and `auditor`, described in
[Permissions](../../../administration/permissions). A name the server does not
know fails the task and reports the names it does know.

`organization_info` reads a tenant back, with `include_members` and
`include_grants` for who is in it and what they hold.

## Removing a member or an organization

Removing a member removes the membership, not the person's account. The identity
is shared across the deployment, and the other organizations they belong to are
untouched.

An organization deletes only once it holds no other members, so a teardown play
removes the memberships before the organization that held them.

