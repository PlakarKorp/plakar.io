---
date: "2026-01-29T09:34:09Z"
title: pkg-rm
summary: "Uninstall Plakar plugins"
aliases:
  - /docs/v1.1.0/commands/plakar-pkg-rm/
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-PKG-RM(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-PKG-RM(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar-pkg-rm</code> &#x2014;
    <span class="Nd">Uninstall Plakar plugins</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar pkg rm <var class="Ar">plugin
      ...</var></code></td>
    <td></td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar pkg rm</code> command removes plugins
    that have been previously installed with
    <a class="Xr" href="../plakar-pkg-add/">plakar-pkg-add(1)</a> command.</p>
<p class="Pp">The list of plugins can be obtained with
    <a class="Xr" href="../plakar-pkg-show/">plakar-pkg-show(1)</a>.</p>
</section>
<section class="Sh">
<h1 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h1>
<p class="Pp">Removing a plugin:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar pkg show
epic-v1.2.3
$ plakar pkg rm epic-v1.2.3</pre>
</div>
</section>
<section class="Sh">
<h1 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h1>
<p class="Pp"><a class="Xr" href="../plakar-pkg-add/">plakar-pkg-add(1)</a>,
    <a class="Xr" href="../plakar-pkg-build/">plakar-pkg-build(1)</a>,
    <a class="Xr" href="../plakar-pkg-create/">plakar-pkg-create(1)</a>,
    <a class="Xr" href="../plakar-pkg-show/">plakar-pkg-show(1)</a></p>
</section>
</div>
<table class="foot">
  <tr>
    <td class="foot-date">July 11, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
