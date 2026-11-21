// Regla de arquitectura: ningun archivo de codigo fuente supera 100 lineas.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const MAX_LINES = 100;
const DIRS = ["src", "scripts", "tests"];
const EXT = /\.(ts|tsx|js|jsx|mjs|cjs)$/;

function walk(dir, out = []) {
  let entries = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry === "node_modules" || entry === "dist") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (EXT.test(entry)) out.push(full);
  }
  return out;
}

const files = DIRS.flatMap((dir) => walk(join(ROOT, dir)));
const offenders = files
  .map((file) => ({
    file: relative(ROOT, file).replaceAll("\\", "/"),
    lines: readFileSync(file, "utf8").split(/\r?\n/).length,
  }))
  .filter((entry) => entry.lines > MAX_LINES)
  .sort((a, b) => b.lines - a.lines);

console.log(`Revisando ${files.length} archivos (limite ${MAX_LINES} lineas)...`);

if (offenders.length > 0) {
  for (const item of offenders) console.error(`  X ${item.file}: ${item.lines} lineas`);
  console.error(`\n${offenders.length} archivo(s) exceden el limite. Refactoriza antes del commit.`);
  process.exit(1);
}

console.log("OK: todos los archivos cumplen el limite de 100 lineas.");
