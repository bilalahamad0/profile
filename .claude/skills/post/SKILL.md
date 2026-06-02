---
name: post
description: Cross-publish a post to the Blog and LinkedIn. Use when the user wants to publish/share something new on LinkedIn (e.g. "/post ...", "post this to my blog and LinkedIn", "draft a LinkedIn post about X"). Drafts an MDX blog article + a brand infographic, then (after explicit confirmation) publishes the same content to LinkedIn via the API and backfills the live URL.
---

# Blog → LinkedIn cross-publish

Draft once here → publish to the Blog → auto-post the same content to LinkedIn → store the live
LinkedIn URL back in the post. The actual LinkedIn post is **irreversible and public** — never
publish without showing the user the final image + text and getting an explicit "yes".

## 0. Preflight (fail fast)

- Confirm credentials exist: check that `.env.local` contains `LINKEDIN_CLIENT_ID` and either
  `LINKEDIN_REFRESH_TOKEN` or `LINKEDIN_ACCESS_TOKEN`. If missing, STOP and tell the user to run the
  one-time setup: `node scripts/linkedin-auth.mjs` (after adding the products + redirect URL — see the
  script header), then paste the printed `LINKEDIN_*` lines into `.env.local`.
- Use today's real date for the post date.

## 1. Draft the content (with the user)

Produce and confirm: `title`, `description` (1–2 sentence excerpt), `tags` (3–6), a `slug`
(use `slugify` from `scripts/lib/linkedin-core.mjs`; keep it `[a-z0-9-]`), the **LinkedIn body**
(the commentary — punchy, ≤ ~2800 chars before tags/link), and an **infographic concept**.

## 2. Render the brand infographic → `public/blog-thumbs/<slug>.png`

Write a spec and render it (2.05:1, date top-left, safe zones are built in):
```
node scripts/render-card.mjs --spec /tmp/<slug>.json --out public/blog-thumbs/<slug>.png
```
Spec keys: `pill, date, title, titleHighlight, subtitle, rows:[{label,value,suffix}], footer`.
For a bespoke visual, hand-author HTML and use `--html` instead. Prefer comparable units in `rows`
(bars scale to the max value). View the PNG to sanity-check it.

## 3. Create the MDX article + register it (the "Both" surface)

- `content/blog/<slug>.mdx` — frontmatter `title, date, description, tags, category, featured: false,
  linkedinUrl: ""` (backfilled in step 7) + the full article body.
- `src/app/blog/page.tsx` — append an entry to the `mdxPosts` array (slug, title, date, description,
  tags, category, readingTime, featured:false, thumbnail:`/blog-thumbs/<slug>.png`, linkedinUrl:"").
- `src/app/blog/[slug]/page.tsx` — add `"<slug>": "/blog-thumbs/<slug>.png"` to `slugToThumb`
  (drives OG image + header). The article page auto-renders a "Discuss on LinkedIn" button from
  `post.linkedinUrl` once it's set.

## 4. Quality gates (must pass before publishing)

`npm run build` (0 errors) · `npm run lint` (0 errors) · `npx vitest run` · Playwright-screenshot the
new card at 1440px and 390px and eyeball the crop.

## 5. CONFIRM GATE 🚦

Show the user the rendered image and the **exact** LinkedIn commentary text (run the poster with
`--dry-run` and show its payload). Ask for explicit approval. Do not continue without a clear yes.

## 6. Publish to LinkedIn

```
node --env-file=.env.local scripts/post-to-linkedin.mjs --confirm \
  --commentary-file /tmp/<slug>-commentary.txt \
  --image public/blog-thumbs/<slug>.png \
  --blog-url https://bilalahamad.com/blog/<slug> \
  --title "<title>" --description "<description>" --tags "<comma,tags>"
```
Capture the printed `POST_URL=<url>`. Default media is the uploaded image (blog link goes in the
text). Pass `--link-mode article` instead if the user wants a link-preview card from the blog's OG
image rather than a natively uploaded image (LinkedIn allows only one, not both).

## 7. Backfill the live URL + ship

- Put the `POST_URL` into the `.mdx` frontmatter `linkedinUrl` and the `mdxPosts` entry `linkedinUrl`.
- `git checkout -b post/<slug>`, commit (`feat(blog): <title> + LinkedIn cross-post`), push.
  Re-check the branch before pushing and use `--force-with-lease` (parallel-agent safety).

## Notes
- Existing blog posts are already on LinkedIn manually — this skill is for NEW posts only.
- Pure helpers (`scripts/lib/linkedin-core.mjs`) are unit-tested; API wrappers live in
  `scripts/lib/linkedin-api.mjs`. Validate end-to-end with `--dry-run` whenever unsure.
