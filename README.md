# Bilal Ahamad Resume Website

This repository contains two ways to view the same resume content.

1. **Static HTML version** – `index.html` with Tailwind CSS and a small amount
   of JavaScript.
2. **Next.js version** – a full Next.js project located in
   [`resume-site/`](resume-site/).

Both versions show the same About, Skills, Experience, Projects, Education,
Testimonials and Contact sections and link to
`docs/Bilal_Ahamad_Resume.pdf` for downloading the resume.

## Viewing Locally

### Static site

Open `index.html` directly in your browser. No build step is required.

### Next.js project

```bash
cd resume-site
npm install
npm run dev
```

Then open <http://localhost:3000>.

## Deploying to Vercel

The repository includes a `vercel.json` that tells Vercel to deploy the
`resume-site/` folder as a Next.js application. When creating the project in
Vercel simply import this repository and it will build from that directory.

If you instead want to deploy the static `index.html` version, remove
`vercel.json` and set the **Root Directory** in the Vercel project settings to
`./` before deploying.

To deploy the current configuration (Next.js) run:

```bash
npx vercel --prod
```

After deployment, map the custom domain **bilalahamad.com** in your Vercel
dashboard.
