# Bilal Ahamad Resume Website

This repository contains a modern personal website for Bilal Ahamad's resume. It uses **Tailwind CSS** for styling and includes a dark/light theme toggle with state saved to `localStorage`. The layout now adopts a glossy glassmorphism aesthetic for a sleek appearance.

The latest version features an Apple-inspired layout with a full-screen hero and smooth typography using the Inter font. A new horizontally scrollable showcase autoplays short videos for an interactive feel. Each section sits on a translucent glass panel with gentle shadows.

Sections fade in as you scroll thanks to a small Intersection Observer script for a refined, modern feel.

The website is published at
[https://bilalahamad.com](https://bilalahamad.com). If you clone this
repository and want your own deployment, map the domain in Vercel or use a
different custom domain. Follow the instructions below to create your own
deployment.

The site is optimized for mobile devices and includes a refined timeline layout for work experience. Update `index.html` to modify any content and replace the placeholder photo and resume with your own files. The PDF resume itself is not included in the repository; place your file at `docs/Bilal_Ahamad_Resume.pdf` or update the download link.

## Usage

Open `index.html` directly in a browser, or serve the folder locally using any HTTP server (e.g. `npx serve`).

## Deploying to Vercel

If you want to publish a preview online, install the Vercel CLI and run. On
systems where global installs require elevated permissions, you can prepend
`sudo` or simply use `npx vercel` which does not require a global install:

```bash
npm install -g vercel  # or use npx vercel if you prefer
vercel --prod          # npx vercel --prod works as well
```

Follow the prompts to log in and assign the deployment to your Vercel account. After deployment, Vercel will output a URL where the site is hosted. You can then map the custom domain (`bilalahamad.com`) via the Vercel dashboard. Until this step is complete, visiting the domain may show a 404 error.
If this repository is linked to Vercel, every push to `main` will automatically create a new preview deployment.
If your live site does not reflect the latest commit, ensure the changes are merged to `main` and run `vercel --prod` or push again to trigger a new build.

