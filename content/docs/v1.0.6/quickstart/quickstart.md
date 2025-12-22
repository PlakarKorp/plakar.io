---
title: "Quickstart"
date: "2025-12-15T00:00:00Z"
weight: 2
summary: "Get started with plakar: create your first backup, verify integrity, restore, and use the UI."
---

In this guide, we will walk you through the basic steps to create your first backup using **plakar**.

## Requirements

Make sure **plakar** is installed on your system. If you haven't done this yet, please refer to the [Installation guide](./installation.md) for detailed instructions.

## Create a Kloset Store

Before we can back up any data, we need to define where the backup will go. In **plakar** terms, this storage location is called a **Kloset Store**. You can find out more about the concept and rationale behind Kloset in [this post on our blog](https://www.plakar.io/posts/2025-04-29/kloset-the-immutable-data-store/).

For our first backup, we will create a local Kloset Store on the filesystem of the host OS. In a real backup scenario you would want to store backups on a different physical device, so substitute in a better location if you have one.

In the CLI, enter the following command:
```bash
plakar at $HOME/backups create
```

**plakar** will then ask you to enter a passphrase, and repeat it to confirm.

{{% notice style="warning" title="Your passphrase is important!" expanded="true" %}}

Be extra careful when choosing the passphrase:
People with access to the Kloset Store and knowledge of the passphrase can read your backups.

By default **plakar** will enforce rules on your choice of passphrase to make sure it is complex enough to be secure. To add complexity, use a mixture of upper and lower case characters, numbers and symbols.

**DO NOT LOSE OR FORGET THE PASSPHRASE:**
it is not stored anywhere and **cannot** be recovered in case of loss. A lost passphrase means the data within the repository can no longer be accessed or recovered.
{{% /notice %}}

## Create your first backup

Now that we have created the Kloset Store where data will be stored, we can use it to create our first backup. **plakar** uses the 'at' keyword to specify the Kloset Store to use.

To create a simple example backup, try running:
```bash
plakar at $HOME/backups backup /private/etc
```
**plakar** will process the files it finds at that location and pass them to the Kloset where they will be chunked and encrypted.

The output will indicate the progress:
```bash
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

The output lists the short form of the snapshot ID. This is used to identify a particular snapshot and is also how you identify the snapshot to use for various **plakar** commands.

{{% notice style="info" title="Command help" expanded="true" %}}
Learning new tools can be confusing. To make things easier, **plakar** includes built-in help for all commands. Just use `plakar help` and then the command you need help with for a full list of options and examples. For example, if you forget what the options are for restoring files from a snapshot: `plakar help restore`
{{% /notice %}}

## List snapshots

You can verify that the backup exists with the `ls` command, returns the backups in that Kloset Store:
```bash
$ plakar at $HOME/backups ls
2025-09-02T15:38:16Z   9abc3294    3.1 MB      0s   /private/etc
```

The output lists the date of the last backup, the short UUID, the size of files backed-up, the time it took to create the backup and the source path of the backup.

## Verify integrity

It's always a good idea to verify the integrity of your backups. You can do this with the `check` command. This will read back the data from the Kloset Store, decrypt it and verify its integrity by recomputing checksums.

```bash
$ plakar at $HOME/backups check 9abc3294
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

In production, you would typically run this command periodically to ensure the integrity of your backups over time. This is necessary to ensure that data has not degraded or become corrupted while stored.

## Restore files from a backup

You can restore files from a backup using the `restore` command. In this case, we are restoring the snapshot we just created to a temporary storage.

```bash
$ plakar at $HOME/backups restore -to /tmp/restore 9abc3294
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

To verify the files have been re-created, list the directory they were restored to. Note that the properties of the restored files, such as timestamps and permissions, will match the original files:

```bash
$ ls -l /tmp/restore
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

## Access the UI

Plakar provides a web interface to view the backups and their content. To start the web interface, run:

```bash
plakar at $HOME/backups ui
```

Your default browser will open a new tab. You can navigate through the snapshots, search and view the files, and download them.

![Web UI, light mode](../images/ui-light.png)
![Web UI, dark mode](../images/ui-dark.png)

A public instance of the web UI is also available at [https://demo.plakar.io](https://demo.plakar.io). You can use it to explore the features of the UI on real backups without installing anything.

## Congratulations!

You have successfully:

 - created a backup
 - verified it
 - restored files
 - used the graphical UI

How long did it take? This is how easy **plakar** is for simple, secure backups.

## Next steps

Having a backup on the filesystem is a start, but to improve the durability of your backups, you should consider hosting multiple copies in different locations.

Continue to the [Part 2 of the Quickstart](./quickstart-2.md) to create multiple copies of your backups.