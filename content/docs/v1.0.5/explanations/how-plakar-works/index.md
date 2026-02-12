---
title: "How Plakar Works"
date: "2026-02-06T00:00:00Z"
weight: 1
summary: "Understand the core architecture and data processing pipeline behind Plakar, including Kloset stores, chunking, deduplication, compression, encryption, and snapshot management."
aliases:
  - /docs/v1.0.5/concepts
---

Plakar is built on top of Kloset, an immutable data store engine designed specifically for backup workloads. Understanding how Plakar processes and stores your data helps you make informed decisions about backup strategies and troubleshoot issues when they arise.

This page explains the technical foundation of Plakar without step-by-step instructions. If you're looking for practical guidance, see the [Guides](../../guides) section.

## Kloset Store

Kloset is the immutable data store engine at the heart of Plakar. It is the library that Plakar uses to store and manage backups.

The simplest way to see Kloset is as a "storage API" that Plakar uses to store backups. It is not a traditional REST API you might be familiar with, but rather a library that exposes a set of functions to store and retrieve data. For example, when making a backup, Plakar will use Kloset to retrieve the content and the metadata to be backed up, chunk it into smaller pieces, compress and encrypt those pieces, regroup them into larger files called "packfiles", and finally write those packfiles to a storage backend such as a local filesystem, an object storage service, or a remote server.

Plakar is a tool built on top of Kloset, which provides a command-line and a web interface to manage your backups, with additional features such as scheduling, activity reporting, and more.

Without Plakar, you would have to write your own code to use Kloset. With Plakar, you get an easy-to-use tool to implement a backup strategy be it for your personal laptop or your large scale infrastructure.

If you want to dig deeper into Kloset and see all the features it provides, read the [Kloset blog post](https://www.plakar.io/posts/2025-04-29/kloset-the-immutable-data-store/).

## Backup steps

When you run a backup command, Plakar will use the integration you specified to retrieve the content to be backed up.

For example, the built-in filesystem integration will scan the directory you specified, and retrieve the content and metadata of the files and directories to be backed up.

There are several steps that Plakar (actually, Kloset) will perform to create a backup:
1. **Chunking**: The content is split into smaller pieces called "chunks". If you attempt to back up a large video file for example, it will be split into smaller chunks to make it easier to store and manage.
2. **Deduplication**: The chunks are deduplicated, meaning that if the same chunk already exists in the store, it will not be stored again. This is a key feature of Plakar that allows you to save space and time when backing up large files or directories that contain many duplicate files. This is also the reason why you can create multiple snapshots of the same directory without consuming much more space than a single snapshot. You might already understand that that's why chunking is so important: if we didn't chunk the content, then adding a single byte to a file would mean that the whole file would have to be stored again. With chunking, only the chunk containing the changed byte will be stored again, and the rest of the file will remain unchanged.
3. **Compression**: The chunks are compressed to save space.
4. **Encryption**: The chunks are encrypted. We call the encrypted chunks "blobs". These blobs are sent to the storage backend, which acts as a "dumb storage": it does not know anything about the content of the blobs, it just stores them as they are. This is what we call "real end-to-end encryption": the storage backend does not have access to the content of the backups, and only you can decrypt them.

## Independent snapshots

In a Kloset store, each backup is stored as an independent snapshot. This means that you can create multiple snapshots of the same data source without consuming much more space than a single snapshot. Each snapshot contains the content and metadata at the time of the backup, and can be restored independently of other snapshots.

These snapshots are not incremental backups, meaning that they do not depend on any other snapshot. You can delete a snapshot without affecting any of the subsequent snapshots, and you can compare the differences between a snapshot and any other snapshot.

## Content Defined Chunking (CDC)

As seen in the [Backup steps](#backup-steps) section, Kloset uses Content Defined Chunking (CDC) to split the content into smaller pieces called "chunks".

To understand why chunking is important, consider the following: let's say you have a large video file that you want to back up. If you didn't chunk the content, then adding a single byte to the end of the file would mean that the whole file would have to be stored again. This would be very inefficient, especially if you have large files that change frequently.

Now, let's understand why CDC is important. In our video example, what would happen if we added a single byte to the middle of the file? With a fixed-size chunking algorithm, all the subsequent chunks would be considered as changed, and they would have to be stored again.

CDC stands for "Content Defined Chunking", and it is a technique that uses the content of the file to determine the size of the chunks. This means that if you add a single byte to the middle of a file, only the chunk containing that byte will be considered as changed, and only that chunk will be stored again. The rest of the file will remain unchanged. The "single byte change" in the middle of the file is obviously an example, and the same applies if you make larger changes to the file, such as adding or removing a few lines of text in a text file, or changing a few pixels in an image file.

To get a better understanding of how CDC works and to know more about go-cdc-chunker, the library we open-sourced to implement CDC in Kloset, read the [go-cdc-chunker blog post](https://www.plakar.io/posts/2025-07-11/introducing-go-cdc-chunkers-chunk-and-deduplicate-everything/).

## Compression

Kloset uses compression to save space when storing backups. The compression is applied to the chunks before they are encrypted and stored in the storage backend.

Plakar currently uses LZ4, a fast compression algorithm that is well suited for backups.

## Backing up encrypted data

When backing up data, you have to make a choice: do you want to backup encrypted data or not?

If you choose to backup encrypted data, then you defeat the deduplication and compression features of Kloset. Whenever you change a single byte in an encrypted file, the whole file will be considered as changed, and it will be stored again. This is because the encryption algorithm will produce a completely different output for the same input if even a single byte is changed.

Still, there might be situations where you want to backup encrypted data, but be aware that you will not benefit from all the optimizations that Kloset provides.

## Tamper-evident snapshots

The data stored in Kloset is tamper-evident. It doesn't mean the storage backend is "immutable" in the sense that it cannot be changed. If you store data on a hard drive, for example, it can be changed by anyone with access to the hard drive, and in any case, data can be lost or tampered due to hardware failures.

When we say that the data is tamper-evident, we mean that Kloset uses cryptographic techniques to ensure that any change to the data will be detected. Each snapshot is signed with a cryptographic hash, and any change to the data will result in a different hash. This means that if someone tries to change the data, you will be able to detect it by checking the hash of the snapshot.

From there, you can decide what to do with the tampered snapshot: should you untrust the whole store and use another copy, or should you just ignore the maybe single tampered item and continue using the store as is? This is up to you, but Kloset will always let you know if something is wrong.

## Integration

We designed Plakar to be as flexible as possible. Nowadays, you not only want to back up your filesystem, but also your databases, your cloud storage, your remote servers, your SaaS applications, and more. To achieve this, Plakar uses the concept of "integrations".

An integration provides a storage connector, a source connector, and a destination connector; or a combination of those.

These integrations are implemented as plugins, and we made the process of installing and using them as easy as possible. We also provide an easy way to create your own integration if you need to backup a data source that is not supported by Plakar out of the box. For example, the FTP source connector is about 80 lines of code, imports included.

Check out the list of [available integrations](/integrations) to see what is already available.

### Storage connector

The storage connector is the part of the integration that allows Plakar to host the Kloset store to a specific storage backend. It is responsible for storing the blobs (the encrypted chunks) in the storage backend, and for retrieving them when needed.

For example, Plakar has a built-in storage connector for filesystems and S3-compatible object storage services, but it is possible to install integrations to host your Kloset store on Google Drive or Dropbox.

### Source connector

The source connector is the part of the integration that allows Plakar to retrieve the content to be backed up. It is responsible for scanning the data source, retrieving the content and metadata, and passing it to Kloset for processing.

For example, Plakar has a built-in source connector for SFTP servers, which allows to backup files from a remote server over SSH, but it is possible to install the integration for Notion to backup your Notion pages, or the integration for Google Photos to make sure your memories are safe.

### Destination connector

The destination connector is the part of the integration that allows Plakar to restore the content from a backup. It is responsible for retrieving the content and metadata from Kloset, and restore it to the target location.

For example, Plakar has a built-in destination connector for filesystems, which allows to restore files to a local directory. Similarly, it is possible to install the integration for Google Drive, Dropbox, or any other cloud storage service to restore your backups to the cloud.
