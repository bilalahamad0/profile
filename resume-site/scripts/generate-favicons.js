#!/usr/bin/env node
/**
 * Generate favicon and PWA icon set from the BA brand mark.
 *
 * Source: ~/Downloads/test-2.png — pure BA monogram on teal disc.
 *   Selected after 16x16 legibility tests across 10 candidates: this is
 *   the only design where "BA" letterforms survive downscaling to favicon size.
 *
 * Outputs (paths relative to resume-site/):
 *   src/app/favicon.ico        — 16+32+48 multi-res ICO
 *   src/app/icon.png           — 512x512 (Next.js auto-detected)
 *   src/app/apple-icon.png     — 180x180 (Next.js auto-detected)
 *   public/icon-192.png        — PWA manifest
 *   public/icon-512.png        — PWA manifest
 */

const path = require("path");
const fs = require("fs");
const os = require("os");
const sharp = require("sharp");

const SOURCE = path.join(os.homedir(), "Downloads", "test-2.png");
const ROOT = path.resolve(__dirname, "..");
const APP_DIR = path.join(ROOT, "src", "app");
const PUBLIC_DIR = path.join(ROOT, "public");

async function downscale(size, { sharpen = true } = {}) {
  let pipe = sharp(SOURCE).resize(size, size, {
    kernel: sharp.kernel.lanczos3,
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });
  if (sharpen) {
    pipe = pipe.sharpen({ sigma: 0.6, m1: 0.5, m2: 2 });
  }
  return pipe.png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
}

async function main() {
  if (!fs.existsSync(SOURCE)) {
    throw new Error(`Source not found: ${SOURCE}`);
  }

  const { default: pngToIco } = await import("png-to-ico");

  const meta = await sharp(SOURCE).metadata();
  console.log(`Source: ${SOURCE} (${meta.width}x${meta.height})`);

  const targets = [
    { size: 512, out: path.join(APP_DIR, "icon.png"), sharpen: false },
    { size: 180, out: path.join(APP_DIR, "apple-icon.png"), sharpen: false },
    { size: 192, out: path.join(PUBLIC_DIR, "icon-192.png"), sharpen: false },
    { size: 512, out: path.join(PUBLIC_DIR, "icon-512.png"), sharpen: false },
  ];

  for (const t of targets) {
    const buf = await downscale(t.size, { sharpen: t.sharpen });
    fs.writeFileSync(t.out, buf);
    console.log(`  ${t.size.toString().padStart(3)}x${t.size}  ${path.relative(ROOT, t.out)}  (${buf.length} bytes)`);
  }

  const icoBuffers = await Promise.all([
    downscale(16, { sharpen: true }),
    downscale(32, { sharpen: true }),
    downscale(48, { sharpen: true }),
  ]);
  const ico = await pngToIco(icoBuffers);
  const icoPath = path.join(APP_DIR, "favicon.ico");
  fs.writeFileSync(icoPath, ico);
  console.log(`  ico      ${path.relative(ROOT, icoPath)}  (${ico.length} bytes, 16+32+48)`);

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
