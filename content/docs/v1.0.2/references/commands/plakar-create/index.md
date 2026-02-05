---
date: "2025-07-31T20:16:52Z"
title: create
summary: "Create a new Plakar repository"
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-CREATE(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-CREATE(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar create</code> &#x2014;
    <span class="Nd">Create a new Plakar repository</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar create</code></td>
    <td>[<code class="Fl">-hashing</code> <var class="Ar">algorithm</var>]
      [<code class="Fl">-no-encryption</code>]
      [<code class="Fl">-no-compression</code>]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar create</code> command creates a new
    Plakar repository at the specified path which defaults to
    <span class="Pa">~/.plakar</span>.</p>
<p class="Pp">The options are as follows:</p>
<dl class="Bl-tag">
  <dt id="hashing"><a class="permalink" href="#hashing"><code class="Fl">-hashing</code></a>
    <var class="Ar">algorithm</var></dt>
  <dd>Provide alternative hashing algorithm to replace the default. Supported
      algorithms are BLAKE3 and SHA256, default is BLAKE3.</dd>
  <dt id="no-encryption"><a class="permalink" href="#no-encryption"><code class="Fl">-no-encryption</code></a></dt>
  <dd>Disable transparent encryption for the repository. If specified, the
      repository will not use encryption.</dd>
  <dt id="no-compression"><a class="permalink" href="#no-compression"><code class="Fl">-no-compression</code></a></dt>
  <dd>Disable transparent compression for the repository. If specified, the
      repository will not use compression.</dd>
</dl>
</section>
<section class="Sh">
<h1 class="Sh" id="ENVIRONMENT"><a class="permalink" href="#ENVIRONMENT">ENVIRONMENT</a></h1>
<dl class="Bl-tag">
  <dt id="PLAKAR_PASSPHRASE"><a class="permalink" href="#PLAKAR_PASSPHRASE"><code class="Ev">PLAKAR_PASSPHRASE</code></a></dt>
  <dd>Repository encryption password.</dd>
</dl>
</section>
<section class="Sh">
<h1 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h1>
<p class="Pp">The <code class="Nm">plakar create</code> utility exits&#x00A0;0
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
<h1 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h1>
<p class="Pp"><a class="Xr" href="../plakar/">plakar(1)</a>,
    <a class="Xr" href="../plakar-backup/">plakar-backup(1)</a></p>
</section>
</div>
<table class="foot">
  <tr>
    <td class="foot-date">February 3, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
