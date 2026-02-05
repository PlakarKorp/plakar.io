---
date: "2025-07-31T20:16:52Z"
title: backup
summary: "Create a new snapshot in a Plakar repository"
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-BACKUP(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-BACKUP(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar backup</code> &#x2014;
    <span class="Nd">Create a new snapshot in a Plakar repository</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar backup</code></td>
    <td>[<code class="Fl">-concurrency</code> <var class="Ar">number</var>]
      [<code class="Fl">-exclude</code> <var class="Ar">pattern</var>]
      [<code class="Fl">-excludes</code> <var class="Ar">file</var>]
      [<code class="Fl">-check</code>] [<code class="Fl">-quiet</code>]
      [<code class="Fl">-tag</code> <var class="Ar">tag</var>]
      [<var class="Ar">place</var>]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar backup</code> command creates a new
    snapshot of <var class="Ar">place</var>, or the current directory. Snapshots
    can be filtered to exclude specific files or directories based on patterns
    provided through options.</p>
<p class="Pp"><var class="Ar">place</var> can be either a path, an URI, or a
    label on the form &#x201C;@<var class="Ar">name</var>&#x201D; to reference a
    remote configured with
    <a class="Xr" href="../plakar-config/">plakar-config(1)</a>.</p>
<p class="Pp">The options are as follows:</p>
<dl class="Bl-tag">
  <dt id="concurrency"><a class="permalink" href="#concurrency"><code class="Fl">-concurrency</code></a>
    <var class="Ar">number</var></dt>
  <dd>Set the maximum number of parallel tasks for faster processing. Defaults
      to <code class="Dv">8 * CPU count + 1</code>.</dd>
  <dt id="exclude"><a class="permalink" href="#exclude"><code class="Fl">-exclude</code></a>
    <var class="Ar">pattern</var></dt>
  <dd>Specify individual glob exclusion patterns to ignore files or directories
      in the backup. This option can be repeated.</dd>
  <dt id="excludes"><a class="permalink" href="#excludes"><code class="Fl">-excludes</code></a>
    <var class="Ar">file</var></dt>
  <dd>Specify a file containing glob exclusion patterns, one per line, to ignore
      files or directories in the backup.</dd>
  <dt id="check"><a class="permalink" href="#check"><code class="Fl">-check</code></a></dt>
  <dd>Perform a full check on the backup after success.</dd>
  <dt id="quiet"><a class="permalink" href="#quiet"><code class="Fl">-quiet</code></a></dt>
  <dd>Suppress output to standard input, only logging errors and warnings.</dd>
  <dt id="tag"><a class="permalink" href="#tag"><code class="Fl">-tag</code></a>
    <var class="Ar">tag</var></dt>
  <dd>Specify a tag to assign to the snapshot for easier identification.</dd>
</dl>
</section>
<section class="Sh">
<h1 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h1>
<p class="Pp">Create a snapshot of the current directory with a tag:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar backup -tag daily-backup</pre>
</div>
<p class="Pp">Backup a specific directory with exclusion patterns from a
  file:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar backup -excludes ~/my-excludes-file /var/www</pre>
</div>
<p class="Pp">Backup a directory with specific file exclusions:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar backup -exclude &quot;*.tmp&quot; -exclude &quot;*.log&quot; /var/www</pre>
</div>
</section>
<section class="Sh">
<h1 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h1>
<p class="Pp">The <code class="Nm">plakar backup</code> utility exits&#x00A0;0
    on success, and&#x00A0;&gt;0 if an error occurs.</p>
<dl class="Bl-tag">
  <dt>0</dt>
  <dd>Command completed successfully, snapshot created.</dd>
  <dt>&gt;0</dt>
  <dd>An error occurred, such as failure to access the repository or issues with
      exclusion patterns.</dd>
</dl>
</section>
<section class="Sh">
<h1 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h1>
<p class="Pp"><a class="Xr" href="../plakar/">plakar(1)</a>,
    <a class="Xr" href="../plakar-config/">plakar-config(1)</a></p>
</section>
</div>
<table class="foot">
  <tr>
    <td class="foot-date">April 4, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
