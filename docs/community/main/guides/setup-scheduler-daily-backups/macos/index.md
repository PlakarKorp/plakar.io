
# macOS: launchd

This guide assumes you've already completed the [prerequisites](../): a
configured store with a non-interactive passphrase, and the `plakar` command you
want to schedule.

## launchd

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

## Power saving and battery (laptops)

On a laptop you usually don't want a backup to fire while you're on battery.
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

