---
date: "2026-05-13T08:36:24Z"
title: diag
summary: "Display detailed information about Plakar internal structures"
aliases:
  - /docs/v1.1.0/commands/plakar-diag/
---

<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR-DIAG(1)</span>
  <span class="head-vol">General Commands Manual</span>
  <span class="head-rtitle">PLAKAR-DIAG(1)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">plakar-diag</code> &#x2014;
    <span class="Nd" role="doc-subtitle">Display detailed information about
    Plakar internal structures</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h2>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar diag</code></td>
    <td>[<code class="Cm">contenttype</code> | <code class="Cm">locks</code> |
      <code class="Cm">object</code> | <code class="Cm">packfile</code> |
      <code class="Cm">snapshot</code> | <code class="Cm">state</code> |
      <code class="Cm">vfs</code> | <code class="Cm">xattr</code>]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
<p class="Pp">The <code class="Nm">plakar diag</code> command provides detailed
    information about various internal data structures. The type of information
    displayed depends on the specified argument. Without any arguments, display
    information about the repository.</p>
<p class="Pp">The sub-commands are as follows:</p>
<dl class="Bl-tag">
  <dt id="contenttype"><a class="permalink" href="#contenttype"><code class="Cm">contenttype</code></a>
    <var class="Ar">snapshotID</var>:<var class="Ar">path</var></dt>
  <dd style="width: auto;">&#x00A0;</dd>
  <dt id="locks"><a class="permalink" href="#locks"><code class="Cm">locks</code></a></dt>
  <dd>Display the list of locks currently held on the repository.</dd>
  <dt id="object"><a class="permalink" href="#object"><code class="Cm">object</code></a>
    <var class="Ar">objectID</var></dt>
  <dd>Display information about a specific object, including its mac, type,
      tags, and associated data chunks.</dd>
  <dt id="packfile"><a class="permalink" href="#packfile"><code class="Cm">packfile</code></a>
    <var class="Ar">packfileID</var></dt>
  <dd>Show details of packfiles, including entries and macs, which store object
      data within the repository.</dd>
  <dt id="snapshot"><a class="permalink" href="#snapshot"><code class="Cm">snapshot</code></a>
    <var class="Ar">snapshotID</var></dt>
  <dd>Show detailed information about a specific snapshot, including its
      metadata, directory and file count, and size.</dd>
  <dt id="state"><a class="permalink" href="#state"><code class="Cm">state</code></a></dt>
  <dd>List or describe the states in the repository.</dd>
  <dt id="vfs"><a class="permalink" href="#vfs"><code class="Cm">vfs</code></a>
    <var class="Ar">snapshotID</var>:<var class="Ar">path</var></dt>
  <dd>Show filesystem (VFS) details for a specific path within a snapshot,
      listing directory or file attributes, including permissions, ownership,
      and custom metadata.</dd>
  <dt id="xattr"><a class="permalink" href="#xattr"><code class="Cm">xattr</code></a>
    <var class="Ar">snapshotID</var>:<var class="Ar">path</var></dt>
  <dd style="width: auto;">&#x00A0;</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="EXIT_STATUS"><a class="permalink" href="#EXIT_STATUS">EXIT
  STATUS</a></h2>
<p class="Pp">The <code class="Nm">plakar-diag</code> utility exits&#x00A0;0 on
    success, and&#x00A0;&gt;0 if an error occurs.</p>
</section>
<section class="Sh">
<h2 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h2>
<p class="Pp">Show repository information:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar diag</pre>
</div>
<p class="Pp">Show detailed information for a snapshot:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar diag snapshot abc123</pre>
</div>
<p class="Pp">List all states in the repository:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar diag state</pre>
</div>
<p class="Pp">Display a specific object within a snapshot:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar diag object 1234567890abcdef</pre>
</div>
<p class="Pp">Display filesystem details for a path within a snapshot:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar diag vfs abc123:/etc/passwd</pre>
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
  2026</span> <span class="foot-right">PLAKAR-DIAG(1)</span></div>
