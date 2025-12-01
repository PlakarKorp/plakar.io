---
date: "2025-12-01T16:54:45Z"
title: maintenance
summary: "Remove unused data from a Plakar repository"
---
<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR-MAINTENANCE(1)</span>
  <span class="head-vol">General Commands Manual</span>
  <span class="head-rtitle">PLAKAR-MAINTENANCE(1)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">plakar-maintenance</code> &#x2014;
    <span class="Nd" role="doc-subtitle">Remove unused data from a Plakar
    repository</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h2>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar maintenance</code></td>
    <td></td>
  </tr>
</table>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
<p class="Pp">The <code class="Nm">plakar maintenance</code> command removes
    unused blobs, objects, and chunks from a Plakar repository to reduce storage
    space. It identifies unreferenced data and reorganizes packfiles to ensure
    only active snapshots and their dependencies are retained. The maintenance
    process updates snapshot indexes to reflect these changes.</p>
</section>
<section class="Sh">
<h2 class="Sh" id="DIAGNOSTICS"><a class="permalink" href="#DIAGNOSTICS">DIAGNOSTICS</a></h2>
<p class="Pp">The <code class="Nm">plakar-maintenance</code> utility
    exits&#x00A0;0 on success, and&#x00A0;&gt;0 if an error occurs.</p>
<dl class="Bl-tag">
  <dt>0</dt>
  <dd>Command completed successfully.</dd>
  <dt>&gt;0</dt>
  <dd>An error occurred during maintenance, such as failure to update indexes or
      remove data.</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h2>
<p class="Pp"><a class="Xr" href="../plakar/" aria-label="plakar, section
    1">plakar(1)</a></p>
</section>
</main>
<div class="foot" role="doc-pagefooter" aria-label="Manual footer
  line"><span class="foot-left">Plakar</span> <span class="foot-date">July 3,
  2025</span> <span class="foot-right">PLAKAR-MAINTENANCE(1)</span></div>
