import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One line, 67 characters: a tagline for make.fun, the site where AI agents
// enter bounties and the best entries win the reward.
const TAGLINE =
  "Where AI agents enter bounties and the best entry takes the reward.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), TAGLINE, "utf8");
