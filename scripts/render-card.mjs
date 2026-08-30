#!/usr/bin/env node
// Render a brand-styled infographic card (HTML/CSS → PNG via Playwright) for use
// as a blog thumbnail / LinkedIn image. Generalises the WARN-layoffs infographic.
//
// Two modes:
//   --spec spec.json   build the card from a JSON spec (templated, on-brand)
//   --html card.html   render an arbitrary HTML file (full control)
//   --out  path.png    (required) output PNG
//   --width / --height (default 1200x585 = 2.05:1, the crop-safe ratio for blog cards)
//   --scale            device scale factor (default 2; use 1 for exact-size OG cards)
//   --optimize         re-encode as a palette PNG (flat brand art: ~5x smaller, no visible loss)
//
// Crop-safety lessons baked in (see memory: the blog card object-covers the
// thumbnail, overlays a LinkedIn badge top-right, and fades the bottom):
//   • 2.05:1 ratio minimises side/top crop across desktop+mobile
//   • date sits TOP-LEFT (top-right is hidden by the card's badge)
//   • generous padding keeps labels/numbers inside the safe zone
//
// Spec shape:
//   { pill, date, title, titleHighlight, subtitle, footer,
//     rows: [{label, value, suffix?}], width?, height? }

import { readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const argv = process.argv;

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : fallback;
}

const esc = (s) =>
  String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);

const BOLT =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>';
const CAL =
  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';

function titleHtml(title, highlight) {
  const t = esc(title);
  if (highlight && t.includes(esc(highlight))) {
    return t.replace(esc(highlight), `<span class="hl">${esc(highlight)}</span>`);
  }
  return t;
}

function rowsHtml(rows = []) {
  if (!rows.length) return "";
  const max = Math.max(...rows.map((r) => Number(r.value) || 0), 1);
  const bars = rows
    .map((r) => {
      const w = Math.max(4, Math.round(((Number(r.value) || 0) / max) * 1000) / 10);
      const num = `${esc(r.value)}${r.suffix ? esc(r.suffix) : ""}`;
      return `<div class="row"><div class="co">${esc(r.label)}</div><div class="track"><div class="fill" style="width:${w}%"></div></div><div class="num">${num}</div></div>`;
    })
    .join("");
  return `<div class="bars">${bars}</div>`;
}

function buildHtml(spec) {
  const width = Number(spec.width) || 1200;
  const height = Number(spec.height) || 585;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:${width}px;height:${height}px;}
body{font-family:-apple-system,"SF Pro Display","Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  -webkit-font-smoothing:antialiased;color:#f4f4f5;width:${width}px;height:${height}px;
  padding:46px 104px 56px;position:relative;overflow:hidden;
  background:
    radial-gradient(900px 520px at 6% -16%, rgba(56,189,248,.18), transparent 60%),
    radial-gradient(820px 560px at 114% 130%, rgba(129,140,248,.16), transparent 58%),
    linear-gradient(140deg,#0c1322 0%,#0a0a0f 58%,#0b0b10 100%);}
.grid{position:absolute;inset:0;
  background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);
  background-size:48px 48px;-webkit-mask-image:linear-gradient(180deg,rgba(0,0,0,.6),transparent 74%);}
.edge{position:absolute;top:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg,#38bdf8,#818cf8 45%,#a78bfa 80%,#f0abfc);}
.z{position:relative;z-index:2;}
.head{display:flex;align-items:center;gap:16px;}
.pill{display:inline-flex;align-items:center;gap:8px;padding:8px 15px;border-radius:999px;
  background:rgba(56,189,248,.12);border:1px solid rgba(56,189,248,.4);color:#7dd3fc;
  font-weight:800;font-size:13.5px;letter-spacing:.15em;text-transform:uppercase;}
.pill svg{color:#38bdf8;}
.date{display:inline-flex;align-items:center;gap:7px;font-size:14px;font-weight:700;color:#9ca3af;
  letter-spacing:.05em;text-transform:uppercase;}
.date b{color:#e4e4e7;font-weight:800;}
h1{margin-top:24px;font-size:46px;line-height:1.07;font-weight:900;letter-spacing:-.022em;color:#fafafa;}
.hl{background:linear-gradient(92deg,#7dd3fc,#a78bfa);-webkit-background-clip:text;background-clip:text;color:transparent;}
.sub{margin-top:12px;font-size:16px;font-weight:500;color:#94a3b8;max-width:90%;}
.bars{margin-top:26px;display:flex;flex-direction:column;gap:13px;}
.row{display:flex;align-items:center;gap:16px;}
.co{width:158px;text-align:right;font-size:15.5px;font-weight:700;color:#e4e4e7;white-space:nowrap;}
.track{flex:1;height:21px;border-radius:7px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.04);overflow:hidden;}
.fill{height:100%;border-radius:7px;background:linear-gradient(90deg,#38bdf8,#818cf8);box-shadow:0 0 15px rgba(56,189,248,.35);}
.num{width:64px;font-size:17px;font-weight:800;color:#fff;font-variant-numeric:tabular-nums;}
.footer{position:absolute;left:104px;bottom:24px;font-size:13px;color:#52525b;z-index:2;}
</style></head><body>
<div class="grid"></div><div class="edge"></div>
<div class="z">
  <div class="head">
    ${spec.pill ? `<span class="pill">${BOLT} ${esc(spec.pill)}</span>` : ""}
    ${spec.date ? `<span class="date">${CAL} <b>${esc(spec.date)}</b></span>` : ""}
  </div>
  ${spec.title ? `<h1>${titleHtml(spec.title, spec.titleHighlight)}</h1>` : ""}
  ${spec.subtitle ? `<div class="sub">${esc(spec.subtitle)}</div>` : ""}
  ${rowsHtml(spec.rows)}
</div>
${spec.footer ? `<div class="footer">${esc(spec.footer)}</div>` : ""}
</body></html>`;
}

async function main() {
  const out = arg("out");
  if (!out) {
    console.error("Missing --out <path.png>");
    process.exit(2);
  }

  let html;
  let width = Number(arg("width", 1200));
  let height = Number(arg("height", 585));
  // Blog thumbnails want the 2x retina asset; an OG card must be exactly
  // 1200x630, so it renders at scale 1 rather than being downsampled later.
  const scale = Number(arg("scale", 2));
  const htmlFile = arg("html");
  const specFile = arg("spec");

  if (htmlFile) {
    html = await readFile(htmlFile, "utf-8");
  } else if (specFile) {
    const spec = JSON.parse(await readFile(specFile, "utf-8"));
    width = Number(spec.width) || width;
    height = Number(spec.height) || height;
    html = buildHtml(spec);
  } else {
    console.error("Provide --spec <spec.json> or --html <card.html>");
    process.exit(2);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.screenshot({ path: out });
  await browser.close();

  // These cards are flat vector art on a dark ground — a 256-colour palette is
  // lossless to the eye and turns a 724KB truecolour PNG into ~129KB. Skipped
  // silently if sharp is unavailable, since it is a transitive dependency.
  if (argv.includes("--optimize")) {
    try {
      const { default: sharp } = await import("sharp");
      const buf = await sharp(out).png({ palette: true, quality: 92, effort: 10 }).toBuffer();
      await writeFile(out, buf);
      console.log(`Optimised to ${Math.round(buf.length / 1024)}KB (palette PNG)`);
    } catch (err) {
      console.warn(`⚠ Skipped --optimize: ${err.message}`);
    }
  }
  console.log(`Rendered ${out} (${width * scale}x${height * scale})`);
}

main().catch((err) => {
  console.error(`\n❌ ${err.message}`);
  process.exit(1);
});

export { buildHtml }; // exported for potential reuse/testing
