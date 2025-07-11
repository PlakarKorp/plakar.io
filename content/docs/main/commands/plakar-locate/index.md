---
date: "2025-07-11T14:06:35Z"
title: locate
summary: "Find filenames in a Plakar snapshot"
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-LOCATE(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-LOCATE(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar-locate</code> &#x2014;
    <span class="Nd">Find filenames in a Plakar snapshot</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar locate</code></td>
    <td>[<code class="Fl">-name</code> <var class="Ar">name</var>]
      [<code class="Fl">-category</code> <var class="Ar">category</var>]
      [<code class="Fl">-environment</code> <var class="Ar">environment</var>]
      [<code class="Fl">-perimeter</code> <var class="Ar">perimeter</var>]
      [<code class="Fl">-job</code> <var class="Ar">job</var>]
      [<code class="Fl">-tag</code> <var class="Ar">tag</var>]
      [<code class="Fl">-latest</code>] [<code class="Fl">-before</code>
      <var class="Ar">date</var>] [<code class="Fl">-since</code>
      <var class="Ar">date</var>] [<code class="Fl">-snapshot</code>
      <var class="Ar">snapshotID</var>] <var class="Ar">patterns ...</var></td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar locate</code> command search all the
    snapshots to find file names matching any of the given
    <var class="Ar">patterns</var> and prints the abbreviated snapshot ID and
    the full path of the matched files. Matching works according to the shell
    globbing rules.</p>
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
  <dt id="snapshot"><a class="permalink" href="#snapshot"><code class="Fl">-snapshot</code></a>
    <var class="Ar">snapshotID</var></dt>
  <dd>Limit the search to the given snapshot.</dd>
</dl>
</section>
<section class="Sh">
<h1 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h1>
<p class="Pp">Search for files ending in &#x201C;wd&#x201D;:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar locate '*wd'
abc123:/etc/master.passwd
abc123:/etc/passwd</pre>
</div>
</section>
<section class="Sh">
<h1 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h1>
<p class="Pp">The <code class="Nm">plakar-locate</code> utility exits&#x00A0;0
    on success, and&#x00A0;&gt;0 if an error occurs.</p>
<dl class="Bl-tag">
  <dt>0</dt>
  <dd>Command completed successfully.</dd>
  <dt>&gt;0</dt>
  <dd>An error occurred, such as invalid parameters, inability to create the
      repository, or configuration issues.</dd>
</dl>
</section>
<section class="Sh">
<h1 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h1>
<p class="Pp"><a class="Xr" href="../plakar/">plakar(1)</a>,
    <a class="Xr" href="../plakar-backup/">plakar-backup(1)</a></p>
</section>
<section class="Sh">
<h1 class="Sh" id="CAVEATS"><a class="permalink" href="#CAVEATS">CAVEATS</a></h1>
<p class="Pp">The patterns may have to be quoted to avoid the shell attempting
    to expand them.</p>
</section>
</div>
<table class="foot">
  <tr>
    <td class="foot-date">July 3, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
