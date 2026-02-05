---
date: "2025-07-31T20:16:52Z"
title: check
summary: "Check data integrity in a Plakar repository"
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
<p class="Pp"><code class="Nm">plakar check</code> &#x2014;
    <span class="Nd">Check data integrity in a Plakar repository</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar check</code></td>
    <td>[<code class="Fl">-concurrency</code> <var class="Ar">number</var>]
      [<code class="Fl">-name</code> <var class="Ar">name</var>]
      [<code class="Fl">-category</code> <var class="Ar">category</var>]
      [<code class="Fl">-environment</code> <var class="Ar">environment</var>]
      [<code class="Fl">-perimeter</code> <var class="Ar">perimeter</var>]
      [<code class="Fl">-job</code> <var class="Ar">job</var>]
      [<code class="Fl">-tag</code> <var class="Ar">tag</var>]
      [<code class="Fl">-latest</code>] [<code class="Fl">-before</code>
      <var class="Ar">date</var>] [<code class="Fl">-since</code>
      <var class="Ar">date</var>] [<code class="Fl">-fast</code>]
      [<code class="Fl">-no-verify</code>] [<code class="Fl">-quiet</code>]
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
    <var class="Ar">snapshotID</var> is given.</p>
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
  <dt id="concurrency"><a class="permalink" href="#concurrency"><code class="Fl">-concurrency</code></a>
    <var class="Ar">number</var></dt>
  <dd>Set the maximum number of parallel tasks for faster processing. Defaults
      to <code class="Dv">8 * CPU count + 1</code>.</dd>
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
<p class="Pp">The <code class="Nm">plakar check</code> utility exits&#x00A0;0 on
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
<p class="Pp"><a class="Xr" href="../plakar/">plakar(1)</a></p>
</section>
</div>
<table class="foot">
  <tr>
    <td class="foot-date">March 3, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
