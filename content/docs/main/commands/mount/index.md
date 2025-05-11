---
date: "2025-03-18T10:07:31Z"
title: mount
summary: "Mount Plakar snapshots as read"
---
PLAKAR-MOUNT(1) - General Commands Manual

## NAME

**plakar mount** - Mount Plakar snapshots as read-only filesystem

## SYNOPSIS

**plakar mount**
*mountpoint*

## DESCRIPTION

The
**plakar mount**
command mounts a Plakar repository snapshot as a read-only filesystem
at the specified
*mountpoint*.
This allows users to access snapshot contents as if they were part of
the local file system, providing easy browsing and retrieval of files
without needing to explicitly restore them.
This command may not work on all Operating Systems.

## EXAMPLES

Mount a snapshot to the specified directory:

	$ plakar mount ~/mnt

## DIAGNOSTICS

The **plakar mount** utility exits&#160;0 on success, and&#160;&gt;0 if an error occurs.

0

> Command completed successfully.

&gt;0

> An error occurred, such as an invalid mountpoint or failure during the
> mounting process.

## SEE ALSO

plakar(1)

Plakar - March 3, 2025
