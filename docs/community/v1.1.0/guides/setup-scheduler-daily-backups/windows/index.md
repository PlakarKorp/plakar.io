
# Windows: Task Scheduler

This guide assumes you've already completed the [prerequisites](../): a
configured store with a non-interactive passphrase, and the `plakar` command you
want to schedule.

## Task Scheduler

Schedule the backup command with Task Scheduler. The quickest way is from an
elevated Command Prompt or PowerShell:

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

## Power saving and battery (laptops)

On a laptop you usually don't want a backup to fire while you're on battery.
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

