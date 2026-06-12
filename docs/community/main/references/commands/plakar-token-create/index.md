
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-TOKEN-CREATE(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-TOKEN-CREATE(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar-token-create</code> &#x2014;
    <span class="Nd">Create a token to authenticate to Plakar
  services</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar token create</code></td>
    <td></td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar token create</code> command generates
    a token that can be used to authenticate with
    <a class="Xr" href="../plakar-login/">plakar-login(1)</a>.</p>
</section>
<section class="Sh">
<h1 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h1>
<p class="Pp">Generate a token:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar token create</pre>
</div>
<p class="Pp">and then use it on a different machine to log in
  automatically:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ export PLAKAR_TOKEN=...
$ plakar login -env</pre>
</div>
</section>
<section class="Sh">
<h1 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h1>
<p class="Pp"><a class="Xr" href="../plakar/">plakar(1)</a>,
    <a class="Xr" href="../plakar-login/">plakar-login(1)</a>,
    <a class="Xr" href="../plakar-service/">plakar-service(1)</a></p>
</section>
</div>
<table class="foot">
  <tr>
    <td class="foot-date">May 5, 2026</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>

