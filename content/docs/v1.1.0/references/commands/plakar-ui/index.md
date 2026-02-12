---
date: "2026-01-29T09:34:09Z"
title: ui
summary: "Serve the Plakar web user interface"
aliases:
  - /docs/v1.1.0/commands/plakar-ui/
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-UI(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-UI(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar-ui</code> &#x2014; <span class="Nd">Serve
    the Plakar web user interface</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar ui</code></td>
    <td>[<code class="Fl">-addr</code> <var class="Ar">address</var>]
      [<code class="Fl">-cors</code>] [<code class="Fl">-no-auth</code>]
      [<code class="Fl">-no-spawn</code>]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar ui</code> command serves the Plakar
    web user interface. By default, it opens the default web browser.</p>
<p class="Pp">The options are as follows:</p>
<dl class="Bl-tag">
  <dt id="addr"><a class="permalink" href="#addr"><code class="Fl">-addr</code></a>
    <var class="Ar">address</var></dt>
  <dd>Specify the address and port for the UI to listen on separated by a colon,
      (e.g. localhost:8080). If omitted, <code class="Nm">plakar ui</code>
      listens on localhost on a random port.</dd>
  <dt id="cors"><a class="permalink" href="#cors"><code class="Fl">-cors</code></a></dt>
  <dd>Set the &#x2018;Access-Control-Allow-Origin&#x2019; HTTP headers to allow
      the UI to be accessed from any origin.</dd>
  <dt id="no-auth"><a class="permalink" href="#no-auth"><code class="Fl">-no-auth</code></a></dt>
  <dd>Disable the authentication token that otherwise is needed to consume the
      exposed HTTP APIs.</dd>
  <dt id="no-spawn"><a class="permalink" href="#no-spawn"><code class="Fl">-no-spawn</code></a></dt>
  <dd>Do not automatically open the web browser.</dd>
</dl>
</section>
<section class="Sh">
<h1 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h1>
<p class="Pp">Using a custom address and disable automatic browser
  execution:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar ui -addr localhost:9090 -no-spawn</pre>
</div>
</section>
<section class="Sh">
<h1 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h1>
<p class="Pp">The <code class="Nm">plakar-ui</code> utility exits&#x00A0;0 on
    success, and&#x00A0;&gt;0 if an error occurs.</p>
<dl class="Bl-tag">
  <dt>0</dt>
  <dd>Command completed successfully.</dd>
  <dt>&gt;0</dt>
  <dd>A general error occurred, such as an inability to launch the UI or bind to
      the specified address.</dd>
</dl>
</section>
<section class="Sh">
<h1 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h1>
<p class="Pp"><a class="Xr" href="../plakar/">plakar(1)</a></p>
</section>
</div>
<table class="foot">
  <tr>
    <td class="foot-date">August 6, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
