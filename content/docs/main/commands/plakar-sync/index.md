---
date: "2025-07-11T14:06:35Z"
title: sync
summary: "Synchronize snapshots between Plakar repositories"
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-SYNC(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-SYNC(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar-sync</code> &#x2014;
    <span class="Nd">Synchronize snapshots between Plakar
  repositories</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar sync</code></td>
    <td>[<code class="Fl">-name</code> <var class="Ar">name</var>]
      [<code class="Fl">-category</code> <var class="Ar">category</var>]
      [<code class="Fl">-environment</code> <var class="Ar">environment</var>]
      [<code class="Fl">-perimeter</code> <var class="Ar">perimeter</var>]
      [<code class="Fl">-job</code> <var class="Ar">job</var>]
      [<code class="Fl">-tag</code> <var class="Ar">tag</var>]
      [<code class="Fl">-latest</code>] [<code class="Fl">-before</code>
      <var class="Ar">date</var>] [<code class="Fl">-since</code>
      <var class="Ar">date</var>] [<var class="Ar">snapshotID</var>]
      <code class="Cm">to</code> | <code class="Cm">from</code> |
      <code class="Cm">with</code> <var class="Ar">repository</var></td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar sync</code> command synchronize
    snapshots between two Plakar repositories. If a specific snapshot ID is
    provided, only snapshots with matching IDs will be synchronized.</p>
<p class="Pp">The options are as follows:</p>
<dl class="Bl-tag">
  <dt id="name"><a class="permalink" href="#name"><code class="Fl">-name</code></a>
    <var class="Ar">string</var></dt>
  <dd>Only apply command to snapshots that match
    <var class="Ar">name</var>.</dd>
  <dt id="category"><a class="permalink" href="#category"><code class="Fl">-category</code></a>
    <var class="Ar">string</var></dt>
  <dd>Only apply command to snapshots that match
    <var class="Ar">category</var>.</dd>
  <dt id="environment"><a class="permalink" href="#environment"><code class="Fl">-environment</code></a>
    <var class="Ar">string</var></dt>
  <dd>Only apply command to snapshots that match
      <var class="Ar">environment</var>.</dd>
  <dt id="perimeter"><a class="permalink" href="#perimeter"><code class="Fl">-perimeter</code></a>
    <var class="Ar">string</var></dt>
  <dd>Only apply command to snapshots that match
      <var class="Ar">perimeter</var>.</dd>
  <dt id="job"><a class="permalink" href="#job"><code class="Fl">-job</code></a>
    <var class="Ar">string</var></dt>
  <dd>Only apply command to snapshots that match <var class="Ar">job</var>.</dd>
  <dt id="tag"><a class="permalink" href="#tag"><code class="Fl">-tag</code></a>
    <var class="Ar">string</var></dt>
  <dd>Only apply command to snapshots that match <var class="Ar">tag</var>.</dd>
  <dt id="latest"><a class="permalink" href="#latest"><code class="Fl">-latest</code></a></dt>
  <dd>Only apply command to latest snapshot matching filters.</dd>
  <dt id="before"><a class="permalink" href="#before"><code class="Fl">-before</code></a>
    <var class="Ar">date</var></dt>
  <dd>Only apply command to snapshots matching filters and older than the
      specified date. Accepted formats include relative durations (e.g. 2d for
      two days, 1w for one week) or specific dates in various formats (e.g.
      2006-01-02 15:04:05).</dd>
  <dt id="since"><a class="permalink" href="#since"><code class="Fl">-since</code></a>
    <var class="Ar">date</var></dt>
  <dd>Only apply command to snapshots matching filters and created since the
      specified date, included. Accepted formats include relative durations
      (e.g. 2d for two days, 1w for one week) or specific dates in various
      formats (e.g. 2006-01-02 15:04:05).</dd>
</dl>
<p class="Pp">The arguments are as follows:</p>
<dl class="Bl-tag">
  <dt id="to"><a class="permalink" href="#to"><code class="Cm">to</code></a> |
    <a class="permalink" href="#from"><code class="Cm" id="from">from</code></a>
    |
    <a class="permalink" href="#with"><code class="Cm" id="with">with</code></a></dt>
  <dd>Specifies the direction of synchronization:
    <dl class="Bl-tag">
      <dt id="to~2"><a class="permalink" href="#to~2"><code class="Cm">to</code></a></dt>
      <dd>Synchronize snapshots from the local repository to the specified peer
          repository.</dd>
      <dt id="from~2"><a class="permalink" href="#from~2"><code class="Cm">from</code></a></dt>
      <dd>Synchronize snapshots from the specified peer repository to the local
          repository.</dd>
      <dt id="with~2"><a class="permalink" href="#with~2"><code class="Cm">with</code></a></dt>
      <dd>Synchronize snapshots in both directions, ensuring both repositories
          are fully synchronized.</dd>
    </dl>
  </dd>
  <dt><var class="Ar">repository</var></dt>
  <dd>Path to the peer repository to synchronize with.</dd>
</dl>
</section>
<section class="Sh">
<h1 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h1>
<p class="Pp">Synchronize the snapshot &#x2018;abcd&#x2019; with a peer
    repository:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar sync abcd to @peer</pre>
</div>
<p class="Pp">Bi-directional synchronization with peer repository of recent
    snapshots:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar sync -since 7d with @peer</pre>
</div>
</section>
<section class="Sh">
<h1 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h1>
<p class="Pp">The <code class="Nm">plakar-sync</code> utility exits&#x00A0;0 on
    success, and&#x00A0;&gt;0 if an error occurs.</p>
<dl class="Bl-tag">
  <dt>0</dt>
  <dd>Command completed successfully.</dd>
  <dt>&gt;0</dt>
  <dd>General failure occurred, such as an invalid repository path, snapshot ID
      mismatch, or network error.</dd>
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
    <td class="foot-date">July 3, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
