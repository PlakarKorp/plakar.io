---
title: "Audit Log"
date: "2026-10-20T00:00:00Z"
weight: 4
summary:
  "The record of administrative and configuration activity in an organization."
---

# Audit Log

The audit log is a chronological record of the administrative and configuration
changes made in an organization. Each entry records who performed the action,
when it occurred, and what changed. The audit log is found under **Compliance**.

Audit logs are inherited downward. If your role allows you to view them, you see
the log of the organization you have selected along with the logs of every
organization beneath it, and never the log of anything above it.

The actor and target of an entry are [users](../../access-control/users) of
Plakar Control Plane. The actor is the user who performed the action, and the
target is the user it was performed on, when there is one. Actions that Plakar
Control Plane performs on its own are recorded with **System** as the actor.

![Viewing organization audit logs](../images/audit-logs.png)

## Exporting the audit log

The audit log can be exported in two forms, for different purposes.

A report is a copy of the entries for reading and processing elsewhere. It is
available as `CSV`, `CEF`, `LEEF` or `JSONL`. `CSV` opens in a spreadsheet,
`JSONL` suits scripted processing, and `CEF` and `LEEF` are the event formats
read by SIEM platforms such as ArcSight and QRadar.

A sealed archive is a signed `JSONL` export of the log. Like a
[residency attestation](../residency#residency-attestation), its signature can
be verified offline, so it can be handed to an auditor or regulator as evidence
that the entries have not been altered since the archive was produced.
