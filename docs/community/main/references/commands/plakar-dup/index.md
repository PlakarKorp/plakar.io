
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-DUP(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-DUP(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar-dup</code> &#x2014;
    <span class="Nd">Duplicates an existing snapshot with a different
  ID</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar dup</code></td>
    <td><var class="Ar">snapshots ...</var></td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar dup</code> command creates a duplicate
    of an existing snapshot with a new snapshot ID. The new snapshot is an exact
    copy of the original, including all files and metadata.</p>
</section>
<section class="Sh">
<h1 class="Sh" id="EXIT_STATUS"><a class="permalink" href="#EXIT_STATUS">EXIT
  STATUS</a></h1>
<p class="Pp">The <code class="Nm">plakar-dup</code> utility exits&#x00A0;0 on
    success, and&#x00A0;&gt;0 if an error occurs.</p>
</section>
<section class="Sh">
<h1 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h1>
<p class="Pp">Create a duplicate of a snapshot with ID &quot;abc123&quot;:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar dup abc123</pre>
</div>
</section>
<section class="Sh">
<h1 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h1>
<p class="Pp"><a class="Xr" href="../plakar/">plakar(1)</a></p>
</section>
</div>
<table class="foot">
  <tr>
    <td class="foot-date">May 5, 2026</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>

