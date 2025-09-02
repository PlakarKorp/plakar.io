+++
title = "Quickstart"
date = "2025-09-02 12:00:00 +0100"
weight = 1
chapter = false
pre = "<b>1. </b>"
+++

Welcome to **plakar** - easy, secure and efficient backups for people who value their time and data. The aim of this quick guide is to get you up and running with **plakar** and create your first backup within minutes. Let's get started!


## What you will need

 - an internet connection to download the plakar packages
 - a Linux, MacOS, FreeBSD or OpenBSD machine to run the software
 - admin access to install
 - sufficient local storage to store your backups
 - a web browser (for logging in and using the UI)

## Get plakar

All the release versions of plakar are available directly from github on the project's [release page](https://github.com/PlakarKorp/plakar/releases). 

For each release, check under the 'assets' section for a list of prebuilt packages. They follow the naming convention:

`plakar_<version>_<os>_<arch>.<format>`

So, for example for a Mac running on modern Mac hardware you would fetch the file `plakar_1.0.3-rc.2_darwin_arm64.tar.gz`; for OpenSuse on Intel hardware, you would want `plakar_1.0.3_linux_amd64.rpm`.

## Install plakar

Once you have downloaded the appropriate package, installation depends on your local operating system.

### Debian-based OS

For a Debian-based OS (e.g. Ubuntu, Debian) it's easiest to download the '.deb' package from the releases page. 
>You can install the package with the `dpkg` command:
```
$ sudo dpkg -i plakar_1.0.3_linux_amd64.deb
```

>Verify the installation by running:
```
$ plakar version
```

This should return the expected version number, for example 'v1.0.3'.

### RPM-based OS

For an OS which uses RPM-based packages, download the relevant '.rpm' file from the releases page.

Then use the package manager to install the package. 
> For example, on Fedora:
```
$ sudo dnf install plakar_1.0.3_linux_amd64.rpm
```

### MacOS

The MacOS built packages use 'darwin' as the OS designation. Modern Mac processors are based
on the arm64 architecture, so you will most likely want to fetch the 
'plakar_1.0.3_linux_arm64.tar.gz' release file.
The binary file can be extracted from the archive and run.
MacOS has some built-in protection from malware. To enable the binary to be run, you will need
to explicitly allow it from the `Privacy & Security` settings.

![MacOS Privacy and Security settings](./images/macos.png)

### FreeBSD

The default package manager for FreeBSD uses simple tar files for packaging. Download the appropriate one based on the hardware architecture.

> For FreeBSD, use the 'pkg' command with root privilege to install the downloaded package: 
```
# pkg add ./plakar_1.0.3_freebsd_amd64.tar.gz
```
 
## Create a Kloset

Before we can backup any data, we need to define where the backup will go. In **plakar** terms, this storage location is called a 'Kloset'. You can find out more about the concept and rationale behind Kloset in [this post on our blog](https://www.plakar.io/posts/2025-04-29/kloset-the-immutable-data-store/).

For our first backup, we will create a local Kloset on the filesystem of the host OS. 

> In the CLI enter the following command:
```shell
$ plakar at $HOME/backups create
```

**plakar** will then ask you to enter a passphrase, and repeat it to confirm.

{{% notice style="warning" title="Your passphrase is important!" expanded="true"  %}}

Be extra careful when choosing the passphrase:
People with access to the repository and knowledge of the passphrase can read your backups.

By default **plakar** will enforce rules on your choice of passphrase to make sure it is 
complex enough to be secure. To add complexity, use a mixture of upper and lower case 
characters and symbols.

**DO NOT LOSE OR FORGET THE PASSPHRASE:**
it is not stored anywhere and **can not** be recovered in case of loss.
A lost passphrase means the data within the repository can no longer be accessed 
or recovered.
{{% /notice %}}

## Create your first backup

Now we have created the Kloset where data will be stored we can use it to create our first backup. **plakar** uses the 'at' keyword to specify where a command is to take place. 
> To create a simple example backup, try running:
```
plakar at $HOME/backups backup /private/etc
```
**plakar** will process the files it finds at that location and pass them to the Kloset where they will be chunked and encrypted. 
>The output will indicate the progress:
```
9abc3294: OK ✓ /private/etc/ftpusers
9abc3294: OK ✓ /private/etc/asl/com.apple.iokit.power
9abc3294: OK ✓ /private/etc/pam.d/screensaver_new_ctk
[...]
9abc3294: OK ✓ /private/etc/apache2
9abc3294: OK ✓ /private/etc
9abc3294: OK ✓ /private
9abc3294: OK ✓ /
backup: created unsigned snapshot 9abc3294 of size 3.1 MB in 72.55875ms
```
>The output lists the short form of the snapshot's id number. This is used to identify a particular snapshot and is also how you identify the snapshot to use for various **plakar** commands.

{{% notice style="info" title="Command help" expanded="true" %}}
Learning new tools can be confusing. To make things easier, **plakar** includes built-in help for all commands. Just add '-h' after the command for specific help. For example, if you forget what the options are for restoring files from a snapshot: `plakar at $HOME/backups restore -h`

{{% /notice %}}

> You can verify that the backup exists:

```bash
$ plakar at $HOME/backups ls
```

>...will return the known backups in that Kloset:
```
2025-09-02T15:38:16Z   9abc3294    3.1 MB      0s   /private/etc
```


> Verify the integrity of the contents:

```bash
$ plakar at $HOME/backups check 9abc3294
```
```
9abc3294: ✓ /private/etc/afpovertcp.cfg
9abc3294: ✓ /private/etc/apache2/extra/httpd-autoindex.conf
9abc3294: ✓ /private/etc/apache2/extra/httpd-dav.conf
[...]
9abc3294: ✓ /private/etc/xtab
9abc3294: ✓ /private/etc/zshrc
9abc3294: ✓ /private/etc/zshrc_Apple_Terminal
9abc3294: ✓ /private/etc
check: verification of 9abc3294:/private/etc completed successfully
```

> And restore it to a local directory:

```bash
$ plakar at $HOME/backups restore -to /tmp/restore 9abc3294
```

```
9abc3294: OK ✓ /private/etc/afpovertcp.cfg
9abc3294: OK ✓ /private/etc/apache2/extra/httpd-autoindex.conf
9abc3294: OK ✓ /private/etc/apache2/extra/httpd-dav.conf
[...]
9abc3294: OK ✓ /private/etc/xtab
9abc3294: OK ✓ /private/etc/zprofile
9abc3294: OK ✓ /private/etc/zshrc
9abc3294: OK ✓ /private/etc/zshrc_Apple_Terminal
restore: restoration of 9abc3294:/private/etc at /tmp/restore completed successfully
```

```
$ ls -l /tmp/restore
```

```
total 1784
-rw-r--r--@  1 gilles  wheel     515 Feb 19 22:47 afpovertcp.cfg
drwxr-xr-x@  9 gilles  wheel     288 Feb 19 22:47 apache2
drwxr-xr-x@ 16 gilles  wheel     512 Feb 19 22:47 asl
[...]
-rw-r--r--@  1 gilles  wheel       0 Feb 19 22:47 xtab
-r--r--r--@  1 gilles  wheel     255 Feb 19 22:47 zprofile
-r--r--r--@  1 gilles  wheel    3094 Feb 19 22:47 zshrc
-rw-r--r--@  1 gilles  wheel    9335 Feb 19 22:47 zshrc_Apple_Terminal
```

## Login

By default, **plakar** works without requiring you to create an account or log in. You can back up and restore your data with just a few commands, no external services involved.

However, logging in unlocks optional features that improve usability and monitoring, most importantly by adding the ability to install additional integrations. In plakar, an integration is a package which supports an additional protocol as a source, destination or storage method (or all three), such as ftp, Google Cloud Storage or an s3 bucket.

Logging in is simple and needs only an email address or github account for authentication.

> To log in using the CLI:
```
plakar login
```

## Access the UI

> Plakar provides a web interface to view the backups and their content. To start the web interface, run:

```bash
$ plakar at $HOME/backups ui
```

Your default browser will open a new tab. You can navigate through the snapshots, view the files, and restore them.

![Web UI, light mode](./images/ui-light.png)
![Web UI, dark mode](./images/ui-dark.png)

## Congratulations!

You have successfully:
 
 - installed **plakar**
 - created a backup
 - verified it
 - restored files
 - used the graphical UI

How long did it take? That's how easy **plakar** is for simple, secure backups.   

## Next steps

there is plenty more to discover about **plakar**. Here are our suggestions on what to try next

 - Enable integrations and backup more things to and from more places
 - Reduce the risk of data loss by creating multiple copies of your backups across different locations.
 -
 -
 
