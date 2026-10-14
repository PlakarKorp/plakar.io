---
title: "Edge Requirements"
date: "2026-07-13T00:00:00Z"
weight: 2
summary:
  "Network access and host tools an edge needs to run tasks for Plakar Control
  Plane."
---

# Edge Requirements

An edge needs network access to two things:

- The **Plakar Control Plane**, over HTTP or HTTPS.
- The systems and services it is expected to protect.

The Control Plane itself does not need network access to those systems. The edge
provides that connectivity when it executes a task.

An edge installs integrations from the Control Plane, so reaching PCP is all it
needs to run any integration installed there. It only needs internet access if
the systems it protects are on the internet. The exception is the external tools
some integrations depend on, described below, which must be installed on the
edge host separately.

## Operating system

The edge and the integrations it installs are built against glibc, so the edge
host must run a Linux distribution with glibc 2.34 or later, such as Ubuntu
22.04 or Debian bookworm. Distributions based on musl, such as Alpine, are not
supported.

## Integrations that need external tools

Most integrations are agentless. They communicate directly with the resource
they manage and do not require additional software on the machine running the
task. For example, the [Windows VSS integration](../../resources/compute/vss)
connects to the Windows host over SSH and needs nothing on the edge beyond the
SSH client described in [SSH client](#ssh-client).

Some integrations such as MongoDB, PostgreSQL and MySQL instead rely on
utilities provided by the vendor. These utilities must be installed on the
machine that executes the task. The
[MongoDB integration](../../resources/database/mongodb), for example, uses
`mongosh`, `mongodump`, and `mongorestore`, which must be available in the
`PATH` of the process running the task.

These utilities are not included in the appliance, and the appliance is not
intended to be extended with additional software. Tasks that require external
tools should therefore run on an edge where the required tools can be installed.

Install the tools required by the integration on the edge host, then configure
the task to run on that edge. When edges run as containers, build a
[custom image](../installation/custom-image) that includes the tools. As
deployments grow, edges can be equipped with different sets of tools so that
workloads can be distributed to the machines capable of running them. Tagging
each edge with the tools it carries lets tasks target the edges that can run
them. See [Selecting an edge](../running-tasks#selecting-an-edge).

## SSH client

The [SFTP](../../resources/file-storage/sftp) and
[Windows VSS](../../resources/compute/vss) integrations, along with the
integrations built on VSS such as
[Microsoft SQL Server](../../resources/database/mssql) and
[Microsoft Active Directory](../../resources/identity/msad), connect through the
OpenSSH `ssh` client. It must be installed on any edge that runs their tasks,
whatever the authentication method.

When these integrations authenticate with a private key, the edge loads that key
into its own SSH agent, which runs for as long as the edge does. Private key
authentication therefore also requires `ssh-add` and `ssh-agent`, which are part
of the OpenSSH client.

The official edge image includes the OpenSSH client. On a binary host or in a
[custom image](../installation/custom-image), install it with the distribution
package, such as `openssh-client` on Debian and Ubuntu.

An edge without `ssh-agent` still starts and logs a warning. Tasks that
authenticate with an SSH private key fail on that edge, and every other task
runs normally.
