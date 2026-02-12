---
date: "2025-09-15T17:20:33Z"
title: pkg-build
summary: "Build Plakar plugins from source"
aliases:
  - /docs/v1.0.4/commands/plakar-pkg-build/
---
<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR-PKG-BUILD(1)</span>
  <span class="head-vol">General Commands Manual</span>
  <span class="head-rtitle">PLAKAR-PKG-BUILD(1)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">plakar-pkg-build</code> &#x2014;
    <span class="Nd" role="doc-subtitle">Build Plakar plugins from
  source</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h2>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar pkg build
      <var class="Ar">recipe.yaml</var></code></td>
    <td></td>
  </tr>
</table>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
<p class="Pp">The <code class="Nm">plakar pkg build</code> fetches the sources
    and builds the plugin as specified in the given
    <a class="Xr" href="../plakar-pkg-recipe.yaml/" aria-label="plakar-pkg-recipe.yaml,
    section 5">plakar-pkg-recipe.yaml(5)</a>. If it builds successfully, the
    resulting plugin will be created in the current working directory.</p>
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
<p class="Pp"><a class="Xr" href="../plakar-pkg-add/" aria-label="plakar-pkg-add,
    section 1">plakar-pkg-add(1)</a>,
    <a class="Xr" href="../plakar-pkg-create/" aria-label="plakar-pkg-create,
    section 1">plakar-pkg-create(1)</a>,
    <a class="Xr" href="../plakar-pkg-rm/" aria-label="plakar-pkg-rm, section
    1">plakar-pkg-rm(1)</a>,
    <a class="Xr" href="../plakar-pkg-show/" aria-label="plakar-pkg-show,
    section 1">plakar-pkg-show(1)</a>,
    <a class="Xr" href="../plakar-pkg-recipe.yaml/" aria-label="plakar-pkg-recipe.yaml,
    section 5">plakar-pkg-recipe.yaml(5)</a></p>
</section>
</main>
<div class="foot" role="doc-pagefooter" aria-label="Manual footer
  line"><span class="foot-left">Plakar</span> <span class="foot-date">July 11,
  2025</span> <span class="foot-right">PLAKAR-PKG-BUILD(1)</span></div>
