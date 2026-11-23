#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const HUB = "PlakarKorp/hub";
const TIER = "community";
const OUTPUT = fileURLToPath(
  new URL("../data/community-integrations.json", import.meta.url),
);
const DIST = "https://plakar.io/dist/plugins/kloset";

// Maintainers whose integrations are listed as Plakar or partner integrations.
const SKIP_MAINTAINERS = ["PlakarKorp", "gillesdubois"];

// Connector types, mapped to the catalog categories.
const CATEGORIES = {
  importer: "source",
  exporter: "destination",
  storage: "storage",
};

// Whether the dist holds a package of this version for at least one platform.
// Recipes without one cannot be installed with `plakar pkg add`.
const isBuilt = async (version, name, pkgVersion) => {
  const res = await fetch(`${DIST}/${TIER}/${version}/${name}/`);
  if (res.status === 404) return false;
  if (!res.ok)
    throw new Error(`failed to check package ${name}: HTTP ${res.status}`);
  return (await res.text()).includes(`${name}_${pkgVersion}_`);
};

const gh = (path) =>
  JSON.parse(execFileSync("gh", ["api", path], { encoding: "utf8" }));

const raw = (repo, path) => {
  try {
    const file = gh(`repos/${repo}/contents/${path}`);
    return Buffer.from(file.content, "base64").toString("utf8");
  } catch {
    return "";
  }
};

// Recipes and manifests are flat YAML. Only top-level scalars and connector
// types are needed, so a full YAML parser is not.
const field = (yaml, key) => {
  const m = yaml.match(new RegExp(`^${key}:[ \\t]*(.*)$`, "m"));
  if (!m) return "";
  return m[1].trim().replace(/^(["'])(.*)\1$/, "$2");
};

const connectorTypes = (yaml) => [
  ...new Set(
    [...yaml.matchAll(/^\s*-?\s*type:\s*([\w-]+)/gm)].map((m) => m[1]),
  ),
];

const versionKey = (v) => v.replace(/^v/, "").split(".").map(Number);
const newest = (a, b) => {
  const [x, y] = [versionKey(a), versionKey(b)];
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0);
  }
  return 0;
};

const versions = gh(`repos/${HUB}/contents/${TIER}`)
  .filter((e) => e.type === "dir")
  .map((e) => e.name)
  .sort(newest);
const latest = versions.at(-1);
if (!latest) throw new Error(`no ${TIER} recipes found in ${HUB}`);

const recipes = gh(`repos/${HUB}/contents/${TIER}/${latest}`).filter(
  (e) => e.type === "dir",
);

const integrations = [];
for (const { name } of recipes) {
  const path = `${TIER}/${latest}/${name}/recipe.yaml`;
  const recipe = raw(HUB, path);
  if (!recipe) throw new Error(`failed to read recipe ${path} from ${HUB}`);
  const maintainer = field(recipe, "maintainer");
  if (!maintainer || SKIP_MAINTAINERS.includes(maintainer)) continue;

  const version = field(recipe, "version");
  if (!(await isBuilt(latest, name, version))) {
    console.log(`${name}: no package built for ${version}, skipped`);
    continue;
  }

  const repository = field(recipe, "repository");
  const repo = repository.replace(/^https:\/\/github\.com\//, "");
  const manifest = raw(repo, "manifest.yaml");
  const info = gh(`repos/${repo}`);
  const [commit] = gh(`repos/${HUB}/commits?path=${path}&per_page=1`);

  integrations.push({
    name,
    title: field(manifest, "display_name") || name,
    description: field(manifest, "description") || info.description || "",
    version,
    repository,
    maintainer,
    categories: [
      ...new Set(
        connectorTypes(manifest)
          .map((t) => CATEGORIES[t])
          .filter(Boolean),
      ),
    ],
    date: commit?.commit?.committer?.date || "",
  });
  console.log(`${name} (${maintainer})`);
}

integrations.sort((a, b) => a.name.localeCompare(b.name));
writeFileSync(OUTPUT, JSON.stringify(integrations, null, 2) + "\n");
execFileSync("npx", ["prettier", "--write", OUTPUT], { stdio: "ignore" });
console.log(`wrote ${integrations.length} integrations to ${OUTPUT}`);
