---
date: "2026-01-29T09:34:09Z"
title: scheduler
summary: "Run the Plakar scheduler"
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-SCHEDULER(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-SCHEDULER(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar-scheduler</code> &#x2014;
    <span class="Nd">Run the Plakar scheduler</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar scheduler</code></td>
    <td>[<code class="Fl">-foreground</code>] [<code class="Cm">start</code>
      <code class="Fl">-tasks</code> <var class="Ar">configfile</var>]
      [<code class="Cm">stop</code>]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar scheduler</code> runs in the
    background and manages task execution based on the defined schedule.</p>
<p class="Pp">The options are as follows:</p>
<dl class="Bl-tag">
  <dt id="foreground"><a class="permalink" href="#foreground"><code class="Fl">-foreground</code></a></dt>
  <dd>Run the scheduler in the foreground instead of as a background
    service.</dd>
  <dt id="tasks"><a class="permalink" href="#tasks"><code class="Fl">-tasks</code></a>
    <var class="Ar">configfile</var></dt>
  <dd>Specify the configuration file that contains the task definitions and
      schedules.</dd>
  <dt id="start"><a class="permalink" href="#start"><code class="Cm">start</code></a>
    <code class="Fl">-tasks</code> <var class="Ar">configfile</var></dt>
  <dd>Starts the scheduler service and its tasks from
      <var class="Ar">configfile</var>.</dd>
  <dt id="stop"><a class="permalink" href="#stop"><code class="Cm">stop</code></a></dt>
  <dd>Stop the currently running scheduler service.</dd>
</dl>
</section>
<section class="Sh">
<h1 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h1>
<p class="Pp">The <code class="Nm">plakar-scheduler</code> utility
    exits&#x00A0;0 on success, and&#x00A0;&gt;0 if an error occurs.</p>
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
    <td class="foot-date">July 3, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
