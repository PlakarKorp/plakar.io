---
date: "2026-01-29T09:34:09Z"
title: token
summary: "Manage Plakar tokens"
aliases:
  - /docs/main/commands/plakar-token/
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-TOKEN(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-TOKEN(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar-token</code> &#x2014;
    <span class="Nd">Manage Plakar tokens</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar token</code></td>
    <td>[<code class="Cm">create</code>]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar token</code> command manages tokens
    used to authenticate to Plakar services. Set the
    <code class="Ev">PLAKAR_TOKEN</code> environment variable to use a token,
    and see <a class="Xr" href="../plakar-login/">plakar-login(1)</a> to persist
    it in the configuration.</p>
</section>
<section class="Sh">
<h1 class="Sh" id="SUBCOMMANDS"><a class="permalink" href="#SUBCOMMANDS">SUBCOMMANDS</a></h1>
<dl class="Bl-tag">
  <dt id="create"><a class="permalink" href="#create"><code class="Cm">create</code></a></dt>
  <dd>Create a new token.</dd>
</dl>
</section>
<section class="Sh">
<h1 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h1>
<p class="Pp"><a class="Xr" href="../plakar/">plakar(1)</a>,
    <a class="Xr" href="../plakar-login/">plakar-login(1)</a></p>
</section>
</div>
<table class="foot">
  <tr>
    <td class="foot-date">December 9, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
