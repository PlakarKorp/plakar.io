
# Logging In to Plakar

Plakar works without an account by default. Logging in is optional but it
unlocks additional features such as installing pre-built packages hosted on
Plakar's servers (so you don't have to build them from source) and alerting
service which can notify you by email on important issues like when a backup
fail.

## Logging In

Logging in starts a sign-in on Plakar's servers that you complete in a browser,
either with GitHub or through a link sent by email. Once the sign-in is
complete, the browser shows a completion code. `plakar login` asks for this code
and only finishes logging in once you enter it.

The code proves that the person who completed the sign-in in the browser is the
person who started it from this machine. Someone who tricks you into opening a
login link they started cannot finish their login without the code.

### Using GitHub

```bash
$ plakar login -github
```

Plakar opens the GitHub sign-in page in your browser. With `-no-spawn`, or when
no browser can be launched, it prints the URL to open instead.

### Using Email

```bash
$ plakar login -email myemail@domain.com
```

Plakar sends a login link to the address. Keep `plakar login` running while you
open the link, then enter the code it shows.

## Enabling Alerting

After logging in, enable alerting to send backup metadata to Plakar's servers
for reporting:

```bash
$ plakar service enable alerting
```

Enable email notifications:

```bash
$ plakar service set alerting report.email=true
```

Alerting sends non-sensitive metadata (backup status, timestamps, sizes) to
power the reporting dashboard and email notifications. Your backup data never
leaves your system.

## Non-Interactive Login

For CI pipelines, remote servers, or automated jobs where interactive login
isn't possible, use token-based authentication.

### Generate a Token

On a machine where you can log in interactively:

```bash
$ plakar login
$ plakar token create
```

This outputs a token:

```
eyJhbGc......
```

### Use the Token

On the non-interactive system, set the environment variable:

```bash
$ export PLAKAR_TOKEN=eyJhbGc......
```

Plakar automatically uses this token for authentication.

### Persist the Token

To save the token in the local configuration:

```bash
$ plakar login -env
```

This reads `PLAKAR_TOKEN` from the environment and stores it in Plakar's
configuration file.

## Installing Pre-Built Packages

Once logged in, you install pre-built integration packages hosted on Plakar's
servers:

```bash
$ plakar pkg add s3
$ plakar pkg add sftp
$ plakar pkg add rclone
```

Without logging in, you can still build these integrations from source.

## Verify Login Status

Check if you're logged in:

```bash
$ plakar login --status
```

This displays your login status.

