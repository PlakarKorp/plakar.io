
# Managing Users

Users represent identities that can access Plakar Control Plane. They are used
either by people interacting with the web interface or by applications
authenticating to the API.

Plakar Control Plane supports two types of users:

- **Member**: a person who signs in to the web interface and interacts with
  Plakar Control Plane.
- **Application**: a non-human identity used by software to authenticate to the
  Plakar Control Plane API using an access key.

Application users are intended for automation and integrations, such as the
[Plakar Kubernetes Operator](../infrastructure-as-code/kubernetes-operator) or
custom applications that interact with the API.

## Creating users

You can create either a **Member** or **Application** user depending on how the
identity will access Plakar Control Plane.

Organizations can be described in simple terms as containers for users and
resources. Membership in an organization is what gives a user access to that
organization's resources.

Users are identified by their email address, and that identity is shared across
the entire Plakar Control Plane deployment. You add a user to an organization by
providing a name and an email address, and the result depends on whether that
email address is already known:

- If no user with that email address exists, the user is created and added as a
  member of the organization.
- If a user with that email address already exists, that user is added as a
  member of the organization. No new user is created, and the existing
  credentials remain unchanged.

Permissions are scoped to an organization as well. A user who belongs to several
organizations holds a separate set of roles in each one, so the same person can
have full administrative access in one organization and limited access in
another. Nothing granted in one organization carries over to another.

See [Permissions](../permissions) for how access is granted, and
[Managing Organizations](../organizations) for information about managing
organization membership.

![Users in an organization](../images/users.png)

## Removing users from an organization

Removing a user from an organization revokes their access to that organization
and its resources. Because a user identity is shared across the deployment, the
user itself is not deleted and their memberships in other organizations are
unaffected.

A user who has been removed from every organization remains in Plakar Control
Plane but cannot sign in, because they no longer have access to anything. The
account becomes usable again once the user is added to an organization, and the
existing credentials continue to work.

Roles are not retained when a user is removed. A user who is added back to an
organization starts with no permissions again, exactly like a newly created
user, and must be granted the roles they need.

## Member users

Member users authenticate through the Plakar Control Plane web interface. When a
user belongs to more than one organization, the organization they work in is
determined by the account they sign in with. See [Signing In](../signing-in)
documentation for more details.

### Creating a member user

To create a member user, select **Member** as the user type, then provide the
user's name and email address. You then select the organization the user is
added to.

{{< figure src="../images/create-member-user.png" alt="Creating a member user" class="mx-auto max-w-100" >}}

If the email address does not belong to an existing user, Plakar Control Plane
creates the user and generates a password for them. Once the user has been
created, their account and generated password are displayed. Pass both to the
user, because they need the account to sign in to this organization. See
[Signing In](../signing-in) for how accounts are formed.

The generated password is used only for the first sign-in. After authenticating
for the first time, the user will be required to set a new password before
accessing Plakar Control Plane.

If the email address belongs to a user who already exists, that user is added to
the organization and keeps their current password.

A newly created member user has no permissions in the organization. They can
sign in, but they cannot access any resources or perform any operations until
permissions are granted to them.

## Application users

Application users authenticate to the Plakar Control Plane API using API keys
instead of interactive credentials. They are intended for automation and
integrations, such as the Plakar Kubernetes Operator or custom applications.

### Creating an application user

To create an application user, select **Application** as the user type, then
provide a name for the application user and the organization it belongs to. API
requests made with the application's keys operate within that organization.

Once you create an application user, you can immediately generate an API key to
authenticate API requests.

## API keys

Application users authenticate to the Plakar Control Plane API using API keys.
Each application user can have multiple API keys, allowing different services or
deployments to use separate credentials.

To create an API key, open the application's **API key** dialog, optionally
provide a description, then generate the key. The generated key is used to
authenticate API requests on behalf of the application user.

The API key management dialog also lists all existing API keys for the
application, allowing you to review and delete keys that are no longer needed.

{{< figure src="../images/creating-api-keys.png" alt="Creating API keys for an application user" class="mx-auto max-w-90" >}}

> [!WARNING]+ API keys
>
> API keys are displayed only once when they are created. After you leave this
> page, the key cannot be viewed again. Store it securely in a password manager,
> secrets manager, or another secure location before continuing.

## User roles

A user's access is determined by the role assigned to them within each
organization. Because roles are scoped to an organization, the same user may
hold a different one in each organization they belong to. A user might
administer the **AWS** organization while only being able to run backups in the
**VMware** organization.

Roles apply to application users in the same way they apply to member users. An
application user with no role assigned can authenticate with its API key but
cannot do anything with it.

See [Permissions](../permissions) for the roles that can be assigned and exactly
what each of them reaches.

