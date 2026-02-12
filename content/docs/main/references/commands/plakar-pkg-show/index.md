---
date: "2026-01-29T09:34:09Z"
title: pkg-show
summary: "Show installed Plakar plugins"
aliases:
  - /docs/main/commands/plakar-pkg-show/
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-PKG-SHOW(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-PKG-SHOW(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar-pkg-show</code> &#x2014;
    <span class="Nd">Show installed Plakar plugins</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar pkg show</code></td>
    <td>[<code class="Fl">-available</code>]
      [<code class="Fl">-long</code>]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
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
    <a class="Xr" href="../plakar-pkg-build/">plakar-pkg-build(1)</a>,
    <a class="Xr" href="../plakar-pkg-create/">plakar-pkg-create(1)</a>,
    <a class="Xr" href="../plakar-pkg-rm/">plakar-pkg-rm(1)</a></p>
</section>
</div>
<table class="foot">
  <tr>
    <td class="foot-date">July 11, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
