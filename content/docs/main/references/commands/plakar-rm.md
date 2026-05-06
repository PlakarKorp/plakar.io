---
date: "2026-05-06T10:34:26Z"
title: rm
summary: "Remove snapshots from a Plakar repository"
aliases:
  - /docs/main/commands/plakar-rm/
---

<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR-RM(1)</span>
  <span class="head-vol">General Commands Manual</span>
  <span class="head-rtitle">PLAKAR-RM(1)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">plakar-rm</code> &#x2014;
    <span class="Nd" role="doc-subtitle">Remove snapshots from a Plakar
    repository</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h2>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar rm</code></td>
    <td>[<code class="Fl">-apply</code>] [<var class="Ar">snapshotID
      ...</var>]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
<p class="Pp">The <code class="Nm">plakar rm</code> command deletes snapshots
    from a Plakar repository. Snapshots can be filtered for deletion by age, by
    tag, or by specifying the snapshot IDs to remove. If no
    <var class="Ar">snapshotID</var> are provided, either
    <code class="Fl">-older</code> or <code class="Fl">-tag</code> must be
    specified to filter the snapshots to delete.</p>
<p class="Pp">In addition to the flags described below, <code class="Nm">plakar
    ls</code> supports the location flags documented in
    <a class="Xr" href="../plakar-query/" aria-label="plakar-query, section
    7">plakar-query(7)</a> to precisely select snapshots.</p>
<p class="Pp">The arguments are as follows:</p>
<dl class="Bl-tag">
  <dt id="apply"><a class="permalink" href="#apply"><code class="Fl">-apply</code></a></dt>
  <dd>Delete the matching snapshots. By default, <code class="Nm">plakar
      rm</code> only prints the snapshots that would be deleted.</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="EXIT_STATUS"><a class="permalink" href="#EXIT_STATUS">EXIT
  STATUS</a></h2>
<p class="Pp">The <code class="Nm">plakar-rm</code> utility exits&#x00A0;0 on
    success, and&#x00A0;&gt;0 if an error occurs.</p>
</section>
<section class="Sh">
<h2 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h2>
<p class="Pp">Remove a specific snapshot by ID:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar rm abc123</pre>
</div>
<p class="Pp">Remove snapshots older than 30 days:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar rm -before 30d</pre>
</div>
<p class="Pp">Remove snapshots with a specific tag:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar rm -tag daily-backup</pre>
</div>
<p class="Pp">Remove snapshots older than 1 year with a specific tag:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar rm -before 1y -tag daily-backup</pre>
</div>
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
  line"><span class="foot-left">Plakar</span> <span class="foot-date">May 5,
  2026</span> <span class="foot-right">PLAKAR-RM(1)</span></div>
