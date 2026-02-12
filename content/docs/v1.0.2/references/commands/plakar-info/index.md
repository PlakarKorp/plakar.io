---
date: "2025-07-31T20:16:52Z"
title: info
summary: "Display detailed information about internal structures"
aliases:
  - /docs/v1.0.2/commands/plakar-info/
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-INFO(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-INFO(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar info</code> &#x2014;
    <span class="Nd">Display detailed information about internal
    structures</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar info</code></td>
    <td>[<var class="Ar">snapshot</var>[:<var class="Ar">/path/to/file</var>]]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar info</code> command provides detailed
    information about a Plakar repository, snapshots and filesystem entries. The
    type of information displayed depends on the specified argument. Without any
    arguments, display information about the repository.</p>
</section>
<section class="Sh">
<h1 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h1>
<p class="Pp">Show repository information:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar info</pre>
</div>
<p class="Pp">Show detailed information for a snapshot:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar info abc123</pre>
</div>
<p class="Pp">Show detailed information for a file within a snapshot:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar info abcd123:/etc/passwd</pre>
</div>
</section>
<section class="Sh">
<h1 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h1>
<p class="Pp">The <code class="Nm">plakar info</code> utility exits&#x00A0;0 on
    success, and&#x00A0;&gt;0 if an error occurs.</p>
<dl class="Bl-tag">
  <dt>0</dt>
  <dd>Command completed successfully.</dd>
  <dt>&gt;0</dt>
  <dd>An error occurred, such as an invalid snapshot or object ID, or a failure
      to retrieve the requested data.</dd>
</dl>
</section>
<section class="Sh">
<h1 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h1>
<p class="Pp"><a class="Xr" href="../plakar/">plakar(1)</a>,
    <a class="Xr" href="../plakar-snapshot/">plakar-snapshot(1)</a></p>
</section>
</div>
<table class="foot">
  <tr>
    <td class="foot-date">March 3, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
