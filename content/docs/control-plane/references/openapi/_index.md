---
title: "OpenAPI Schema"
date: "2026-09-24T00:00:00Z"
weight: 4
summary:
  "Endpoint-by-endpoint reference for the Plakar Control Plane HTTP API,
  generated from its OpenAPI document."
---

# OpenAPI Schema

Plakar Control Plane (PCP) exposes an HTTP API that the web interface, the
[Terraform provider](../terraform-provider), the
[Ansible collection](../ansible-collection) and the
[Kubernetes operator](../kubernetes-operator) are all built on. Every operation
available in PCP can be performed through it.

The API is versioned, and each version is documented separately. The reference
for a version is generated from the OpenAPI document a running PCP instance
publishes at `/swagger/openapi.json`.

{{< children description="true" >}}
