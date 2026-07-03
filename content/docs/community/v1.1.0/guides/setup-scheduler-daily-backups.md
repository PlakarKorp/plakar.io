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

## cron (Linux and macOS)

Open your crontab:

```bash
$ crontab -e
```

Add a line to run the backup every day at 02:00, sending all output to a log
file:

```cron
0 2 * * * /usr/local/bin/plakar at "@mybackups" backup -check /var/www >> /var/log/plakar-backup.log 2>&1
```

A plain cron job does **not** run a backup that was missed while the machine was
off. If that matters, which is often the case, use a `systemd timer` (Linux) or
`launchd` (macOS), both of which catch up on missed runs.

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
ExecStart=/usr/local/bin/plakar at @mybackups backup -check /var/www
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
scheduled time was missed while it was off. Adjust `OnCalendar` to taste
(`daily`, `hourly`, `*-*-* 02,14:00:00`, and so on).

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

## launchd (macOS)

macOS uses launchd for scheduled jobs. Create the launchd agent at
`~/Library/LaunchAgents/io.plakar.backup.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>io.plakar.backup</string>

  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/plakar</string>
    <string>at</string>
    <string>@mybackups</string>
    <string>backup</string>
    <string>-check</string>
    <string>/Users/me/Documents</string>
  </array>

  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key><integer>2</integer>
    <key>Minute</key><integer>0</integer>
  </dict>

  <key>StandardOutPath</key>
  <string>/Users/me/Library/Logs/plakar-backup.log</string>
  <key>StandardErrorPath</key>
  <string>/Users/me/Library/Logs/plakar-backup.log</string>
</dict>
</plist>
```

If the Mac is asleep at the scheduled time, launchd runs the job once when it
next wakes, so missed runs are picked up automatically.

Load the agent so it becomes active:

```sh
$ launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/io.plakar.backup.plist
```

Trigger a run immediately to test it, and read the log:

```sh
$ launchctl kickstart -k gui/$(id -u)/io.plakar.backup
$ tail -f ~/Library/Logs/plakar-backup.log
```

## Windows Task Scheduler

On Windows, schedule the same command with Task Scheduler. The quickest way is
from an elevated Command Prompt or PowerShell:

```bat
schtasks /Create ^
  /TN "Plakar Daily Backup" ^
  /SC DAILY ^
  /ST 02:00 ^
  /TR "\"C:\Program Files\Plakar\plakar.exe\" at @mybackups backup -check \"C:\Data\"" ^
  /RU "DOMAIN\user" ^
  /RP * ^
  /RL HIGHEST
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
"C:\Program Files\Plakar\plakar.exe" at @mybackups backup -check C:\Data >> "C:\Logs\plakar-backup.log" 2>&1
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

## Power saving and battery (laptops)

On a laptop you usually don't want a backup to fire while you're on battery.
Each OS can skip runs unless the machine is on AC power.

### Linux

On Linux with systemd add `ConditionACPower=true` to the `[Unit]` section of
`plakar-backup.service`. When you're on battery at the scheduled time, that run
is skipped.

### macOS

launchd has no built-in AC-power condition, so run the backup through a small
wrapper script that checks the power state first. Create
`~/bin/plakar-backup.sh` and make it executable with
`chmod +x ~/bin/plakar-backup.sh`:

```bash
#!/bin/sh
set -eu

# Optional pause switch: `touch ~/.plakar-pause` to pause, `rm` to resume.
[ -f "$HOME/.plakar-pause" ] && exit 0

# Skip the run when not on AC power.
pmset -g ps | grep -q "AC Power" || exit 0

exec /usr/local/bin/plakar at "@mybackups" backup -check "$HOME/Documents"
```

Then point the agent at the wrapper instead of at `plakar` directly by replacing
the `ProgramArguments` block in `io.plakar.backup.plist`:

```xml
<key>ProgramArguments</key>
<array>
  <string>/Users/me/bin/plakar-backup.sh</string>
</array>
```

Reload the agent to apply the change:

```bash
$ launchctl bootout   gui/$(id -u)/io.plakar.backup
$ launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/io.plakar.backup.plist
```

### Windows

Windows Task Scheduler has native power conditions. Open the task, and on the
**Conditions** tab:

- Enable Start the task only if the computer is on AC power.
- Enable Stop if the computer switches to battery power.

On the Settings tab, enable **Run task as soon as possible after a scheduled
start is missed** so a run skipped while the machine was off (or on battery) is
caught up.

These conditions can't be set through `schtasks` flags. To script it, export the
task to XML, set the fields below, and re-import with `schtasks /Create /XML`:

```xml
<Settings>
  <DisallowStartIfOnBatteries>true</DisallowStartIfOnBatteries>
  <StopIfGoingOnBatteries>true</StopIfGoingOnBatteries>
  <StartWhenAvailable>true</StartWhenAvailable>
</Settings>
```
