import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const wanted = readFileSync(
  new URL("../.hugo-version", import.meta.url),
  "utf8",
).trim();

let output;
try {
  output = execFileSync("hugo", ["version"], { encoding: "utf8" });
} catch {
  console.error(
    `Hugo not found. Install Hugo extended ${wanted} (see .hugo-version).`,
  );
  process.exit(1);
}

const found = output.match(/^hugo v(\d+\.\d+\.\d+)/)?.[1];
if (found !== wanted) {
  console.error(
    `Hugo ${found ?? "of unknown version"} found, but this site builds with ${wanted} (see .hugo-version).`,
  );
  process.exit(1);
}
