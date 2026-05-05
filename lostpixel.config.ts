import { CustomProjectConfig } from 'lost-pixel';

export const config: CustomProjectConfig = {
  pageShots: {
    pages: [
      { path: '/', name: 'home-desktop' },
      { path: '/projects', name: 'projects-desktop' },
      { path: '/blog', name: 'blog-desktop' },
      { path: '/certifications', name: 'certifications-desktop' },
    ],
    baseUrl: 'http://localhost:3000',
  },
  generateOnly: true,
  // failOnDifference must be false in generateOnly mode — every run is a fresh
  // addition with no prior baseline to compare against, so true would fail every CI run.
  // To enable real visual regression detection later: commit .lostpixel/baseline/*.png
  // to the repo and flip both flags (generateOnly:false, failOnDifference:true).
  failOnDifference: false,
};
