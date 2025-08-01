---
date: "2025-07-31T20:19:30Z"
title: pkg-create
summary: "Create Plakar plugins"
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-PKG-CREATE(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-PKG-CREATE(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar-pkg-create</code> &#x2014;
    <span class="Nd">Create Plakar plugins</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar pkg build
      <var class="Ar">manifest.yaml</var></code></td>
    <td></td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar pkg create</code> assembles a plugin
    using the provided
    <a class="Xr" href="../plakar-pkg-manifest.yaml/">plakar-pkg-manifest.yaml(5)</a>.</p>
<p class="Pp">All the files needed for the plugin need to be already available,
    i.e. executables must be already be built.</p>
<p class="Pp">All external files must reside in the same directory as the
    <var class="Ar">manifest.yaml</var> or in subdirectories.</p>
</section>
<section class="Sh">
<h1 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h1>
<p class="Pp"><a class="Xr" href="../plakar-pkg/">plakar-pkg(1)</a>,
    <a class="Xr" href="../plakar-pkg-add/">plakar-pkg-add(1)</a>,
    <a class="Xr" href="../plakar-pkg-rm/">plakar-pkg-rm(1)</a>,
    <a class="Xr" href="../plakar-pkg-manifest.yaml/">plakar-pkg-manifest.yaml(5)</a></p>
</section>
</div>
<table class="foot">
  <tr>
    <td class="foot-date">July 11, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
