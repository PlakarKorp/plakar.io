---
date: "2025-07-31T20:16:52Z"
title: agent
summary: "Run the Plakar agent"
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-AGENT(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-AGENT(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar agent</code> &#x2014; <span class="Nd">Run
    the Plakar agent</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar agent</code></td>
    <td>[<code class="Fl">-foreground</code>] [<code class="Fl">-log</code>
      <var class="Ar">filename</var>] [<code class="Cm">stop</code>]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar agent</code> command starts the Plakar
    agent which will execute subsequent
    <a class="Xr" href="../plakar/">plakar(1)</a> commands on their behalfs for
    faster processing. <code class="Nm">plakar agent</code> continues running
    indefinitely.</p>
<p class="Pp">The options are as follows:</p>
<dl class="Bl-tag">
  <dt id="foreground"><a class="permalink" href="#foreground"><code class="Fl">-foreground</code></a></dt>
  <dd>Do not daemonize agent, run in foreground.</dd>
  <dt id="log"><a class="permalink" href="#log"><code class="Fl">-log</code></a>
    <var class="Ar">filename</var></dt>
  <dd>Redirect all output to <var class="Ar">filename</var>.</dd>
</dl>
<p class="Pp">With the <code class="Cm">stop</code> argument,
    <code class="Nm">plakar agent</code> will be stopped.</p>
</section>
<section class="Sh">
<h1 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h1>
<p class="Pp">The <code class="Nm">plakar agent</code> utility exits&#x00A0;0 on
    success, and&#x00A0;&gt;0 if an error occurs.</p>
<dl class="Bl-tag">
  <dt>0</dt>
  <dd>Command completed successfully.</dd>
  <dt>&gt;0</dt>
  <dd>An error occurred, such as invalid parameters, inability to create the
      repository, or configuration issues.</dd>
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
    <td class="foot-date">February 1, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
