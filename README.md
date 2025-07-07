# Bilal Ahamad Resume Website

This repository contains a modern personal website for Bilal Ahamad's resume. It uses **Tailwind CSS** for styling and includes a dark/light theme toggle with state saved to `localStorage`.


The website is deployed at [https://bilalahamad.com](https://bilalahamad.com).

The site is optimized for mobile devices and includes a simple timeline layout for work experience. Update `index.html` to modify any content and replace the placeholder photo and resume with your own files.

## Usage

Open `index.html` directly in a browser, or serve the folder locally using any HTTP server (e.g. `npx serve`).

## Deploying to Vercel

If you want to publish a preview online, install the Vercel CLI and run:

```bash
npm install -g vercel
vercel --prod
```

Follow the prompts to log in and assign the deployment to your Vercel account. After deployment, Vercel will output a URL where the site is hosted. You can also map the custom domain (`bilalahamad.com`) via the Vercel dashboard.
If this repository is linked to Vercel, every push to `main` will automatically create a new preview deployment.

