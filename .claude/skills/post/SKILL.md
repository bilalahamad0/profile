---
name: post
description: Cross-publish a post to the Blog AND LinkedIn, fully automated. TRIGGER on any request to publish/share a new post to LinkedIn — e.g. "post this on blog and LinkedIn", "post on blog and LinkedIn", "share this on LinkedIn", "publish a LinkedIn post about X", "/post ...". The agent does ALL technical steps itself (draft, infographic, MDX article, blog wiring, build, LinkedIn publish via API, backfill the live URL, commit, push). The user's only inputs are the topic/content and a single final approval (waivable). Existing blog posts are already on LinkedIn manually — this is for NEW posts only.
---

# Blog → LinkedIn cross-publish (fully automated)

When the user asks to post something to blog + LinkedIn, **you do everything below yourself**. The
user does not run commands or edit files. Their only inputs: the topic/content, one final approval of
the post (skip it if they say "just post it" / "no preview"), and — at most once every ~60 days — a
single "Allow" click to renew the LinkedIn token (LinkedIn issues no refresh token for this app, so
that one OAuth click is unavoidable; everything around it is automated).

All commands run from the repo root. Credentials live in `.env.local` (gitignored).

## 0. Token preflight (automatic — never post with a dead token)

```
node --env-file=.env.local scripts/post-to-linkedin.mjs --check-token
```
- `TOKEN_STATUS=ok` → continue.
- `TOKEN_STATUS=expiring` (≤7 days left) → continue, but mention it'll need a renewal soon.
- `TOKEN_STATUS=expired` (exit 3) → **renew it for the user, don't make them figure it out:** run
  `node --env-file=.env.local scripts/linkedin-auth.mjs --write`, tell them "your 60-day LinkedIn
  token expired — I've opened LinkedIn; please click **Allow** in the browser." Wait for it to write
  the new keys, re-run `--check-token` to confirm `ok`, then continue.
- `TOKEN_STATUS=error` (no creds) → first-time setup: see `scripts/linkedin-auth.mjs` header.

## 1. Draft (propose, don't make them write it)

Draft and briefly confirm: `title`, `description` (1–2 sentences), `tags` (3–6), the **LinkedIn body**
(commentary; punchy, ≤ ~2800 chars before link/tags), and an **infographic concept**. Compute the
`slug` with `slugify` from `scripts/lib/linkedin-core.mjs` (`[a-z0-9-]`). Use today's real date.

## 2. Render the infographic → `public/blog-thumbs/<slug>.png`

```
node scripts/render-card.mjs --spec /tmp/<slug>.json --out public/blog-thumbs/<slug>.png
```
Spec keys: `pill, date, title, titleHighlight, subtitle, rows:[{label,value,suffix}], footer`
(omit `rows` for a clean title card). 2.05:1 + date-top-left crop-safety is built in. View the PNG.

## 3. Create the MDX article + wire it in (the "Both" surface)

- `content/blog/<slug>.mdx` — frontmatter `title, date, description, tags, category, featured:false,
  linkedinUrl:""` (backfilled in step 6) + the article body.
- `src/app/blog/page.tsx` — append a `mdxPosts` entry (slug, title, date, description, tags, category,
  readingTime, featured:false, `thumbnail:"/blog-thumbs/<slug>.png"`, `linkedinUrl:""`).
- `src/app/blog/[slug]/page.tsx` — add `"<slug>": "/blog-thumbs/<slug>.png"` to `slugToThumb`.
  (The article auto-renders a "Discuss on LinkedIn" button once `linkedinUrl` is set.)

## 4. Quality gates

`npm run build` (0 errors) · `npm run lint` (0 errors) · `npx vitest run` · screenshot the new card at
1440px + 390px and eyeball the crop.

## 5. Single approval 🚦 (the one human decision)

Run the poster with `--dry-run` and show the user the **rendered image + the exact LinkedIn text**.
Ask once for a yes. **Skip this step only if the user explicitly said to post without preview.** Never
publish on a typo'd/unreviewed draft by default — it's public under their name and irreversible.

## 6. Publish + backfill + ship (all automatic)

```
node --env-file=.env.local scripts/post-to-linkedin.mjs --confirm \
  --commentary-file /tmp/<slug>-commentary.txt --image public/blog-thumbs/<slug>.png \
  --blog-url https://bilalahamad.com/blog/<slug> --title "<title>" --tags "<comma,tags>"
```
Capture `POST_URL=<url>`. Default media = the uploaded image with the blog link in the text; pass
`--link-mode article` for a link-preview card instead (LinkedIn allows only one). Then:
- Write `POST_URL` into the `.mdx` frontmatter `linkedinUrl` and the `mdxPosts` entry.
- `git checkout -b post/<slug>`, commit `feat(blog): <title> + LinkedIn cross-post`, push
  (`--force-with-lease`, re-check branch first — parallel-agent safety). Offer to open a PR.

## Notes
- Pure helpers (`scripts/lib/linkedin-core.mjs`, `linkedin-token.mjs`) are unit-tested; API I/O is in
  `scripts/lib/linkedin-api.mjs`. The poster refuses to publish without `--confirm`.
