---
date: "2025-04-16T00:25:18Z"
title: exec
summary: "Execute a file from a Plakar snapshot"
---
PLAKAR-EXEC(1) - General Commands Manual

## NAME

**plakar exec** - Execute a file from a Plakar snapshot

## SYNOPSIS

**plakar exec**
*snapshotID*:*path*
\[*command\_args&nbsp;...*]

## DESCRIPTION

The
**plakar exec**
command extracts and executes a file at
*path*
from a Plakar snapshot passing the given arguments
*command\_args*
to it.

## EXAMPLES

Execute a script from a snapshot with some arguments:

	$ plakar exec abc123:/home/op/korpus/driver.sh -r 100

## DIAGNOSTICS

**plakar exec**
preserves the exit code of the command but may also fail with exit
code 1 without executing it, for e.g. if the file or the snapshot
doesn't exist.

## SEE ALSO

plakar(1)

Plakar - February 3, 2025
