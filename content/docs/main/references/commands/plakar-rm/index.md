---
date: "2026-01-29T09:34:09Z"
title: rm
summary: "Remove snapshots from a Plakar repository"
aliases:
  - /docs/main/commands/plakar-rm/
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-RM(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-RM(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar-rm</code> &#x2014; <span class="Nd">Remove
    snapshots from a Plakar repository</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar rm</code></td>
    <td>[<code class="Fl">-name</code> <var class="Ar">name</var>]
      [<code class="Fl">-category</code> <var class="Ar">category</var>]
      [<code class="Fl">-environment</code> <var class="Ar">environment</var>]
      [<code class="Fl">-perimeter</code> <var class="Ar">perimeter</var>]
      [<code class="Fl">-job</code> <var class="Ar">job</var>]
      [<code class="Fl">-tag</code> <var class="Ar">tag</var>]
      [<code class="Fl">-latest</code>] [<code class="Fl">-before</code>
      <var class="Ar">date</var>] [<code class="Fl">-since</code>
      <var class="Ar">date</var>] [<var class="Ar">snapshotID ...</var>]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar rm</code> command deletes snapshots
    from a Plakar repository. Snapshots can be filtered for deletion by age, by
    tag, or by specifying the snapshot IDs to remove. If no
    <var class="Ar">snapshotID</var> are provided, either
    <code class="Fl">-older</code> or <code class="Fl">-tag</code> must be
    specified to filter the snapshots to delete.</p>
<p class="Pp">The arguments are as follows:</p>
<dl class="Bl-tag">
  <dt id="name"><a class="permalink" href="#name"><code class="Fl">-name</code></a>
    <var class="Ar">name</var></dt>
  <dd>Filter snapshots that match <var class="Ar">name</var>.</dd>
  <dt id="category"><a class="permalink" href="#category"><code class="Fl">-category</code></a>
    <var class="Ar">category</var></dt>
  <dd>Filter snapshots that match <var class="Ar">category</var>.</dd>
  <dt id="environment"><a class="permalink" href="#environment"><code class="Fl">-environment</code></a>
    <var class="Ar">environment</var></dt>
  <dd>Filter snapshots that match <var class="Ar">environment</var>.</dd>
  <dt id="perimeter"><a class="permalink" href="#perimeter"><code class="Fl">-perimeter</code></a>
    <var class="Ar">perimeter</var></dt>
  <dd>Filter snapshots that match <var class="Ar">perimeter</var>.</dd>
  <dt id="job"><a class="permalink" href="#job"><code class="Fl">-job</code></a>
    <var class="Ar">job</var></dt>
  <dd>Filter snapshots that match <var class="Ar">job</var>.</dd>
  <dt id="tag"><a class="permalink" href="#tag"><code class="Fl">-tag</code></a>
    <var class="Ar">tag</var></dt>
  <dd>Filter snapshots that match <var class="Ar">tag</var>.</dd>
  <dt id="latest"><a class="permalink" href="#latest"><code class="Fl">-latest</code></a></dt>
  <dd>Filter latest snapshot matching filters.</dd>
  <dt id="before"><a class="permalink" href="#before"><code class="Fl">-before</code></a>
    <var class="Ar">date</var></dt>
  <dd>Filter snapshots matching filters and older than the specified date.
      Accepted formats include relative durations (e.g. 2d for two days, 1w for
      one week) or specific dates in various formats (e.g. 2006-01-02
    15:04:05).</dd>
  <dt id="since"><a class="permalink" href="#since"><code class="Fl">-since</code></a>
    <var class="Ar">date</var></dt>
  <dd>Filter snapshots matching filters and created since the specified date,
      included. Accepted formats include relative durations (e.g. 2d for two
      days, 1w for one week) or specific dates in various formats (e.g.
      2006-01-02 15:04:05).</dd>
</dl>
</section>
<section class="Sh">
<h1 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h1>
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
<h1 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h1>
<p class="Pp">The <code class="Nm">plakar-rm</code> utility exits&#x00A0;0 on
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
    <a class="Xr" href="../plakar-backup/">plakar-backup(1)</a></p>
</section>
</div>
<table class="foot">
  <tr>
    <td class="foot-date">July 3, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
