---
title: "Edges Installation"
date: "2026-07-13T00:00:00Z"
weight: 4
summary: "Install an edge as a standalone binary or as a Kubernetes workload."
---

# Installing an Edge

An edge can run either as a standalone binary or as a Kubernetes workload.
Choose the deployment method that best fits the environment where the edge will
run. When the edge needs tools required by integrations such as MySQL or
PostgreSQL, build a custom image that includes them.

Edge enrollment must be enabled for the organization the edge joins. See
[edge enrollment](../enrollment).

{{% children description="true" %}}
