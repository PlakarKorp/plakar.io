---
date: "2026-01-29T09:34:09Z"
title: pkg-recipe.yaml
summary: "Recipe to build Plakar plugins from source"
aliases:
  - /docs/v1.1.0/commands/plakar-pkg-recipe.yaml/
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-PKG-RECIPE.YAML(5)</td>
    <td class="head-vol">File Formats Manual</td>
    <td class="head-rtitle">PLAKAR-PKG-RECIPE.YAML(5)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">recipe.yaml</code> &#x2014;
    <span class="Nd">Recipe to build Plakar plugins from source</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">recipe.yaml</code> file format describes how
    to fetch and build Plakar plugins. It must have a top-level YAML object with
    the following fields:</p>
<dl class="Bl-tag">
  <dt id="name"><a class="permalink" href="#name"><code class="Ic">name</code></a></dt>
  <dd>The name of the plugins</dd>
  <dt id="version"><a class="permalink" href="#version"><code class="Ic">version</code></a></dt>
  <dd>The plugin version, which doubles as the git tag as well. It must follow
      semantic versioning and have a &#x2018;v&#x2019; prefix, e.g.
      &#x2018;v1.2.3&#x2019;.</dd>
  <dt id="repository"><a class="permalink" href="#repository"><code class="Ic">repository</code></a></dt>
  <dd>URL to the git repository holding the plugin.</dd>
</dl>
</section>
<section class="Sh">
<h1 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h1>
<p class="Pp">A sample recipe to build the &#x201C;fs&#x201D; plugin is as
    follows:</p>
<div class="Bd Pp Bd-indent Li">
<pre># recipe.yaml
name: fs
version: v1.0.0
repository: https://github.com/PlakarKorp/integrations-fs</pre>
</div>
</section>
<section class="Sh">
<h1 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h1>
<p class="Pp"><a class="Xr" href="../plakar-pkg-build/">plakar-pkg-build(1)</a></p>
</section>
</div>
<table class="foot">
  <tr>
    <td class="foot-date">July 11, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
