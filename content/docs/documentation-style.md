+++
title = "Documentation style guidelines"
date = "2025-03-18T10:07:31Z"
weight = 2
chapter = false
pre = "<b>2. </b>"
+++

## Custom shortcodes

### Tabs

On any Markdown page (`.md`), you can embed a **tab set** to present the same solution in different “flavors” (for example: CLI, Go, Python).

The `tabs` shortcode works with nested `tab` shortcodes and supports:

- `name` – The label shown on the tab.
- `codelang` – Sets the syntax highlighting when you provide inner content for a tab. If you use `include` instead, `codelang` is optional because the language is inferred from the file extension.
- `include` – A file to include inside the tab. If the current page is a [leaf bundle](https://gohugo.io/content-management/page-bundles/#leaf-bundles), the file is looked up in that bundle; otherwise it is resolved relative to the current page. Any non-content file is highlighted as code by default.
- If your inner content is Markdown, use the `%`-delimiters for the `tab` shortcode (so Hugo renders the Markdown).  
  Example: `{{%/* tab name="Markdown" %}}**Bold**{{% /tab */%}}`

> **Note**  
> Tab `name` values must be unique within the same content page.

---

#### Tabs demo: code highlighting (Plakar “backup a folder”)

```go-text-template
{{</* tabs name="tab_with_code" >}}
{{< tab name="CLI (Bash)" codelang="bash" >}}
plakar repo init
plakar backup ~/Projects
{{< /tab >}}
{{< tab name="Go (exec)" codelang="go" >}}
package main

import (
  "os/exec"
  "log"
)

func main() {
  if err := exec.Command("plakar", "repo", "init").Run(); err != nil { log.Fatal(err) }
  if err := exec.Command("plakar", "backup", "~/Projects").Run(); err != nil { log.Fatal(err) }
}
{{< /tab >}}
{{< tab name="Python (subprocess)" codelang="python" >}}
import subprocess

subprocess.run(["plakar", "repo", "init"], check=True)
subprocess.run(["plakar", "backup", "~/Projects"], check=True)
{{< /tab >}}
{{< /tabs */>}}
```

Renders to:

{{< tabs name="tab_with_code" >}}
{{< tab name="CLI (Bash)" codelang="bash" >}}
plakar repo init  
plakar backup ~/Projects
{{< /tab >}}
{{< tab name="Go (exec)" codelang="go" >}}
package main

import (
"os/exec"
"log"
)

func main() {
if err := exec.Command("plakar", "repo", "init").Run(); err != nil { log.Fatal(err) }
if err := exec.Command("plakar", "backup", "~/Projects").Run(); err != nil { log.Fatal(err) }
}
{{< /tab >}}
{{< tab name="Python (subprocess)" codelang="python" >}}
import subprocess

subprocess.run(["plakar", "repo", "init"], check=True)
subprocess.run(["plakar", "backup", "~/Projects"], check=True)
{{< /tab >}}
{{< /tabs >}}

---

#### Tabs demo: inline Markdown vs HTML (concept + callout)

```go-html-template
{{</* tabs name="tab_with_md" >}}
{{% tab name="Why Plakar?" %}}
Plakar stores **immutable snapshots**. Each object is content-addressed, so
restores can be **verified** by hash. Snapshots are **portable** across backends.
{{% /tab %}}

{{< tab name="HTML" >}}
<div>
  <h3>Key properties</h3>
  <ul>
    <li>Immutable snapshots</li>
    <li>Portable format (<code>.ptar</code> for exports)</li>
    <li>Verifiable restores</li>
  </ul>
</div>
{{< /tab >}}
{{< /tabs */>}}
```

Renders to:

{{< tabs name="tab_with_md" >}}
{{% tab name="Why Plakar?" %}}
Plakar stores **immutable snapshots**. Each object is content-addressed, so
restores can be **verified** by hash. Snapshots are **portable** across backends.


{{% /tab %}}
{{< tab name="HTML" >}}
<div>
  <h3>Key properties</h3>
  <ul>
    <li>Immutable snapshots</li>
    <li>Portable format (<code>.ptar</code> for exports)</li>
    <li>Verifiable restores</li>
  </ul>
</div>
{{< /tab >}}
{{< /tabs >}}

---

#### Tabs demo: file include (bring content from your bundle)

```go-text-template
{{</* tabs name="tab_with_file_include" >}}
{{< tab name="plakar ls" include="main/references/commands/plakar-ls" />}}
{{< tab name="plakar cat" include="main/references/commands/plakar-cat" />}}
{{< tab name="plakar diff" include="main/references/commands/plakar-diff" />}} 
{{< /tabs */>}}
```

Renders to:

{{< tabs name="tab_with_file_include" >}}
{{< tab name="plakar ls" include="main/references/commands/plakar-ls" />}}
{{< tab name="plakar cat" include="main/references/commands/plakar-cat" />}}
{{< tab name="plakar diff" include="main/references/commands/plakar-diff" />}}
{{< /tabs >}}

**Notes**
- If `quickstart` is a Markdown content file in a leaf bundle, it will render as Markdown.
- If `restore-example.txt` or `repo-policy.json` are plain files, they will be shown as highlighted code.
- You can override highlighting by setting `codelang` explicitly on the tab.

---

##### Authoring checklist

- Choose **short, unique** tab names per page.
- Prefer **consistent ordering** across pages (for example: CLI, Go, Python).
- When mixing Markdown and HTML, remember to use `%` for Markdown tabs.
- Keep examples runnable and minimal, then link to deeper guides when needed.
