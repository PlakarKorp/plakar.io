---
date: "2026-01-29T09:34:09Z"
title: prune
summary: "Prune snapshots according to a policy"
aliases:
  - /docs/main/commands/plakar-prune/
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-PRUNE(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-PRUNE(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar-prune</code> &#x2014;
    <span class="Nd">Prune snapshots according to a policy</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar prune</code></td>
    <td>[<code class="Fl">-apply</code>] [<code class="Fl">-policy</code>
      <var class="Ar">name</var>] [<var class="Ar">snapshotID ...</var>]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar prune</code> command deletes snapshots
    from a Plakar repository. Snapshots can be filtered for deletion by age, by
    tag, or by specifying the snapshot IDs to remove. If no
    <var class="Ar">snapshotID</var> are provided, either
    <code class="Fl">-older</code> or <code class="Fl">-tag</code> must be
    specified to filter the snapshots to delete.</p>
<p class="Pp"><code class="Nm">plakar prune</code> supports the location flags
    documented in <a class="Xr" href="../plakar-query/">plakar-query(7)</a> to
    precisely select snapshots.</p>
<p class="Pp">The arguments are as follows:</p>
<dl class="Bl-tag">
  <dt id="apply"><a class="permalink" href="#apply"><code class="Fl">-apply</code></a></dt>
  <dd>Delete matching snapshot. The default is to just show the snapshot that
      would be removed but not actually execute the operation.</dd>
  <dt id="policy"><a class="permalink" href="#policy"><code class="Fl">-policy</code></a>
    <var class="Ar">name</var></dt>
  <dd>Use the given policy. See
      <a class="Xr" href="../plakar-policy/">plakar-policy(1)</a> for how
      policies are managed.</dd>
</dl>
</section>
<section class="Sh">
<h1 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h1>
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
<h1 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h1>
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
<h1 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h1>
<p class="Pp"><a class="Xr" href="../plakar/">plakar(1)</a>,
    <a class="Xr" href="../plakar-backup/">plakar-backup(1)</a>,
    <a class="Xr" href="../plakar-policy/">plakar-policy(1)</a>,
    <a class="Xr" href="../plakar-query/">plakar-query(7)</a></p>
</section>
</div>
<table class="foot">
  <tr>
    <td class="foot-date">September 10, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
