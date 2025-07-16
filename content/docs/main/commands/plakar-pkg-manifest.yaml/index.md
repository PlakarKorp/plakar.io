---
date: "2025-07-15T19:15:41Z"
title: pkg-manifest.yaml
summary: "Manifest for plugin assemblation"
---
<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR-PKG-MANIFEST.YAML(5)</span>
  <span class="head-vol">File Formats Manual</span>
  <span class="head-rtitle">PLAKAR-PKG-MANIFEST.YAML(5)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">manifest.yaml</code> &#x2014;
    <span class="Nd" role="doc-subtitle">Manifest for plugin
  assemblation</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
<p class="Pp">The <code class="Nm">manifest.yaml</code> file format describes
    how to package a plugin. No build or compilation is done, so all executables
    and other files have to be prepared beforehand. It must have a top-level
    YAML object with the following fields:</p>
<dl class="Bl-tag">
  <dt id="name"><a class="permalink" href="#name"><code class="Ic">name</code></a></dt>
  <dd>The name of the plugins</dd>
  <dt id="version"><a class="permalink" href="#version"><code class="Ic">version</code></a></dt>
  <dd>The plugin version, which doubles as the git tag as well. It must follow
      semantic versioning and have a &#x2018;v&#x2019; prefix, e.g.
      &#x2018;v1.2.3&#x2019;.</dd>
  <dt id="connectors"><a class="permalink" href="#connectors"><code class="Ic">connectors</code></a></dt>
  <dd>A YAML array of objects with the following properties:
    <dl class="Bl-tag">
      <dt id="type"><a class="permalink" href="#type"><code class="Ic">type</code></a></dt>
      <dd>The connector type, one of <code class="Ic">importer</code>,
          <code class="Ic">exporter</code>, or
        <code class="Ic">store</code>.</dd>
      <dt id="protocols"><a class="permalink" href="#protocols"><code class="Ic">protocols</code></a></dt>
      <dd>An array of YAML strings containing all the protocols that the
          connector supports.</dd>
      <dt id="location_flags"><a class="permalink" href="#location_flags"><code class="Ic">location_flags</code></a></dt>
      <dd>An optional array of YAML strings describing some properties of the
          connector. These properties are:
        <dl class="Bl-tag">
          <dt id="localfs"><a class="permalink" href="#localfs"><code class="Ic">localfs</code></a></dt>
          <dd>Whether paths given to this connector have to be made
            absolute.</dd>
          <dt id="file"><a class="permalink" href="#file"><code class="Ic">file</code></a></dt>
          <dd>Whether this store backend handles a Kloset in a sigle file, for
              e.g. a ptar file.</dd>
        </dl>
      </dd>
      <dt id="executable"><a class="permalink" href="#executable"><code class="Ic">executable</code></a></dt>
      <dd>Path to the plugin executable.</dd>
      <dt id="extra_file"><a class="permalink" href="#extra_file"><code class="Ic">extra_file</code></a></dt>
      <dd>An optional array of YAML string. These are extra files that need to
          be included in the package.</dd>
      <dt id="homepage"><a class="permalink" href="#homepage"><code class="Ic">homepage</code></a></dt>
      <dd>The plugin homepage.</dd>
      <dt id="license"><a class="permalink" href="#license"><code class="Ic">license</code></a></dt>
      <dd>The plugin license.</dd>
    </dl>
  </dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h2>
<p class="Pp">A sample manifest for the &#x201C;fs&#x201D; plugin is as
  follows:</p>
<div class="Bd Pp Bd-indent Li">
<pre># manifest.yaml
name: fs
description: file storage but as external plugin
version: 1.0.0
connectors:
- type: importer
  executable: fs-importer
  homepage: https://github.com/PlakarKorp/integration-fs
  license: ISC
  protocols: [fs]
- type: exporter
  executable: fs-exporter
  homepage: https://github.com/PlakarKorp/integration-fs
  license: ISC
  protocols: [fs]
- type: storage
  executable: fs-store
  homepage: https://github.com/PlakarKorp/integration-fs
  license: ISC
  protocols: [fs]</pre>
</div>
</section>
<section class="Sh">
<h2 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h2>
<p class="Pp"><a class="Xr" href="../plakar-pkg-create/" aria-label="plakar-pkg-create,
    section 1">plakar-pkg-create(1)</a></p>
</section>
</main>
<div class="foot" role="doc-pagefooter" aria-label="Manual footer
  line"><span class="foot-left">Plakar</span> <span class="foot-date">July 11,
  2025</span> <span class="foot-right">PLAKAR-PKG-MANIFEST.YAML(5)</span></div>
