---
date: "2026-01-29T09:34:09Z"
title: ls
summary: "List snapshots and their contents in a Plakar repository"
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-LS(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-LS(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar-ls</code> &#x2014; <span class="Nd">List
    snapshots and their contents in a Plakar repository</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar ls</code></td>
    <td>[<code class="Fl">-uuid</code>] [<code class="Fl">-recursive</code>]
      [<var class="Ar">snapshotID</var>:<var class="Ar">path</var>]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar ls</code> command lists snapshots
    stored in a Plakar repository, and optionally displays the contents of
    <var class="Ar">path</var> in a specified snapshot.</p>
<p class="Pp">In addition to the flags described below, <code class="Nm">plakar
    ls</code> supports the location flags documented in
    <a class="Xr" href="../plakar-query/">plakar-query(7)</a> to precisely
    select snapshots.</p>
<p class="Pp">The options are as follows:</p>
<dl class="Bl-tag">
  <dt id="uuid"><a class="permalink" href="#uuid"><code class="Fl">-uuid</code></a></dt>
  <dd>Display the full UUID for each snapshot instead of the shorter snapshot
      ID.</dd>
  <dt id="recursive"><a class="permalink" href="#recursive"><code class="Fl">-recursive</code></a></dt>
  <dd>List directory contents recursively when exploring snapshot contents.</dd>
</dl>
</section>
<section class="Sh">
<h1 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h1>
<p class="Pp">List all snapshots with their short IDs:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar ls</pre>
</div>
<p class="Pp">List all snapshots with UUIDs instead of short IDs:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar ls -uuid</pre>
</div>
<p class="Pp">List snapshots with a specific tag:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar ls -tag daily-backup</pre>
</div>
<p class="Pp">List contents of a specific snapshot:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar ls abc123</pre>
</div>
<p class="Pp">Recursively list contents of a specific snapshot:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar ls -recursive abc123:/etc</pre>
</div>
</section>
<section class="Sh">
<h1 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h1>
<p class="Pp">The <code class="Nm">plakar-ls</code> utility exits&#x00A0;0 on
    success, and&#x00A0;&gt;0 if an error occurs.</p>
<dl class="Bl-tag">
  <dt>0</dt>
  <dd>Command completed successfully.</dd>
  <dt>&gt;0</dt>
  <dd>An error occurred, such as failure to retrieve snapshot information or
      invalid snapshot ID.</dd>
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
