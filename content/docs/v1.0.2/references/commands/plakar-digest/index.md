---
date: "2025-07-31T20:16:52Z"
title: digest
summary: "Compute digests for files in a Plakar snapshot"
aliases:
  - /docs/v1.0.2/commands/plakar-digest/
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-DIGEST(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-DIGEST(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar digest</code> &#x2014;
    <span class="Nd">Compute digests for files in a Plakar snapshot</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar digest</code></td>
    <td>[<code class="Fl">-hashing</code> <var class="Ar">algorithm</var>]
      <var class="Ar">snapshotID</var>[:<var class="Ar">path</var>] [...]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar digest</code> command computes and
    displays digests for specified <var class="Ar">path</var> in a the given
    <var class="Ar">snapshotID</var>. Multiple <var class="Ar">snapshotID</var>
    and <var class="Ar">path</var> may be given. By default, the command
    computes the digest by reading the file contents.</p>
<p class="Pp">The options are as follows:</p>
<dl class="Bl-tag">
  <dt id="hashing"><a class="permalink" href="#hashing"><code class="Fl">-hashing</code></a>
    <var class="Ar">algorithm</var></dt>
  <dd>Use <var class="Ar">algorithm</var> to compute the digest. Defaults to
      SHA256.</dd>
</dl>
</section>
<section class="Sh">
<h1 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h1>
<p class="Pp">Compute the digest of a file within a snapshot:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar digest abc123:/etc/passwd</pre>
</div>
<p class="Pp">Use BLAKE3 as the digest algorithm:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar digest -hashing BLAKE3 abc123:/etc/netstart</pre>
</div>
</section>
<section class="Sh">
<h1 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h1>
<p class="Pp">The <code class="Nm">plakar digest</code> utility exits&#x00A0;0
    on success, and&#x00A0;&gt;0 if an error occurs.</p>
<dl class="Bl-tag">
  <dt>0</dt>
  <dd>Command completed successfully.</dd>
  <dt>&gt;0</dt>
  <dd>An error occurred, such as failure to retrieve a file digest or invalid
      snapshot ID.</dd>
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
    <td class="foot-date">March 3, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
