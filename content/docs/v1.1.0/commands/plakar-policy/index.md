---
date: "2026-01-29T09:34:09Z"
title: policy
summary: "Manage Plakar retention policies"
---
<table class="head">
  <tr>
    <td class="head-ltitle">PLAKAR-POLICY(1)</td>
    <td class="head-vol">General Commands Manual</td>
    <td class="head-rtitle">PLAKAR-POLICY(1)</td>
  </tr>
</table>
<div class="manual-text">
<section class="Sh">
<h1 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h1>
<p class="Pp"><code class="Nm">plakar-policy</code> &#x2014;
    <span class="Nd">Manage Plakar retention policies</span></p>
</section>
<section class="Sh">
<h1 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h1>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar policy</code></td>
    <td><var class="Ar">subcommand ...</var></td>
  </tr>
</table>
</section>
<section class="Sh">
<h1 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h1>
<p class="Pp">The <code class="Nm">plakar policy</code> command manages the
    retention policies for
    <a class="Xr" href="../plakar-prune/">plakar-prune(1)</a>.</p>
<p class="Pp">The configuration consists in a set of named entries, each of them
    describing a retention policy.</p>
<p class="Pp">The subcommands are as follows:</p>
<dl class="Bl-tag">
  <dt id="add"><a class="permalink" href="#add"><code class="Cm">add</code></a>
    <var class="Ar">name</var>
    [<var class="Ar">option</var><span class="No">=</span><var class="Ar">value
    ...</var>]</dt>
  <dd>Create a new source entry identified by <var class="Ar">name</var>.
      Additional parameters can be set by adding
      <var class="Ar">option</var><span class="No">=</span><var class="Ar">value</var>
      parameters.</dd>
  <dt id="rm"><a class="permalink" href="#rm"><code class="Cm">rm</code></a>
    <var class="Ar">name</var></dt>
  <dd>Remove the policy identified by <var class="Ar">name</var> from the
      configuration.</dd>
  <dt id="set"><a class="permalink" href="#set"><code class="Cm">set</code></a>
    <var class="Ar">name</var>
    [<var class="Ar">option</var><span class="No">=</span><var class="Ar">value
    ...</var>]</dt>
  <dd>Set the <var class="Ar">option</var> to <var class="Ar">value</var> for
      the source identified by <var class="Ar">name</var>. Multiple option/value
      pairs can be specified.</dd>
  <dt id="show"><a class="permalink" href="#show"><code class="Cm">show</code></a>
    [<code class="Fl">-ini</code>] [<code class="Fl">-json</code>]
    [<code class="Fl">-yaml</code>] [<var class="Ar">name ...</var>]</dt>
  <dd>Display the current sources configuration. <code class="Fl">-ini</code>,
      <code class="Fl">-json</code> and <code class="Fl">-yaml</code> control
      the output format, which is YAML by default.</dd>
  <dt id="unset"><a class="permalink" href="#unset"><code class="Cm">unset</code></a>
    <var class="Ar">name</var> [option ...]</dt>
  <dd>Remove the <var class="Ar">option</var> for the policy identified by
      <var class="Ar">name</var>.</dd>
</dl>
<p class="Pp">The available options as described in
    <a class="Xr" href="../plakar-query/">plakar-query(7)</a>: each option
    corresponds the similarly named flag.</p>
</section>
<section class="Sh">
<h1 class="Sh" id="EXIT_STATUS"><a class="permalink" href="#EXIT_STATUS">EXIT
  STATUS</a></h1>
<p class="Pp">The <code class="Nm">plakar-policy</code> utility exits&#x00A0;0
    on success, and&#x00A0;&gt;0 if an error occurs.</p>
</section>
<section class="Sh">
<h1 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h1>
<p class="Pp">Create a policy &#x2018;weekly&#x2019; that keeps one backup per
    week and discards backups older than three months:</p>
<div class="Bd Pp Li">
<pre>$ plakar policy add weekly
$ plakar policy set weekly since='3 months'
$ plakar policy set weekly per-week=1</pre>
</div>
<p class="Pp">Prune snapshots accordingly to the &#x2018;weekly&#x2019;
  policy:</p>
<div class="Bd Pp Li">
<pre>$ plakar prune -policy weekly</pre>
</div>
</section>
<section class="Sh">
<h1 class="Sh" id="SEE_ALSO"><a class="permalink" href="#SEE_ALSO">SEE
  ALSO</a></h1>
<p class="Pp"><a class="Xr" href="../plakar/">plakar(1)</a>,
    <a class="Xr" href="../plakar-prune/">plakar-prune(1)</a></p>
</section>
</div>
<table class="foot">
  <tr>
    <td class="foot-date">September 11, 2025</td>
    <td class="foot-os">Plakar</td>
  </tr>
</table>
