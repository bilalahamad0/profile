import { CustomProjectConfig } from 'lost-pixel';

export const config: CustomProjectConfig = {
  pageShots: {
    pages: [
      { path: '/', name: 'home-desktop' },
      { path: '/projects', name: 'projects-desktop' },
      { path: '/blog', name: 'blog-desktop' }
    ],
    pagesJsonUrl: 'http://localhost:3000',
    baseUrl: 'http://localhost:3000',
  },
  generateOnly: true,
  failOnDifference: true,
  // Note: generateOnly creates baselines locally inside .lostpixel/baseline/
  // In CI, you run `lost-pixel` to compare against baselines if stored in repo
};
