---
title: "Scheduling Backups"
date: "2026-06-26T00:00:00Z"
weight: 1
summary:
  "Automate Plakar backups with your operating system's native scheduler: cron,
  systemd timers, or Windows Task Scheduler."
aliases:
  - /docs/v1.1.0/guides/setup-scheduler-daily-backups/
---

# Scheduling Backups

Backups only protect you if they run regularly. Without automation, it's easy to
forget to run one, and the backup you didn't run is the one you'll wish you had
when something goes wrong. The fix is to run `plakar backup` automatically on a
schedule.

Plakar does not ship its own scheduler since `v1.1.0`. The right way to schedule
a backup going forward is to delegate to the scheduling to what your operating
system already provides:

- **cron**: available on virtually every Linux and macOS system.
- **systemd timers**: the recommended option on modern Linux distributions.
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

The `@mybackups` label refers to the entry you just created with
`plakar store add`. The configuration lives in `~/.config/plakar/stores.yml`.

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

- **Use a key file.** Pass `-keyfile /path/to/key` as a global flag (it must
  appear before `at`). Plakar reads the passphrase from that file. This flag
  overrides `PLAKAR_PASSPHRASE` if both are set.
- **Use an environment variable.** Export `PLAKAR_PASSPHRASE` in the job's
  environment.

### The command to schedule

Every scheduler below runs the same command. Back up a path into the store and
verify the result:

```bash
$ plakar at "@mybackups" backup /var/www -check
```

`-check` runs a full integrity check after the backup is completed.

> [!NOTE]
>
> Use the absolute path to the `plakar` binary. Schedulers run with a minimal
> `PATH`, so a bare `plakar` may not be found. Run `command -v plakar` to locate
> it (commonly `/usr/local/bin/plakar`).

## cron (Linux and macOS)

Open your crontab:

```bash
$ crontab -e
```

Add a line to run the backup every day at 02:00, sending all output to a log
file:

```cron
0 2 * * * /usr/local/bin/plakar at "@mybackups" backup /var/www -check >> /var/log/plakar-backup.log 2>&1
```

A plain cron job does **not** run a backup that was missed while the machine was
off. If that matters, use a systemd timer with `Persistent=true` instead.

## systemd timers (Linux)

systemd timers are the recommended approach on modern Linux. They keep a log in
the journal, can catch up on runs missed while the machine was off, and are
managed with the same tooling as the rest of the system.

Create a service unit that performs the backup,
`/etc/systemd/system/plakar-backup.service`:

```ini
[Unit]
Description=Plakar daily backup
Wants=network-online.target
After=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/plakar at @mybackups backup /var/www -check
# If you supply the passphrase via the environment instead of the store config:
# Environment=PLAKAR_PASSPHRASE=mysuperpassphrase
```

Then a timer unit with the same base name,
`/etc/systemd/system/plakar-backup.timer`:

```ini
[Unit]
Description=Run the Plakar daily backup

[Timer]
OnCalendar=*-*-* 02:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

`Persistent=true` runs the job as soon as the machine comes back up if a
scheduled time was missed. Adjust `OnCalendar` to taste (`daily`, `hourly`,
`*-*-* 02,14:00:00`, and so on).

Enable and start the timer:

```bash
$ sudo systemctl daemon-reload
$ sudo systemctl enable --now plakar-backup.timer
```

Inspect and verify it:

```bash
$ systemctl list-timers plakar-backup.timer   # see the next run time
$ journalctl -u plakar-backup.service         # read the backup logs
$ sudo systemctl start plakar-backup.service  # trigger a run immediately to test
```

The example above runs as root, which reads configuration from
`/root/.config/plakar`. To run as a specific user instead, add `User=` and
`Group=` to the `[Service]` section and make sure that user has its own store
configuration. Alternatively, install the units under `~/.config/systemd/user/`
and manage them with `systemctl --user`; user timers run only while that user
has an active session unless lingering is enabled
(`loginctl enable-linger <user>`).

## Windows Task Scheduler

On Windows, schedule the same command with Task Scheduler. The quickest way is
from an elevated Command Prompt or PowerShell:

```bat
schtasks /Create /TN "Plakar Daily Backup" /SC DAILY /ST 02:00 ^
  /TR "\"C:\Program Files\Plakar\plakar.exe\" at @mybackups backup C:\Data -check" ^
  /RU "DOMAIN\user" /RP * /RL HIGHEST
```

- `/SC DAILY /ST 02:00` runs it every day at 02:00.
- `/TR` is the command to run. Quote the full path to `plakar.exe`, and quote
  any backup path that contains spaces.
- `/RU` / `/RP` set the account the task runs as. Use an account that can run
  when no one is logged on, and that has access to the Plakar configuration
  (stored under `%USERPROFILE%\.config\plakar` for that account, or use a key
  file with `-keyfile`).

To capture output, wrap the command in a small batch file and run that instead:

```bat
@echo off
"C:\Program Files\Plakar\plakar.exe" at @mybackups backup C:\Data -check >> "C:\Logs\plakar-backup.log" 2>&1
```

You can also create the task through the Task Scheduler GUI (**Create Task** →
set a daily trigger → add a **Start a program** action pointing at `plakar.exe`
with the arguments above → enable **Run whether user is logged on or not**).
Review past runs under the task's **History** tab.

## Verifying your scheduled backups

After the first scheduled run, confirm snapshots are being created:

```bash
$ plakar at "@mybackups" ls
```

For monitoring and alerting, rely on the exit status: `plakar backup` returns
`0` on success and a non-zero code on failure.
