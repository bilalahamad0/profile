import { getPostBySlug, getAllPosts, metaDescription } from "@/lib/blog";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Tag, Calendar, BookOpen, Github, Linkedin } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbList } from "@/lib/structured-data";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

const slugToThumb: Record<string, string> = {
  "adhan-caster-extension-story": "/images/adhan-ce-poster.jpg",
  "ai-driven-development": "/blog-thumbs/ai-native-dev.png",
  "california-warn-story": "/blog-thumbs/california-warn.png",
  "warn-tracker-goes-national": "/blog-thumbs/us-warn-national.png",
  "media-caster-story":    "/blog-thumbs/media-caster.png",
  "resilient-iot-application": "/blog-thumbs/resilient-iot.png",
  "clock-jump-case-study": "/blog-thumbs/iot_clock_jump_thumbnail.png",
  "gemma-ollama-raspberry-pi-adhan": "/blog-thumbs/gemma-ollama-raspberry-pi-adhan.png",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const image = slugToThumb[slug] ?? "/og-image.png";
  const desc = metaDescription(post.description);
  return {
    title: post.title,
    description: desc,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: `${post.title} | Bilal Ahamad`,
      description: desc,
      url: `https://bilalahamad.com/blog/${slug}`,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${post.title} | Bilal Ahamad`,
      description: desc,
      images: [image],
    },
  };
}

const mdxComponents = {
  h1: (props: any) => <h1 className="t-h2 text-ink mt-12 mb-6 first:mt-0" {...props} />,
  h2: (props: any) => <h2 className="t-h3 text-ink mt-10 mb-4 border-b border-line/10 dark:border-line/5 pb-3" {...props} />,
  h3: (props: any) => <h3 className="t-h3 text-ink/90 mt-8 mb-3" {...props} />,
  p: (props: any) => <p className="t-body text-ink-muted mb-5" {...props} />,
  ul: (props: any) => <ul className="space-y-2 mb-5 ml-4" {...props} />,
  ol: (props: any) => <ol className="space-y-2 mb-5 ml-4 list-decimal list-inside" {...props} />,
  li: (props: any) => <li className="text-ink-muted leading-relaxed flex gap-2 items-start"><span className="text-blue-600 dark:text-blue-500 mt-1.5 shrink-0">▪</span><span {...props} /></li>,
  code: (props: any) => (
    <code className="px-1.5 py-0.5 rounded-md bg-ink/5 border border-line/10 text-blue-700 dark:text-blue-300 text-sm font-mono" {...props} />
  ),
  pre: (props: any) => (
    <pre
      tabIndex={0}
      role="group"
      aria-label="Code block, scrollable"
      className="bg-zinc-100 dark:bg-zinc-900 border border-line/10 rounded-2xl p-6 overflow-x-auto mb-6 text-sm font-mono text-zinc-800 dark:text-zinc-300 leading-relaxed"
      {...props}
    />
  ),
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-blue-500 pl-6 my-6 italic text-ink-muted" {...props} />
  ),
  a: (props: any) => (
    <a className="text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2 transition-colors" target="_blank" rel="noreferrer" {...props} />
  ),
  table: (props: any) => (
    <div tabIndex={0} role="group" aria-label="Table, scrollable" className="overflow-x-auto mb-6">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: any) => <th className="px-4 py-3 text-left font-bold text-ink/80 border-b border-line/10 text-xs uppercase tracking-widest" {...props} />,
  td: (props: any) => <td className="px-4 py-3 text-ink-muted border-b border-line/10 dark:border-line/5" {...props} />,
  hr: () => <hr className="border-line/10 my-10" />,
  strong: (props: any) => <strong className="text-ink font-bold" {...props} />,
};

const categoryColors: Record<string, string> = {
  "Project Story": "text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
  "Whitepaper": "text-violet-700 dark:text-violet-400 bg-violet-500/10 border-violet-500/20",
  "LinkedIn": "text-sky-700 dark:text-sky-400 bg-sky-500/10 border-sky-500/20",
  "Tutorial": "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const colors = categoryColors[post.category] ?? categoryColors["Project Story"];
  const image = slugToThumb[slug];

  /**
   * Related posts, ranked by shared tags then recency.
   *
   * The section below was labelled "Related Posts Nav" and contained a single
   * "All Posts" link — so every post was a dead end, and a reader who finished
   * the strongest piece on the site had nowhere to go but back. Same-category
   * posts break ties so there is always something to show even at zero tag
   * overlap.
   */
  const related = getAllPosts()
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      shared: p.tags.filter((t) => post.tags.includes(t)).length,
      sameCategory: p.category === post.category ? 1 : 0,
    }))
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        b.sameCategory - a.sameCategory ||
        new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
    )
    .slice(0, 3)
    .map((r) => r.post);

  // Structured data — blog post pages are the most-indexed/most-shared URLs.
  // Canonical points at bilalahamad.com (not any LinkedIn cross-post) so the
  // source page wins ranking over syndicated copies.
  const canonicalUrl = `https://bilalahamad.com/blog/${slug}`;
  const ogImage = `https://bilalahamad.com${image ?? "/og-image.png"}`;
  const breadcrumbLd = breadcrumbList([
    { name: "Home", path: "" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${slug}` },
  ]);
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    image: ogImage,
    url: canonicalUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    keywords: post.tags.join(", "),
    author: { "@type": "Person", name: "Bilal Ahamad", url: "https://bilalahamad.com" },
    publisher: { "@type": "Person", name: "Bilal Ahamad", url: "https://bilalahamad.com" },
  };

  return (
    <div className="min-h-screen bg-surface text-ink">
      <JsonLd data={[breadcrumbLd, articleLd]} />

      {/* Header */}
      <section className="pt-32 pb-16 px-6 lg:px-24 border-b border-line/10 dark:border-line/5 relative overflow-hidden">
        {image && (
          /* The hero art sits behind dark ink in the light theme, so it is held
             further back there; the dark theme keeps its original 40%. */
          <div className="absolute inset-0 z-0 opacity-20 dark:opacity-40 pointer-events-none">
            <Image src={image} alt={post.title} fill className="object-cover" sizes="100vw" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
          </div>
        )}
        <div className="absolute top-0 left-0 w-[500px] h-[400px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none z-0" />
        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/blog" className="inline-flex items-center gap-2 text-ink-muted hover:text-ink transition-colors group mb-10">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border t-label font-black uppercase tracking-wider ${colors}`}>
              <BookOpen className="w-3.5 h-3.5" />
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-ink-muted">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-ink-muted">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime} min read
            </span>
          </div>

          <h1 className="t-h1 text-ink mb-6">
            {post.title}
          </h1>

          <p className="t-lead text-ink-muted mb-8">{post.description}</p>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 t-label font-semibold text-ink-muted px-2.5 py-1 rounded-lg bg-ink/5 border border-line/10">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-16 px-6 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-invert max-w-none">
            {/* remark-gfm: without it, markdown pipe tables fall through to
                remark's core parser and render as literal "| a | b |" text. */}
            <MDXRemote
              source={post.content}
              components={mdxComponents}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </div>

          {/* Footer */}
          <div className="mt-16 pt-10 border-t border-line/10 dark:border-line/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-ink-muted text-sm">Written by Bilal Ahamad</p>
              <p className="text-ink-muted text-xs mt-1">Systems Validation Architect</p>
            </div>
            <div className="flex gap-4">
              {post.linkedinUrl && (
                <a href={post.linkedinUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 transition-all">
                  <Linkedin className="w-4 h-4" />
                  Discuss on LinkedIn
                </a>
              )}
              <a href="https://github.com/bilalahamad0" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink/5 border border-line/10 text-sm font-bold text-ink-muted hover:text-ink hover:border-line/20 transition-all">
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <Link href="/contact"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <section
        className="py-12 px-6 lg:px-24 border-t border-line/10 dark:border-line/5 bg-ink/[0.01]"
        aria-labelledby="related-heading"
      >
        <div className="max-w-4xl mx-auto">
          <h2 id="related-heading" className="t-h3 text-ink mb-6">
            Keep reading
          </h2>

          <ul className="grid gap-4 md:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/blog/${r.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line/10 bg-surface-card p-5 transition-colors hover:border-line/20"
                >
                  <span className="t-label font-black uppercase tracking-wider text-ink-muted">
                    {r.category}
                  </span>
                  <span className="t-body font-semibold text-ink mt-2 leading-snug group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {r.title}
                  </span>
                  <span className="t-caption text-ink-muted mt-auto pt-3 inline-flex items-center gap-1.5">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    {r.readingTime} min read
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="text-center mt-8">
            <Link
              href="/blog"
              className="inline-flex min-h-11 items-center gap-2 t-small font-bold text-ink-muted hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              All Posts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
