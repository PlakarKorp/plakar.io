---
title: "Scheduling"
date: "2026-06-25T00:00:00Z"
weight: 2
summary: "How to create and manage tasks and schedules in Plakar Control Plane."
aliases:
  - /control-plane-docs/operations/scheduling/
---

# Scheduling

Plakar Control Plane supports two ways to schedule backup operations:

- **Manual scheduler** - create tasks manually and attach one or more schedules
  to run them on a recurring basis
- **Policy scheduler** - policies automatically schedule tasks based on SLA
  rules defined for your sources

Both schedulers can trigger the same types of tasks. The
[manual scheduler](../manual-scheduler) gives you direct control over when and
how tasks run, while the [policy scheduler](../policy-scheduler) automates
scheduling based on the protection requirements defined in your policies.

{{< children description="true" >}}
