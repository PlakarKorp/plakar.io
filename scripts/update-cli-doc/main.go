// Command update-cli-doc regenerates the Plakar CLI command reference from the
// man pages of the plakar repository.
//
//	update-cli-doc [flags] [version] [tag]
//
// version names the docs directory, content/docs/community/<version>, and
// defaults to main. tag is the plakar git ref to read the man pages from, and
// defaults to version. Each man page is rendered with mandoc(1), so the output
// depends on the mandoc it runs: the GitHub workflow runs it on OpenBSD, whose
// mandoc is the reference implementation.
package main

import (
	"bytes"
	"errors"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"time"
)

const repoURL = "https://github.com/PlakarKorp/plakar.git"

var (
	manPage      = regexp.MustCompile(`\.[1-9]$`)
	validVersion = regexp.MustCompile(`^(main|v[0-9]+\.[0-9]+\.[0-9]+)$`)
)

func main() {
	log.SetFlags(0)
	log.SetPrefix("update-cli-doc: ")

	root := flag.String("root", ".", "root of the plakar.io repository")
	src := flag.String("src", "", "existing plakar checkout to read; clones the tag when empty")
	out := flag.String("out", "", "output directory (default: <root>/content/docs/community/<version>/references/commands)")
	format := flag.Bool("format", true, "run prettier on the output")
	flag.Usage = func() {
		fmt.Fprintf(flag.CommandLine.Output(), "usage: update-cli-doc [flags] [version] [tag]\n")
		flag.PrintDefaults()
	}
	flag.Parse()
	if flag.NArg() > 2 {
		flag.Usage()
		os.Exit(2)
	}

	version := flag.Arg(0)
	if version == "" {
		version = "main"
	}
	tag := flag.Arg(1)
	if tag == "" {
		tag = version
	}
	if !validVersion.MatchString(version) {
		log.Fatalf("version %q must be main or vX.Y.Z", version)
	}
	if *out == "" {
		*out = filepath.Join(*root, "content", "docs", "community", version, "references", "commands")
	}

	if err := update(*root, *src, *out, version, tag, *format); err != nil {
		log.Fatal(err)
	}
}

func update(root, src, out, version, tag string, format bool) error {
	if src == "" {
		tmp, err := os.MkdirTemp("", "update-cli-doc-")
		if err != nil {
			return err
		}
		defer os.RemoveAll(tmp)
		if err := run("", "git", "clone", "--depth", "1", "-b", tag, repoURL, tmp); err != nil {
			return fmt.Errorf("clone failed for tag %q: %w", tag, err)
		}
		src = tmp
	}

	if err := generate(src, out, version, tag); err != nil {
		return err
	}

	if !format {
		return nil
	}
	log.Printf("formatting generated documentation for %s", version)
	abs, err := filepath.Abs(out)
	if err != nil {
		return err
	}
	return run(root, "npx", "--no-install", "prettier", "--write", abs)
}

func generate(src, out, version, tag string) error {
	if err := os.RemoveAll(out); err != nil {
		return err
	}
	if err := os.MkdirAll(out, 0o755); err != nil {
		return err
	}

	log.Printf("generating documentation for %s (tag: %s)", version, tag)
	now := time.Now().UTC().Format("2006-01-02T15:04:05Z")

	if err := os.WriteFile(filepath.Join(out, "_index.md"), []byte(indexPage(version, now)), 0o644); err != nil {
		return err
	}

	pages, err := findManPages(src)
	if err != nil {
		return err
	}
	for _, man := range pages {
		if err := writePage(man, out, version, now); err != nil {
			return fmt.Errorf("%s: %w", filepath.Base(man), err)
		}
	}
	return nil
}

// findManPages returns the man pages of the subcommands, plus plakar(1) and
// plakar-query(7) at the root of the repository.
func findManPages(src string) ([]string, error) {
	subcmds := filepath.Join(src, "subcommands")
	if _, err := os.Stat(subcmds); err != nil {
		subcmds = filepath.Join(src, "cmd", "plakar", "subcommands")
	}

	var pages []string
	err := filepath.WalkDir(subcmds, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.Type().IsRegular() && manPage.MatchString(strings.ToLower(d.Name())) {
			pages = append(pages, path)
		}
		return nil
	})
	if err != nil {
		return nil, err
	}

	for _, name := range []string{"plakar.1", "plakar-query.7"} {
		path := filepath.Join(src, name)
		if _, err := os.Stat(path); err == nil {
			pages = append(pages, path)
		}
	}

	sort.Slice(pages, func(i, j int) bool {
		return filepath.Base(pages[i]) < filepath.Base(pages[j])
	})
	return pages, nil
}

func writePage(man, out, version, now string) error {
	name := manPage.ReplaceAllString(filepath.Base(man), "")
	log.Printf("generating documentation for %s", name)

	summary, err := description(man)
	if err != nil {
		return err
	}

	var page bytes.Buffer
	fmt.Fprintf(&page, "---\n")
	fmt.Fprintf(&page, "date: %q\n", now)
	fmt.Fprintf(&page, "title: %s\n", strings.TrimPrefix(name, "plakar-"))
	fmt.Fprintf(&page, "summary: %q\n", summary)
	fmt.Fprintf(&page, "aliases:\n")
	fmt.Fprintf(&page, "  - /docs/%s/references/commands/%s/\n", version, name)
	fmt.Fprintf(&page, "  - /docs/%s/commands/%s/\n", version, name)
	if name == "plakar-ptar" && (version == "main" || version == "v1.0.6" || version == "v1.1.0") {
		fmt.Fprintf(&page, "  - /docs/%s/references/ptar/\n", version)
		fmt.Fprintf(&page, "  - /docs/community/%s/references/ptar\n", version)
	}
	fmt.Fprintf(&page, "---\n\n")

	cmd := exec.Command("mandoc", "-I", "os=Plakar", "-Thtml",
		"-Ofragment,man=../%N/;https://man.openbsd.org/%N.%s", man)
	cmd.Stderr = os.Stderr
	html, err := cmd.Output()
	if err != nil {
		return fmt.Errorf("mandoc: %w", err)
	}
	html = bytes.ReplaceAll(html,
		[]byte("https://docs.plakar.io/en/guides/importing-configurations/"),
		[]byte("https://plakar.io/docs/community/"+version+"/guides/importing-configurations/"))
	page.Write(html)

	return os.WriteFile(filepath.Join(out, name+".md"), page.Bytes(), 0o644)
}

// description returns the argument of the first .Nd macro of a man page.
func description(man string) (string, error) {
	data, err := os.ReadFile(man)
	if err != nil {
		return "", err
	}
	for _, line := range strings.Split(string(data), "\n") {
		if rest, ok := strings.CutPrefix(line, ".Nd"); ok {
			return strings.TrimPrefix(rest, " "), nil
		}
	}
	return "", errors.New("no .Nd line")
}

func indexPage(version, now string) string {
	return fmt.Sprintf(`---
title: "Commands"
date: %q
weight: 5
summary: "Reference for all Plakar commands. Browse detailed documentation for each command, including usage, options, and examples. Access help online or directly from your terminal."
aliases:
  - /docs/%s/references/commands/
---

# Commands

Welcome to the Plakar commands reference. This section provides detailed documentation for all available Plakar commands, including usage, options, and examples.
You can browse the command documentation here, or access it directly from your terminal using `+"`plakar help`"+`. This allows you to explore command behavior and options whether you are online or working locally.
Below is the complete list of commands. Select any command to view its detailed documentation.

{{%% children description="true" %%}}
`, now, version)
}

func run(dir, name string, args ...string) error {
	cmd := exec.Command(name, args...)
	cmd.Dir = dir
	cmd.Stdout = os.Stderr
	cmd.Stderr = os.Stderr
	return cmd.Run()
}
