---
date: "2025-07-11T14:06:35Z"
title: login
summary: "Authenticate to Plakar services"
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-LOGIN(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-LOGIN(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar-login</code> &#x2014;
    <span class="Nd">Authenticate to Plakar services</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar login</code></td>
    <td>[<code class="Fl">-email</code> <var class="Ar">email</var>]
      [<code class="Fl">-github</code>] [<code class="Fl">-no-spawn</code>]</td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar login</code> command initiates an
    authentication flow with the Plakar platform. Login is optional for most
    <code class="Nm">plakar</code> commands but required to enable certain
    services, such as alerting. See also
    <a class="Xr" href="../plakar-services/">plakar-services(1)</a>.</p>
<p class="Pp">Only one authentication method may be specified per invocation:
    the <code class="Fl">-email</code> and <code class="Fl">-github</code>
    options are mutually exclusive. If neither is provided,
    <code class="Fl">-github</code> is assumed.</p>
<p class="Pp">The options are as follows:</p>
<dl class="Bl-tag">
  <dt id="email"><a class="permalink" href="#email"><code class="Fl">-email</code></a>
    <var class="Ar">email</var></dt>
  <dd>Send a login link to the specified email address. Clicking the link in the
      received email will authenticate <code class="Nm">plakar</code>.</dd>
  <dt id="github"><a class="permalink" href="#github"><code class="Fl">-github</code></a></dt>
  <dd>Use GitHub OAuth to authenticate. A browser will be spawned to initiate
      the OAuth flow unless <code class="Fl">-no-spawn</code> is specified.</dd>
  <dt id="no-spawn"><a class="permalink" href="#no-spawn"><code class="Fl">-no-spawn</code></a></dt>
  <dd>Do not automatically open a browser window for authentication flows.</dd>
</dl>
</section>
<section class="Sh">
<h1 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h1>
<p class="Pp">Start a login via email:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar login -email user@example.com</pre>
</div>
<p class="Pp">Authenticate via GitHub (default, opens browser):</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar login</pre>
</div>
</section>
<section class="Sh">
<h1 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h1>
<p class="Pp"><a class="Xr" href="../plakar/">plakar(1)</a>,
    <a class="Xr" href="../plakar-services/">plakar-services(1)</a></p>
</section>
</div>
<table class="foot">
  <tr>
    <td class="foot-date">July 8, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
