// Saves the real answer for a demo photo so DEMO_MODE can replay it if the AI fails on stage.
// Usage: npm run demo:save -- path/to/photo.jpg
// Only works when the exact same file is uploaded later (for example from a laptop).
import { readFileSync, writeFileSync } from "node:fs";
import { extname } from "node:path";
import { extractPackDetails } from "@/lib/ai/extract";
import { verifyPack } from "@/lib/match/verifyPack";
import { hashImage } from "@/lib/demo/fallback";

const file = process.argv[2];
if (!file) throw new Error("Usage: npm run demo:save -- path/to/photo.jpg");

const types: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};
const mimeType = types[extname(file).toLowerCase()];
if (!mimeType) throw new Error("Use a .jpg, .png or .webp photo");

const image = readFileSync(file);
const response = verifyPack(await extractPackDetails(image, mimeType));
const path = "data/demo-responses.json";
const saved = JSON.parse(readFileSync(path, "utf8"));
saved[hashImage(image)] = response;
writeFileSync(path, JSON.stringify(saved, null, 2) + "\n");
console.log(`Saved ${response.verdict} for ${file}`);
