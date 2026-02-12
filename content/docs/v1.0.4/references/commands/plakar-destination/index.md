---
date: "2025-09-15T17:20:33Z"
title: destination
summary: "Manage Plakar restore destination configuration"
aliases:
  - /docs/v1.0.4/commands/plakar-destination/
---
<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR-DESTINATION(1)</span>
  <span class="head-vol">General Commands Manual</span>
  <span class="head-rtitle">PLAKAR-DESTINATION(1)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">plakar-destination</code> &#x2014;
    <span class="Nd" role="doc-subtitle">Manage Plakar restore destination
    configuration</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h2>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar destination</code></td>
    <td><var class="Ar">subcommand ...</var></td>
  </tr>
</table>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
<p class="Pp">The <code class="Nm">plakar destination</code> command manages the
    configuration of destinations where Plakar will restore.</p>
<p class="Pp">The configuration consists in a set of named entries, each of them
    describing a destination where a restore operation may happen.</p>
<p class="Pp">A destination is defined by at least a location, specifying the
    exporter to use, and some exporter-specific parameters.</p>
<p class="Pp">The subcommands are as follows:</p>
<dl class="Bl-tag">
  <dt id="add"><a class="permalink" href="#add"><code class="Cm">add</code></a>
    <var class="Ar">name</var> <var class="Ar">location</var>
    [<var class="Ar">option</var><span class="No">=</span><var class="Ar">value
    ...</var>]</dt>
  <dd>Create a new destination entry identified by <var class="Ar">name</var>
      with the specified <var class="Ar">location</var> describing the exporter
      to use. Additional exporter options can be set by adding
      <var class="Ar">option</var><span class="No">=</span><var class="Ar">value</var>
      parameters.</dd>
  <dt id="check"><a class="permalink" href="#check"><code class="Cm">check</code></a>
    <var class="Ar">name</var></dt>
  <dd>Check wether the exporter for the destination identified by
      <var class="Ar">name</var> is properly configured.</dd>
  <dt id="import"><a class="permalink" href="#import"><code class="Cm">import</code></a>
    [<code class="Fl">-config</code> <var class="Ar">location</var>]
    [<code class="Fl">-overwrite</code>] [<code class="Fl">-rclone</code>]
    [<var class="Ar">sections ...</var>]</dt>
  <dd>Import a configuration from either stdin (default), a file, or a URL.
    <p class="Pp">If <var class="Ar">location</var> is specified, the input will
        be read from that file or URL.</p>
    <p class="Pp">If <code class="Fl">-overwrite</code> is specified, existing
        sections will be overwritten by new ones.</p>
    <p class="Pp">If <code class="Fl">-rclone</code> is specified, the input
        will be treated as an rclone configuration.</p>
    <p class="Pp">If <var class="Ar">sections</var> are specified, only those
        sections will be imported. A section can be renamed on import by
        appending a colon and the new name.</p>
  </dd>
  <dt id="ping"><a class="permalink" href="#ping"><code class="Cm">ping</code></a>
    <var class="Ar">name</var></dt>
  <dd>Try to open the destination identified by <var class="Ar">name</var> to
      make sure it is reachable.</dd>
  <dt id="rm"><a class="permalink" href="#rm"><code class="Cm">rm</code></a>
    <var class="Ar">name</var></dt>
  <dd>Remove the destination identified by <var class="Ar">name</var> from the
      configuration.</dd>
  <dt id="set"><a class="permalink" href="#set"><code class="Cm">set</code></a>
    <var class="Ar">name</var>
    [<var class="Ar">option</var><span class="No">=</span><var class="Ar">value
    ...</var>]</dt>
  <dd>Set the <var class="Ar">option</var> to <var class="Ar">value</var> for
      the destination identified by <var class="Ar">name</var>. Multiple
      option/value pairs can be specified.</dd>
  <dt id="show"><a class="permalink" href="#show"><code class="Cm">show</code></a>
    [<code class="Fl">-secrets</code>] [<var class="Ar">name ...</var>]</dt>
  <dd>Display the current destinations configuration. If
      <code class="Fl">-secrets</code> is specified, sensitive information such
      as passwords or tokens will be shown.</dd>
  <dt id="unset"><a class="permalink" href="#unset"><code class="Cm">unset</code></a>
    <var class="Ar">name</var> [<var class="Ar">option ...</var>]</dt>
  <dd>Remove the <var class="Ar">option</var> for the destination entry
      identified by <var class="Ar">name</var>.</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="EXIT_STATUS"><a class="permalink" href="#EXIT_STATUS">EXIT
  STATUS</a></h2>
<p class="Pp">The <code class="Nm">plakar-destination</code> utility
    exits&#x00A0;0 on success, and&#x00A0;&gt;0 if an error occurs.</p>
</section>
<section class="Sh">
<h2 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h2>
<p class="Pp"><a class="Xr" href="../plakar/" aria-label="plakar, section
    1">plakar(1)</a></p>
</section>
</main>
<div class="foot" role="doc-pagefooter" aria-label="Manual footer
  line"><span class="foot-left">Plakar</span> <span class="foot-date">September
  11, 2025</span> <span class="foot-right">PLAKAR-DESTINATION(1)</span></div>
