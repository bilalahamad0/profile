# Bilal Ahamad Resume Website

This repository contains a responsive resume site built with **HTML**, **Tailwind CSS** and a small amount of JavaScript. The page uses a glossy glassmorphism design with animated section reveals and a dark/light theme toggle saved in `localStorage`.

Sections include About, Skills, Experience, Projects, Education, Testimonials and Contact. A download button links to `docs/Bilal_Ahamad_Resume.pdf`.

## Resume PDF

The repository cannot distribute Bilal Ahamad's actual resume. The file at
`docs/Bilal_Ahamad_Resume.pdf` is only a minimal placeholder so the download
link works. Replace this file with your own resume before deploying the site.

## Viewing Locally

Open `index.html` directly in your browser. No build step is required.

## Deploying

Deploy the files to any static host or use Vercel. The repository now includes a
`vercel.json` configuration for static deployments.

With the included `package.json`, simply run:

```bash
npm run deploy
```

This executes `npx vercel --prod --yes` for you so the deployment runs non-interactively. After deployment, map the custom domain **bilalahamad.com** in your Vercel dashboard.
