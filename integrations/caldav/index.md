
## Why protecting CalDAV matters

Calendar data has become a critical infrastructure for personal and professional life. Meetings, appointments, deadlines, and event history represent important scheduling information that organizations and individuals depend on daily.

CalDAV provides reliable synchronization across devices, but synchronization is not the same as backup. Standard CalDAV usage faces several risks:

- **Accidental Deletion**: Events can be permanently deleted across all synchronized devices instantly.
- **Limited Recovery**: Most providers offer minimal version history or trash functionality with short retention windows.
- **Calendar Corruption**: Malformed events or sync errors can corrupt entire calendars.

## Security and Compromise

CalDAV servers are accessed via account credentials and application-specific passwords. If credentials are compromised or permissions are misconfigured, your calendar data is vulnerable:

- **Mass Deletion**: Unauthorized access can delete years of event history instantly.
- **Silent Modification**: Compromised accounts can alter meeting times, locations, or attendee lists without detection.
- **Sync Propagation**: Malicious changes spread automatically to all connected devices.
- **Account Lockout**: Lost credentials or provider issues can leave you unable to access your own calendar data.

Without independent snapshots, recovering from these events requires manual reconstruction from scattered sources. Plakar solves this by creating immutable snapshots that exist outside your CalDAV infrastructure. Even if your calendar server is compromised, your backup history remains intact and independently verifiable.

## How Plakar secures your CalDAV workflows

You can use Plakar's CalDAV integration as:

- **Source Connector**: Capture complete snapshots of your calendar events and store them in a secure Kloset Store.
- **Destination Connector**: Restore calendar data as `.ics` format from a backup to your CalDAV server.

This approach provides several advantages over native calendar exports:

- **Automated Scheduling**: Run backups on schedule without manual intervention.
- **Complete Fidelity**: All event metadata, recurrence rules, attendees, and timestamps are preserved.
- **Deduplication**: All calendar data and metadata are deduplicated to minimize storage.
- **Point-in-Time Recovery**: Restore your calendar to any previous backup snapshot.
- **Cross-Provider Migration**: Move calendar data between different CalDAV providers seamlessly.

## What Plakar backs up

- **Events**: Complete event details including title, description, location, and time
- **Recurrence Rules**: Repeating event patterns and exception dates
- **Attendees**: Participant lists with email addresses and response status
- **Metadata**: Creation dates, last modified timestamps, organizer information, UIDs
- **Alarms**: Reminder and notification settings
- **Attachments**: Document and file references
- **Time Zones**: Complete timezone information for accurate scheduling across regions

## Current Limitations

The CalDAV integration is in beta and has some known limitations:

- **Bulk Operations**: All accessible calendars are backed up together; per-calendar selection is not yet supported.
- **Filtering**: Time-based or event-type filtering during backup is not yet available.
- **OAuth2 Providers**: Services requiring OAuth2 authentication (like native Google Calendar) require third-party gateway configuration.
- **Write Permissions**: Restoration requires write access to the target CalDAV server.

