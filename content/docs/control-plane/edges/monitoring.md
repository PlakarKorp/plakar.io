---
title: "Supervision and Metrics"
date: "2026-07-13T00:00:00Z"
weight: 7
summary: "Health, readiness, and Prometheus metrics endpoints exposed by edges."
---

# Supervision and Metrics

An edge can expose a small HTTP server for health checks and monitoring.

The server listens on `127.0.0.1:9877` by default. If an external monitoring
system needs to access it, configure `-listen` with an address reachable from
that system.

The server provides three endpoints:

- `/health` reports whether the edge process is running. It returns `200 OK`
  while the process is alive.
- `/ready` reports whether the edge has successfully enrolled and is polling the
  Control Plane. It returns `200 OK` when ready and `503` otherwise.
- `/metrics` exposes host, process, Go runtime, and node-exporter metrics in
  Prometheus format.

The `/metrics` endpoint can be disabled with `-metrics=false`.

For Kubernetes deployments, these endpoints are primarily useful for external
monitoring. The edge itself does not require inbound connectivity to perform its
normal work.
