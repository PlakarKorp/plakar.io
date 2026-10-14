---
title: "Binary"
date: "2026-07-13T00:00:00Z"
weight: 1
summary: "Build, enroll, and configure a standalone plakar-edge binary."
---

# Installing an Edge as a Binary

The standalone edge is currently built from source. The source code is available
in the [PlakarKorp/plakar-edge](https://github.com/PlakarKorp/plakar-edge)
repository.

Build it with:

```sh
$ make
# OR
$ go build -o plakar-edge .
```

Prebuilt binaries will be provided in a future release, and edge functionality
will eventually be integrated directly into the `plakar` CLI.

## Enroll the edge

Start the edge with the Control Plane URL, enrollment key, and organization it
should join:

```sh
$ plakar-edge \
  -control-plane https://plakman.example.com \
  -enroll <enrollment-key> \
  -organization <organization-id> \
  -name edge-paris-1 \
  -tags env:prod,zone:eu-1 \
  -state-dir /var/lib/plakar-edge \
  -pkg /var/lib/plakar-edge/pkgs
```

The enrollment key and organization are only required for the first startup.
After successful enrollment, the edge stores its identity and authentication
token in its state directory and reuses them on subsequent starts.

For subsequent starts, you can therefore run:

```sh
$ plakar-edge \
  -control-plane https://plakman.example.com \
  -name edge-paris-1 \
  -tags env:prod,zone:eu-1 \
  -state-dir /var/lib/plakar-edge \
  -pkg /var/lib/plakar-edge/pkgs
```

## Configure the edge

The most important options are:

| Option           | Required  | Description                                                                                                                                |
| ---------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `-control-plane` | Yes       | Base URL of the Plakar Control Plane.                                                                                                      |
| `-enroll`        | First run | Enrollment key used to register the edge. It can also be provided through `PLAKAR_EDGE_ENROLL_KEY`.                                        |
| `-organization`  | First run | Identifier of the organization the edge joins. It can also be provided through `PLAKAR_EDGE_ORGANIZATION`.                                 |
| `-name`          | No        | Name displayed for the edge in PCP. Defaults to the hostname.                                                                              |
| `-tags`          | No        | Comma-separated tags reported by the edge on each poll. Tags can be used to target work to matching edges.                                 |
| `-state-dir`     | No        | Directory used to store the edge identity and authentication token. Defaults to `/var/lib/plakar-edge`.                                    |
| `-pkg`           | No        | Directory used for downloaded connector packages. Defaults to `<state-dir>/pkg`.                                                           |
| `-max-parallel`  | No        | Maximum number of tasks the edge runs concurrently. Defaults to `5`.                                                                       |
| `-poll-hold`     | No        | Expected server-side long-poll duration. Defaults to `30s`.                                                                                |
| `-listen`        | No        | Address of the [supervision HTTP server](../../monitoring). Defaults to `127.0.0.1:9877`. Set it to an empty string to disable the server. |
| `-metrics`       | No        | Enables the Prometheus `/metrics` endpoint. Defaults to `true`.                                                                            |
| `-scripts-dir`   | No        | Directory holding the [hook scripts](../../hooks) tasks may run. Empty by default, which refuses every hook.                               |

`-max-parallel` caps how much work one edge takes on at a time. Tasks assigned
beyond that limit wait until a running one finishes.

Tags are useful when you have multiple edges and want PCP to select an edge
based on its environment. For example:

```text
env:prod,zone:eu-1
```

An edge can report multiple tags. See
[Selecting an edge](../../running-tasks#selecting-an-edge) for how PCP matches
them when assigning work.
