---
date: "2026-01-30T00:00:00Z"
title: Why multiple backup copies matter
summary: Understand why multiple backup copies drastically reduce the risk of data loss, and how this leads to the 3‑2‑1 backup strategy.
last_reviewed: "2026-01-30"
last_reviewed_version: "v1.1.0"
weight: 4
aliases:
  - /docs/v1.1.0/guides/why-several-copies
---

Keeping multiple copies of your backups is one of the most important principles in data protection. The goal is simple: reduce the chance that a single failure can destroy all copies of your data at once.

This page explains why multiple copies matter and how many you should reasonably aim for.

## Why one copy is not enough

If all your backups exist in a single location, any failure affecting that location can result in total data loss.

This includes:
- Hardware failures (disk crashes, controller failures)
- Power or electrical issues
- Accidental deletion or misconfiguration
- Theft or physical damage
- Natural disasters (fire, flood, earthquake)
- Malicious or intentional actions

Even if each of these events is unlikely on its own, they happen often enough that relying on a single backup copy is risky. A good backup strategy assumes that failures **will** happen eventually.

## Why multiple copies change the odds

Each backup copy stored in a different place acts as an independent safety net.

Data loss only occurs if *all* copies are lost at the same time. As long as at least one copy survives, recovery is possible.

This is why adding copies reduces risk so dramatically:
- With **one copy**, a single failure is enough to lose everything.
- With **two copies**, data is lost only if both copies fail at the same time.
- With **three copies**, all three must fail simultaneously.

In practice, the probability of independent failures overlapping is extremely low, especially when copies are stored in different locations.

## An intuitive way to think about it

Studies of large storage systems typically show that the probability of losing data at a single site over a year is in the low single‑digit percentages.

That means:
- Losing one copy is not rare
- Losing two independent copies at the same time is very unlikely
- Losing three independent copies is exceptionally unlikely

Each additional copy reduces risk by orders of magnitude, not by small increments.

## Why locations matter

Multiple copies only help if failures are **independent**. Storing three backups on the same machine, in the same room, or in the same data center does not protect you from events that affect all of them at once.

To be effective, copies should be:
- Stored on different hardware
- Located in different physical places
- Ideally managed under different failure domains

## The 3‑2‑1 backup strategy

These ideas are commonly summarized by the **3‑2‑1 backup rule**:

- **3 copies** of your data (the live data plus two backups)
- **2 different storage types**
- **1 off‑site copy**

This strategy places the risk of total data loss into the “extremely unlikely” range while remaining practical to operate.

Plakar’s ability to synchronize Kloset Stores across locations makes it easy to apply these principles without changing how backups are created.
