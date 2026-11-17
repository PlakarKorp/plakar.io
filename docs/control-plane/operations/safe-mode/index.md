
# Safe Mode

Safe mode puts Plakar Control Plane on hold for every organization it hosts. No
task starts, and schedules and inventory refreshes stop. Only the
[Superuser](../../access-control/permissions/superuser) and
[Platform Admins](../../access-control/permissions/platform-admin) can sign in.
Other users and application users are locked out until it is turned off. The web
interface, the API and the database stay up, so the instance can be investigated
and safe mode turned off again.

It is a recovery tool for the rare case when Plakar Control Plane keeps
crashing. Plakar Control Plane restarts automatically a few seconds after a
crash, but when the crash is caused by work it starts on its own, such as a
scheduled task or an inventory refresh, the same work can make it crash again
after each restart. Safe mode stops that work so the instance stays up while the
cause is fixed.

## What safe mode stops

While safe mode is on:

- Only the Superuser and Platform Admins can sign in. Every other user is
  refused at sign-in. Requests from sessions already open, and from the API keys
  of [application users](../../access-control/users/applications/), are answered
  with `503` and the message `control plane is in safe mode`.
- Schedules start no tasks. An occurrence that falls during safe mode is
  skipped, and the schedule resumes at its next occurrence. Skipped occurrences
  are not run when safe mode is turned off.
- [One-off tasks](../../scheduling/one-off-tasks) due during safe mode are
  postponed, and run shortly after safe mode is turned off.
- No task starts, on the appliance or on an [edge](../../edges). This includes
  tasks started manually by the Superuser or a Platform Admin.
- Inventories and integrations are not refreshed, and a manual inventory sync is
  refused.

Schedules, queued tasks and the rest of the configuration are kept, so the
instance resumes normal work as soon as safe mode is turned off.

## Using safe mode

Safe mode is turned on and off through the API, with
[`PUT /api/v1/safe-mode`](../../references/openapi/v1/system#setSafeMode). The
request needs a badge issued to the Superuser or a Platform Admin. An
application user's API key does not work, because application users are refused
while safe mode is on. See
[Authentication](../../references/openapi/v1#authentication) for how badges are
used.

{{< steps >}}

{{< step >}}

### Turn safe mode on

Send the request with an optional reason of up to 512 characters:

```sh
$ curl -X PUT https://pcp.example.com/api/v1/safe-mode \
  -H "Authorization: Bearer eyJhbGciOi..." \
  -H "Content-Type: application/json" \
  -d '{"enabled": true, "reason": "crash loop after 03:00 backup run"}'
```

If the instance restarts before the request completes, send it again. The
response returns the state now in force, with `enabled`, `since`, `by` and
`reason`.

{{< /step >}}

{{< step >}}

### Check that the instance stays up

[`GET /api/v1/safe-mode`](../../references/openapi/v1/system#getSafeMode)
returns the current state at any time.

{{< /step >}}

{{< step >}}

### Fix the cause

Find the cause in the
[Control Plane logs](../control-plane-settings#plakar-control-plane-logs) and
fix it.

{{< /step >}}

{{< step >}}

### Turn safe mode off

Send the same `PUT` request with `{"enabled": false}`. Schedules resume at their
next occurrence, and postponed one-off tasks run shortly after.

{{< /step >}}

{{< /steps >}}

## Who can turn safe mode on

Safe mode applies to every organization hosted on the instance, so only the
Superuser and Platform Admins can turn it on or off. A request from any other
user returns `403`.

Safe mode is saved to the database before the request returns. An instance that
restarts while in safe mode comes back in safe mode. It has no expiry and stays
on until it is turned off.

## Audit events

Each change is recorded in the [audit log](../../compliance/audit-log) of the
root organization, with the user who made it:

- `controlplane.safemode.entered`, with the reason, if one was given.
- `controlplane.safemode.exited`.

A request that does not change the state, such as turning safe mode on when it
is already on, records nothing.

