---
date: "2025-12-01T16:54:45Z"
title: archive
summary: "Create an archive from a Plakar snapshot"
---
<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR-ARCHIVE(1)</span>
  <span class="head-vol">General Commands Manual</span>
  <span class="head-rtitle">PLAKAR-ARCHIVE(1)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">plakar-archive</code> &#x2014;
    <span class="Nd" role="doc-subtitle">Create an archive from a Plakar
    snapshot</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h2>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar archive</code></td>
    <td>[<code class="Fl">-format</code> <var class="Ar">type</var>]
      [<code class="Fl">-output</code> <var class="Ar">archive</var>]
      [<code class="Fl">-rebase</code>]
      <var class="Ar">snapshotID</var>:<var class="Ar">path</var></td>
  </tr>
</table>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
<p class="Pp">The <code class="Nm">plakar archive</code> command creates an
    <var class="Ar">archive</var> of the given <var class="Ar">type</var> from
    the contents at <var class="Ar">path</var> of a specified Plakar snapshot,
    or all the files if no <var class="Ar">path</var> is given.</p>
<p class="Pp">The options are as follows:</p>
<dl class="Bl-tag">
  <dt id="format"><a class="permalink" href="#format"><code class="Fl">-format</code></a>
    <var class="Ar">type</var></dt>
  <dd>Specify the archive format. Supported formats are:
    <p class="Pp"></p>
    <dl class="Bl-tag Bl-compact">
      <dt id="tar"><a class="permalink" href="#tar"><code class="Cm">tar</code></a></dt>
      <dd>Creates a tar file.</dd>
      <dt id="tarball"><a class="permalink" href="#tarball"><code class="Cm">tarball</code></a></dt>
      <dd>Creates a compressed tar.gz file.</dd>
      <dt id="zip"><a class="permalink" href="#zip"><code class="Cm">zip</code></a></dt>
      <dd>Creates a zip archive.</dd>
    </dl>
  </dd>
  <dt id="output"><a class="permalink" href="#output"><code class="Fl">-output</code></a>
    <var class="Ar">pathname</var></dt>
  <dd>Specify the output path for the archive file. If omitted, the archive is
      created with a default name based on the current date and time.</dd>
  <dt id="rebase"><a class="permalink" href="#rebase"><code class="Fl">-rebase</code></a></dt>
  <dd>Strip the leading path from archived files, useful for creating
      &quot;flat&quot; archives without nested directories.</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h2>
<p class="Pp">Create a tarball of the entire snapshot:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar archive -output backup.tar.gz -format tarball abc123</pre>
</div>
<p class="Pp">Create a zip archive of a specific directory within a
  snapshot:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar archive -output dir.zip -format zip abc123:/var/www</pre>
</div>
<p class="Pp">Archive with rebasing to remove directory structure:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar archive -rebase -format tar abc123</pre>
</div>
</section>
<section class="Sh">
<h2 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h2>
<p class="Pp">The <code class="Nm">plakar-archive</code> utility exits&#x00A0;0
    on success, and&#x00A0;&gt;0 if an error occurs.</p>
<dl class="Bl-tag">
  <dt>0</dt>
  <dd>Command completed successfully.</dd>
  <dt>&gt;0</dt>
  <dd>An error occurred, such as unsupported format, missing files, or
      permission issues.</dd>
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
  2025</span> <span class="foot-right">PLAKAR-ARCHIVE(1)</span></div>
