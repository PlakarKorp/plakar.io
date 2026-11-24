---
title: "Single Sign-On"
date: "2026-11-05T00:00:00Z"
weight: 5
summary:
  "Let members sign in to Plakar Control Plane through an OpenID Connect
  provider such as Google, Okta, Entra ID, Keycloak or Auth0."
---

# Single Sign-On

Single sign-on lets members sign in to Plakar Control Plane with an account they
already have at an identity provider. PCP works with any provider that supports
OpenID Connect, such as Google, Okta, Entra ID, Keycloak or Auth0.

To set it up:

1. [Set the public URL](#setting-the-public-url) of the root organization, so
   identity providers can reach PCP.
2. [Add a provider](#adding-a-provider) in the
   [Control Plane settings](../../operations/control-plane-settings#single-sign-on),
   under **System**.
3. [Turn single sign-on on](#turning-single-sign-on-on) in the
   [organization settings](../organization-settings#sign-in-and-ai-agents).
4. [Assign email domains](#assigning-email-domains) to the provider. They decide
   who signs in with it and which organization they join.

PCP uses a new or changed provider from the next sign-in, with no restart.

## Who manages single sign-on

A provider decides who can sign in to the instance. Only the members of the root
organization who can change the
[Control Plane settings](../../operations/control-plane-settings) manage single
sign-on, such as the [Superuser](../permissions/superuser) and
[Platform Admins](../permissions/platform-admin).

The same rule covers the public URL and the email domains of every organization,
and the single sign-on switch of the root organization. An organization admin
cannot assign email domains in their own organization. Other members cannot see
the providers. Members who can view the organization settings see its domains,
but cannot change them.

## Setting the public URL

Plakar Control Plane does not know the address members reach it at, so you set
it as the public URL, such as `https://pcp.example.com`. Set it under **Sign-in
and AI agents** in the
[organization settings](../organization-settings#sign-in-and-ai-agents) of the
root organization. Every organization below inherits it. Single sign-on does not
work until you set it.

Members sign in at that address, and PCP builds the redirect URIs of the
providers from it. PCP does not offer single sign-on at any other address, such
as its IP address.

### Separate addresses for organizations

An organization below the root can set its own public URL, such as
`https://aws.pcp.example.com` for an AWS organization. Each address belongs to
one organization only. A sign-in at an address only considers that organization
and the organizations below it. You can therefore assign the same email domain
in organizations that use different addresses.

Each provider lists a redirect URI for every address. Register all of them at
the provider.

PCP tells the addresses apart by the host name of each request, and serves plain
HTTP. Route every address through the load balancer or reverse proxy in front of
the instance. It terminates TLS with a certificate that covers every address,
and passes the original host name on. For an example on Scaleway, see
[setting up HTTPS access on a Scaleway Private Network](../../guides/scaleway/https-access-to-a-private-network).

## Adding a provider

Register Plakar Control Plane at the provider as an OpenID Connect client, with
the redirect URI `<public URL>/auth/sso/<id>/callback`. The `<id>` is the id you
choose for the provider in PCP, and you cannot change it later.

Then enter the client id and client secret that the provider issues, and the
issuer URL of the provider, such as `https://accounts.google.com`. The sign-in
button shows the name of the provider, which defaults to its id.

{{< figure src="../images/add-sso-provider.png" alt="" class="mx-auto max-w-130" >}}

### Checking the issuer

PCP finds the endpoints of a provider from its issuer URL, through OpenID
Connect discovery. You can run discovery before you save the provider. It
reports the reason when it fails.

## Turning single sign-on on

Single sign-on stays off until you turn it on under **Sign-in and AI agents** in
the [organization settings](../organization-settings#sign-in-and-ai-agents).
While it is off, nobody can sign in with a provider, but you can still add and
prepare providers. Turning it off only pauses single sign-on. PCP revokes
nothing, and keeps the providers and email domains.

Organizations below inherit the switch by default. An organization that uses the
public URL of an organization above it cannot set its own switch. It follows the
switch of that organization.

## Changing a provider

You can edit a provider at any time. The change applies from the next sign-in.

PCP ties the identity of everyone who signs in with a provider to its issuer.
Changing the issuer therefore stops the sign-ins of everyone who already used
that provider. Change it only to move to a new provider, not to rewrite the
issuer of the same one.

## Disabling or deleting a provider

Disabling a provider stops sign-ins with it at once, and removes it from the
sign-in page. PCP keeps every setting, including the client secret, so you can
enable it again later.

Deleting a provider removes it along with its secret. To add it again, you need
a client secret from the provider. You cannot delete a provider while an
organization still assigns it email domains. Disable it instead, or first remove
it from the single sign-on settings of those organizations.

## Assigning email domains

Nobody signs in with a provider until you assign it email domains, under
**Settings > Authentication** in the
[organization settings](../organization-settings#single-sign-on). Members whose
email address is in one of those domains sign in with that provider, and join
the organization at their first sign-in. Only the Superuser and Platform Admins
can assign domains, as described in
[who manages single sign-on](#who-manages-single-sign-on).

An organization can use several providers, each with its own domains. PCP
matches a domain exactly against the part of the email address after the `@`, in
lowercase. Assigning `example.com` does not cover `eu.example.com`, so assign it
separately. Sub-organizations do not inherit domains.

When you sign in, PCP looks for the organization that assigns your email domain
to the provider. It searches the organization of the address you sign in at, and
the organizations below it. PCP refuses the sign-in if no organization assigns
the domain, or if several do.

{{< figure src="../images/sso-email-domain.png" alt="" class="mx-auto max-w-130" >}}

## Signing in

The sign-in page offers every enabled provider, next to sign-in with an email
address and password. See [Signing In](../../intro/signing-in).

PCP accepts a sign-in only when the provider confirms that the email address is
verified, and refuses providers that do not report it. The
[provider setup](#provider-setup) below notes where a provider needs extra
configuration for this.

If you have no account, your first sign-in with a provider creates one, with the
provider already linked.

If you already have an account with an email address and password,
[link the provider](#linking-a-provider-to-an-account) to it first. Until then,
PCP refuses your sign-ins with the provider, so a provider cannot take over an
existing account.

## Linking a provider to an account

Link a provider to your account from your **Account** page. You can then sign in
with that provider as well as with your existing methods.

PCP accepts the link only when your account at the provider has the same email
address, and you are a member of the organization that assigns that email domain
to the provider. You can link an identity at a provider to one account only.

![](../images/sso-account-linking.png)

## Provider setup

At each provider, register Plakar Control Plane as a client with the redirect
URI of every address. The provider then issues a client id and a client secret.

### Google

In the Google Cloud console, create an OAuth client ID of the type **Web
application**, and add the redirect URI to its authorized redirect URIs. Use
`https://accounts.google.com` as the issuer.

### Okta

In the Okta admin console, create an OIDC app integration of the type **Web
Application**, and add the redirect URI as a sign-in redirect URI. The issuer is
the URL of the Okta organization, such as `https://example.okta.com`.

### Entra ID

In the Microsoft Entra admin center, register an application with a **Web**
redirect URI, and create a client secret for it. The client id is the
application id.

Use the issuer of the tenant,
`https://login.microsoftonline.com/<tenant id>/v2.0`. PCP does not support the
`common` endpoint.

By default, Entra ID does not report whether an email address is verified. In
**Token configuration**, add the optional claim `xms_edov` to the ID token.
Without it, PCP refuses every sign-in with Entra ID.

### Keycloak

In the realm, create an OpenID Connect client with **Client authentication** on,
and add the redirect URI to its **Valid redirect URIs**. The client secret is in
its **Credentials** tab. The issuer is the URL of the realm, such as
`https://keycloak.example.com/realms/example`.

Keycloak reports for each user whether the email address is verified. Users
whose email address is not marked as verified cannot sign in.

### Auth0

In the Auth0 dashboard, create an application of the type **Regular Web
Application**, and add the redirect URI to its allowed callback URLs. The issuer
is the domain of the tenant with a trailing slash, such as
`https://example.auth0.com/`.
