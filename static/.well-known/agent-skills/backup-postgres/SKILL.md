# Backup PostgreSQL with Plakar

Take a consistent, encrypted, deduplicated backup of a PostgreSQL database
into a Plakar Kloset.

## Requirements

- Plakar CLI installed (see the `install-plakar` skill)
- A reachable PostgreSQL instance and credentials with `pg_dump` privileges
- A Kloset repository (local path, S3 bucket, or Vault Provider URL)

## Steps

1. Configure the PostgreSQL source connector:
   ```sh
   plakar source add postgres-prod \
     --type postgres \
     --dsn "postgres://backup_user:****@db.internal:5432/app"
   ```
2. Run the backup. Plakar will stream a logical dump through Kloset's
   dedup + encrypt pipeline before persisting:
   ```sh
   plakar at s3://plakar-backups/prod backup source://postgres-prod
   ```
3. Verify the snapshot's cryptographic integrity proof:
   ```sh
   plakar at s3://plakar-backups/prod check --latest
   ```
4. (Recommended) Schedule with cron or systemd for hourly backups.

## Validate

`plakar at s3://plakar-backups/prod ls` shows the new snapshot, and
`check --latest` reports `Integrity verified`.

## References

- Postgres how-to: https://www.plakar.io/posts/2026-04-03/backing-up-postgresql-with-plakar/
- Integrations catalog: https://www.plakar.io/integrations/
