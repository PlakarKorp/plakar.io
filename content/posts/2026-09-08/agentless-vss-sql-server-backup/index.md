---
title: "Agentless VSS and SQL Server backup now available in Plakar"
slug: "agentless-vss-sql-server-backup"
date: 2026-09-08T10:00:00+0100
authors:
  - "gilles"
summary:
  "VSS and SQL Server backups are now free for registered Plakar users: agentless
  over SSH, encrypted and deduplicated into an open, portable Kloset store. The
  connectors are closed source, built for Control Plane. Active Directory recovery
  is a Plakar Control Plane capability."
categories:
  - announcement
tags:
  - windows
  - active-directory
  - sql-server
  - vss
  - backup
  - ransomware
  - control-plane
---

For twenty years, backing up Windows meant paying the same tax: an agent on every machine or a vendor holding the keys to your own data. VSS, the Windows service that quietly makes a consistent copy of a running system, and SQL Server are front and center, reachable mostly through an enterprise backup suite or a tool you have to install on every host.

Everything else moved on. We went from monoliths to microservices, from physical hardware to containers and Kubernetes, from one on-prem data center to multi clouds. Infrastructure is now run as code: you declare it in Git, it scales dynamically and includes self-healing mechanisms and multi-region disaster recovery (DR) strategies, managed programmatically. That pace is only accelerating as companies integrate AI into their development process. We've built a world of automated, cloud-native infrastructure resilience, but the data protection layer remains obsolete.

Every other layer of your stack has an open format you can read and an API you can call. Backup should too. It should be declared as code, agentless, fully encrypted, deduplicated and portable. That is proper resilience, and today it comes to Windows!

## VSS and SQL Server: free in Plakar

Plakar's [VSS](/integrations/vss/) and [SQL Server](/integrations/mssql/) integrations now run at no cost with Plakar: agentless, self-hosted, no per-VM license, no vendor standing between you and your own recovery. Everything lands in an encrypted, deduplicated [Kloset store](/posts/2025-04-29/kloset-the-immutable-data-store/) that lives nowhere near the machine it protects.

These two connectors are built for Plakar Control Plane and are free to use for registered Plakar users. We are not open-sourcing their code for now. The Plakar CLI and the Kloset format stay open source.

{{< mermaid >}}
flowchart LR
  subgraph dom["Windows domain"]
    dc["Domain Controller<br/>(System State)"]
    sql["SQL Server"]
    file["File server"]
  end
  dc & sql & file -->|"VSS snapshot,<br/>over SSH / SFTP"| plakar["Plakar<br/>(no host agent)"]
  plakar -->|"encrypted +<br/>deduplicated"| kloset[("Kloset store<br/>outside the domain")]
{{< /mermaid >}}

## How agentless VSS backup works

In a nutshell, Plakar connects to the Windows host over SSH and asks VSS for a snapshot. VSS puts the volume in a consistent state first, streams the result over SFTP, splits it into small chunks, removes the duplicates, compresses them, and encrypts them. The storage only ever sees encrypted data, and the keys stay on your side.

Data is [encrypted client-side](/posts/2025-02-28/audit-of-plakar-cryptography/), the Kloset store sits outside the domain, and the account Plakar connects with is not your domain admin. If the domain is compromised, the copy remains completely safe.

## Unlocking MSSQL Backup

Database backups are the request we hear most, and SQL Server is near the top of the list. Databases are the most painful thing to lose and the hardest thing to restore correctly, which is why so many teams still run them through hand-written scripts and scheduled tasks nobody wants to own.

After [Postgres](/integrations/postgres/) and [MySQL](/integrations/mysql/), you can now back up your SQL Server database with Plakar. Plakar asks VSS for an application-consistent, point-in-time snapshot of the volume the database sits on, so the copy is clean and complete without taking the database offline. No dump scripts, no agent, no downtime, and you restore it onto the original server or a fresh one.

## Active Directory available in Plakar Control Plane

If you are running Windows workloads in a regulated environment, you are probably wondering about Active Directory. In a Windows environment, almost everything runs through Active Directory. Who can log in, what they can touch, and which systems they can reach all depend on it being up and correct.

In case you missed it, [Active Directory](/integrations/msad/) is already covered through the Plakar Control Plane. While a Domain Controller is still healthy, Plakar takes an encrypted System State backup (everything Windows needs to bring that controller back) and stores it outside the domain. So even if every Domain Controller is lost at once, you can rebuild your whole Active Directory from a clean, off-domain copy.

Active Directory is the one you restore first when ransomware takes the domain, because nothing else works until it is back. The restore is the normal Windows path (System State via Directory Services Restore Mode); full steps are in the [Active Directory docs](/docs/control-plane/resources/identity/msad/).

## Get started

Download Plakar to try the VSS and SQL Server backups. Several installation methods are available depending on your operating system. [Choose the method that best suits your environment](/docs/community/v1.1.0/quickstart/installation/).

If you want to try Windows Active Directory, Plakar Control Plane has a free plan including up to 500GB of managed data, making it well suited for small configurations, personal use, or evaluating the platform before committing to a larger deployment.

As always, tell us what you think. Come hang out on our [Discord](https://discord.gg/uuegtnF2Q5) or [GitHub](https://github.com/PlakarKorp/plakar) if you want to follow along or help shape what comes next.

Happy hacking 🚀
