---
date: "2025-12-01T16:54:45Z"
title: prune
summary: "Prune snapshots according to a policy"
aliases:
  - /docs/v1.0.6/commands/plakar-prune/
---
<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR-PRUNE(1)</span>
  <span class="head-vol">General Commands Manual</span>
  <span class="head-rtitle">PLAKAR-PRUNE(1)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">plakar-prune</code> &#x2014;
    <span class="Nd" role="doc-subtitle">Prune snapshots according to a
    policy</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h2>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar prune</code></td>
    <td>[<code class="Fl">-apply</code>] [<code class="Fl">-policy</code>
      <var class="Ar">name</var>] [<var class="Ar">snapshotID ...</var>]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
<p class="Pp">The <code class="Nm">plakar prune</code> command deletes snapshots
    from a Plakar repository. Snapshots can be filtered for deletion by age, by
    tag, or by specifying the snapshot IDs to remove. If no
    <var class="Ar">snapshotID</var> are provided, either
    <code class="Fl">-older</code> or <code class="Fl">-tag</code> must be
    specified to filter the snapshots to delete.</p>
<p class="Pp"><code class="Nm">plakar prune</code> supports the location flags
    documented in
    <a class="Xr" href="../plakar-query/" aria-label="plakar-query, section
    7">plakar-query(7)</a> to precisely select snapshots.</p>
<p class="Pp">The arguments are as follows:</p>
<dl class="Bl-tag">
  <dt id="apply"><a class="permalink" href="#apply"><code class="Fl">-apply</code></a></dt>
  <dd>Delete matching snapshot. The default is to just show the snapshot that
      would be removed but not actually execute the operation.</dd>
  <dt id="policy"><a class="permalink" href="#policy"><code class="Fl">-policy</code></a>
    <var class="Ar">name</var></dt>
  <dd>Use the given policy. See
      <a class="Xr" href="../plakar-policy/" aria-label="plakar-policy, section
      1">plakar-policy(1)</a> for how policies are managed.</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h2>
<p class="Pp">Remove a specific snapshot by ID:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar prune abc123</pre>
</div>
<p class="Pp">Remove snapshots older than 30 days:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar prune -days 30d</pre>
</div>
<p class="Pp">Remove snapshots with a specific tag:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar prune -tag daily-backup</pre>
</div>
<p class="Pp">Remove snapshots older than 1 year with a specific tag:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar prune -years 1 -tag daily-backup</pre>
</div>
</section>
<section class="Sh">
<h2 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h2>
<p class="Pp">The <code class="Nm">plakar-prune</code> utility exits&#x00A0;0 on
    success, and&#x00A0;&gt;0 if an error occurs.</p>
<dl class="Bl-tag">
  <dt>0</dt>
  <dd>Command completed successfully.</dd>
  <dt>&gt;0</dt>
  <dd>An error occurred, such as invalid date format or failure to delete a
      snapshot.</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h2>
<p class="Pp"><a class="Xr" href="../plakar/" aria-label="plakar, section
    1">plakar(1)</a>,
    <a class="Xr" href="../plakar-backup/" aria-label="plakar-backup, section
    1">plakar-backup(1)</a>,
    <a class="Xr" href="../plakar-policy/" aria-label="plakar-policy, section
    1">plakar-policy(1)</a>,
    <a class="Xr" href="../plakar-query/" aria-label="plakar-query, section
    7">plakar-query(7)</a></p>
</section>
</main>
<div class="foot" role="doc-pagefooter" aria-label="Manual footer
  line"><span class="foot-left">Plakar</span> <span class="foot-date">September
  10, 2025</span> <span class="foot-right">PLAKAR-PRUNE(1)</span></div>
