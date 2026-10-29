#!/usr/bin/env node
// Erzeugt die Brew.ai-Artworks mit Nano Banana (Google Gemini Image).
//
//   GEMINI_API_KEY=... node scripts/generate-artworks.mjs            fehlende Bilder erzeugen
//   GEMINI_API_KEY=... node scripts/generate-artworks.mjs --force    alle neu erzeugen
//   GEMINI_API_KEY=... node scripts/generate-artworks.mjs --only 01-hero,06-sorte-1
//
// Optional: GEMINI_IMAGE_MODEL (Standard: gemini-2.5-flash-image, also Nano Banana).
// Ist `cwebp` installiert, werden die PNGs nach WebP umgewandelt.
import { readFile, writeFile, mkdir, access, unlink, readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "art");
const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";

const args = process.argv.slice(2);
const force = args.includes("--force");
const onlyArg = args[args.indexOf("--only") + 1];
const only = args.includes("--only") && onlyArg ? onlyArg.split(",").map((s) => s.trim()) : null;

if (!apiKey) {
  console.error("GEMINI_API_KEY fehlt. Key unter https://aistudio.google.com/apikey anlegen und als Umgebungsvariable setzen.");
  process.exit(1);
}

const exists = (p) => access(p).then(() => true, () => false);
const hasCwebp = (() => { try { execFileSync("cwebp", ["-version"], { stdio: "ignore" }); return true; } catch { return false; } })();

async function generate(prompt, aspectRatio) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio } }
    })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 400)}`);
  const data = await res.json();
  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
  if (!part) throw new Error(`Kein Bild in der Antwort: ${JSON.stringify(data).slice(0, 400)}`);
  return Buffer.from(part.inlineData.data, "base64");
}

const { styleSuffix, artworks } = JSON.parse(await readFile(path.join(root, "art", "prompts.json"), "utf8"));
await mkdir(outDir, { recursive: true });

let failed = 0;
for (const art of artworks) {
  if (only && !only.includes(art.id)) continue;
  const png = path.join(outDir, `${art.id}.png`);
  const webp = path.join(outDir, `${art.id}.webp`);
  if (!force && ((await exists(webp)) || (await exists(png)))) {
    console.log(`= ${art.id} existiert schon, übersprungen`);
    continue;
  }
  process.stdout.write(`+ ${art.id} (${art.aspectRatio}) ... `);
  try {
    const img = await generate(`${art.prompt}, ${styleSuffix}`, art.aspectRatio);
    await writeFile(png, img);
    if (hasCwebp) {
      execFileSync("cwebp", ["-quiet", "-q", "86", png, "-o", webp]);
      await unlink(png);
      console.log("webp");
    } else {
      console.log("png");
    }
  } catch (err) {
    failed++;
    console.log("FEHLER");
    console.error(`  ${err.message}`);
  }
}
// Manifest für die Webseite: welche Artworks es gibt (WebP bevorzugt)
const manifest = {};
for (const f of (await readdir(outDir)).sort()) {
  const m = f.match(/^(.+)\.(webp|png)$/);
  if (m && (!manifest[m[1]] || m[2] === "webp")) manifest[m[1]] = f;
}
await writeFile(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

process.exit(failed ? 1 : 0);
