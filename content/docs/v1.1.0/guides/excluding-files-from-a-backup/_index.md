---
date: "2025-09-05T00:00:00Z"
title: Excluding files from a backup
summary: "Learn how to exclude files from a backup using the `-ignore` and `-ignore-file` options in Plakar. This tutorial explains the syntax and provides examples for excluding files and directories."
last_reviewed: "2025-12-08"
last_reviewed_version: "v1.0.6"
weight: 40
---

*Last reviewed: {{<param "last_reviewed">}} / Plakar {{<param "last_reviewed_version">}}*

The `plakar backup` command supports the `-ignore` and `-ignore-file` options to exclude files from a backup.

These options use patterns with a syntax similar to `.gitignore` files.

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
plakar at /var/backups backup -ignore-file ./excludes.txt /var/files
```

*You can use `-ignore` multiple times with different patterns, or use `-ignore-file` with a file containing one pattern per line. The result is the same.*

### Ignore the `/var/files/demo/vendor` directory only:

```
/var/files/demo/vendor
```

### Ignore the `node_modules` directory, wherever it is in the tree:

```
node_modules
```

*In this case, both `/var/files/demo/node_modules` and `/var/files/demo/src/node_modules` would be ignored.*

### Ignore the file `.git/config`, wherever it is in the tree:

```
**/.git/config
```

Here, the double asterisk `**` is required.

*When a path pattern contains multiple parts, it is evaluated relative to the root directory `/`.*

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

