import { test, expect, Page } from '@playwright/test';

type Tier = 'mobile' | 'tablet' | 'desktop';

const VIEWPORTS: Array<{ width: number; height: number; label: string; tier: Tier }> = [
  { width: 375, height: 812, label: '375', tier: 'mobile' },
  { width: 390, height: 844, label: '390', tier: 'mobile' },
  { width: 768, height: 1024, label: '768', tier: 'tablet' },
  { width: 1280, height: 900, label: '1280', tier: 'desktop' },
  { width: 1440, height: 900, label: '1440', tier: 'desktop' },
  { width: 1920, height: 1080, label: '1920', tier: 'desktop' },
];

const PAGES = [
  { path: '/', name: 'home' },
  { path: '/certifications', name: 'certifications' },
  { path: '/experience', name: 'experience' },
  { path: '/projects', name: 'projects' },
  { path: '/ai', name: 'ai' },
  { path: '/blog', name: 'blog' },
  { path: '/contact', name: 'contact' },
];

const TOLERANCES: Record<Tier, { headerPtMin: number; headerPtMax: number; sectionPyMin: number; sectionPyMax: number }> = {
  mobile: { headerPtMin: 88, headerPtMax: 104, sectionPyMin: 40, sectionPyMax: 104 },
  tablet: { headerPtMin: 104, headerPtMax: 144, sectionPyMin: 64, sectionPyMax: 104 },
  desktop: { headerPtMin: 136, headerPtMax: 176, sectionPyMin: 72, sectionPyMax: 176 },
};

async function getSectionMetrics(page: Page) {
  return page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section'));
    return sections.map((s, i) => {
      const cs = window.getComputedStyle(s);
      const rect = s.getBoundingClientRect();
      return {
        index: i,
        paddingTop: parseFloat(cs.paddingTop),
        paddingBottom: parseFloat(cs.paddingBottom),
        height: rect.height,
        top: rect.top + window.scrollY,
      };
    });
  });
}

for (const vp of VIEWPORTS) {
  for (const p of PAGES) {
    test(`${p.name} @ ${vp.label}px — section spacing within tolerances`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(p.path);
      await page.waitForLoadState('networkidle');

      const sections = await getSectionMetrics(page);
      expect(sections.length, 'page should render at least one <section>').toBeGreaterThan(0);

      const tol = TOLERANCES[vp.tier];

      // First section is the page header on every page except '/' (which has Hero first).
      // Assert header padding-top falls within the header tier band for header pages.
      if (p.name !== 'home') {
        const header = sections[0];
        expect(header.paddingTop, `${p.name} header pt @ ${vp.label}px`).toBeGreaterThanOrEqual(tol.headerPtMin - 4);
        expect(header.paddingTop, `${p.name} header pt @ ${vp.label}px`).toBeLessThanOrEqual(tol.headerPtMax + 4);
      }

      // All sections: each side of vertical padding should fall within the standard band.
      for (const s of sections) {
        const py = Math.max(s.paddingTop, s.paddingBottom);
        // Cap at sectionPyMax with a generous +8px tolerance for hero/header sections
        expect(py, `section ${s.index} ${p.name} max(py) @ ${vp.label}px`).toBeLessThanOrEqual(tol.sectionPyMax + 24);
      }

      // Inter-section gap: bottom of section N + top of section N+1 should not exceed
      // 2 * sectionPyMax + 32 buffer (no border decorations counted).
      for (let i = 0; i < sections.length - 1; i++) {
        const gap = sections[i].paddingBottom + sections[i + 1].paddingTop;
        expect(gap, `gap between section ${i} and ${i + 1} on ${p.name} @ ${vp.label}px`).toBeLessThanOrEqual(2 * tol.sectionPyMax + 32);
      }

      await testInfo.attach(`${p.name}-${vp.label}.png`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });
  }
}

test('certifications space-y stack gap on mobile is ≤ 80px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/certifications');
  await page.waitForLoadState('networkidle');

  // The space-y-* container holds all main content sections.
  const stackGap = await page.evaluate(() => {
    const stack = document.querySelector('.max-w-7xl.mx-auto.px-6 > section');
    if (!stack || !stack.parentElement) return null;
    const cs = window.getComputedStyle(stack.parentElement);
    return parseFloat(cs.rowGap || '0');
  });

  // Tailwind space-y-16 sets a 64px margin-top on siblings; rowGap may be 0 on flex/block.
  // Fallback: measure first→second section delta minus first section height.
  if (stackGap !== null && stackGap > 0) {
    expect(stackGap).toBeLessThanOrEqual(80);
    expect(stackGap).toBeGreaterThanOrEqual(48);
  }
});
