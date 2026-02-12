---
date: "2025-12-01T16:54:45Z"
title: locate
summary: "Find filenames in a Plakar snapshot"
aliases:
  - /docs/v1.0.6/commands/plakar-locate/
---
<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR-LOCATE(1)</span>
  <span class="head-vol">General Commands Manual</span>
  <span class="head-rtitle">PLAKAR-LOCATE(1)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">plakar-locate</code> &#x2014;
    <span class="Nd" role="doc-subtitle">Find filenames in a Plakar
    snapshot</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h2>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar locate</code></td>
    <td>[<code class="Fl">-snapshot</code> <var class="Ar">snapshotID</var>]
      <var class="Ar">patterns ...</var></td>
  </tr>
</table>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
<p class="Pp">The <code class="Nm">plakar locate</code> command search snapshots
    to find file names matching any of the given <var class="Ar">patterns</var>
    and prints the abbreviated snapshot ID and the full path of the matched
    files. Matching works according to the shell globbing rules.</p>
<p class="Pp">If no <code class="Fl">-snapshot</code> nor location flags are
    given, <code class="Nm">plakar locate</code> will search in all
  snapshots.</p>
<p class="Pp">In addition to the flags described below, <code class="Nm">plakar
    locate</code> supports the location flags documented in
    <a class="Xr" href="../plakar-query/" aria-label="plakar-query, section
    7">plakar-query(7)</a> to precisely select snapshots.</p>
<p class="Pp">The options are as follows:</p>
<dl class="Bl-tag">
  <dt id="snapshot"><a class="permalink" href="#snapshot"><code class="Fl">-snapshot</code></a>
    <var class="Ar">snapshotID</var></dt>
  <dd>Limit the search to the given snapshot.</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h2>
<p class="Pp">Search for files ending in &#x201C;wd&#x201D;:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar locate '*wd'
abc123:/etc/master.passwd
abc123:/etc/passwd</pre>
</div>
</section>
<section class="Sh">
<h2 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h2>
<p class="Pp">The <code class="Nm">plakar-locate</code> utility exits&#x00A0;0
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
    1">plakar-backup(1)</a>,
    <a class="Xr" href="../plakar-query/" aria-label="plakar-query, section
    7">plakar-query(7)</a></p>
</section>
<section class="Sh">
<h2 class="Sh" id="CAVEATS"><a class="permalink" href="#CAVEATS">CAVEATS</a></h2>
<p class="Pp">The patterns may have to be quoted to avoid the shell attempting
    to expand them.</p>
</section>
</main>
<div class="foot" role="doc-pagefooter" aria-label="Manual footer
  line"><span class="foot-left">Plakar</span> <span class="foot-date">September
  10, 2025</span> <span class="foot-right">PLAKAR-LOCATE(1)</span></div>
