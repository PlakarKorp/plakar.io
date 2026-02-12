---
date: "2025-09-15T17:20:33Z"
title: pkg-recipe.yaml
summary: "Recipe to build Plakar plugins from source"
aliases:
  - /docs/v1.0.4/commands/plakar-pkg-recipe.yaml/
---
<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR-PKG-RECIPE.YAML(5)</span>
  <span class="head-vol">File Formats Manual</span>
  <span class="head-rtitle">PLAKAR-PKG-RECIPE.YAML(5)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">recipe.yaml</code> &#x2014;
    <span class="Nd" role="doc-subtitle">Recipe to build Plakar plugins from
    source</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
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
<h2 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h2>
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
<h2 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h2>
<p class="Pp"><a class="Xr" href="../plakar-pkg-build/" aria-label="plakar-pkg-build,
    section 1">plakar-pkg-build(1)</a></p>
</section>
</main>
<div class="foot" role="doc-pagefooter" aria-label="Manual footer
  line"><span class="foot-left">Plakar</span> <span class="foot-date">July 11,
  2025</span> <span class="foot-right">PLAKAR-PKG-RECIPE.YAML(5)</span></div>
