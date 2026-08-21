
# Linux: cron and systemd timers

This guide assumes you've already completed the [prerequisites](../): a
configured store with a non-interactive passphrase, and the `plakar` command you
want to schedule.

## cron

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
off. If that matters, which is often the case, use a systemd timer instead,
which catches up on missed runs.

## systemd timers

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

## Power saving and battery (laptops)

On a laptop you usually don't want a backup to fire while you're on battery.
With systemd, add `ConditionACPower=true` to the `[Unit]` section of
`plakar-backup.service`. When you're on battery at the scheduled time, that run
is skipped.

A plain cron job has no equivalent built-in condition, so use a systemd timer
instead if this matters for your setup.

