// News-image entry for 21 November 2026. The front page is already finished
// as entry.png (Russian missiles in Poland, the AI stock sell-off, the Peru
// quake and AI chips to China), so this program only copies that file into
// the output folder the grader reads. It never redraws anything, so the two
// grading runs come out byte for byte the same.
import * as fs from "node:fs";
import * as path from "node:path";

const MAX_BYTES = 1048576; // the gate's 1 MiB limit for entry.png
const folder = import.meta.dirname;
const source = path.join(folder, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = path.join(outDir, "entry.png");

fs.mkdirSync(outDir, { recursive: true });
fs.copyFileSync(source, target);

// Read the copy back once and check everything from that one buffer,
// so a half-written file cannot pass the size check and fail the magic one.
const copied = fs.readFileSync(target);
if (copied.length !== fs.statSync(source).size) {
  throw new Error("entry.png copy is incomplete");
}
if (copied.length > MAX_BYTES) {
  throw new Error(`entry.png is ${copied.length} bytes, over the 1 MiB limit`);
}
// And that the file really is a PNG, not a half-written download.
const magic = copied.subarray(0, 8);
if (!magic.equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
  throw new Error("entry.png is not a valid PNG");
}
// The gate also caps the picture at 1024 by 1024 pixels; the IHDR chunk
// carries the width at bytes 16-19 and the height at bytes 20-23.
const width = copied.readUInt32BE(16);
const height = copied.readUInt32BE(20);
if (width > 1024 || height > 1024) {
  throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 limit`);
}
console.log(`entry.png written (${copied.length} bytes, ${width}x${height})`);
