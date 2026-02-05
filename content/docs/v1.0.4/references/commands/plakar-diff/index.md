---
date: "2025-09-15T17:20:33Z"
title: diff
summary: "Show differences between files in a Plakar snapshots"
---
<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR-DIFF(1)</span>
  <span class="head-vol">General Commands Manual</span>
  <span class="head-rtitle">PLAKAR-DIFF(1)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">plakar-diff</code> &#x2014;
    <span class="Nd" role="doc-subtitle">Show differences between files in a
    Plakar snapshots</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h2>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar diff</code></td>
    <td>[<code class="Fl">-highlight</code>]
      [<code class="Fl">-recursive</code>]
      <var class="Ar">snapshotID1</var>[:<var class="Ar">path1</var>]
      <var class="Ar">snapshotID2</var>[:<var class="Ar">path2</var>]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
<p class="Pp">The <code class="Nm">plakar diff</code> command compares two
    Plakar snapshots, optionally restricting to specific files within them. If
    only snapshot IDs are provided, it compares the root directories of each
    snapshot. If file paths are specified, the command compares the individual
    files. The diff output is shown in unified diff format, with an option to
    highlight differences.</p>
<p class="Pp">The options are as follows:</p>
<dl class="Bl-tag">
  <dt id="highlight"><a class="permalink" href="#highlight"><code class="Fl">-highlight</code></a></dt>
  <dd>Apply syntax highlighting to the diff output for readability.</dd>
  <dt id="recursive"><a class="permalink" href="#recursive"><code class="Fl">-recursive</code></a></dt>
  <dd>When comparing directories, recursively compare all subdirectories.</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h2>
<p class="Pp">Compare root directories of two snapshots:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar diff abc123 def456</pre>
</div>
<p class="Pp">Compare across snapshots with highlighting:
    <span class="Pa">/etc/passwd</span></p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar diff -highlight abc123:/etc/passwd def456:/etc/passwd</pre>
</div>
</section>
<section class="Sh">
<h2 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h2>
<p class="Pp">The <code class="Nm">plakar-diff</code> utility exits&#x00A0;0 on
    success, and&#x00A0;&gt;0 if an error occurs.</p>
<dl class="Bl-tag">
  <dt>0</dt>
  <dd>Command completed successfully.</dd>
  <dt>&gt;0</dt>
  <dd>An error occurred, such as invalid snapshot IDs, missing files, or an
      unsupported file type.</dd>
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
  2025</span> <span class="foot-right">PLAKAR-DIFF(1)</span></div>
