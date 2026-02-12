---
date: "2026-01-29T09:34:09Z"
title: sync
summary: "Synchronize snapshots between Plakar repositories"
aliases:
  - /docs/v1.1.0/commands/plakar-sync/
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
    <td>[<code class="Fl">-packfiles</code> <var class="Ar">path</var>]
      [<var class="Ar">snapshotID</var>] <code class="Cm">to</code> |
      <code class="Cm">from</code> | <code class="Cm">with</code>
      <var class="Ar">repository</var></td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar sync</code> command synchronize
    snapshots between two Plakar repositories. If a specific snapshot ID is
    provided, only snapshots with matching IDs will be synchronized.</p>
<p class="Pp"><code class="Nm">plakar sync</code> supports the location flags
    documented in <a class="Xr" href="../plakar-query/">plakar-query(7)</a> to
    precisely select snapshots.</p>
<p class="Pp">The options are as follows:</p>
<dl class="Bl-tag">
  <dt id="packfiles"><a class="permalink" href="#packfiles"><code class="Fl">-packfiles</code></a>
    <var class="Ar">path</var></dt>
  <dd>Path where to put the temporary packfiles instead of building them in the
      default temporary directory. If the special value &#x2018;memory&#x2019;
      is specified then the packfiles are build in memory.</dd>
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
<p class="Pp">Synchronize all snapshots of @peer to @repo:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar at @repo sync from @peer</pre>
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
<p class="Pp"><a class="Xr" href="../plakar/">plakar(1)</a>,
    <a class="Xr" href="../plakar-query/">plakar-query(7)</a></p>
</section>
</div>
<table class="foot">
  <tr>
    <td class="foot-date">September 10, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
