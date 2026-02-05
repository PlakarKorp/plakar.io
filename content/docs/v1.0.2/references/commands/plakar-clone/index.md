---
date: "2025-07-31T20:16:52Z"
title: clone
summary: "Clone a Plakar repository to a new location"
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-CLONE(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-CLONE(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar clone</code> &#x2014;
    <span class="Nd">Clone a Plakar repository to a new location</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar clone</code></td>
    <td><code class="Cm">to</code> <var class="Ar">path</var></td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar clone</code> command creates a full
    clone of an existing Plakar repository, including all snapshots, packfiles,
    and repository states, and saves it at the specified
    <var class="Ar">path</var>.</p>
</section>
<section class="Sh">
<h1 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h1>
<p class="Pp">Clone a repository to a new location:</p>
<div class="Bd Pp Bd-indent Li">
<pre>plakar clone to /path/to/new/repository</pre>
</div>
</section>
<section class="Sh">
<h1 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h1>
<p class="Pp">The <code class="Nm">plakar clone</code> utility exits&#x00A0;0 on
    success, and&#x00A0;&gt;0 if an error occurs.</p>
<dl class="Bl-tag">
  <dt>0</dt>
  <dd>Command completed successfully.</dd>
  <dt>&gt;0</dt>
  <dd>An error occurred, such as failure to access the source repository or to
      create the target repository.</dd>
</dl>
</section>
<section class="Sh">
<h1 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h1>
<p class="Pp"><a class="Xr" href="../plakar/">plakar(1)</a>,
    <a class="Xr" href="../plakar-create/">plakar-create(1)</a></p>
</section>
</div>
<table class="foot">
  <tr>
    <td class="foot-date">February 1, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
