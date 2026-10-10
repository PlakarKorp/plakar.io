import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);
const checkFragments = !args.includes("--no-fragments");
const siteDir = path.resolve(args.find((a) => !a.startsWith("--")) ?? "public");

const INTERNAL_HOSTS = new Set([
  "plakar.io",
  "www.plakar.io",
  "www.stg.plakar.io",
]);

// Paths that are absent from the Hugo build output: the Pagefind index is
// generated after Hugo runs, and release downloads, appliance images and the
// releases feed are served from plakar.io outside of this site.
const IGNORED_PREFIXES = ["/pagefind/", "/dl/", "/dist/", "/api/"];

const ATTR_RE = /\s(href|src|srcset)\s*=\s*("([^"]*)"|'([^']*)')/gi;
const ID_RE = /\s(?:id|name)\s*=\s*("([^"]*)"|'([^']*)')/gi;

function decodeEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

// Returns the URL path portion and fragment of an internal link, or null when
// the link points elsewhere (external host, mailto:, javascript:, ...).
function toInternal(raw, pageUrlPath) {
  const value = decodeEntities(raw.trim());
  if (value === "" || value === "#") return null;
  if (/^(mailto|tel|javascript|data|blob):/i.test(value)) return null;

  let url;
  try {
    url = new URL(value, `https://www.plakar.io${pageUrlPath}`);
  } catch {
    return { path: value, fragment: "", invalid: true };
  }
  if (!/^https?:$/.test(url.protocol)) return null;
  if (!INTERNAL_HOSTS.has(url.hostname)) return null;

  let p;
  try {
    p = decodeURIComponent(url.pathname);
  } catch {
    p = url.pathname;
  }
  let fragment = url.hash.slice(1);
  try {
    fragment = decodeURIComponent(fragment);
  } catch {}
  return { path: p, fragment };
}

const fileCache = new Map();
async function resolveTarget(urlPath) {
  if (fileCache.has(urlPath)) return fileCache.get(urlPath);
  const candidates = [path.join(siteDir, urlPath)];
  if (urlPath.endsWith("/")) candidates[0] = path.join(siteDir, urlPath, "index.html");
  else candidates.push(path.join(siteDir, urlPath, "index.html"), path.join(siteDir, `${urlPath}.html`));

  let found = null;
  for (const c of candidates) {
    try {
      if ((await stat(c)).isFile()) {
        found = c;
        break;
      }
    } catch {}
  }
  fileCache.set(urlPath, found);
  return found;
}

const idCache = new Map();
async function idsOf(file) {
  if (!idCache.has(file)) {
    const html = await readFile(file, "utf8");
    const ids = new Set();
    for (const m of html.matchAll(ID_RE)) ids.add(decodeEntities(m[2] ?? m[3]));
    idCache.set(file, ids);
  }
  return idCache.get(file);
}

const files = await walk(siteDir);
if (files.length === 0) {
  console.error(`No HTML files found in ${siteDir}. Build the site first.`);
  process.exit(2);
}

// "target" -> Set of source pages
const broken = new Map();
const brokenFragments = new Map();
const report = (map, target, source) => {
  if (!map.has(target)) map.set(target, new Set());
  map.get(target).add(source);
};

let checked = 0;
for (const file of files) {
  const rel = path.relative(siteDir, file);
  const pageUrlPath = "/" + rel.split(path.sep).join("/").replace(/index\.html$/, "");
  const html = await readFile(file, "utf8");

  for (const m of html.matchAll(ATTR_RE)) {
    const attr = m[1].toLowerCase();
    const value = m[3] ?? m[4];
    const urls =
      attr === "srcset"
        ? value.split(",").map((s) => s.trim().split(/\s+/)[0])
        : [value];

    for (const raw of urls) {
      const link = toInternal(raw, pageUrlPath);
      if (!link) continue;
      if (IGNORED_PREFIXES.some((p) => link.path.startsWith(p))) continue;
      checked++;

      if (link.invalid) {
        report(broken, raw, "/" + rel);
        continue;
      }
      const target = await resolveTarget(link.path);
      if (!target) {
        report(broken, link.path, "/" + rel);
        continue;
      }
      if (checkFragments && link.fragment && target.endsWith(".html")) {
        if (!(await idsOf(target)).has(link.fragment)) {
          report(brokenFragments, `${link.path}#${link.fragment}`, "/" + rel);
        }
      }
    }
  }
}

console.log(`Checked ${checked} internal links across ${files.length} pages.`);

if (broken.size === 0 && brokenFragments.size === 0) {
  console.log("No broken links found.");
  process.exit(0);
}

// Prints one section and returns its occurrence count.
function printSection(title, map) {
  if (map.size === 0) return 0;
  console.log(`\n== ${title} ==`);
  let total = 0;
  for (const [target, sources] of [...map].sort(([a], [b]) => a.localeCompare(b))) {
    console.log(`\n✗ ${target}`);
    for (const s of [...sources].sort()) console.log(`    linked from ${s}`);
    total += sources.size;
  }
  return total;
}

const linkCount = printSection("Broken links (target does not exist)", broken);
const fragmentCount = printSection(
  "Broken fragments (page exists, anchor does not)",
  brokenFragments,
);

console.log(
  `\n${broken.size} broken links (${linkCount} occurrences), ` +
    `${brokenFragments.size} broken fragments (${fragmentCount} occurrences).`,
);
process.exit(1);
