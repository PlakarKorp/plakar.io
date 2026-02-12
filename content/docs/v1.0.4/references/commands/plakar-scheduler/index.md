---
date: "2025-09-15T17:20:33Z"
title: scheduler
summary: "Run the Plakar scheduler"
aliases:
  - /docs/v1.0.4/commands/plakar-scheduler/
---
<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR-SCHEDULER(1)</span>
  <span class="head-vol">General Commands Manual</span>
  <span class="head-rtitle">PLAKAR-SCHEDULER(1)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">plakar-scheduler</code> &#x2014;
    <span class="Nd" role="doc-subtitle">Run the Plakar scheduler</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h2>
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
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
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
<h2 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h2>
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
<h2 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h2>
<p class="Pp"><a class="Xr" href="../plakar/" aria-label="plakar, section
    1">plakar(1)</a></p>
</section>
</main>
<div class="foot" role="doc-pagefooter" aria-label="Manual footer
  line"><span class="foot-left">Plakar</span> <span class="foot-date">July 3,
  2025</span> <span class="foot-right">PLAKAR-SCHEDULER(1)</span></div>
