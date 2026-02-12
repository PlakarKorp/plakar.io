---
date: "2025-12-01T16:54:45Z"
title: pkg-add
summary: "Install Plakar plugins"
aliases:
  - /docs/v1.0.6/commands/plakar-pkg-add/
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
    <td><code class="Nm">plakar pkg add <var class="Ar">plugin
      ...</var></code></td>
    <td></td>
  </tr>
</table>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
<p class="Pp">The <code class="Nm">plakar pkg add</code> command adds a local or
    a remote plugin.</p>
<p class="Pp">If <var class="Ar">plugin</var> is an absolute path, or if it
    starts with &#x2018;./&#x2019;, then it is considered a path to a local
    plugin file, otherwise it is downloaded from the Plakar plugin server. In
    the latter case, the user must be logged in via the
    <a class="Xr" href="../plakar-login/" aria-label="plakar-login, section
    1">plakar-login(1)</a> command.</p>
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
  line"><span class="foot-left">Plakar</span> <span class="foot-date">July 11,
  2025</span> <span class="foot-right">PLAKAR-PKG-ADD(1)</span></div>
