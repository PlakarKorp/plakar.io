---
date: "2026-03-24T09:40:29Z"
title: mount
summary: "Mount Plakar snapshots as read-only filesystem"
aliases:
  - /docs/main/commands/plakar-mount/
---

<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-MOUNT(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-MOUNT(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar-mount</code> &#x2014;
    <span class="Nd">Mount Plakar snapshots as read-only filesystem</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar mount</code></td>
    <td>[<code class="Fl">-to</code> <var class="Ar">mountpoint</var>]
      [<var class="Ar">snapshotID</var>]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar mount</code> command mounts a Plakar
    repository snapshot as a read-only filesystem at the specified
    <var class="Ar">mountpoint</var>. This allows users to access snapshot
    contents as if they were part of the local file system, providing easy
    browsing and retrieval of files without needing to explicitly restore them.
    This command may not work on all Operating Systems.</p>
<p class="Pp">In addition to the flags described below, <code class="Nm">plakar
    mount</code> supports the location flags documented in
    <a class="Xr" href="../plakar-query/">plakar-query(7)</a> to precisely
    select snapshots.</p>
<p class="Pp">The options are as follows:</p>
<dl class="Bl-tag">
  <dt id="to"><a class="permalink" href="#to"><code class="Fl">-to</code></a>
    <var class="Ar">mountpoint</var></dt>
  <dd>Specify the mount location. The <var class="Ar">mountpoint</var> can
      either be:
    <ul class="Bl-bullet Bd-indent">
      <li>A directory path for FUSE mounts</li>
      <li>An HTTP address including port for remote mounting (e.g.,
          &#x2018;<code class="Li">http://hostname:8080</code>&#x2019;)</li>
    </ul>
    If not specified, mount will attempt a FUSE mount in the working directory
      with a random subdirectory name.</dd>
  <dt><var class="Ar">snapshotID</var></dt>
  <dd>Optional. Specifies which snapshot to mount. If not provided, all
      snapshots are mounted.</dd>
</dl>
</section>
<section class="Sh">
<h1 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h1>
<p class="Pp">Mount all snapshots to a local directory:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar mount -to ~/mnt</pre>
</div>
<p class="Pp">Mount the latest snapshot to a local directory:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar mount -to ~/mnt -latest</pre>
</div>
<p class="Pp">Mount a specific snapshot by ID to a directory:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar mount -to ~/mnt abc123</pre>
</div>
<p class="Pp">Mount snapshots matching a filter (e.g., snapshots with tag
    &quot;daily-backup&quot;):</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar mount -to ~/mnt -tag daily-backup</pre>
</div>
<p class="Pp">Mount a snapshot to an HTTP endpoint:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar mount -to http://hostname:8080</pre>
</div>
<p class="Pp">Mount a specific snapshot to an HTTP endpoint:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar mount -to http://hostname:8080 abc123</pre>
</div>
</section>
<section class="Sh">
<h1 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h1>
<p class="Pp">The <code class="Nm">plakar-mount</code> utility exits&#x00A0;0 on
    success, and&#x00A0;&gt;0 if an error occurs.</p>
<dl class="Bl-tag">
  <dt>0</dt>
  <dd>Command completed successfully.</dd>
  <dt>&gt;0</dt>
  <dd>An error occurred, such as an invalid mountpoint or failure during the
      mounting process.</dd>
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
    <td class="foot-date">July 3, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
