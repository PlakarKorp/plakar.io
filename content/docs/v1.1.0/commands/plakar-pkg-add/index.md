---
date: "2026-01-29T09:34:09Z"
title: pkg-add
summary: "Install Plakar plugins"
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-PKG-ADD(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-PKG-ADD(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar-pkg-add</code> &#x2014;
    <span class="Nd">Install Plakar plugins</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar pkg add <var class="Ar">plugin
      ...</var></code></td>
    <td></td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar pkg add</code> command adds a local or
    a remote plugin.</p>
<p class="Pp">If <var class="Ar">plugin</var> matches an existing local file, it
    is installed directly. Otherwise, it is treated as a recipe name and
    downloaded from the Plakar plugin server which requires a login via the
    <a class="Xr" href="../plakar-login/">plakar-login(1)</a> command.</p>
<p class="Pp">Installing plugins without logging in is possible via the
    <a class="Xr" href="../plakar-pkg-build/">plakar-pkg-build(1)</a> command,
    provided you have the necessary dependencies to build it locally (currently,
    official plugins require make and a working Go toolchain).</p>
<p class="Pp">To force local resolution use an absolute path, otherwise to force
    remote fetching pass an HTTP or HTTPS URL.</p>
</section>
<section class="Sh">
<h1 class="Sh" id="FILES"><a class="permalink" href="#FILES">FILES</a></h1>
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
<h1 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h1>
<p class="Pp"><a class="Xr" href="../plakar-login/">plakar-login(1)</a>,
    <a class="Xr" href="../plakar-pkg-build/">plakar-pkg-build(1)</a>,
    <a class="Xr" href="../plakar-pkg-create/">plakar-pkg-create(1)</a>,
    <a class="Xr" href="../plakar-pkg-rm/">plakar-pkg-rm(1)</a>,
    <a class="Xr" href="../plakar-pkg-show/">plakar-pkg-show(1)</a></p>
</section>
</div>
<table class="foot">
  <tr>
    <td class="foot-date">November 27, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
