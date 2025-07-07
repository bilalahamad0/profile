# Bilal Ahamad Resume Website

This repository contains a responsive resume site built with **HTML**, **Tailwind CSS** and a small amount of JavaScript. The page uses a glossy glassmorphism design with animated section reveals and a dark/light theme toggle saved in `localStorage`.

Sections include About, Skills, Experience, Projects, Education, Testimonials and Contact. A download button links to `docs/Bilal_Ahamad_Resume.pdf`.

## Resume PDF

The repository cannot distribute Bilal Ahamad's actual resume. The file at
`docs/Bilal_Ahamad_Resume.pdf` is only a minimal placeholder so the download
link works.

To use your own resume:

1. Place your PDF inside the `docs` directory. Either rename your file to
   `Bilal_Ahamad_Resume.pdf` **or**
2. Update the `<a href>` in `index.html` that points to
   `docs/Bilal_Ahamad_Resume.pdf` so it matches your file name and location.

After replacing the file or link, the "Download Resume" button will download
your PDF when clicked.

## Custom images

The hero headshot and Open Graph preview defined in `index.html` currently use
placeholder URLs from `via.placeholder.com`. Before publishing the site you
should provide real images and update the HTML:

- Replace the `src` of the hero `<img>` in the **About** section with a path to
  your own photo (for example `images/headshot.jpg`).
- Set the `content` of the `<meta property="og:image">` tag to the preview
  image you want displayed when the site is shared (e.g. `images/og-image.png`).

Create an `images` folder or another location of your choice and place these
files there prior to deployment.

## Custom images

The hero headshot and Open Graph preview defined in `index.html` currently use
placeholder URLs from `via.placeholder.com`. Before publishing the site you
should provide real images and update the HTML:

- Replace the `src` of the hero `<img>` in the **About** section with a path to
  your own photo (for example `images/headshot.jpg`).
- Set the `content` of the `<meta property="og:image">` tag to the preview
  image you want displayed when the site is shared (e.g. `images/og-image.png`).

Create an `images` folder or another location of your choice and place these
files there prior to deployment.

## Viewing Locally

Open `index.html` directly in your browser. No build step is required.

## External assets

This site pulls the **Inter** font from Google Fonts using the public CDN and
the showcase section references sample videos hosted on `w3schools.com`. These
resources are fetched from the internet when the page loads. For a fully
offline deployment you can download and host the font and video files yourself
or replace them with system fonts and local assets.

## Deploying

Deploy the files to any static host or use Vercel. The repository now includes a
`vercel.json` configuration for static deployments.

### Setting up Vercel

1. Install the Vercel CLI if you do not already have it:

   ```bash
   npm install -g vercel
   ```

2. Authenticate with your Vercel account:

   ```bash
   vercel login
   ```

   Follow the prompts to sign in with your preferred method.

3. From the project root run the following to link the directory to a Vercel project
   (create a new project when prompted if one does not already exist):

   ```bash
   vercel
   ```

   You can also run `vercel link` to associate the folder with an existing Vercel project.

With the included `package.json`, simply run:

```bash
npm run deploy
```

This executes `npx vercel --prod --yes` for you so the deployment runs non-interactively.

### Mapping the Custom Domain

1. Open your project in the [Vercel dashboard](https://vercel.com/dashboard).
2. Go to the **Domains** tab and click **Add**.
3. Enter `bilalahamad.com` and follow the displayed instructions to configure the DNS records with your domain registrar.
4. Once the DNS changes propagate, the domain will point to your Vercel deployment.

## License

This project is licensed under the [MIT License](LICENSE).
