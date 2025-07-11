---
date: "2025-07-11T14:06:35Z"
title: store
summary: "Manage Plakar store configurations"
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-STORE(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-STORE(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar-store</code> &#x2014;
    <span class="Nd">Manage Plakar store configurations</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar store</code></td>
    <td>[subcommand ...]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar store</code> command manages the
    Plakar store configurations.</p>
<p class="Pp">The configuration consists in a set of named entries, each of them
    describing a Plakar store holding backups.</p>
<p class="Pp">A store is defined by at least a location, specifying the storage
    implementation to use, and some storage-specific parameters.</p>
<p class="Pp">The subcommands are as follows:</p>
<dl class="Bl-tag">
  <dt id="add"><a class="permalink" href="#add"><code class="Cm">add</code></a>
    <var class="Ar">name</var> <var class="Ar">location</var> [option=value
    ...]</dt>
  <dd>Create a new store entry identified by <var class="Ar">name</var> with the
      specified <var class="Ar">location</var>. Specific additional
      configuration parameters can be set by adding
      <var class="Ar">option=value</var> parameters.</dd>
  <dt id="check"><a class="permalink" href="#check"><code class="Cm">check</code></a>
    <var class="Ar">name</var></dt>
  <dd>Check wether the store identified by <var class="Ar">name</var> is
      properly configured.</dd>
  <dt id="ls"><a class="permalink" href="#ls"><code class="Cm">ls</code></a></dt>
  <dd>Display the current stores configuration. This is the default if no
      subcommand is specified.</dd>
  <dt id="ping"><a class="permalink" href="#ping"><code class="Cm">ping</code></a>
    <var class="Ar">name</var></dt>
  <dd>Try to connect to the store identified by <var class="Ar">name</var> to
      make sure it is reachable.</dd>
  <dt id="rm"><a class="permalink" href="#rm"><code class="Cm">rm</code></a>
    <var class="Ar">name</var></dt>
  <dd>Remove the store identified by <var class="Ar">name</var> from the
      configuration.</dd>
  <dt id="set"><a class="permalink" href="#set"><code class="Cm">set</code></a>
    <var class="Ar">name</var> [option=value ...]</dt>
  <dd>Set the <var class="Ar">option</var> to <var class="Ar">value</var> for
      the store identified by <var class="Ar">name</var>. Multiple option/value
      pairs can be specified.</dd>
  <dt id="unset"><a class="permalink" href="#unset"><code class="Cm">unset</code></a>
    <var class="Ar">name</var> [option ...]</dt>
  <dd>Remove the <var class="Ar">option</var> for the store entry identified by
      <var class="Ar">name</var>.</dd>
</dl>
</section>
<section class="Sh">
<h1 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h1>
<p class="Pp">The <code class="Nm">plakar-store</code> utility exits&#x00A0;0 on
    success, and&#x00A0;&gt;0 if an error occurs.</p>
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
