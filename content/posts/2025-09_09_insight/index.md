---
title: "Falsehoods Engineers believe about backup"
date: 2025-09-16T10:00:00+0100
authors:
- "julien"
summary: "Falsehoods Engineers believe about backup"
categories:
  - insights
tags:
 - plakar
 - backup
---

Here is a list of common false assumptions about backup that I’ve heard repeatedly over the past year from discussions with engineers, CTOs, and sysadmins across various industries.
These misconceptions often sound reasonable, but they create a false sense of safety until reality strikes.

- **If a backup finished successfully, it can be restored**  
  A backup that completes without errors doesn't guarantee it can be restored.
  Most failures happen during recovery due to corruption, misconfiguration, or missing pieces.
  For example, I heard multiple times that one major software vendor is well known to corrupt one backup over three.

- **RAID, replication, or snapshots are backups**  
  They are not. These mechanisms protect availability, not recoverability. They replicate corruption, deletions, and ransomware with impressive speed.
  **Replication synchronizes data including accidental deletions or corruptions. Backups preserve history and offer rollback.**

- **Cloud providers back up my data**  
  They don’t. All cloud providers offer at the best durability and redundancy, not backups. You are responsible for protecting your own data.
  They all use a shared responsibility model that clearly states that backups are your job and implicitly (or clearly) state that you should backup you data out of their scope.

- **The database files are enough to recover the database**  
  Not without transaction logs or consistency coordination. Copying raw files doesn't guarantee usable data.

- **Our backups are safe from ransomware**  
  If they are accessible from the network, they are a primary target. Ransomware hits backups first. Isolation and immutability are critical.
  To prevent data leakage, backups should be encrypted, but you can still lose access to your data if the ransomware also encrypts or deletes your backups.

- **A well configured S3 bucket doesn't require backup**  
  S3, or S3-compatible buckets can be misconfigured later, credentials can be compromised, and data can be accidentally deleted or corrupted.
  Your cloud provider can, by accident, delete or corrupt your data.

- **Encryption in transit and at rest is enough is end to end security for backup**  
  Real end-to-end encryption means that data is encrypted before it leaves the source system and remains encrypted until it is restored, with only the data owner having access to the decryption keys.
  If your backup solution provider manages the encryption keys, they could potentially access your data, so attackers could potentially access your data, which compromises true end-to-end security.

- **Incremental backups are always safer and faster**  
  Not always. Long chains of incrementals are fragile. One missing link and the whole chain collapses.

- **A daily backup is enough**  
  For most modern systems, losing 23 hours of data is not acceptable. Recovery Point Objectives must match business needs.

- **Backup storage will always be available**  
  Storage fills up, disks fail, and credentials expire. Many backup systems stop quietly when that happens.

- **Backup is an IT problem**  
  It's not. It's a business continuity and risk management concern. Recovery priorities should be defined at the business level.

Help us debunk these myths by sharing your own experiences and insights in this reddit thread: 

We are building Plakar as an Open Source project to help everyone protect their data effectively and cover all these bases.