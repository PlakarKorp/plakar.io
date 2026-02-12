---
date: "2025-10-15T10:33:18Z"
title: create
summary: "Create a new Plakar repository"
aliases:
  - /docs/v1.0.5/commands/plakar-create/
---
<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR-CREATE(1)</span>
  <span class="head-vol">General Commands Manual</span>
  <span class="head-rtitle">PLAKAR-CREATE(1)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">plakar-create</code> &#x2014;
    <span class="Nd" role="doc-subtitle">Create a new Plakar
  repository</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h2>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar create</code></td>
    <td>[<code class="Fl">-plaintext</code>]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
<p class="Pp">The <code class="Nm">plakar create</code> command creates a new
    Plakar repository at the specified path which defaults to
    <span class="Pa">~/.plakar</span>.</p>
<p class="Pp">The options are as follows:</p>
<dl class="Bl-tag">
  <dt id="plaintext"><a class="permalink" href="#plaintext"><code class="Fl">-plaintext</code></a></dt>
  <dd>Disable transparent encryption for the repository. If specified, the
      repository will not use encryption.</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="ENVIRONMENT"><a class="permalink" href="#ENVIRONMENT">ENVIRONMENT</a></h2>
<dl class="Bl-tag">
  <dt id="PLAKAR_PASSPHRASE"><a class="permalink" href="#PLAKAR_PASSPHRASE"><code class="Ev">PLAKAR_PASSPHRASE</code></a></dt>
  <dd>Repository encryption password.</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h2>
<p class="Pp">The <code class="Nm">plakar-create</code> utility exits&#x00A0;0
    on success, and&#x00A0;&gt;0 if an error occurs.</p>
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
    1">plakar(1)</a>,
    <a class="Xr" href="../plakar-backup/" aria-label="plakar-backup, section
    1">plakar-backup(1)</a></p>
</section>
</main>
<div class="foot" role="doc-pagefooter" aria-label="Manual footer
  line"><span class="foot-left">Plakar</span> <span class="foot-date">July 3,
  2025</span> <span class="foot-right">PLAKAR-CREATE(1)</span></div>
