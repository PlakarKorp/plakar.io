

# Scheduling Backups

Backups only protect you if they run regularly. Without automation, it's easy to
forget to run one, and the backup you didn't run is the one you'll wish you had
when something goes wrong. The fix is to run `plakar backup` automatically on a
schedule.

We can schedule backups using operating system tools such as:

- **cron**: available on virtually every Linux and macOS system.
- **systemd** timers: the recommended option on modern Linux distributions.
- **launchd**: the native scheduler on macOS.
- **Windows Task Scheduler**: the native scheduler on Windows.

Using the OS scheduler means your backups appear alongside every other scheduled
job on the machine, with the logging, monitoring, and failure handling your
platform already provides.

## Prerequisites

### Configure a store

Create a configuration entry for your Kloset store, then create the store
itself:

```bash
$ plakar store add mybackups /var/backups passphrase=mysuperpassphrase
$ plakar at "@mybackups" create
```

### Make the passphrase available without a prompt

This is the most important step. A scheduled job runs without a terminal, so if
Plakar has to prompt for the store passphrase the job will simply fail. You must
supply the passphrase non-interactively. Pick one of the following:

- **Store it in the configuration** (simplest). The
  `passphrase=mysuperpassphrase` option above writes the passphrase into
  `stores.yml`. Plakar reads it automatically, so the scheduled command needs
  nothing extra.
- **Retrieve it with a command** (recommended for production). Set
  `passphrase_cmd` instead of `passphrase`, pointing at a command that prints
  the passphrase, so the secret can come from a keychain or a secrets manager
  rather than a file:

  ```bash
  $ plakar store add mybackups /var/backups passphrase_cmd="gopass show mystore/passphrase"
  ```

- **Use a key file.** Pass `-keyfile /path/to/key` as a flag . Plakar reads the
  passphrase from that file. This flag overrides `PLAKAR_PASSPHRASE` if both are
  set.
- **Use an environment variable.** Export `PLAKAR_PASSPHRASE` in the job's
  environment.

### The command to schedule

Every scheduler below runs the same command. Back up a path into the store and
verify the result:

```bash
$ plakar at "@mybackups" backup -check /var/www
```

`-check` runs a full integrity check after the backup is completed.

> [!NOTE]
>
> Use the absolute path to the `plakar` binary. Schedulers run with a minimal
> `PATH`, so a bare `plakar` may not be found. Run `command -v plakar` to locate
> it (commonly `/usr/local/bin/plakar`).

## Choose your operating system

Follow the guide for the scheduler on your platform:


## Verifying your scheduled backups

After the first scheduled run, confirm snapshots are being created:

```bash
$ plakar at "@mybackups" ls
```

For monitoring and alerting, rely on the exit status: `plakar backup` returns
`0` on success and a non-zero code on failure.





## [Linux: cron and systemd timers](https://www.plakar.io/docs/community/v1.1.0/guides/setup-scheduler-daily-backups/linux/index.md)



## [macOS: launchd](https://www.plakar.io/docs/community/v1.1.0/guides/setup-scheduler-daily-backups/macos/index.md)



## [Windows: Task Scheduler](https://www.plakar.io/docs/community/v1.1.0/guides/setup-scheduler-daily-backups/windows/index.md)




