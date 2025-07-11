---
date: "2025-07-11T14:06:35Z"
title: mount
summary: "Mount Plakar snapshots as read-only filesystem"
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
    <td><var class="Ar">mountpoint</var></td>
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
</section>
<section class="Sh">
<h1 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h1>
<p class="Pp">Mount a snapshot to the specified directory:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar mount ~/mnt</pre>
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
<p class="Pp"><a class="Xr" href="../plakar/">plakar(1)</a></p>
</section>
</div>
<table class="foot">
  <tr>
    <td class="foot-date">July 3, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
