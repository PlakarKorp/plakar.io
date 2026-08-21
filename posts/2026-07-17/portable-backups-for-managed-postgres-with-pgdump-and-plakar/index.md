
**TL;DR**

> Your managed provider keeps backups, but those backups live as a restore
> button inside its console, and there is no way to download one. Plakar does
> not replace pg\_dump. It wraps it, turning your dumps into encrypted,
> deduplicated snapshots that you can store externally and restore anywhere.
> This post covers the setup, the storage pricing, and a restore drill that you
> can run to test this in action.

## The problem: you cannot download your provider's backup

Usually, you would want a copy of your live Postgres database on your own
machine or on storage (like S3, R2, etc.) that you can control. You'd require
this when you want to run a migration against realistic data before it goes
anywhere near production, or you want to reproduce the bug that only shows up
with production data shapes. Also, you want to be sure that a bad afternoon at
your provider, or a billing lapse, or a decision to move to a different platform
next year, does not take your data with it.

Your provider might allow you to take backups on a schedule (or on demand) and
allow you to restore with a few clicks. While that is something that's easier to
access and restore from, note that those backups are not copies you can hold,
move, or open anywhere else. The backup does exist, but it exists inside the
platform only (kind of a lock-in).

Supabase, for example, has backups that restore to the same project, in the same
region, through Supabase's own infrastructure. Neon's history window rewinds a
branch inside Neon. Amazon RDS snapshots live in your AWS account and restore to
a new RDS instance. In all three cases the backup does happen, but in all three
cases the backup is a state your provider can return you to rather than a file
you can use locally or directly access as you require.

**If you cannot download it, you do not fully own it.**

## "My provider backs up Postgres" is true but still not enough

So there are two different jobs that both usually get called "backup", and they
are solved by different tooling:

- The first job is bringing your own project back to a recent state, quickly, on
  the platform you are already paying for. Provider backups do this job well,
  and you should keep using them.

- The second job is everything else: Migrating off the platform, cloning
  production into staging, handing a dataset to an auditor, or keeping history
  that reaches back further than the provider's retention window.

Retention windows on hosted Postgres platforms are shorter than you might
imagine:

| Platform        | Built-in retention                                                                                                         | Longer history                                                   | Portable file you can download?      |
| :-------------- | :------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------- | :----------------------------------- |
| Supabase        | Daily backups kept 7 days on Pro, 14 days on Team. Free projects get none                                                  | Point-in-time recovery add-on, from $100/mo per 7 days of window | No, restores happen in-platform      |
| Neon            | History window up to 7 days on Launch. Free tier is a 6 hour window                                                        | Up to 30 days on Scale                                           | No portable copy                     |
| Xata            | Managed backups with WAL-based point-in-time recovery capped at 35 days. The free tier gets support-assisted daily backups | No option today to go beyond 35 days                             | No self-serve download               |
| Prisma Postgres | Daily snapshots kept 7 days on Starter and Pro, 30 days on Business, and taken only on days the database saw activity      | No point-in-time recovery today, listed as future work           | No self-serve download of a snapshot |

Did you notice that none of these platforms hand you the backup it took for you?
Also, the retention column tells a similar story once you look at the ceilings.
Seven days is the common default, and the outer limit across all four is
somewhere between 30 and 40 days, usually on the plan that can get expensive
quickly. But if you were, say, running a 100 GB project and wanted to back it up
for 60 days, would it financially make sense to go with the priciest plan on any
of these platforms?

## So why not just cron a pg\_dump?

That is a fair question, and it does indeed work for taking a single backup at a
given instant, producing a full fresh copy of the database:

```
pg_dump "$DATABASE_URL" | gzip > backup-$(date +%F).sql.gz
```

Now, you can run that on a cron schedule and you have a portable copy of your
database every time it is ran but it does not manage those copies over time and
you simply end up with a directory of .sql.gz files named by date, with no index
and no quick way to know which of them will actually restore.

You might reach for compression to keep the size down, and it does help, though
only inside a single file. The catch is that gzip only ever looks at the one
dump it is compressing. It has no memory of the dump it compressed earlier and
what needs to be de-duped.

Also, your storage size would grow close to linearly, because every run writes a
fresh full copy of the database. There is no integrity check either, which means
you have no way to verify whether the dump is complete or malformed. Encryption,
the offsite copy, and pruning old files are another set of scripts you would
maintain, and then might remember to fix as you modify your storage (updating
the S3 bucket name, for example).

## Where Plakar fits: it wraps pg\_dump instead of replacing it

Plakar's [PostgreSQL integration](https://plakar.io/integrations/postgres/)
calls PostgreSQL's own tools to provide you with the portable copy of your
database that the providers would not give you. It runs pg\_dump and
pg\_dumpall, takes the output those tools produce, and adds
[encryption, deduplication, and snapshot management](https://plakar.io/docs/community/v1.1.0/explanations/how-plakar-works/#backup-steps)
around it. This approach enables you to build on top of pg\_dump, and a restore
would then simply reassemble the dump it produced so that pg\_restore and psql
can replay it into a target database over a `postgres://` connection.

Those snapshots are stored in a
[Kloset store](https://www.plakar.io/posts/2025-04-29/kloset-the-immutable-data-store/),
which is
[Plakar's immutable storage engine](https://www.plakar.io/posts/2025-04-29/kloset-the-immutable-data-store/)
that splits your data into encrypted chunks, addresses each one by a hash of its
contents so identical chunks are only ever stored once, and never rewrites a
chunk after it has been written.

Before we dig deeper, here's a quick overview of how it solves the pain points
we covered above:

1. **Snapshots with IDs and Date(s):**
   [plakar ls](https://plakar.io/docs/community/v1.1.0/references/commands/plakar-ls/)
   lists the snapshots with their tags, unique IDs, and date.
2. **An encrypted Kloset store with a check command:**
   [plakar check](https://plakar.io/docs/community/v1.1.0/references/commands/plakar-check/)
   reads the data back, decrypts it, and recomputes checksums to tell you
   whether your snapshots are intact.
3. **Deduplication across snapshots:** Each daily backup only stores what
   changed since the last one, using
   [content defined chunking](https://plakar.io/docs/community/v1.1.0/explanations/how-plakar-works/#backup-steps).
4. **Back to offsite storage easily:** Point the store at a local disk or at an
   [S3 bucket](https://www.plakar.io/docs/community/v1.1.0/integrations/s3/) and
   Plakar handles the upload for you.
5. **Restores easily into Postgres:**
   [plakar restore](https://plakar.io/docs/community/v1.1.0/references/commands/plakar-restore/)
   replays the dump through pg\_restore and psql into any database you choose.

### What 60 days of a 100 GB database costs to store

Let's go back to that 100 GB database from earlier, the one we wanted 60 days of
history for, and say roughly 2 GB of it changes on any given day. Now, since
pg\_dump does not write the data of the indexes itself and skips the dead rows,
let us assume that the dump comes out to about 30 GB for our 100 GB database.

Assuming that you use LZ4 yourself (the decompression algorithm Plakar uses)
with the cron script to keep full copies, every run writes all 15 GB and sixty
of them come to about 900 GB sitting in your bucket, with each additional day of
retention costing you another 15 GB. Native deduplication with Plakar would
write the first backup at 15 GB, but then only store the chunks that actually
changed on the following days. With 2 GB of daily churn that comes to a few
hundred megabytes a day, so sixty days of history lands you near 35 GB in total.

At S3's standard rate of about
$0.023 per GB per month, that is the difference between paying roughly $21 a
month to keep those 60 days and **paying under a dollar with Plakar**.

## Back up managed Postgres with Plakar, step by step

Plakar uses pg\_dump, so you would want to make sure that the version of
pg\_dump set up on the machine creating the backup matches the one on the server
to avoid a "server version mismatch" error.

```
psql "$DATABASE_URL" -c "show server_version;"
pg_dump --version
```

Also, on Supabase, Neon, Xata, and Prisma Postgres you usually do not get a true
superuser. Backing up an entire cluster including its roles can require
permissions the platform will not give you, and on restricted managed services
the Plakar integration automatically falls back to \-–no-role-passwords. The
backup operation still does complete, but the roles come back without their
passwords set, so you would set those yourself after restoring with Plakar.

Now, let's get started with the process of backing up via Plakar:

1. Install the Plakar's Postgres integration:

```
plakar pkg add postgresql
```

2. Point Plakar at the database with the connection string of your live
   database, but with one edit. Since some platforms give you a connection
   string that starts with postgresql:// and Plakar's importer only recognises
   the `postgres://` scheme, update that prefix and then add it as the source:

```
plakar source add myprovider "postgres://...:...@ep-.../dbname"
```

3. Set up the Kloset store for your snapshots. The commands below register the
   store in your config under a name you choose, and then initialize the store
   on disk:

```
plakar store add mystore /var/backups passphrase=xxx
plakar at @mystore create
```

4. Perform the backup with the following command:

```
plakar at @mystore backup @myprovider
```

5. List the snapshots with IDs and dates:

```
plakar at @mystore ls
```

It should produce an output like the following:

```
2026-07-13T05:51:52Z   f894b582   578 KiB      1m0s   /
```

Now with the backup done locally, let's learn to store this backup remotely on a
S3-compatible storage.

## Back up Postgres to your own S3 bucket

To store the Plakar created backup on a remote storage, register an
[S3-backed store](https://www.plakar.io/docs/community/v1.1.0/integrations/s3/)
with the following command:

```
plakar store add my-s3-store \\
  location=s3://s3.region.amazonaws.com/my-bucket \\
  access_key=YOUR_ACCESS_KEY_ID \\
  secret_access_key=YOUR_SECRET_ACCESS_KEY \\
  use_tls=true
```

Then, create a store on S3, and back up your Postgres into it:

```
plakar at @my-s3-store create
plakar at @my-s3-store backup @myprovider
```

The commands above do the following:

- **create** initializes a brand new Kloset store inside the bucket you
  registered. A Kloset store is encrypted by default (and the passphrase is read
  from the store config or from the PLAKAR\_PASSPHRASE environment variable), so
  the objects that are stored in your bucket are unreadable to anyone who gets
  into it.
- **backup @myprovider** creates a new snapshot in that store. The @myprovider
  part points at the source connector you registered earlier. Plakar opens a
  connection to the provider, runs pg\_dump behind the scenes, and writes what
  comes back as a point-in-time snapshot.

Notice that the backup command is the same one you ran against the local store,
with only the store name changed, so moving your backups into a bucket remains
simply as a change of destination.

## Restore your snapshot into local Postgres

To restore a snapshot from the store into a local Postgres instance, run the
following commands:

```
plakar destination add mylocal "postgres://youruser@localhost:5432/" recreate=true
plakar at @mystore restore -to @mylocal f894b582
```

It should produce an output like the following:

```
f894b582: OK ✓ /
f894b582: OK ✓ /00000-globals.sql
f894b582: OK ✓ /00001-providerdb.dump
f894b582: OK ✓ /manifest.json
```

Now, confirm that the data actually restored, by matching the schema and the
number of rows in your busiest table:

```
psql -d providerdb -c "\dt"
psql -d providerdb -c "select count(*) from your_busiest_table;"
```

The same snapshot can be restored back to the provider by pointing at a
different destination.

## When you do not need this

A plain pg\_dump on a cron schedule is genuinely enough when you have one small
database, you are content maintaining one script, and your provider's retention
window covers every recovery you can realistically picture within your budget.
If you are already running pgBackRest or WAL-G and you are happy with them, you
have solved this problem in a different way and you should keep going.

## Frequently asked questions

**Does Plakar replace pg\_dump?** No. It runs pg\_dump and pg\_dumpall for you,
then adds
[snapshots, encryption, deduplication, and offsite storage](https://plakar.io/docs/community/v1.1.0/explanations/how-plakar-works/#backup-steps)
on top of the output those tools produce.

**Is my backup actually encrypted?** Yes. Encryption is a property of the store,
and you can configure a passphrase on a store when you register it with plakar
store add ... passphrase=xxx. The
[passphrase guide](https://www.plakar.io/docs/community/v1.1.0/guides/managing-passphrases/)
covers the full workflow.

**Do I need server access to the machine my database runs on?** No, and that is
the main case this integration is built for. Tools like pgBackRest and
pg\_basebackup need the filesystem and the WAL directory, and not many managed
platforms give you that access. Plakar goes through pg\_dump over an ordinary
`postgres://` connection instead, so a connection string from your dashboard and
a role that can read the data is the only requirement.

**How do I know a backup is good?** Run
[plakar at @mystore check](https://plakar.io/docs/community/v1.1.0/references/commands/plakar-check/)
to verify the store's integrity. The check command tells you if the data is
intact.

**Do I still need my provider's backups?** Yes, keep them if they fit your
budget. They are your fastest path back from an accident inside the platform.
With Plakar, you are insuring yourself against the scenarios of backing up
beyond the retention window, migrating to another platform, keeping a copy on
your own disk to develop against, or losing access to the account itself after a
billing lapse or a lockout.

