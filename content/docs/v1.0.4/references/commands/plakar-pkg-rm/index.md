---
date: "2025-09-15T17:20:33Z"
title: pkg-rm
summary: "Uninstall Plakar plugins"
---
<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR-PKG-RM(1)</span>
  <span class="head-vol">General Commands Manual</span>
  <span class="head-rtitle">PLAKAR-PKG-RM(1)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">plakar-pkg-rm</code> &#x2014;
    <span class="Nd" role="doc-subtitle">Uninstall Plakar plugins</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h2>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar pkg rm <var class="Ar">plugin
      ...</var></code></td>
    <td></td>
  </tr>
</table>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
<p class="Pp">The <code class="Nm">plakar pkg rm</code> command removes plugins
    that have been previously installed with
    <a class="Xr" href="../plakar-pkg-add/" aria-label="plakar-pkg-add, section
    1">plakar-pkg-add(1)</a> command.</p>
<p class="Pp">The list of plugins can be obtained with
    <a class="Xr" href="../plakar-pkg-show/" aria-label="plakar-pkg-show,
    section 1">plakar-pkg-show(1)</a>.</p>
</section>
<section class="Sh">
<h2 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h2>
<p class="Pp">Removing a plugin:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar pkg show
epic-v1.2.3
$ plakar pkg rm epic-v1.2.3</pre>
</div>
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
    <a class="Xr" href="../plakar-pkg-show/" aria-label="plakar-pkg-show,
    section 1">plakar-pkg-show(1)</a></p>
</section>
</main>
<div class="foot" role="doc-pagefooter" aria-label="Manual footer
  line"><span class="foot-left">Plakar</span> <span class="foot-date">July 11,
  2025</span> <span class="foot-right">PLAKAR-PKG-RM(1)</span></div>
