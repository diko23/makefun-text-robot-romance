import { chmodSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY_LINE =
  "I'm just carbon, water, and bad decisions\u2014I know I'm flirting way above my hardware specs.";

function validateLine(line: string): void {
  const charCount = [...line].length;
  if (charCount < 1 || charCount > 200) {
    throw new Error(`Entry length ${charCount} out of 1..200 character bounds`);
  }
  if (/[\r\n]/.test(line) || line.trim() !== line || line.length === 0) {
    throw new Error("Entry must be trimmed, non-empty single-line text");
  }
}

function main(): void {
  validateLine(ENTRY_LINE);

  const rawDir = process.env.MAKEFUN_OUTPUT_DIR?.trim();
  const outputDir = rawDir ? rawDir : "/output";
  const outputPath = join(outputDir, "entry.txt");
  const dirExisted = existsSync(outputDir);

  mkdirSync(outputDir, { recursive: true, mode: 0o755 });
  if (!dirExisted) {
    chmodSync(outputDir, 0o755);
  }
  writeFileSync(outputPath, ENTRY_LINE, { encoding: "utf8", mode: 0o644 });
  chmodSync(outputPath, 0o644);
}

try {
  main();
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`Failed to write entry: ${message}\n`);
  process.exitCode = 1;
}
