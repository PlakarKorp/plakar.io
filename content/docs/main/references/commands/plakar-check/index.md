---
date: "2026-01-29T09:34:09Z"
title: check
summary: "Check data integrity in a Plakar repository"
aliases:
  - /docs/main/commands/plakar-check/
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-CHECK(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-CHECK(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar-check</code> &#x2014;
    <span class="Nd">Check data integrity in a Plakar repository</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar check</code></td>
    <td>[<code class="Fl">-fast</code>] [<code class="Fl">-no-verify</code>]
      [<code class="Fl">-quiet</code>]
      [<var class="Ar">snapshotID</var>:<var class="Ar">path ...</var>]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar check</code> command verifies the
    integrity of data in a Plakar repository. It checks the given paths inside
    the snapshots for consistency and validates file macs to ensure no
    corruption has occurred, or all the data in the repository if no
    <var class="Ar">snapshotID</var> or location flags is given.</p>
<p class="Pp">In addition to the flags described below, <code class="Nm">plakar
    check</code> supports the location flags documented in
    <a class="Xr" href="../plakar-query/">plakar-query(7)</a> to precisely
    select snapshots.</p>
<p class="Pp">The options are as follows:</p>
<dl class="Bl-tag">
  <dt id="fast"><a class="permalink" href="#fast"><code class="Fl">-fast</code></a></dt>
  <dd>Enable a faster check that skips mac verification. This option performs
      only structural validation without confirming data integrity.</dd>
  <dt id="no-verify"><a class="permalink" href="#no-verify"><code class="Fl">-no-verify</code></a></dt>
  <dd>Disable signature verification. This option allows to proceed with
      checking snapshot integrity regardless of an invalid snapshot
    signature.</dd>
  <dt id="quiet"><a class="permalink" href="#quiet"><code class="Fl">-quiet</code></a></dt>
  <dd>Suppress output to standard output, only logging errors and warnings.</dd>
</dl>
</section>
<section class="Sh">
<h1 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h1>
<p class="Pp">Perform a full integrity check on all snapshots:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar check</pre>
</div>
<p class="Pp">Perform a fast check on specific paths of two snapshot:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar check -fast abc123:/etc/passwd def456:/var/www</pre>
</div>
</section>
<section class="Sh">
<h1 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h1>
<p class="Pp">The <code class="Nm">plakar-check</code> utility exits&#x00A0;0 on
    success, and&#x00A0;&gt;0 if an error occurs.</p>
<dl class="Bl-tag">
  <dt>0</dt>
  <dd>Command completed successfully with no integrity issues found.</dd>
  <dt>&gt;0</dt>
  <dd>An error occurred, such as corruption detected in a snapshot or failure to
      check data integrity.</dd>
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
