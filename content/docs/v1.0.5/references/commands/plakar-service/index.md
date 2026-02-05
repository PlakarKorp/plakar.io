---
date: "2025-10-15T10:33:18Z"
title: service
summary: "Manage optional Plakar-connected services"
---
<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR-SERVICE(1)</span>
  <span class="head-vol">General Commands Manual</span>
  <span class="head-rtitle">PLAKAR-SERVICE(1)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">plakar-service</code> &#x2014;
    <span class="Nd" role="doc-subtitle">Manage optional Plakar-connected
    services</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h2>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar service <code class="Cm">list</code></code></td>
    <td></td>
  </tr>
</table>
<br/>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar service <code class="Cm">add</code>
      <var class="Ar">name</var>
      [<var class="Ar">key</var>=<var class="Ar">value ...</var>]</code></td>
    <td></td>
  </tr>
</table>
<br/>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar service <code class="Cm">rm</code>
      <var class="Ar">name</var></code></td>
    <td></td>
  </tr>
</table>
<br/>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar service <code class="Cm">status</code>
      <var class="Ar">name</var></code></td>
    <td></td>
  </tr>
</table>
<br/>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar service <code class="Cm">show</code>
      <var class="Ar">name</var></code></td>
    <td></td>
  </tr>
</table>
<br/>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar service <code class="Cm">enable</code>
      <var class="Ar">name</var></code></td>
    <td></td>
  </tr>
</table>
<br/>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar service <code class="Cm">disable</code>
      <var class="Ar">name</var></code></td>
    <td></td>
  </tr>
</table>
<br/>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar service <code class="Cm">set</code>
      <var class="Ar">name</var>
      [<var class="Ar">key</var>=<var class="Ar">value ...</var>]</code></td>
    <td></td>
  </tr>
</table>
<br/>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar service <code class="Cm">unset</code>
      <var class="Ar">name</var> [<var class="Ar">key ...</var>]</code></td>
    <td></td>
  </tr>
</table>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
<p class="Pp">The <code class="Nm">plakar service</code> command allows you to
    enable, disable, and inspect additional services that integrate with the
    <code class="Nm">plakar</code> platform via
    <a class="Xr" href="../plakar-login/" aria-label="plakar-login, section
    1">plakar-login(1)</a> authentication. These services connect to the
    plakar.io infrastructure, and should only be enabled if you agree to
    transmit non-sensitive operational data to plakar.io.</p>
<p class="Pp">All subcommands require prior authentication via
    <a class="Xr" href="../plakar-login/" aria-label="plakar-login, section
    1">plakar-login(1)</a>.</p>
<p class="Pp">Services are managed by the backend and discovered at runtime. For
    example, when the &#x201C;alerting&#x201D; service is enable, it will:</p>
<ol class="Bl-enum">
  <li>Send email notifications when operations fail.</li>
  <li>Expose the latest alerting reports in the Plakar UI (see
      <a class="Xr" href="../plakar-ui/" aria-label="plakar-ui, section
      1">plakar-ui(1)</a>).</li>
</ol>
<p class="Pp">By default, all services are disabled.</p>
</section>
<section class="Sh">
<h2 class="Sh" id="SUBCOMMANDS"><a class="permalink" href="#SUBCOMMANDS">SUBCOMMANDS</a></h2>
<dl class="Bl-tag">
  <dt id="list"><a class="permalink" href="#list"><code class="Cm">list</code></a></dt>
  <dd>Display the list of available services.</dd>
  <dt id="add"><a class="permalink" href="#add"><code class="Cm">add</code></a>
    <var class="Ar">name</var> [<var class="Ar">key</var>=<var class="Ar">value
    ...</var>]</dt>
  <dd>Set the configuration for the service identified by
      <var class="Ar">name</var> and enable it. The configuration is defined by
      the given set of <var class="Ar">key</var>/<var class="Ar">value</var>
      pairs. The existing configuration, if any, is discarded.</dd>
  <dt id="rm"><a class="permalink" href="#rm"><code class="Cm">rm</code></a>
    <var class="Ar">name</var></dt>
  <dd>Disable the service identified by <var class="Ar">name</var> and discard
      its configuration.</dd>
  <dt id="status"><a class="permalink" href="#status"><code class="Cm">status</code></a>
    <var class="Ar">name</var></dt>
  <dd>Display the current status (enabled or disabled) of the named
    service.</dd>
  <dt id="show"><a class="permalink" href="#show"><code class="Cm">show</code></a>
    <var class="Ar">name</var></dt>
  <dd>Display the configuration for the specified service.</dd>
  <dt id="enable"><a class="permalink" href="#enable"><code class="Cm">enable</code></a>
    <var class="Ar">name</var></dt>
  <dd>Enable the specified service.</dd>
  <dt id="disable"><a class="permalink" href="#disable"><code class="Cm">disable</code></a>
    <var class="Ar">name</var></dt>
  <dd>Disable the specified service.</dd>
  <dt id="set"><a class="permalink" href="#set"><code class="Cm">set</code></a>
    <var class="Ar">name</var> [<var class="Ar">key</var>=<var class="Ar">value
    ...</var>]</dt>
  <dd>Set the configuration <var class="Ar">key</var> to
      <var class="Ar">value</var> for the service identified by
      <var class="Ar">name</var>. Multiple
      <var class="Ar">key</var>/<var class="Ar">value</var> pairs can be
      specified.</dd>
  <dt id="unset"><a class="permalink" href="#unset"><code class="Cm">unset</code></a>
    <var class="Ar">name</var> [<var class="Ar">key ...</var>]</dt>
  <dd>Unset the configuration <var class="Ar">key</var> for the service
      identified by <var class="Ar">name</var>. Multiple keys can be
    specified.</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h2>
<p class="Pp">Check the status of the alerting service:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar service status alerting</pre>
</div>
<p class="Pp">Enable alerting:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar service enable alerting</pre>
</div>
<p class="Pp">Disable alerting:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar service disable alerting</pre>
</div>
</section>
<section class="Sh">
<h2 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h2>
<p class="Pp"><a class="Xr" href="../plakar-login/" aria-label="plakar-login,
    section 1">plakar-login(1)</a>,
    <a class="Xr" href="../plakar-ui/" aria-label="plakar-ui, section
    1">plakar-ui(1)</a></p>
</section>
</main>
<div class="foot" role="doc-pagefooter" aria-label="Manual footer
  line"><span class="foot-left">Plakar</span> <span class="foot-date">August 7,
  2025</span> <span class="foot-right">PLAKAR-SERVICE(1)</span></div>
