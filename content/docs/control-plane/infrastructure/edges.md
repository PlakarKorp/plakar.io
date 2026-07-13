---
title: "Edges"
date: "2026-07-13T00:00:00Z"
weight: 3
summary: "Configure remote edge executors for Plakar Control Plane."
---

# Edges

By default, Plakar Control Plane (PCP) executes every scheduled task from the
appliance itself. This works well for small deployments, but larger or
distributed environments often require task execution closer to the data.

An **edge** is a remote executor that registers with PCP and performs operations
on its behalf. Deploying edges inside the networks where your data resides
allows tasks to run locally without requiring PCP to have direct network access
to every resource.

Edges improve scalability by distributing work across multiple executors while
also allowing backups of resources located behind private networks, firewalls,
or NAT gateways.

![list of remote edge executors registered on a control plane instance](../images/edges-list.png)

## Requirements

An edge must have network access to:

- The **Plakar Control Plane** over HTTP.
- The systems or services it will back up or restore.

The edge receives tasks from PCP, performs them locally, and reports the results
back to the Control Plane.

## Installing plakar-edge

The source code is available from
[PlakarKorp/plakar-edge](https://github.com/PlakarKorp/plakar-edge). Currently,
`plakar-edge` must be built from source:

```sh
make
# or
go build -o plakar-edge .
```

Prebuilt binaries will be available in a future release, and edge functionality
will eventually be integrated directly into the `plakar` binary.

## Enabling edge enrollment

Edge enrollment is disabled by default. To enable it:

1. Open **Settings**.
2. Select the **General** tab.
3. Under **Edge Enrollment**, click **Configure**.
4. Enable enrollment.

![control plane general settings](../images/general-settings.png)

PCP generates an enrollment key that new edges use to register themselves. You
can regenerate the key at any time or disable enrollment.

## Starting an edge

Run the edge with:

```sh
plakar-edge \
  -control-plane https://plakman.example.com \
  -enroll <enrollment-key> \
  -name edge-paris-1 \
  -state-dir /var/lib/plakar-edge \
  -pkg /var/lib/plakar-edge/pkgs
```

| Flag             | Default                | Description                                                         |
| ---------------- | ---------------------- | ------------------------------------------------------------------- |
| `-control-plane` | _(required)_           | Base URL of the Plakar Control Plane instance.                      |
| `-enroll`        | —                      | Enrollment key. Required only the first time the edge starts.       |
| `-name`          | Hostname               | Name displayed in PCP for this edge.                                |
| `-state-dir`     | `/var/lib/plakar-edge` | Directory used to store the edge identity and authentication token. |
| `-pkg`           | —                      | Base directory for Plaklet packages (`integrations` and `cache`).   |

After a successful enrollment, the edge stores its authentication token in
`-state-dir`. Future restarts reuse this token, so the `-enroll` option is no
longer required unless the edge is re-enrolled.

## Secrets

When an edge executes a task, PCP resolves the required secrets and securely
provides them to the edge for the duration of that task. This includes
repository credentials such as the repository passphrase.

## Running tasks on an edge

Scheduled tasks run on the PCP appliance by default. To execute a task on an
edge instead, select the desired edge in the **Advanced** section when creating
or editing a scheduled task. See
[Scheduled Tasks](../../operations/scheduling/tasks) documentation for more
information.
