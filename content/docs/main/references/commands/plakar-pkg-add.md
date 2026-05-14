---
date: "2026-05-13T08:38:47Z"
title: pkg-add
summary: "Install Plakar plugins"
aliases:
  - /docs/main/commands/plakar-pkg-add/
---

<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR-PKG-ADD(1)</span>
  <span class="head-vol">General Commands Manual</span>
  <span class="head-rtitle">PLAKAR-PKG-ADD(1)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">plakar-pkg-add</code> &#x2014;
    <span class="Nd" role="doc-subtitle">Install Plakar plugins</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h2>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar pkg add</code></td>
    <td>[<code class="Fl">-u</code>] <var class="Ar">plugin ...</var></td>
  </tr>
</table>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
<p class="Pp">The <code class="Nm">plakar pkg add</code> command adds a local or
    a remote plugin.</p>
<p class="Pp">If <var class="Ar">plugin</var> matches an existing local file, it
    is installed directly. Otherwise, it is treated as a recipe name and
    downloaded from the Plakar plugin server which requires a login via the
    <a class="Xr" href="../plakar-login/" aria-label="plakar-login, section
    1">plakar-login(1)</a> command.</p>
<p class="Pp">Installing plugins without logging in is possible via the
    <a class="Xr" href="../plakar-pkg-build/" aria-label="plakar-pkg-build,
    section 1">plakar-pkg-build(1)</a> command, provided you have the necessary
    dependencies to build it locally (currently, official plugins require make
    and a working Go toolchain).</p>
<p class="Pp">To install a specific version of a plugin, use the
    <var class="Ar">name</var>@<var class="Ar">version</var> syntax.</p>
<p class="Pp">The options are as follows:</p>
<dl class="Bl-tag">
  <dt id="u"><a class="permalink" href="#u"><code class="Fl">-u</code></a></dt>
  <dd>Update the specific plugins. If none are given, attempt to update all the
      installed ones.</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="FILES"><a class="permalink" href="#FILES">FILES</a></h2>
<dl class="Bl-tag">
  <dt><span class="Pa">~/.cache/plakar/plugins/</span></dt>
  <dd>Plugin cache directory. Respects <code class="Ev">XDG_CACHE_HOME</code> if
      set.</dd>
  <dt><span class="Pa">~/.local/share/plakar/plugins</span></dt>
  <dd>Plugin directory. Respects <code class="Ev">XDG_DATA_HOME</code> if
    set.</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h2>
<p class="Pp"><a class="Xr" href="../plakar-login/" aria-label="plakar-login,
    section 1">plakar-login(1)</a>,
    <a class="Xr" href="../plakar-pkg-build/" aria-label="plakar-pkg-build,
    section 1">plakar-pkg-build(1)</a>,
    <a class="Xr" href="../plakar-pkg-create/" aria-label="plakar-pkg-create,
    section 1">plakar-pkg-create(1)</a>,
    <a class="Xr" href="../plakar-pkg-rm/" aria-label="plakar-pkg-rm, section
    1">plakar-pkg-rm(1)</a>,
    <a class="Xr" href="../plakar-pkg-show/" aria-label="plakar-pkg-show,
    section 1">plakar-pkg-show(1)</a></p>
</section>
</main>
<div class="foot" role="doc-pagefooter" aria-label="Manual footer
  line"><span class="foot-left">Plakar</span> <span class="foot-date">March 23,
  2026</span> <span class="foot-right">PLAKAR-PKG-ADD(1)</span></div>
