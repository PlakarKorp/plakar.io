---
title: "Excluding files from a backup"
date: "2026-03-16T00:00:00Z"
weight: 5
summary: "Learn how to exclude files from a backup in Plakar"
---

# Excluding files from a backup

This guide shows how to exclude files and directories from a backup using ignore patterns.

## Why you'd need to exclude files from a backup

When backing up a source directory, not all files are worth preserving. Some are large and easily regenerated (build artifacts, dependency directories like `node_modules` or `vendor`), some are temporary (cache files, lock files, log files), and some are sensitive and should not be stored in a backup repository (secrets, local environment files).

Excluding these from your backups reduces storage usage, speeds up backup and restore operations, and keeps your snapshots focused on only the important files.

The `plakar backup` command supports the `-ignore` and `-ignore-file` options to exclude files from a backup. These options use patterns with a syntax similar to `.gitignore` files.

## Examples

For the examples below, we assume the following directory structure in `/var/files/demo`:

```
/var/files/demo
├── .cache
│   └── index.db
├── .config
├── .env
├── .env.local
├── .git
│   ├── config
│   └── hooks
├── build
│   ├── app.bin
│   └── app.o
├── config
│   ├── config.local.yaml
│   └── config.yaml
├── Documents
│   ├── Invoices
│   │   ├── invoice1.pdf
│   │   └── invoice2.pdf
│   └── Reports
│       ├── report1.docx
│       └── report2.docx
├── logs
│   ├── app.log
│   └── error.log
├── node_modules
│   ├── module1.js
│   └── module2.js
├── Pictures
│   ├── Family
│   │   └── photo1.jpg
│   └── Vacation
│       └── photo2.png
├── src
│   ├── main.go
│   ├── secret.key
│   └── utils.go
├── tmp
│   ├── cache.db
│   └── tempfile.tmp
└── vendor
    └── github.com
        ├── lib1.go
        └── lib2.go
```

And we assume the backup command is:

```bash
$ plakar at /var/backups backup -ignore-file ./excludes.txt /var/files
```

> You can use `-ignore` multiple times with different patterns, or use `-ignore-file` with a file containing one pattern per line. The result is the same.

### Ignore the `/var/files/demo/vendor` directory only:

```
/var/files/demo/vendor
```

### Ignore the `node_modules` directory, wherever it is in the tree:

```
node_modules
```

> In this case, both `/var/files/demo/node_modules` and `/var/files/demo/src/node_modules` would be ignored.

### Ignore the file `.git/config`, wherever it is in the tree:

```
**/.git/config
```

Here, the double asterisk `**` is required.

> When a path pattern contains multiple parts, it is evaluated relative to the root directory `/`.

### Exclude all files located in a `tmp` directory anywhere in the tree, except for `cache.db`:

```
**/tmp/*
!**/tmp/cache.db
```

### Exclude everything, except `.pdf` and `.docx` files:

```
*
!**/*.pdf
!**/*.docx
```
