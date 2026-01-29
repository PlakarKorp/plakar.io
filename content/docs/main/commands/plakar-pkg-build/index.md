---
date: "2026-01-29T09:34:09Z"
title: pkg-build
summary: "Build Plakar plugins from source"
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-PKG-BUILD(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-PKG-BUILD(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar-pkg-build</code> &#x2014;
    <span class="Nd">Build Plakar plugins from source</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar pkg build
      <var class="Ar">recipe.yaml</var></code></td>
    <td></td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar pkg build</code> fetches the sources
    and builds the plugin as specified in the given
    <a class="Xr" href="../plakar-pkg-recipe.yaml/">plakar-pkg-recipe.yaml(5)</a>.
    If it builds successfully, the resulting plugin will be created in the
    current working directory.</p>
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
<p class="Pp"><a class="Xr" href="../plakar-pkg-add/">plakar-pkg-add(1)</a>,
    <a class="Xr" href="../plakar-pkg-create/">plakar-pkg-create(1)</a>,
    <a class="Xr" href="../plakar-pkg-rm/">plakar-pkg-rm(1)</a>,
    <a class="Xr" href="../plakar-pkg-show/">plakar-pkg-show(1)</a>,
    <a class="Xr" href="../plakar-pkg-recipe.yaml/">plakar-pkg-recipe.yaml(5)</a></p>
</section>
</div>
<table class="foot">
  <tr>
    <td class="foot-date">July 11, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
