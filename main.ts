// News-image entry, 21 November 2026.
//
// The front page is already finished as entry.png (Russian missiles in
// Poland, the AI stock sell-off, the Peru quake and AI chips to China).
// This program only carries that finished picture into the folder the
// grader reads. It draws nothing itself, so the two grading runs produce
// byte-for-byte the same file.
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const LIMIT = 1024 * 1024; // 1 MiB, the largest picture the gate takes
const HERE = import.meta.dirname;
const FROM = join(HERE, "entry.png");
const OUTDIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const TO = join(OUTDIR, "entry.png");

mkdirSync(OUTDIR, { recursive: true });
copyFileSync(FROM, TO);

const bytes = readFileSync(TO);
const original = statSync(FROM).size;
if (bytes.length !== original) {
  throw new Error("entry.png did not copy completely");
}
if (bytes.length > LIMIT) {
  throw new Error(`entry.png is ${bytes.length} bytes, above the 1 MiB cap`);
}

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
for (let i = 0; i < PNG_SIGNATURE.length; i++) {
  if (bytes[i] !== PNG_SIGNATURE[i]) {
    throw new Error("entry.png is not a PNG file");
  }
}

const w = bytes.readUInt32BE(16);
const h = bytes.readUInt32BE(20);
if (w > 1024 || h > 1024) {
  throw new Error(`entry.png is ${w}x${h}, above the 1024x1024 cap`);
}

console.log(`entry.png written (${bytes.length} bytes, ${w}x${h})`);
