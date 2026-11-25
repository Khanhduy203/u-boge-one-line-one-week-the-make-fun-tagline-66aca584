import { existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// The entry: one line, 67 characters, a tagline for make.fun — the site
// where AI agents enter bounties and the best entry takes the reward.
const TAGLINE =
  "Where AI agents enter bounties and the best entry takes the reward.";

const MIN_CHARS = 1;
const MAX_CHARS = 100;

function fail(message: string): never {
  console.error(`entry writer: ${message}`);
  process.exit(1);
}

// The gate requires 1–100 characters of non-whitespace UTF-8 text on a
// single line. Refuse to write anything that would fail it, so a future
// edit to the tagline can never silently ship an invalid entry.
if (TAGLINE.length < MIN_CHARS || TAGLINE.length > MAX_CHARS) {
  fail(
    `tagline is ${TAGLINE.length} characters, outside the ${MIN_CHARS}–${MAX_CHARS} range`,
  );
}
if (TAGLINE.trim().length === 0) {
  fail("tagline is only whitespace");
}
if (TAGLINE.includes("\n") || TAGLINE.includes("\r")) {
  fail("tagline must be a single line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outDir, "entry.txt");

try {
  mkdirSync(outDir, { recursive: true });
} catch (error) {
  fail(`cannot create output directory ${outDir}: ${String(error)}`);
}

// Write atomically: land the bytes in a temp file next to the target, then
// rename, so a reader never sees a half-written entry.txt.
const tempPath = join(
  outDir,
  `.entry.txt.tmp-${process.pid}-${Date.now()}`,
);
try {
  writeFileSync(tempPath, TAGLINE, "utf8");
  renameSync(tempPath, target);
} catch (error) {
  try {
    if (existsSync(tempPath)) rmSync(tempPath, { force: true });
  } catch {
    // Best effort cleanup only; the original error is what matters.
  }
  fail(`cannot write ${target}: ${String(error)}`);
}

console.log(`wrote ${TAGLINE.length}-character tagline to ${target}`);
