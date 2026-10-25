import { execFileSync } from "node:child_process";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const changelogDir = path.resolve("content/changelog");

function frontMatter(text) {
  const params = {};
  const block = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  for (const line of block.split("\n")) {
    const m = line.match(/^([a-z_]+):\s*"?([^"]+)"?$/);
    if (m) params[m[1]] = m[2];
  }
  return params;
}

function listReleases(repo) {
  const out = execFileSync(
    "gh",
    [
      "api",
      "--paginate",
      `repos/${repo}/releases`,
      "--jq",
      ".[] | select(.draft | not) | {tag: .tag_name, date: .published_at, body: .body}",
    ],
    { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 },
  );
  return out.split("\n").filter(Boolean).map(JSON.parse);
}

function cleanNotes(notes) {
  return (notes ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/^#+\s*New Contributors[\s\S]*?(?=^#+\s|(?![\s\S]))/im, "")
    .replace(/^#+\s*What's Changed\s*$/gim, "")
    .replace(/^\**Full Changelog\**:.*$/gim, "")
    .replace(
      /^\s*[*+-]\s+(.*?)\.?\s+by @[\w-]+ in (https:\/\/github\.com\/\S+\/pull\/(\d+))\s*$/gm,
      "- $1 ([#$3]($2))",
    )
    .replace(/^\s*[*+]\s+/gm, "- ")
    .replace(/^- (\w)/gm, (_, c) => `- ${c.toUpperCase()}`)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function stageOf(version) {
  return (
    ["alpha", "beta", "rc"].find((s) => version.includes(`-${s}`)) ?? "stable"
  );
}

for (const name of await readdir(changelogDir)) {
  const dir = path.join(changelogDir, name);
  const index = await readFile(path.join(dir, "_index.md"), "utf8").catch(
    () => null,
  );
  if (index === null) continue;
  const { title, repo, tag_prefix: prefix = "" } = frontMatter(index);
  if (!repo) continue;

  const entries = (await readdir(dir)).filter((f) => f !== "_index.md");
  const dates = await Promise.all(
    entries.map(
      async (f) =>
        frontMatter(await readFile(path.join(dir, f), "utf8")).date ?? "",
    ),
  );
  const newest = dates.sort().at(-1) ?? "";

  for (const release of listReleases(repo)) {
    if (!release.tag.startsWith(prefix) || release.date <= newest) continue;
    const version = release.tag.slice(prefix.length);
    if (version.includes("/") || entries.includes(`${version}.md`)) continue;

    const file = path.join(dir, `${version}.md`);
    await writeFile(
      file,
      [
        "---",
        `title: "${title} ${version}"`,
        `version: "${version}"`,
        `date: ${release.date.slice(0, 10)}T00:00:00Z`,
        `stage: "${stageOf(version)}"`,
        `summary: "TODO"`,
        "build:",
        "  render: never",
        "---",
        "",
        cleanNotes(release.body),
        "",
      ].join("\n"),
    );
    console.log(`wrote ${path.relative(process.cwd(), file)}`);
  }
}
