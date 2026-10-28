---
title: "Appliance Sizing"
date: "2026-10-26T00:00:00Z"
weight: 1
summary:
  "What the Plakar Control Plane appliance is made of, what uses its CPU, memory
  and disk, and how to size it."
---

# Appliance Sizing

The Plakar Control Plane appliance needs enough CPU and memory for the tasks it
runs, and two disks for its system and its data. How much CPU, memory or disk
depends on the number of sources it protects and how many tasks it needs to run
within a given duration.

## What the appliance is made of

Plakar Control Plane is delivered as a software appliance in two layers. The
base is a minimal, immutable operating system built on LinuxKit, whose job is to
boot and run containers. The containers carry Plakar Control Plane itself, and
are what an [update](../operations/updating) replaces.

The appliance uses two disks:

- **The system disk** holds the appliance image. It does not change between
  updates and stores no state, so about 10 GB is enough.
- **The data disk** holds the database, the logs and all Plakar state. It is
  what makes the configuration and history survive an update or a redeployment
  of the appliance.

Backups are not stored on either disk. Restore points are written to
[stores](../apps/stores), such as an S3 bucket or an SFTP server, which are
sized separately according to the volume of data to protect and its retention.

## What uses the resources

The appliance runs two kinds of work. It always runs Plakar Control Plane
itself: the web interface, the API, the database, the schedulers and the
inventories. This part is light and grows slowly with the number of resources,
apps and schedules it manages.

By default, it also runs the tasks it schedules: backups, restores, syncs and
checks. Each task reads, chunks, compresses, encrypts and transfers data, so
this part uses most of the CPU and memory, and grows with the number of tasks
that run at the same time.

Tasks can run on [edges](../edges) instead. Every task an edge runs is work the
appliance no longer does, so edges are how a deployment grows beyond what a
single appliance can handle, without resizing it. An edge is sized for the tasks
it runs, and is not covered by the tiers below.

## Sizing tiers

The following tiers are a starting point, based on the number of sources the
appliance protects:

| Tier | Protected sources | vCPU | RAM   | Data disk |
| ---- | ----------------- | ---- | ----- | --------- |
| S    | Fewer than 100    | 4    | 16 GB | 1 TB      |
| M    | 100 to 500        | 8    | 32 GB | 1 TB      |
| L    | More than 500     | 16   | 64 GB | 1 TB      |

The data disk is 1 TB in every tier. It is in addition to the system disk of the
appliance, which needs about 10 GB.

The S tier suits most deployments. Tasks moved to edges reduce the load on the
appliance, so a deployment that runs most of its tasks on edges can stay on a
lower tier than its number of sources suggests.

> [!NOTE]
>
> The final sizing depends on the volume of data, the backup window and the
> target RPO and RTO. [Contact us](/contact) to validate the sizing of a
> production deployment.

## Smaller deployments

The tiers are for production. For an evaluation, a test, or a small deployment
that does not need production guarantees, the appliance runs with fewer vCPUs,
less memory and a smaller data disk. Backups then take longer, and fewer tasks
can run at the same time.
