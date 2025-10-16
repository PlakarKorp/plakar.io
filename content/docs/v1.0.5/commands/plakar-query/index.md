---
date: "2025-10-15T10:33:18Z"
title: query
summary: "query flags shared among many Plakar subcommands"
---
<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR-QUERY(7)</span>
  <span class="head-vol">Miscellaneous Information Manual</span>
  <span class="head-rtitle">PLAKAR-QUERY(7)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">plakar-query</code> &#x2014;
    <span class="Nd" role="doc-subtitle">query flags shared among many Plakar
    subcommands</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
<p class="Pp">What follows is a set of command line arguments that many
    <a class="Xr" href="../plakar/" aria-label="plakar, section 1">plakar(1)</a>
    subcommands provide to filter snapshots.</p>
<p class="Pp">There are two kind of flags:</p>
<dl class="Bl-tag">
  <dt>matchers</dt>
  <dd>These allow to select snapshots. If combined, the result is the union of
      the various matchers.</dd>
  <dt>filters</dt>
  <dd>These instead filter the output of the matchers by yielding snapshots
      matching only certain criterias. If combined, the result is the
      intersection of the various filters.</dd>
</dl>
<p class="Pp">If no matcher is given, all the snapshots are implicitly selected,
    and then filtered according to the given filters, if any.</p>
<p class="Pp">The matchers are divided into:</p>
<ul class="Bl-bullet Bd-indent">
  <li>matchers that select snapshots from the last <var class="Ar">n</var> unit
      of time:
    <p class="Pp"></p>
    <div class="Bd-indent">
    <dl class="Bl-tag Bl-compact">
      <dt id="minutes"><a class="permalink" href="#minutes"><code class="Fl">-minutes</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
      <dt id="hours"><a class="permalink" href="#hours"><code class="Fl">-hours</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
      <dt id="days"><a class="permalink" href="#days"><code class="Fl">-days</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
      <dt id="weeks"><a class="permalink" href="#weeks"><code class="Fl">-weeks</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
      <dt id="months"><a class="permalink" href="#months"><code class="Fl">-months</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
      <dt id="years"><a class="permalink" href="#years"><code class="Fl">-years</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
    </dl>
    </div>
    <p class="Pp">Or that selects snapshots that were done during the last
        <var class="Ar">n</var> days of the week:</p>
    <p class="Pp"></p>
    <div class="Bd-indent">
    <dl class="Bl-tag Bl-compact">
      <dt id="mondays"><a class="permalink" href="#mondays"><code class="Fl">-mondays</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
      <dt id="thuesdays"><a class="permalink" href="#thuesdays"><code class="Fl">-thuesdays</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
      <dt id="wednesdays"><a class="permalink" href="#wednesdays"><code class="Fl">-wednesdays</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
      <dt id="thursdays"><a class="permalink" href="#thursdays"><code class="Fl">-thursdays</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
      <dt id="fridays"><a class="permalink" href="#fridays"><code class="Fl">-fridays</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
      <dt id="saturdays"><a class="permalink" href="#saturdays"><code class="Fl">-saturdays</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
      <dt id="sundays"><a class="permalink" href="#sundays"><code class="Fl">-sundays</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
    </dl>
    </div>
  </li>
  <li>matchers that select at most <var class="Ar">n</var> snapshots per time
      period:
    <p class="Pp"></p>
    <div class="Bd-indent">
    <dl class="Bl-tag Bl-compact">
      <dt id="per-minute"><a class="permalink" href="#per-minute"><code class="Fl">-per-minute</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
      <dt id="per-hour"><a class="permalink" href="#per-hour"><code class="Fl">-per-hour</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
      <dt id="per-day"><a class="permalink" href="#per-day"><code class="Fl">-per-day</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
      <dt id="per-week"><a class="permalink" href="#per-week"><code class="Fl">-per-week</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
      <dt id="per-month"><a class="permalink" href="#per-month"><code class="Fl">-per-month</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
      <dt id="per-year"><a class="permalink" href="#per-year"><code class="Fl">-per-year</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
      <dt id="per-monday"><a class="permalink" href="#per-monday"><code class="Fl">-per-monday</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
      <dt id="per-thuesday"><a class="permalink" href="#per-thuesday"><code class="Fl">-per-thuesday</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
      <dt id="per-wednesday"><a class="permalink" href="#per-wednesday"><code class="Fl">-per-wednesday</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
      <dt id="per-thursday"><a class="permalink" href="#per-thursday"><code class="Fl">-per-thursday</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
      <dt id="per-friday"><a class="permalink" href="#per-friday"><code class="Fl">-per-friday</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
      <dt id="per-saturday"><a class="permalink" href="#per-saturday"><code class="Fl">-per-saturday</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
      <dt id="per-sunday"><a class="permalink" href="#per-sunday"><code class="Fl">-per-sunday</code></a>
        <var class="Ar">n</var></dt>
      <dd style="width: auto;">&#x00A0;</dd>
    </dl>
    </div>
  </li>
</ul>
<p class="Pp">The filters are:</p>
<dl class="Bl-tag">
  <dt id="before"><a class="permalink" href="#before"><code class="Fl">-before</code></a>
    <var class="Ar">date</var></dt>
  <dd>Select snapshots older than given <var class="Ar">date</var>. The date may
      be in RFC3339 format, as
      &#x201C;<var class="Ar">YYYY</var>-<var class="Ar">mm</var>-<var class="Ar">DD</var>
      <var class="Ar">HH</var>:<var class="Ar">MM</var>&#x201D;,
      &#x201C;<var class="Ar">YYYY</var>-<var class="Ar">mm</var>-<var class="Ar">DD</var>
      <var class="Ar">HH</var>:<var class="Ar">MM</var>:<var class="Ar">SS</var>&#x201D;,
      &#x201C;<var class="Ar">YYYY</var>-<var class="Ar">mm</var>-<var class="Ar">DD</var>&#x201D;,
      or
      &#x201C;<var class="Ar">YYYY</var>/<var class="Ar">mm</var>/<var class="Ar">DD</var>&#x201D;
      where <var class="Ar">YYYY</var> is a year, <var class="Ar">mm</var> a
      month, <var class="Ar">DD</var> a day, <var class="Ar">HH</var> a hour in
      24 hour format number, <var class="Ar">MM</var> minutes and
      <var class="Ar">SS</var> the number of seconds.
    <p class="Pp">Alternatively, human-style intervals like &#x201C;half an
        hour&#x201D;, &#x201C;a month&#x201D; or &#x201C;2h30m&#x201D; are also
        accepted.</p>
  </dd>
  <dt id="category"><a class="permalink" href="#category"><code class="Fl">-category</code></a>
    <var class="Ar">name</var></dt>
  <dd>Select snapshot whose category is <var class="Ar">name</var>.</dd>
  <dt id="environment"><a class="permalink" href="#environment"><code class="Fl">-environment</code></a>
    <var class="Ar">name</var></dt>
  <dd>Select snapshot whose environment is <var class="Ar">name</var>.</dd>
  <dt id="job"><a class="permalink" href="#job"><code class="Fl">-job</code></a>
    <var class="Ar">name</var></dt>
  <dd>Select snapshot whose job is <var class="Ar">name</var>.</dd>
  <dt id="latest"><a class="permalink" href="#latest"><code class="Fl">-latest</code></a></dt>
  <dd>Select only the latest snapshot.</dd>
  <dt id="name"><a class="permalink" href="#name"><code class="Fl">-name</code></a>
    <var class="Ar">name</var></dt>
  <dd>Select snapshots whose name is <var class="Ar">name</var>.</dd>
  <dt id="perimeter"><a class="permalink" href="#perimeter"><code class="Fl">-perimeter</code></a>
    <var class="Ar">name</var></dt>
  <dd>Select snapshots whose perimeter is <var class="Ar">name</var>.</dd>
  <dt id="root"><a class="permalink" href="#root"><code class="Fl">-root</code></a>
    <var class="Ar">path</var></dt>
  <dd>Select snapshots whose root directory is <var class="Ar">path</var>. May
      be specified multiple time, snapshots are selected if any of the given
      paths matches.</dd>
  <dt id="since"><a class="permalink" href="#since"><code class="Fl">-since</code></a>
    <var class="Ar">date</var></dt>
  <dd>Select snapshots newer than the given <var class="Ar">date</var>. The
      accepted format is the same as <code class="Fl">-before</code>.</dd>
  <dt id="tag"><a class="permalink" href="#tag"><code class="Fl">-tag</code></a>
    <var class="Ar">name</var></dt>
  <dd>Select snapshots tagged with <var class="Ar">name</var>. May be specified
      multiple times, and multiple tags may be given at the same time if
      comma-separated.</dd>
</dl>
</section>
</main>
<div class="foot" role="doc-pagefooter" aria-label="Manual footer
  line"><span class="foot-left">Plakar</span> <span class="foot-date">September
  10, 2025</span> <span class="foot-right">PLAKAR-QUERY(7)</span></div>
