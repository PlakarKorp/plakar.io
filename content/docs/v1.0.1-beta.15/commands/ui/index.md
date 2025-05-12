---
date: "2025-04-16T00:25:17Z"
title: ui
summary: "Serve the Plakar web user interface"
---
PLAKAR-UI(1) - General Commands Manual

## NAME

**plakar ui** - Serve the Plakar web user interface

## SYNOPSIS

**plakar ui**
\[**-addr**&nbsp;*address*]
\[**-cors**]
\[**-no-auth**]
\[**-no-spawn**]

## DESCRIPTION

The
**plakar ui**
command serves the Plakar webapp user interface.
By default, this command opens the default web browser to use the interface.

The options are as follows:

**-addr** *address*

> Specify the address and port for the UI to listen on separated by a colon,
> (e.g. localhost:8080).
> If omitted,
> **plakar ui**
> listen on localhost on a random port.

**-cors**

> Set the
> 'Access-Control-Allow-Origin'
> HTTP headers to allow the UI to be accesses from any origin.

**-no-auth**

> Disable the authentication token that otherwise is needed to consume
> the exposed HTTP APIs.

**-no-spawn**

> Do not automatically open the web browser.

## EXAMPLES

Using a custom address and disable automatic browser execution:

	$ plakar ui -addr localhost:9090 -no-spawn

## DIAGNOSTICS

The **plakar ui** utility exits&#160;0 on success, and&#160;&gt;0 if an error occurs.

0

> Command completed successfully.

&gt;0

> A general error occurred, such as an inability to launch the UI or
> bind to the specified address.

## SEE ALSO

plakar(1)

Plakar - March 3, 2024
