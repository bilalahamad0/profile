# Bilal Ahamad Resume Website

This repository hosts a modern resume website built with **Next.js** and **Tailwind CSS**. It uses a glassmorphism design, animated scroll reveals and a responsive dark/light theme that persists via `localStorage`.

The site is composed of multiple pages (Home, Skills, Experience, Projects, Education, Testimonials and Contact) with a sticky navigation bar. GitHub and LinkedIn badges appear in the header, and a placeholder PDF is available for a resume download. SEO metadata and structured schema data are included for discoverability. The design uses a lightweight system font so the build can run without network access. A skip link is provided for screen readers to jump directly to the main content. Dark mode applies the `page-overview theme-dark` classes to the body element.

## Running Locally

```bash
cd resume-site
npm install
npm run dev
```

Open `http://localhost:3000` to view the site. Edit files in `src/app` to customize content.

## Deploying

Deploy to Vercel with the following commands after logging in.
The project root is the **`resume-site`** folder. A `vercel.json`
file at the repository root already points Vercel to this directory.
Run the CLI from the repository root so this configuration is picked up:

```bash
npx vercel --prod
```

Map the custom domain `bilalahamad.com` in your Vercel dashboard after deployment.
