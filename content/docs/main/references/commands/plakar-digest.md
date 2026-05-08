---
date: "2026-05-06T10:34:26Z"
title: digest
summary: "Compute digests for files in a Plakar snapshot"
aliases:
  - /docs/main/commands/plakar-digest/
---

<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR-DIGEST(1)</span>
  <span class="head-vol">General Commands Manual</span>
  <span class="head-rtitle">PLAKAR-DIGEST(1)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">plakar-digest</code> &#x2014;
    <span class="Nd" role="doc-subtitle">Compute digests for files in a Plakar
    snapshot</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h2>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar digest</code></td>
    <td>[<code class="Fl">-hashing</code> <var class="Ar">algorithm</var>]
      <var class="Ar">snapshotID</var>[:<var class="Ar">path</var>] [...]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
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
<h2 class="Sh" id="EXIT_STATUS"><a class="permalink" href="#EXIT_STATUS">EXIT
  STATUS</a></h2>
<p class="Pp">The <code class="Nm">plakar-digest</code> utility exits&#x00A0;0
    on success, and&#x00A0;&gt;0 if an error occurs.</p>
</section>
<section class="Sh">
<h2 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h2>
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
<h2 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h2>
<p class="Pp"><a class="Xr" href="../plakar/" aria-label="plakar, section
    1">plakar(1)</a></p>
</section>
</main>
<div class="foot" role="doc-pagefooter" aria-label="Manual footer
  line"><span class="foot-left">Plakar</span> <span class="foot-date">May 5,
  2026</span> <span class="foot-right">PLAKAR-DIGEST(1)</span></div>
