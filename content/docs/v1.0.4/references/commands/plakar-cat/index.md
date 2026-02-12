---
date: "2025-09-15T17:20:33Z"
title: cat
summary: "Display file contents from a Plakar snapshot"
aliases:
  - /docs/v1.0.4/commands/plakar-cat/
---
<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR-CAT(1)</span>
  <span class="head-vol">General Commands Manual</span>
  <span class="head-rtitle">PLAKAR-CAT(1)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">plakar-cat</code> &#x2014;
    <span class="Nd" role="doc-subtitle">Display file contents from a Plakar
    snapshot</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h2>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar cat</code></td>
    <td>[<code class="Fl">-decompress</code>]
      [<code class="Fl">-highlight</code>]
      <var class="Ar">snapshotID</var>:<var class="Ar">path ...</var></td>
  </tr>
</table>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
<p class="Pp">The <code class="Nm">plakar cat</code> command outputs the
    contents of <var class="Ar">path</var> within Plakar snapshots to the
    standard output. It can decompress compressed files and optionally apply
    syntax highlighting based on the file type.</p>
<p class="Pp">The options are as follows:</p>
<dl class="Bl-tag">
  <dt id="decompress"><a class="permalink" href="#decompress"><code class="Fl">-decompress</code></a></dt>
  <dd>If set, Plakar attempts to decompress application/gzip files.</dd>
  <dt id="highlight"><a class="permalink" href="#highlight"><code class="Fl">-highlight</code></a></dt>
  <dd>Apply syntax highlighting to the output based on the file type.</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h2>
<p class="Pp">Display a file's contents from a snapshot:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar cat abc123:/etc/passwd</pre>
</div>
<p class="Pp">Display a file with syntax highlighting:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar cat -highlight abc123:/home/op/korpus/driver.sh</pre>
</div>
</section>
<section class="Sh">
<h2 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h2>
<p class="Pp">The <code class="Nm">plakar-cat</code> utility exits&#x00A0;0 on
    success, and&#x00A0;&gt;0 if an error occurs.</p>
<dl class="Bl-tag">
  <dt>0</dt>
  <dd>Command completed successfully.</dd>
  <dt>&gt;0</dt>
  <dd>An error occurred, such as failure to retrieve a file or decompress
      content.</dd>
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
  line"><span class="foot-left">Plakar</span> <span class="foot-date">August 6,
  2025</span> <span class="foot-right">PLAKAR-CAT(1)</span></div>
