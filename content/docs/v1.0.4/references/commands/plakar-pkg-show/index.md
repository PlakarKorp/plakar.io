---
date: "2025-09-15T17:20:33Z"
title: pkg-show
summary: "Show installed Plakar plugins"
---
<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR-PKG-SHOW(1)</span>
  <span class="head-vol">General Commands Manual</span>
  <span class="head-rtitle">PLAKAR-PKG-SHOW(1)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">plakar-pkg-show</code> &#x2014;
    <span class="Nd" role="doc-subtitle">Show installed Plakar
  plugins</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h2>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar pkg show</code></td>
    <td>[<code class="Fl">-available</code>]
      [<code class="Fl">-long</code>]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
<p class="Pp">The <code class="Nm">plakar pkg show</code> command shows the
    currently installed plugins.</p>
<p class="Pp">The options are as follows:</p>
<dl class="Bl-tag">
  <dt id="available"><a class="permalink" href="#available"><code class="Fl">-available</code></a></dt>
  <dd>Instead of installed packages, show the set of prebuilt packages available
      for this system.</dd>
  <dt id="long"><a class="permalink" href="#long"><code class="Fl">-long</code></a></dt>
  <dd>Show the full package name.</dd>
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
<p class="Pp"><a class="Xr" href="../plakar-pkg-add/" aria-label="plakar-pkg-add,
    section 1">plakar-pkg-add(1)</a>,
    <a class="Xr" href="../plakar-pkg-build/" aria-label="plakar-pkg-build,
    section 1">plakar-pkg-build(1)</a>,
    <a class="Xr" href="../plakar-pkg-create/" aria-label="plakar-pkg-create,
    section 1">plakar-pkg-create(1)</a>,
    <a class="Xr" href="../plakar-pkg-rm/" aria-label="plakar-pkg-rm, section
    1">plakar-pkg-rm(1)</a></p>
</section>
</main>
<div class="foot" role="doc-pagefooter" aria-label="Manual footer
  line"><span class="foot-left">Plakar</span> <span class="foot-date">July 11,
  2025</span> <span class="foot-right">PLAKAR-PKG-SHOW(1)</span></div>
