# Bilal Ahamad Resume Website

This repository contains a responsive resume site built with **HTML**, **Tailwind CSS** and a small amount of JavaScript. The page uses a glossy glassmorphism design with animated section reveals and a dark/light theme toggle saved in `localStorage`.

Sections include About, Skills, Experience, Projects, Education, Testimonials and Contact. A download button links to `docs/Bilal_Ahamad_Resume.pdf` so you can easily provide your own resume.

## Viewing Locally

Open `index.html` directly in your browser. No build step is required.

## Deploying

Deploy the files to any static host or use Vercel.

Before running `npm run deploy`, authenticate with Vercel so the CLI can access your account:

```bash
npx vercel login
# or provide a token: npx vercel --token <TOKEN>
```

Then deploy:

```bash
npm run deploy
```

Ensure your network can reach `https://api.vercel.com` during deployment.

After deployment, map the custom domain **bilalahamad.com** in your Vercel dashboard.
