---
title: "Importing Configurations"
linkTitle: "Importing Configurations"
weight: 10
description: >
  Learn how to import configurations for stores, sources, and destinations in Plakar using the import command.
---

## Overview

Plakar allows you to import configurations for stores, sources, and destinations from various sources including files, piped input, and external tools like rclone. This guide explains how to use the `import` subcommand for `plakar store`, `plakar source`, and `plakar destination`.

## Basic Usage

The import command can read configuration data from:
- Standard input (stdin) - useful for piping from other commands
- A file specified with the `-config` option
- URLs (when using `-config` with a URL)

### Importing from a Configuration File

Use the `-config` option to specify a configuration file to import. Create a YAML file with the appropriate structure for the type of configuration you're importing.

For example, to import store configurations, create a file like `my-stores.yaml`:

```yaml
minio:
    access_key: minioadmin
    location: s3://localhost:9000/kloset
    passphrase: superpassphrase
    secret_access_key: minioadmin
    use_tls: "false"
```

Then import it with:

```bash
plakar store import -config my-stores.yaml
```

Similarly for sources and destinations:

```bash
plakar source import -config my-sources.yaml
plakar destination import -config my-destinations.yaml
```

The configuration files should be in YAML format with named sections for each configuration entry.

### Importing from Piped Input

You can pipe configuration data directly from other commands:

```bash
# Import a specific source configuration as a destination
plakar source show | plakar destination import mybucket

# Import all sources as destinations
plakar source show | plakar destination import

# Import from rclone configuration
rclone config show | plakar store import -rclone koofr
```

## Command Options

### -config <location>

Specifies the file or URL to read configuration from. Without this option, the command reads from stdin.

**Examples:**
```bash
# Import from a local file
plakar store import -config /path/to/stores.yaml

# Import from a URL
plakar store import -config https://example.com/config.yaml
```

### -overwrite

Overwrites existing configuration sections with the same names. Without this option, importing will fail if a section with the same name already exists.

**Example:**
```bash
plakar store import -config new-stores.yaml -overwrite
```

### -rclone

Treats the input as an rclone configuration file. This allows you to import rclone remotes as Plakar stores.

**Example:**
```bash
rclone config show | plakar store import -rclone myremote
```

When using `-rclone`, you can specify which rclone remote to import by providing its name as an additional argument.

### Section Selection

You can specify which sections to import by listing their names. Sections can be renamed during import by appending `:newname`.

**Examples:**
```bash
# Import only specific sections
plakar store import -config stores.yaml section1 section2

# Import and rename sections
plakar store import -config stores.yaml oldname:newname
```

## Configuration File Format

Configuration files should be in YAML format. Each top-level key represents a named configuration section.

### Store Configuration Example

```yaml
mystorage:
  location: s3://mybucket
  access_key: myaccesskey
  secret_access_key: mysecretkey

localbackup:
  location: /var/backups
```

### Source Configuration Example

```yaml
myapp:
  location: /var/www/myapp
  excludes: "*.log,*.tmp"

database:
  location: postgresql://user:pass@localhost/mydb
```

### Destination Configuration Example

```yaml
restorepoint:
  location: /mnt/restore
  permissions: 0755

cloudrestore:
  location: s3://restore-bucket
  access_key: restorekey
  secret_access_key: restoresecret
```

## Practical Examples

### Migrating from rclone

If you have rclone configurations, you can easily import them as Plakar stores:

```bash
# Show available rclone remotes
rclone config show

# Import a specific rclone remote as a Plakar store
rclone config show | plakar store import -rclone myremote
```

### Bulk Configuration Management

You can export and import configurations between different Plakar installations:

```bash
# Export current store configurations
plakar store show > stores-backup.yaml

# Import on another machine
plakar store import -config stores-backup.yaml
```

### Converting Sources to Destinations

A common use case is to use the same locations for both backup sources and restore destinations:

```bash
# Import all sources as destinations
plakar source show | plakar destination import

# Import a specific source as a destination with a new name
plakar source show | plakar destination import mysource:myrestore
```

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure you have read access to the configuration file and write access to Plakar's configuration directory.

2. **Invalid YAML**: Validate your YAML syntax before importing. Use tools like `yamllint` or online validators.

3. **Name Conflicts**: Use `-overwrite` to replace existing configurations, or rename sections during import.

4. **rclone Import Issues**: Ensure rclone is installed and the specified remote exists in your rclone configuration.

### Verification

After importing, verify the configuration was imported correctly:

```bash
plakar store show
plakar source show
plakar destination show
```

Use the `check` subcommand to validate configurations:

```bash
plakar store check mystore
plakar source check mysource
plakar destination check mydest
```

## Related Commands

- [`plakar store`](../commands/plakar-store/) - Manage store configurations
- [`plakar source`](../commands/plakar-source/) - Manage source configurations
- [`plakar destination`](../commands/plakar-destination/) - Manage destination configurations
- [`plakar store show`](../commands/plakar-store/) - Display current store configurations
- [`plakar source show`](../commands/plakar-source/) - Display current source configurations