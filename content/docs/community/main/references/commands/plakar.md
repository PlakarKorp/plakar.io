---
date: "2026-05-13T08:38:47Z"
title: plakar
summary: "effortless backups"
aliases:
  - /docs/main/commands/plakar/
---

<div class="head" role="doc-pageheader" aria-label="Manual header
  line"><span class="head-ltitle">PLAKAR(1)</span>
  <span class="head-vol">General Commands Manual</span>
  <span class="head-rtitle">PLAKAR(1)</span></div>
<main class="manual-text">
<section class="Sh">
<h2 class="Sh" id="NAME"><a class="permalink" href="#NAME">NAME</a></h2>
<p class="Pp"><code class="Nm">plakar</code> &#x2014;
    <span class="Nd" role="doc-subtitle">effortless backups</span></p>
</section>
<section class="Sh">
<h2 class="Sh" id="SYNOPSIS"><a class="permalink" href="#SYNOPSIS">SYNOPSIS</a></h2>
<table class="Nm">
  <tr>
    <td><code class="Nm">plakar</code></td>
    <td>[<code class="Fl">-concurrency</code> <var class="Ar">number</var>]
      [<code class="Fl">-config</code> <var class="Ar">dir</var>]
      [<code class="Fl">-cpu</code> <var class="Ar">number</var>]
      [<code class="Fl">-json</code>] [<code class="Fl">-keyfile</code>
      <var class="Ar">path</var>] [<code class="Fl">-quiet</code>]
      [<code class="Fl">-silent</code>] [<code class="Fl">-stdio</code>]
      [<code class="Fl">-time</code>] [<code class="Fl">-trace</code>
      <var class="Ar">subsystems</var>] [<code class="Cm">at</code>
      <var class="Ar">kloset</var>] <var class="Ar">subcommand ...</var></td>
  </tr>
</table>
</section>
<section class="Sh">
<h2 class="Sh" id="DESCRIPTION"><a class="permalink" href="#DESCRIPTION">DESCRIPTION</a></h2>
<p class="Pp"><code class="Nm">plakar</code> is a tool to create distributed,
    versioned backups with compression, encryption, and data deduplication.</p>
<p class="Pp">By default, <code class="Nm">plakar</code> operates on the Kloset
    store at <span class="Pa">~/.plakar</span>. This can be changed either by
    using the <code class="Cm">at</code> option.</p>
<p class="Pp">The following options are available:</p>
<dl class="Bl-tag">
  <dt id="concurrency"><a class="permalink" href="#concurrency"><code class="Fl">-concurrency</code></a>
    <var class="Ar">number</var></dt>
  <dd>Set the maximum number of parallel tasks for faster processing. Defaults
      to the CPU count.</dd>
  <dt id="config"><a class="permalink" href="#config"><code class="Fl">-config</code></a>
    <var class="Ar">dir</var></dt>
  <dd>Specify an alternate configuration directory. Defaults to
      <span class="Pa">~/.config/plakar</span>.</dd>
  <dt id="cpu"><a class="permalink" href="#cpu"><code class="Fl">-cpu</code></a>
    <var class="Ar">number</var></dt>
  <dd>Limit the number of parallel workers <code class="Nm">plakar</code> uses
      to <var class="Ar">number</var>. By default it's the number of online
      CPUs.</dd>
  <dt id="json"><a class="permalink" href="#json"><code class="Fl">-json</code></a></dt>
  <dd>Use newline-delimited JSON as output format for some subcommands.</dd>
  <dt id="keyfile"><a class="permalink" href="#keyfile"><code class="Fl">-keyfile</code></a>
    <var class="Ar">path</var></dt>
  <dd>Read the passphrase from the key file at <var class="Ar">path</var>
      instead of prompting. Overrides the
      <code class="Ev">PLAKAR_PASSPHRASE</code> environment variable.</dd>
  <dt id="quiet"><a class="permalink" href="#quiet"><code class="Fl">-quiet</code></a></dt>
  <dd>Disable all output except for errors.</dd>
  <dt id="silent"><a class="permalink" href="#silent"><code class="Fl">-silent</code></a></dt>
  <dd>Disable all output.</dd>
  <dt id="stdio"><a class="permalink" href="#stdio"><code class="Fl">-stdio</code></a></dt>
  <dd>Use text lines as output format for some subcommands instead of the
      default ncurses frontend. Enabled by default when the standard output is
      not a terminal.</dd>
  <dt id="time"><a class="permalink" href="#time"><code class="Fl">-time</code></a></dt>
  <dd>Report the time the subcommand took to run.</dd>
  <dt id="trace"><a class="permalink" href="#trace"><code class="Fl">-trace</code></a>
    <var class="Ar">subsystems</var></dt>
  <dd>Display trace logs. <var class="Ar">subsystems</var> is a comma-separated
      series of keywords to enable the trace logs for different subsystems:
      <code class="Cm">all</code>, <code class="Cm">trace</code>,
      <code class="Cm">repository</code>, <code class="Cm">snapshot</code>
      <span class="No">and</span> <code class="Cm">server</code>.</dd>
  <dt id="at"><a class="permalink" href="#at"><code class="Cm">at</code></a>
    <var class="Ar">kloset</var></dt>
  <dd>Operates on the given <var class="Ar">kloset</var> store. It could be a
      path, an URI, or a label in the form
      &#x201C;@<var class="Ar">name</var>&#x201D; to reference a configuration
      created with
      <a class="Xr" href="../plakar-store/" aria-label="plakar-store, section
      1">plakar-store(1)</a>.</dd>
</dl>
<section class="Ss">
<h3 class="Ss" id="General_Commands"><a class="permalink" href="#General_Commands">General
  Commands</a></h3>
<dl class="Bl-tag">
  <dt id="help"><a class="permalink" href="#help"><code class="Cm">help</code></a></dt>
  <dd>Show this manpage and the ones for the subcommands.</dd>
  <dt id="login"><a class="permalink" href="#login"><code class="Cm">login</code></a></dt>
  <dd>Authenticate to Plakar services, refer to
      <a class="Xr" href="../plakar-login/" aria-label="plakar-login, section
      1">plakar-login(1)</a>.</dd>
  <dt id="logout"><a class="permalink" href="#logout"><code class="Cm">logout</code></a></dt>
  <dd>Log out from Plakar services, refer to
      <a class="Xr" href="../plakar-logout/" aria-label="plakar-logout, section
      1">plakar-logout(1)</a>.</dd>
  <dt id="service"><a class="permalink" href="#service"><code class="Cm">service</code></a></dt>
  <dd>Manage additional Plakar services that require you to be logged in, refer
      to <a class="Xr" href="../plakar-service/" aria-label="plakar-service,
      section 1">plakar-service(1)</a>.</dd>
  <dt id="token"><a class="permalink" href="#token"><code class="Cm">token
    create</code></a></dt>
  <dd>Generate a token to interact with Plakar services, refer to
      <a class="Xr" href="../plakar-token-create/" aria-label="plakar-token-create,
      section 1">plakar-token-create(1)</a>.</dd>
  <dt id="version"><a class="permalink" href="#version"><code class="Cm">version</code></a></dt>
  <dd>Display the current Plakar version, refer to
      <a class="Xr" href="../plakar-version/" aria-label="plakar-version,
      section 1">plakar-version(1)</a>.</dd>
</dl>
</section>
<section class="Ss">
<h3 class="Ss" id="Configuration_management"><a class="permalink" href="#Configuration_management">Configuration
  management</a></h3>
<dl class="Bl-tag">
  <dt id="destination"><a class="permalink" href="#destination"><code class="Cm">destination</code></a></dt>
  <dd>Manage configurations for the destination connectors, refer to
      <a class="Xr" href="../plakar-destination/" aria-label="plakar-destination,
      section 1">plakar-destination(1)</a>.</dd>
  <dt id="source"><a class="permalink" href="#source"><code class="Cm">source</code></a></dt>
  <dd>Manage configurations for the source connectors, refer to
      <a class="Xr" href="../plakar-source/" aria-label="plakar-source, section
      1">plakar-source(1)</a>.</dd>
  <dt id="store"><a class="permalink" href="#store"><code class="Cm">store</code></a></dt>
  <dd>Manage configurations for storage connectors, refer to
      <a class="Xr" href="../plakar-store/" aria-label="plakar-store, section
      1">plakar-store(1)</a>.</dd>
</dl>
</section>
<section class="Ss">
<h3 class="Ss" id="Kloset_management"><a class="permalink" href="#Kloset_management">Kloset
  management</a></h3>
<dl class="Bl-tag">
  <dt id="check"><a class="permalink" href="#check"><code class="Cm">check</code></a></dt>
  <dd>Check data integrity in a Kloset store, refer to
      <a class="Xr" href="../plakar-check/" aria-label="plakar-check, section
      1">plakar-check(1)</a>.</dd>
  <dt id="create"><a class="permalink" href="#create"><code class="Cm">create</code></a></dt>
  <dd>Create a new Kloset store, refer to
      <a class="Xr" href="../plakar-create/" aria-label="plakar-create, section
      1">plakar-create(1)</a>.</dd>
  <dt id="info"><a class="permalink" href="#info"><code class="Cm">info</code></a></dt>
  <dd>Display detailed information about internal structures, refer to
      <a class="Xr" href="../plakar-info/" aria-label="plakar-info, section
      1">plakar-info(1)</a>.</dd>
  <dt id="maintenance"><a class="permalink" href="#maintenance"><code class="Cm">maintenance</code></a></dt>
  <dd>Remove unused data from a Kloset store, refer to
      <a class="Xr" href="../plakar-maintenance/" aria-label="plakar-maintenance,
      section 1">plakar-maintenance(1)</a>.</dd>
  <dt id="prune"><a class="permalink" href="#prune"><code class="Cm">prune</code></a></dt>
  <dd>Prune snapshots according to a policy, refer to
      <a class="Xr" href="../plakar-prune/" aria-label="plakar-prune, section
      1">plakar-prune(1)</a>.</dd>
  <dt id="ptar"><a class="permalink" href="#ptar"><code class="Cm">ptar</code></a></dt>
  <dd>Create a .ptar archive, refer to
      <a class="Xr" href="../plakar-ptar/" aria-label="plakar-ptar, section
      1">plakar-ptar(1)</a>.</dd>
  <dt id="server"><a class="permalink" href="#server"><code class="Cm">server</code></a></dt>
  <dd>Start a Plakar server, refer to
      <a class="Xr" href="../plakar-server/" aria-label="plakar-server, section
      1">plakar-server(1)</a>.</dd>
  <dt id="sync"><a class="permalink" href="#sync"><code class="Cm">sync</code></a></dt>
  <dd>Synchronize snapshots between Kloset stores, refer to
      <a class="Xr" href="../plakar-sync/" aria-label="plakar-sync, section
      1">plakar-sync(1)</a>.</dd>
  <dt id="ui"><a class="permalink" href="#ui"><code class="Cm">ui</code></a></dt>
  <dd>Serve the Plakar web user interface, refer to
      <a class="Xr" href="../plakar-ui/" aria-label="plakar-ui, section
      1">plakar-ui(1)</a>.</dd>
</dl>
</section>
<section class="Ss">
<h3 class="Ss" id="Snapshot_management"><a class="permalink" href="#Snapshot_management">Snapshot
  management</a></h3>
<dl class="Bl-tag Bl-compact">
  <dt id="archive"><a class="permalink" href="#archive"><code class="Cm">archive</code></a></dt>
  <dd>Create an archive from a Kloset snapshot, refer to
      <a class="Xr" href="../plakar-archive/" aria-label="plakar-archive,
      section 1">plakar-archive(1)</a>.</dd>
  <dt id="backup"><a class="permalink" href="#backup"><code class="Cm">backup</code></a></dt>
  <dd>Create a new Kloset snapshot, refer to
      <a class="Xr" href="../plakar-backup/" aria-label="plakar-backup, section
      1">plakar-backup(1)</a>.</dd>
  <dt id="cat"><a class="permalink" href="#cat"><code class="Cm">cat</code></a></dt>
  <dd>Display file contents from a Kloset snapshot, refer to
      <a class="Xr" href="../plakar-cat/" aria-label="plakar-cat, section
      1">plakar-cat(1)</a>.</dd>
  <dt id="diff"><a class="permalink" href="#diff"><code class="Cm">diff</code></a></dt>
  <dd>Show differences between files in a Kloset snapshot, refer to
      <a class="Xr" href="../plakar-diff/" aria-label="plakar-diff, section
      1">plakar-diff(1)</a>.</dd>
  <dt id="digest"><a class="permalink" href="#digest"><code class="Cm">digest</code></a></dt>
  <dd>Compute digests for files in a Kloset snapshot, refer to
      <a class="Xr" href="../plakar-digest/" aria-label="plakar-digest, section
      1">plakar-digest(1)</a>.</dd>
  <dt id="dup"><a class="permalink" href="#dup"><code class="Cm">dup</code></a></dt>
  <dd>Duplicate an existing snapshot with a different ID, refer to
      <a class="Xr" href="../plakar-dup/" aria-label="plakar-dup, section
      1">plakar-dup(1)</a>.</dd>
  <dt id="locate"><a class="permalink" href="#locate"><code class="Cm">locate</code></a></dt>
  <dd>Find filenames in a Kloset snapshot, refer to
      <a class="Xr" href="../plakar-locate/" aria-label="plakar-locate, section
      1">plakar-locate(1)</a>.</dd>
  <dt id="ls"><a class="permalink" href="#ls"><code class="Cm">ls</code></a></dt>
  <dd>List snapshots and their contents in a Kloset store, refer to
      <a class="Xr" href="../plakar-ls/" aria-label="plakar-ls, section
      1">plakar-ls(1)</a>.</dd>
  <dt id="mount"><a class="permalink" href="#mount"><code class="Cm">mount</code></a></dt>
  <dd>Mount Kloset snapshots as a read-only filesystem, refer to
      <a class="Xr" href="../plakar-mount/" aria-label="plakar-mount, section
      1">plakar-mount(1)</a>.</dd>
  <dt id="restore"><a class="permalink" href="#restore"><code class="Cm">restore</code></a></dt>
  <dd>Restore files from a Kloset snapshot, refer to
      <a class="Xr" href="../plakar-restore/" aria-label="plakar-restore,
      section 1">plakar-restore(1)</a>.</dd>
  <dt id="rm"><a class="permalink" href="#rm"><code class="Cm">rm</code></a></dt>
  <dd>Remove snapshots from a Kloset store, refer to
      <a class="Xr" href="../plakar-rm/" aria-label="plakar-rm, section
      1">plakar-rm(1)</a>.</dd>
</dl>
</section>
<section class="Ss">
<h3 class="Ss" id="Plugin_handling"><a class="permalink" href="#Plugin_handling">Plugin
  handling</a></h3>
<dl class="Bl-tag">
  <dt id="pkg"><a class="permalink" href="#pkg"><code class="Cm">pkg
    add</code></a></dt>
  <dd>Install a plugin, refer to
      <a class="Xr" href="../plakar-pkg-add/" aria-label="plakar-pkg-add,
      section 1">plakar-pkg-add(1)</a>.</dd>
  <dt id="pkg~2"><a class="permalink" href="#pkg~2"><code class="Cm">pkg
    build</code></a></dt>
  <dd>Build a plugin from source, refer to
      <a class="Xr" href="../plakar-pkg-build/" aria-label="plakar-pkg-build,
      section 1">plakar-pkg-build(1)</a>.</dd>
  <dt id="pkg~3"><a class="permalink" href="#pkg~3"><code class="Cm">pkg
    create</code></a></dt>
  <dd>Package a plugin, refer to
      <a class="Xr" href="../plakar-pkg-create/" aria-label="plakar-pkg-create,
      section 1">plakar-pkg-create(1)</a>.</dd>
  <dt id="pkg~4"><a class="permalink" href="#pkg~4"><code class="Cm">pkg
    rm</code></a></dt>
  <dd>Uninstall a plugin, refer to
      <a class="Xr" href="../plakar-pkg-rm/" aria-label="plakar-pkg-rm, section
      1">plakar-pkg-rm(1)</a>.</dd>
  <dt id="pkg~5"><a class="permalink" href="#pkg~5"><code class="Cm">pkg
    show</code></a></dt>
  <dd>List installed plugins, refer to
      <a class="Xr" href="../plakar-pkg-show/" aria-label="plakar-pkg-show,
      section 1">plakar-pkg-show(1)</a>.</dd>
</dl>
</section>
</section>
<section class="Sh">
<h2 class="Sh" id="ENVIRONMENT"><a class="permalink" href="#ENVIRONMENT">ENVIRONMENT</a></h2>
<dl class="Bl-tag">
  <dt id="PLAKAR_PASSPHRASE"><a class="permalink" href="#PLAKAR_PASSPHRASE"><code class="Ev">PLAKAR_PASSPHRASE</code></a></dt>
  <dd>Passphrase to unlock the Kloset store; overrides the one from the
      configuration. If set, <code class="Nm">plakar</code> won't prompt to
      unlock. The option <code class="Cm">keyfile</code> overrides this
      environment variable.</dd>
  <dt id="PLAKAR_REPOSITORY"><a class="permalink" href="#PLAKAR_REPOSITORY"><code class="Ev">PLAKAR_REPOSITORY</code></a></dt>
  <dd>Reference to the Kloset store.</dd>
  <dt id="PLAKAR_TOKEN"><a class="permalink" href="#PLAKAR_TOKEN"><code class="Ev">PLAKAR_TOKEN</code></a></dt>
  <dd>Token to authenticate for Plakar services.</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="FILES"><a class="permalink" href="#FILES">FILES</a></h2>
<dl class="Bl-tag">
  <dt><span class="Pa">~/.cache/plakar</span></dt>
  <dd>Plakar cache directories.</dd>
  <dt><span class="Pa">~/.config/plakar/destinations.yml</span></dt>
  <dd>Restore destinations configuration.</dd>
  <dt><span class="Pa">~/.config/plakar/sources.yml</span></dt>
  <dd>Backup sources configuration.</dd>
  <dt><span class="Pa">~/.config/plakar/stores.yml</span></dt>
  <dd>Kloset stores configuration.</dd>
  <dt><span class="Pa">~/.plakar</span></dt>
  <dd>Default Kloset store location.</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="EXIT_STATUS"><a class="permalink" href="#EXIT_STATUS">EXIT
  STATUS</a></h2>
<p class="Pp">The following exit codes are aligned with
    <a class="Xr" href="../sysexits/" aria-label="sysexits, section
    3">sysexits(3)</a> where applicable:</p>
<dl class="Bl-tag">
  <dt>0</dt>
  <dd>Command completed successfully.</dd>
  <dt>1</dt>
  <dd>A general error occurred.</dd>
  <dt>64 (EX_USAGE)</dt>
  <dd>Invalid command-line arguments or flags.</dd>
  <dt>65 (EX_DATAERR)</dt>
  <dd>Data integrity check failed (corrupted chunks, verification
    mismatch).</dd>
  <dt>66 (EX_NOINPUT)</dt>
  <dd>The repository could not be opened or located.</dd>
  <dt>77 (EX_NOPERM)</dt>
  <dd>Authentication or decryption failure (wrong passphrase, missing
    keyfile).</dd>
  <dt>78 (EX_CONFIG)</dt>
  <dd>Incompatible repository version.</dd>
</dl>
</section>
<section class="Sh">
<h2 class="Sh" id="EXAMPLES"><a class="permalink" href="#EXAMPLES">EXAMPLES</a></h2>
<p class="Pp">Create an encrypted Kloset store at the default location:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar create</pre>
</div>
<p class="Pp">Create an encrypted Kloset store on AWS S3:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar store add mys3bucket \
    location=s3://s3.eu-west-3.amazonaws.com/backups \
    access_key=&quot;access_key&quot; \
    secret_access_key=&quot;secret_key&quot;
$ plakar at @mys3bucket create</pre>
</div>
<p class="Pp">Create a snapshot of the current directory on the @mys3bucket
    Kloset store:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar at @mys3bucket backup</pre>
</div>
<p class="Pp">List the snapshots of the default Kloset store:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar ls</pre>
</div>
<p class="Pp">Restore the file &#x201C;notes.md&#x201D; in the current directory
    from the snapshot with id &#x201C;abcd&#x201D;:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar restore -to . abcd:notes.md</pre>
</div>
<p class="Pp">Remove snapshots older than 30 days:</p>
<div class="Bd Pp Bd-indent Li">
<pre>$ plakar rm -before 30d</pre>
</div>
</section>
</main>
<div class="foot" role="doc-pagefooter" aria-label="Manual footer
  line"><span class="foot-left">Plakar</span> <span class="foot-date">May 5,
  2026</span> <span class="foot-right">PLAKAR(1)</span></div>
