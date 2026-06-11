---
date: "2026-05-13T08:38:47Z"
title: backup
summary: "Create a new snapshot in a Kloset store"
aliases:
  - /docs/main/commands/plakar-backup/
---

<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR-BACKUP(1)</span>
  <span class="head-vol">General Commands Manual</span>
  <span class="head-rtitle">PLAKAR-BACKUP(1)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">plakar-backup</code> &#x2014;
    <span class="Nd" role="doc-subtitle">Create a new snapshot in a Kloset
    store</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h2>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar backup</code></td>
    <td>[<code class="Fl">-cache</code> <var class="Ar">path</var>]
      [<code class="Fl">-category</code> <var class="Ar">category</var>]
      [<code class="Fl">-check</code>] [<code class="Fl">-dry-run</code>]
      [<code class="Fl">-environment</code> <var class="Ar">environment</var>]
      [<code class="Fl">-force-timestamp</code> <var class="Ar">timestamp</var>]
      [<code class="Fl">-ignore</code> <var class="Ar">pattern</var>]
      [<code class="Fl">-ignore-file</code> <var class="Ar">file</var>]
      [<code class="Fl">-job</code> <var class="Ar">job</var>]
      [<code class="Fl">-name</code> <var class="Ar">name</var>]
      [<code class="Fl">-no-progress</code>] [<code class="Fl">-no-xattr</code>]
      [<code class="Fl">-o</code>
      <var class="Ar">option</var><span class="No">=</span><var class="Ar">value</var>]
      [<code class="Fl">-packfiles</code> <var class="Ar">path</var>]
      [<code class="Fl">-perimeter</code> <var class="Ar">perimeter</var>]
      [<code class="Fl">-tag</code> <var class="Ar">tag</var>]
      [<var class="Ar">place</var>]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
<p class="Pp">The <code class="Nm">plakar backup</code> command creates a new
    snapshot of <var class="Ar">place</var>, or the current directory. Snapshots
    can be filtered to ignore specific files or directories based on patterns
    provided through options.</p>
<p class="Pp"><var class="Ar">place</var> can be either a path, an URI, or a
    label with the form &#x201C;@<var class="Ar">name</var>&#x201D; to reference
    a source connector configured with
    <a class="Xr" href="../plakar-source/" aria-label="plakar-source, section
    1">plakar-source(1)</a>.</p>
<p class="Pp">The options are as follows:</p>
<dl class="Bl-tag">
  <dt id="cache"><a class="permalink" href="#cache"><code class="Fl">-cache</code></a>
    <var class="Ar">path</var></dt>
  <dd>Specify a path to store the vfs cache. Use the special value
      &#x2018;no&#x2019; to disable caching. Use the special value
      &#x2018;vfs&#x2019; to use the in-memory vfs cache (the default).</dd>
  <dt id="category"><a class="permalink" href="#category"><code class="Fl">-category</code></a>
    <var class="Ar">category</var></dt>
  <dd>Set the snapshot category.</dd>
  <dt id="check"><a class="permalink" href="#check"><code class="Fl">-check</code></a></dt>
  <dd>Perform a full check on the backup after success.</dd>
  <dt id="dry-run"><a class="permalink" href="#dry-run"><code class="Fl">-dry-run</code></a></dt>
  <dd>Do not write a snapshot; instead, perform a dry run by outputting the list
      of files and directories that would be included in the backup. Respects
      all exclude patterns and other options, but makes no changes to the Kloset
      store.</dd>
  <dt id="environment"><a class="permalink" href="#environment"><code class="Fl">-environment</code></a>
    <var class="Ar">environment</var></dt>
  <dd>Set the snapshot environment.</dd>
  <dt id="force-timestamp"><a class="permalink" href="#force-timestamp"><code class="Fl">-force-timestamp</code></a>
    <var class="Ar">timestamp</var></dt>
  <dd>Specify a fixed timestamp (in ISO 8601 or relative human format) to use
      for the snapshot. Could be used to reimport an existing backup with the
      same timestamp.</dd>
  <dt id="ignore"><a class="permalink" href="#ignore"><code class="Fl">-ignore</code></a>
    <var class="Ar">pattern</var></dt>
  <dd>Specify individual gitignore exclusion patterns to ignore files or
      directories in the backup. This option can be repeated.</dd>
  <dt id="ignore-file"><a class="permalink" href="#ignore-file"><code class="Fl">-ignore-file</code></a>
    <var class="Ar">file</var></dt>
  <dd>Specify a file containing gitignore exclusion patterns, one per line, to
      ignore files or directories in the backup.</dd>
  <dt id="job"><a class="permalink" href="#job"><code class="Fl">-job</code></a>
    <var class="Ar">job</var></dt>
  <dd>Name the snapshot job.</dd>
  <dt id="name"><a class="permalink" href="#name"><code class="Fl">-name</code></a>
    <var class="Ar">name</var></dt>
  <dd>Name the snapshot.</dd>
  <dt id="no-progress"><a class="permalink" href="#no-progress"><code class="Fl">-no-progress</code></a></dt>
  <dd>Do not compute or display progress. By default, <code class="Nm">plakar
      backup</code> does two passes on the source of the backup: one to compute
      the number of items, and a second for processing the items themselves.
      This flag disables the pass to compute the number of items. It is set
      implicitly for some importer connectors that don't support the
    two-passes.</dd>
  <dt id="no-xattr"><a class="permalink" href="#no-xattr"><code class="Fl">-no-xattr</code></a></dt>
  <dd>Skip extended attributes (xattrs) when creating the backup.</dd>
  <dt id="o"><a class="permalink" href="#o"><code class="Fl">-o</code></a>
    <var class="Ar">option</var><span class="No">=</span><var class="Ar">value</var></dt>
  <dd>Can be used to pass extra arguments to the source connector. The given
      <var class="Ar">option</var> takes precedence over the configuration
    file.</dd>
  <dt id="packfiles"><a class="permalink" href="#packfiles"><code class="Fl">-packfiles</code></a>
    <var class="Ar">path</var></dt>
  <dd>Path where to put the temporary packfiles instead of building them in the
      default temporary directory. If the special value &#x2018;memory&#x2019;
      is specified then the packfiles are built in memory.</dd>
  <dt id="perimeter"><a class="permalink" href="#perimeter"><code class="Fl">-perimeter</code></a>
    <var class="Ar">perimeter</var></dt>
  <dd>Set the snapshot perimeter.</dd>
  <dt id="tag"><a class="permalink" href="#tag"><code class="Fl">-tag</code></a>
    <var class="Ar">tag</var></dt>
  <dd>Comma-separated list of tags to apply to the snapshot.</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="ENVIRONMENT"><a class="permalink" href="#ENVIRONMENT">ENVIRONMENT</a></h2>
<dl class="Bl-tag">
  <dt id="PLAKAR_TAGS"><a class="permalink" href="#PLAKAR_TAGS"><code class="Ev">PLAKAR_TAGS</code></a></dt>
  <dd>Comma-separated list of tags to apply to the snapshot during backup.
      Overridden by the <code class="Fl">-tag</code> command-line flag.</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="EXIT_STATUS"><a class="permalink" href="#EXIT_STATUS">EXIT
  STATUS</a></h2>
<p class="Pp">The <code class="Nm">plakar-backup</code> utility exits&#x00A0;0
    on success, and&#x00A0;&gt;0 if an error occurs.</p>
</section>
<section class="Sh">
<h2 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h2>
<p class="Pp">Create a snapshot of the current directory with two tags:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar backup -tag daily-backup,production</pre>
</div>
<p class="Pp">Ignore files using patterns in a given file:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar backup -ignore-file ~/my-ignore-file /var/www</pre>
</div>
<p class="Pp">or by using patterns specified inline:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar backup -ignore &quot;*.tmp&quot; -ignore &quot;*.log&quot; /var/www</pre>
</div>
<p class="Pp">Pass an option to the importer, in this case to don't traverse
    mount points:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar backup -o dont_traverse_fs=true /</pre>
</div>
</section>
<section class="Sh">
<h2 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h2>
<p class="Pp"><a class="Xr" href="../plakar/" aria-label="plakar, section
    1">plakar(1)</a>,
    <a class="Xr" href="../plakar-source/" aria-label="plakar-source, section
    1">plakar-source(1)</a></p>
</section>
</main>
<div class="foot" role="doc-pagefooter" aria-label="Manual footer
  line"><span class="foot-left">Plakar</span> <span class="foot-date">May 5,
  2026</span> <span class="foot-right">PLAKAR-BACKUP(1)</span></div>
