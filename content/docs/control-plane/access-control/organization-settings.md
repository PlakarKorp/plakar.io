---
title: "Organization Settings"
date: "2026-09-08T00:00:00Z"
weight: 2
summary: "Configure a single organization in Plakar Control Plane."
aliases:
  - /docs/control-plane/administration/settings/organization/
---

# Organization Settings

Organization settings apply to one organization only. Every organization on the
instance carries its own settings, so changing them affects that organization
and the resources that belong to it, and nothing else. Settings that apply to
the appliance as a whole, and so to every organization it hosts, are
[Control Plane settings](../../operations/control-plane-settings).

## Handing settings down

A setting is not confined to the organization it is set in. Alongside its value,
each setting carries a choice about what the organizations beneath it inherit:

- **Not handed down**, the value applies only to the organization it is set in.
  The organizations below it do not inherit it.
- **Handed down**, every organization below inherits the value, at any depth,
  and any of them can override it with one of its own.
- **Handed down, locked**, every organization below inherits the value and none
  of them can override it.

The choice is made per setting, so an organization can hand down its SMTP server
while keeping its webhook to itself. Locking a setting lets an organization high
in the hierarchy fix a value for everything beneath it, rather than setting the
same value in each organization and trusting it to stay.

### How an organization resolves a setting

Without a lock, an organization uses its own value for a setting. When it has
none, it inherits the value of the nearest organization above it that hands the
setting down, whether that is its parent or an organization several levels up.
When no organization above hands the setting down, the organization has no value
for it.

Only values that are handed down are inherited. The organizations beneath one
that keeps a value to itself skip it and inherit from further up. If the root
organization hands down an SMTP server and organization A below it sets its own
without handing it down, A uses its own server and organization B below A uses
the root organization's.

A lock overrides this order. Every organization below a locked value uses it,
and none of them can set its own. A value one of them set before the lock is
ignored while the lock is in place, and applies again if the lock is removed.

![Organization settings](../images/organization-settings.png)

## Authentication

The authentication settings control how members of this organization sign in and
how long the credentials they are issued remain valid. They cover the lifetime
of session badges and rotated API keys, and whether a second factor is required
at sign-in.

### Token lifetimes

Two time-to-live (TTL) durations are configured together here:

- **Authentication badge TTL:** how long an authentication badge remains valid.
  The badge indicates the current authentication status of a session. Defaults
  to 1 day.
- **API key rotation TTL:** how long the new key issued when an application
  [rotates its API key](../users/applications#rotating-an-api-key) remains
  valid. Defaults to 90 days.

When neither this organization nor any organization above it sets a lifetime,
the default applies and the screen shows it with a **(default)** label.

### Two-factor authentication

Require the members of this organization to sign in with a second factor.
Members who already hold one are unaffected. Members without one are taken
through the setup the next time they sign in, and cannot reach Plakar Control
Plane until a factor is enrolled. See
[two-factor authentication](../two-factor-authentication) for what a member sets
up and how it is used at sign-in.

### Single sign-on

Tie email domains to a single sign-on provider. A person whose email address is
in one of the domains signs in with that provider, and joins this organization
at the first sign-in. Only the Superuser and Platform Admins can change the
domains, not the admins of the organization. See
[who manages single sign-on](../sso#who-manages-single-sign-on). See
[Single Sign-On](../sso) for how providers are added.

## Sign-in and AI agents

The address members use to reach this organization, and whether they can sign in
with an identity provider.

### Public URL

The address that members and identity providers reach this organization at, such
as `https://pcp.example.com`. Single sign-on needs it, because Plakar Control
Plane does not know its own address. Organizations below always inherit it, and
can set their own. Only the [Superuser](../permissions/superuser) and
[Platform Admins](../permissions/platform-admin) can set it. See
[setting the public URL](../sso#setting-the-public-url).

### Single sign-on

Lets members of this organization sign in with an identity provider. Turning it
off only pauses single sign-on. PCP revokes nothing, and keeps the providers and
email domains. Organizations below inherit it by default. You can also keep it
to this organization or lock it, as described in
[handing settings down](#handing-settings-down). An organization that uses the
public URL of an organization above it cannot set its own switch. It follows the
switch of that organization. See
[turning single sign-on on](../sso#turning-single-sign-on-on).

## System

The system settings connect the organization to the infrastructure around Plakar
Control Plane. They define the mail server used for its email, and an external
Vector instance that receives a copy of the logs of Plakar Control Plane.

### SMTP

Configure the mail server used to send email notifications for this
organization, including notifications and other system-generated messages. See
[Email & SMTP](../../operations/email-and-smtp) documentation for configuration
details.

### Vector

Plakar Control Plane processes its logs with its own Vector instance. This
setting forwards a copy of them to a Vector instance you manage, which PCP adds
as a
[Vector sink](https://vector.dev/docs/reference/configuration/sinks/vector/).

PCP uses only the address set in the root organization, and forwards the logs of
the whole deployment there. An address with no scheme connects over HTTPS, so
use `http://host:port` for a Vector instance that listens over plain HTTP.

PCP reads the level of each log line before forwarding it, so your Vector
instance receives `level`, `msg` and `attrs` fields alongside the original
`message`.

## Notifications

The notification settings send the events of the organization, such as job
completions and failures, to systems outside Plakar Control Plane. Events are
delivered to an external endpoint as HTTP requests through a webhook.

### Webhook

Deliver Plakar Control Plane events, such as job completions and failures, to an
external endpoint as HTTP requests. Webhook delivery is disabled by default. See
[Webhook](../../operations/webhooks) documentation for more information.
