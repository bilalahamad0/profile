import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Guards what Google needs to find and index the blog (GSC, 2026-10).
 *
 * Everything here reads the raw server HTML through `request`, so no JS runs:
 * this is what a crawler sees before rendering.
 *  - /blog used to load its grid with ssr:false, so the HTML linked only the
 *    featured post. The other seven were reachable only from /projects.
 *  - MDX "# Heading" lines rendered a second, differently worded <h1>.
 *  - Tag-only "Keep reading" ranking never linked ai-driven-development.
 */

// Same slug rule as src/lib/blog.ts getAllPosts().
const SLUGS = fs
  .readdirSync(path.join(process.cwd(), 'content/blog'))
  .filter((f) => f.endsWith('.mdx'))
  .map((f) => f.replace(/\.mdx$/, '').replace(/[^a-zA-Z0-9-]/g, ''));

test.describe('blog crawlability', () => {
  test('the /blog server HTML links every post', async ({ request }) => {
    const html = await (await request.get('/blog')).text();
    for (const slug of SLUGS) {
      expect(html, `/blog is missing a crawlable link to ${slug}`).toContain(`href="/blog/${slug}"`);
    }
  });

  test('every post has exactly one <h1>', async ({ request }) => {
    for (const slug of SLUGS) {
      const html = await (await request.get(`/blog/${slug}`)).text();
      expect(html.match(/<h1[\s>]/g) ?? [], `${slug} should have one <h1>`).toHaveLength(1);
    }
  });

  test('every post is linked from at least one other post', async ({ request }) => {
    const inbound = new Set<string>();
    for (const slug of SLUGS) {
      const html = await (await request.get(`/blog/${slug}`)).text();
      for (const [, target] of html.matchAll(/href="\/blog\/([A-Za-z0-9-]+)"/g)) {
        if (target !== slug) inbound.add(target);
      }
    }
    for (const slug of SLUGS) {
      expect(inbound.has(slug), `no other post links to ${slug}`).toBe(true);
    }
  });
});
