---
title: SFTP
subtitle: Securely back up remote servers over SFTP with Plakar
description: Backup your remote directories over the secure SFTP protocol.
categories:
- storage connector
stage: beta
tags:
- SFTP
- Linux
- BSD
- NAS
- Synology
- Qnap
date: 2025-05-13
---

# SFTP Integration

## Overview

SFTP is the protocol for secure file transfer over SSH. The SFTP integration in Plakar allows you to back up servers, NAS devices, and other remote systems securely. If you can SSH into a machine, you can use Plakar to back it up securely.

## Configuration

The SFTP integration does not require any special configuration and you can use it directly with the `plakar` command. However, setting up a remote can make things more convenient.

### Setting Up a Remote

You can configure a remote called `mysftp` to connect to your SFTP server:

```bash
$ plakar config remote create mysftp
$ plakar config remote set mysftp location s3://<IP_address_or_hostname>/<path>
```

To refer to this remote in Plakar commands, use the syntax `@mysftp`, for example `plakar backup @mysftp`.

#### Remote Configuration Options

- **`location`**: SFTP URL. Format: `s3://<endpoint>/<optional_path>`. To specify the username, port or identity file path, use the SSH configuration file `~/.ssh/config`.
- `insecure_ignore_host_key`: Ignore host key verification (default: false).
- `identity_file`: Path to the SSH identity file. By default, Plakar reads the file `~/.ssh/config` for the identity file. If not present, it falls back to the default SSH identity files `~/.ssh/id_rsa`, `~/.ssh/id_ed25519`, `~/.ssh/id_ecdsa` and `~/.ssh/id_dsa`.


## Example Usage

Let's assume we have a remote server with the IP address `1.2.3.4` and we want to back up the `/etc` directory from that server.

First, create the SSH configuration file `~/.ssh/config` with the following content:

```
Host myserver
  HostName 1.2.3.4
  User root
  Port 22
  IdentityFile ~/.ssh/id_rsa
```

Ensure your public key is added to the remote server's `~/.ssh/authorized_keys` file for the user you specified, and make sure you can connect to the server using SSH:

```bash
ssh myserver
```

Now create a Kloset repository at `/var/backups` and back up the `/etc` directory from the remote server:

```bash
$ plakar at /var/backups create
$ plakar at /var/backups backup sftp://myserver/etc
```

You can use the remote configuration for convenience:

```bash
$ plakar config remote create mysftp
$ plakar config remote set mysftp location s3://myserver

$ plakar at /var/backups create
$ plakar at /var/backups backup @mysftp
```

To restore data from the same Kloset repository to the SFTP server, use the following commands:

```bash
# List available backups
$ plakar at /var/backups ls

# Restore a specific file using the simple syntax
$ plakar at /var/backups restore -to sftp://myserver/tmp fc1b1e94:path/to/file.docx
# Restore the full backup using the simple syntax
$ plakar at /var/backups restore -to sftp://myserver/tmp fc1b1e94

# Restore a specific file using the remote syntax
$ plakar at /var/backups restore -to @mysftp fc1b1e94:path/to/file.docx
# Restore the full backup using the remote syntax
$ plakar at /var/backups restore -to @mysftp fc1b1e94
```

See the [QuickStart guide](https://docs.plakar.io/en/quickstart/index.html) for more examples.

## Questions, Feedback, and Support

Found a bug? [Open an issue on GitHub](https://github.com/PlakarKorp/plakar/issues/new?title=Bug%20report%20on%20SFTP%20integration&body=Please%20provide%20a%20detailed%20description%20of%20the%20issue.%0A%0A**Plakar%20version**)

Join our [Discord community](https://discord.gg/uuegtnF2Q5) for real-time help and discussions.

## Q&A

**How can I configure the username, port or identity file for my SFTP server?**

You can set these options in the SSH configuration file `~/.ssh/config`. For example:

```
Host myserver
  HostName example.com
  User myuser
  Port 2222
  IdentityFile ~/.ssh/my_id_rsa
```

**How can I prevent Plakar from prompting for my SSH passphrase?**

If your SSH key is protected by a passphrase, Plakar will prompt you for it. Currently, there is no way to bypass this prompt.

As an alternative, configure a passphrase-less SSH key for the user you are using to connect to the remote server.
