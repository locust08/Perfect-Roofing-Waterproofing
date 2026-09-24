import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const output = "dist";
const redirects = readFileSync(path.join(output, "_redirects"), "utf8")
  .split(/\r?\n/)
  .filter((line) => line.trim() && !line.startsWith("#"));

const missing = redirects.flatMap((line) => {
  const [, destination] = line.trim().split(/\s+/);
  const route = destination.split(/[?#]/, 1)[0].replace(/\/$/, "") || "/";
  const relative = route.replace(/^\//, "");
  const page = path.join(output, relative, "index.html");
  const asset = path.join(output, relative);
  return existsSync(page) || statSync(asset, { throwIfNoEntry: false })?.isFile() ? [] : [destination];
});

if (missing.length) {
  throw new Error(`Redirect destinations missing from generated output: ${[...new Set(missing)].join(", ")}`);
}

console.log(`Checked ${redirects.length} shipped redirect destinations against generated output.`);
