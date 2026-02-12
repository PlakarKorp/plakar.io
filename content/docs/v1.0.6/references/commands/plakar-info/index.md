---
date: "2025-12-01T16:54:45Z"
title: info
summary: "Display detailed information about internal structures"
aliases:
  - /docs/v1.0.6/commands/plakar-info/
---
<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR-INFO(1)</span>
  <span class="head-vol">General Commands Manual</span>
  <span class="head-rtitle">PLAKAR-INFO(1)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">plakar-info</code> &#x2014;
    <span class="Nd" role="doc-subtitle">Display detailed information about
    internal structures</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h2>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar info</code></td>
    <td>[<code class="Fl">-errors</code>] [<var class="Ar">snapshot</var>]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
<p class="Pp">The <code class="Nm">plakar info</code> command provides detailed
    information about a Plakar repository and snapshots. The type of information
    displayed depends on the specified argument. Without any arguments, display
    information about the repository.</p>
<p class="Pp">The options are as follows:</p>
<dl class="Bl-tag">
  <dt id="errors"><a class="permalink" href="#errors"><code class="Fl">-errors</code></a></dt>
  <dd>Show errors within the specified snapshot.</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h2>
<p class="Pp">Show repository information:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar info</pre>
</div>
<p class="Pp">Show detailed information for a snapshot:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar info abc123</pre>
</div>
<p class="Pp">Show errors within a snapshot:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar info -errors abc123</pre>
</div>
</section>
<section class="Sh">
<h2 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h2>
<p class="Pp">The <code class="Nm">plakar-info</code> utility exits&#x00A0;0 on
    success, and&#x00A0;&gt;0 if an error occurs.</p>
<dl class="Bl-tag">
  <dt>0</dt>
  <dd>Command completed successfully.</dd>
  <dt>&gt;0</dt>
  <dd>An error occurred, such as an invalid snapshot or object ID, or a failure
      to retrieve the requested data.</dd>
</dl>
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
  line"><span class="foot-left">Plakar</span> <span class="foot-date">July 3,
  2025</span> <span class="foot-right">PLAKAR-INFO(1)</span></div>
