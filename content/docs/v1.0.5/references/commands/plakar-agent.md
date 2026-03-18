---
date: "2026-03-18T08:05:04Z"
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
<p class="Pp"><code class="Nm">plakar-agent</code> &#x2014; <span class="Nd">Run
    the Plakar agent</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar agent</code></td>
    <td>[<code class="Cm">start</code> [<code class="Fl">-foreground</code>]
      [<code class="Fl">-log</code> <var class="Ar">logfile</var>]
      [<code class="Fl">-teardown</code> <var class="Ar">delay</var>]]</td>
  </tr>
</table>
<br/>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar agent</code></td>
    <td><code class="Cm">stop</code></td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar agent start</code> command, which is
    the default, starts the Plakar agent which will execute subsequent
    <a class="Xr" href="../plakar/">plakar(1)</a> commands on their behalfs for
    faster processing.</p>
<p class="Pp"><code class="Nm">plakar agent</code> is executed automatically by
    most <a class="Xr" href="../plakar/">plakar(1)</a> commands and terminates
    by itself when idle for too long, so usually there's no need to manually
    start it.</p>
<p class="Pp">The options for <code class="Nm">plakar agent</code>
    <code class="Cm">start</code> are as follows:</p>
<dl class="Bl-tag">
  <dt id="foreground"><a class="permalink" href="#foreground"><code class="Fl">-foreground</code></a></dt>
  <dd>Do not daemonize, run in the foreground and log to standard error.</dd>
  <dt id="log"><a class="permalink" href="#log"><code class="Fl">-log</code></a>
    <var class="Ar">logfile</var></dt>
  <dd>Write log output to the given <var class="Ar">logfile</var> which is
      created if it does not exist. The default is to log to syslog.</dd>
  <dt id="teardown"><a class="permalink" href="#teardown"><code class="Fl">-teardown</code></a>
    <var class="Ar">delay</var></dt>
  <dd>Specify the delay after which the idle agent terminate. The
      <var class="Ar">delay</var> parameter must be given as a sequence of
      decimal value, each followed by a time unit (e.g. &#x201C;1m30s&#x201D;).
      Defaults to 5 seconds.</dd>
</dl>
<p class="Pp"><code class="Nm">plakar agent</code> <code class="Cm">stop</code>
    forces the currently running agent to stop. This is useful when upgrading
    from an older <a class="Xr" href="../plakar/">plakar(1)</a> version were the
    agent was always running.</p>
</section>
<section class="Sh">
<h1 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h1>
<p class="Pp">The <code class="Nm">plakar-agent</code> utility exits&#x00A0;0 on
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
    <td class="foot-date">July 3, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
