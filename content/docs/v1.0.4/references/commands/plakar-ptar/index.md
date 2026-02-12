---
date: "2025-09-15T17:20:33Z"
title: ptar
summary: "generate a self-contained Kloset archive (.ptar)"
aliases:
  - /docs/v1.0.4/commands/plakar-ptar/
---
<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR-PTAR(1)</span>
  <span class="head-vol">General Commands Manual</span>
  <span class="head-rtitle">PLAKAR-PTAR(1)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">plakar-ptar</code> &#x2014;
    <span class="Nd" role="doc-subtitle">generate a self-contained Kloset
    archive (.ptar)</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h2>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar ptar</code></td>
    <td>[<code class="Fl">-plaintext</code>]
      [<code class="Fl">-overwrite</code>] [<code class="Fl">-k</code>
      <var class="Ar">location</var>] <code class="Fl">-o</code>
      <var class="Ar">file.ptar</var> [<var class="Ar">path ...</var>]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
<p class="Pp">The <code class="Nm">plakar ptar</code> command creates a single
    portable archive (a &#x2018;.ptar&#x2019; file) that bundles one or more
    existing Plakar repositories (&#x201C;klosets&#x201D;) and/or arbitrary
    filesystem paths into a self-contained package. The resulting archive
    preserves repository metadata, snapshots and data chunks, and is compressed
    and encrypted for secure transport or off-site storage.</p>
<p class="Pp">At least one data source must be supplied: either one or more
    <code class="Fl">-k</code> <span class="No">or</span>
    <code class="Fl">-kloset</code> options naming remote or local kloset
    repositories, and/or one or more <var class="Ar">path</var> arguments
    identifying files or directories to back up. The destination archive name is
    mandatory and supplied with <code class="Fl">-o</code>.</p>
<p class="Pp">Unless the <code class="Fl">-overwrite</code> flag is given,
    <code class="Nm">plakar ptar</code> refuses to replace an existing
  archive.</p>
<p class="Pp">The options are as follows:</p>
<dl class="Bl-tag">
  <dt id="plaintext"><a class="permalink" href="#plaintext"><code class="Fl">-plaintext</code></a></dt>
  <dd>Disable transparent encryption of the archive. If omitted,
      <code class="Nm">plakar ptar</code> encrypts repository data using a key
      derived from the passphrase specified via
      <code class="Ev">PLAKAR_PASSPHRASE</code> or prompted interactively.</dd>
  <dt id="overwrite"><a class="permalink" href="#overwrite"><code class="Fl">-overwrite</code></a></dt>
  <dd>Overwrite an existing <span class="Pa">.ptar</span> file at the
      destination path.</dd>
  <dt id="k"><a class="permalink" href="#k"><code class="Fl">-k</code></a>
    <var class="Ar">location</var>, <code class="Fl">-kloset</code>
    <var class="Ar">location</var></dt>
  <dd>Add a kloset repository to include in the archive. May be specified
      multiple times to bundle several repositories.</dd>
  <dt id="o"><a class="permalink" href="#o"><code class="Fl">-o</code></a>
    <var class="Ar">file.ptar</var></dt>
  <dd>Path of the archive to create. This option is required.</dd>
  <dt><var class="Ar">path ...</var></dt>
  <dd>Zero or more filesystem paths to back up directly into the archive.</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="ENVIRONMENT"><a class="permalink" href="#ENVIRONMENT">ENVIRONMENT</a></h2>
<dl class="Bl-tag">
  <dt id="PLAKAR_PASSPHRASE"><a class="permalink" href="#PLAKAR_PASSPHRASE"><code class="Ev">PLAKAR_PASSPHRASE</code></a></dt>
  <dd>Passphrase used to derive the encryption key when encryption is
    enabled.</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h2>
<p class="Pp">The <code class="Nm">plakar-ptar</code> utility exits&#x00A0;0 on
    success, and&#x00A0;&gt;0 if an error occurs.</p>
<dl class="Bl-tag">
  <dt>0</dt>
  <dd>Command completed successfully.</dd>
  <dt>&gt;0</dt>
  <dd>An error occurred (invalid arguments, existing archive without
      <code class="Fl">-overwrite</code>, hashing algorithm unknown, repository
      access failure, I/O errors, etc.).</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h2>
<p class="Pp"><a class="Xr" href="../plakar/" aria-label="plakar, section
    1">plakar(1)</a>,
    <a class="Xr" href="../plakar-backup/" aria-label="plakar-backup, section
    1">plakar-backup(1)</a>,
    <a class="Xr" href="../plakar-create/" aria-label="plakar-create, section
    1">plakar-create(1)</a></p>
</section>
</main>
<div class="foot" role="doc-pagefooter" aria-label="Manual footer
  line"><span class="foot-left">Plakar</span> <span class="foot-date">July 3,
  2025</span> <span class="foot-right">PLAKAR-PTAR(1)</span></div>
