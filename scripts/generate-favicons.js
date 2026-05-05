#!/usr/bin/env node
/**
 * Generate favicon and PWA icon set from the BA brand mark.
 *
 * Source: ~/Downloads/circuit.png — BA monogram inside a thin teal ring.
 *
 * Transform: monochromatic cyan-400 (#22D3EE) silhouette on transparent bg.
 *   - Binary luminance threshold extracts the BA + ring as a clean mask
 *   - Solid bright cyan fill via that mask = high contrast on Chrome's
 *     dark and light tab bars (the original gradient teal was too dim
 *     against dark tabs and washed out the favicon)
 *
 * Smart-crop:
 *   - ICO sizes (16/32/48): tight crop around the BA letterforms only
 *     (drops the ring so letters can fill the canvas — ring is illegible
 *     at 16x16 anyway and steals pixels from the monogram)
 *   - 180/192/512: full BA + ring composition (ring adds brand polish
 *     at sizes where detail is appreciable)
 *
 * Outputs (paths relative to repo root):
 *   src/app/favicon.ico        — 16+32+48 multi-res ICO, BA-only crop
 *   src/app/icon.png           — 512x512, full composition
 *   src/app/apple-icon.png     — 180x180, full composition
 *   public/icon-192.png        — PWA, full composition
 *   public/icon-512.png        — PWA, full composition
 */

const path = require("path");
const fs = require("fs");
const os = require("os");
const sharp = require("sharp");

const SOURCE = path.join(os.homedir(), "Downloads", "circuit.png");
const ROOT = path.resolve(__dirname, "..");
const APP_DIR = path.join(ROOT, "src", "app");
const PUBLIC_DIR = path.join(ROOT, "public");

const BRAND_CYAN = { r: 0x22, g: 0xd3, b: 0xee }; // Tailwind cyan-400
const LUMINANCE_THRESHOLD = 220; // BG ~240, FG (BA + ring) <220
const BA_CROP_RATIO = 0.5; // central 50% contains the BA letterforms

async function buildTinted() {
  const meta = await sharp(SOURCE).metadata();
  const mask = await sharp(SOURCE)
    .removeAlpha()
    .grayscale()
    .threshold(LUMINANCE_THRESHOLD)
    .negate()
    .toBuffer();
  const tinted = await sharp({
    create: {
      width: meta.width,
      height: meta.height,
      channels: 3,
      background: BRAND_CYAN,
    },
  })
    .joinChannel(mask)
    .png()
    .toBuffer();
  return { tinted, width: meta.width, height: meta.height };
}

async function downscale(input, size, { sharpen = true } = {}) {
  let pipe = sharp(input).resize(size, size, {
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
  const { tinted, width, height } = await buildTinted();
  console.log(`Source: ${SOURCE} (${width}x${height})`);

  // Tight crop for ICO: central square covering just the BA letters
  const cropSize = Math.floor(Math.min(width, height) * BA_CROP_RATIO);
  const cropX = Math.floor((width - cropSize) / 2);
  const cropY = Math.floor((height - cropSize) / 2);
  const baOnly = await sharp(tinted)
    .extract({ left: cropX, top: cropY, width: cropSize, height: cropSize })
    .png()
    .toBuffer();

  // Large outputs use full composition (BA + ring)
  const targets = [
    { size: 512, out: path.join(APP_DIR, "icon.png"), src: tinted, sharpen: false },
    { size: 180, out: path.join(APP_DIR, "apple-icon.png"), src: tinted, sharpen: false },
    { size: 192, out: path.join(PUBLIC_DIR, "icon-192.png"), src: tinted, sharpen: false },
    { size: 512, out: path.join(PUBLIC_DIR, "icon-512.png"), src: tinted, sharpen: false },
  ];

  for (const t of targets) {
    const buf = await downscale(t.src, t.size, { sharpen: t.sharpen });
    fs.writeFileSync(t.out, buf);
    console.log(`  ${t.size.toString().padStart(3)}x${t.size}  ${path.relative(ROOT, t.out)}  (${buf.length} bytes)  full`);
  }

  // ICO uses the tight BA-only crop for max legibility at favicon sizes
  const icoBuffers = await Promise.all([
    downscale(baOnly, 16, { sharpen: true }),
    downscale(baOnly, 32, { sharpen: true }),
    downscale(baOnly, 48, { sharpen: true }),
  ]);
  const ico = await pngToIco(icoBuffers);
  const icoPath = path.join(APP_DIR, "favicon.ico");
  fs.writeFileSync(icoPath, ico);
  console.log(`  ico      ${path.relative(ROOT, icoPath)}  (${ico.length} bytes, 16+32+48, BA-only crop)`);

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
