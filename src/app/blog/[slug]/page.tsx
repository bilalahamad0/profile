import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft, Clock, Tag, Calendar, BookOpen, Github } from "lucide-react";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

const slugToThumb: Record<string, string> = {
  "ai-driven-development": "/blog-thumbs/ai-native-dev.png",
  "california-warn-story": "/blog-thumbs/california-warn.png",
  "media-caster-story":    "/blog-thumbs/media-caster.png?v=2",
  "resilient-iot-application": "/blog-thumbs/resilient-iot.png",
  "clock-jump-case-study": "/blog-thumbs/iot_clock_jump_thumbnail.png",
  "gemma-ollama-raspberry-pi-adhan": "/blog-thumbs/gemma-ollama-raspberry-pi-adhan.png",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const image = slugToThumb[slug] ?? "/og-image.png";
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      title: `${post.title} | Bilal Ahamad`,
      description: post.description,
      url: `https://bilalahamad.com/blog/${slug}`,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${post.title} | Bilal Ahamad`,
      description: post.description,
      images: [image],
    },
  };
}

const mdxComponents = {
  h1: (props: any) => <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-12 mb-6 first:mt-0" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-black text-white tracking-tight mt-10 mb-4 border-b border-white/5 pb-3" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-bold text-white/90 mt-8 mb-3" {...props} />,
  p: (props: any) => <p className="text-zinc-400 leading-relaxed mb-5 text-base" {...props} />,
  ul: (props: any) => <ul className="space-y-2 mb-5 ml-4" {...props} />,
  ol: (props: any) => <ol className="space-y-2 mb-5 ml-4 list-decimal list-inside" {...props} />,
  li: (props: any) => <li className="text-zinc-400 leading-relaxed flex gap-2 items-start"><span className="text-blue-500 mt-1.5 shrink-0">▪</span><span {...props} /></li>,
  code: (props: any) => (
    <code className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-blue-300 text-sm font-mono" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-zinc-900 border border-white/10 rounded-2xl p-6 overflow-x-auto mb-6 text-sm font-mono text-zinc-300 leading-relaxed" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-blue-500 pl-6 my-6 italic text-zinc-400" {...props} />
  ),
  a: (props: any) => (
    <a className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors" target="_blank" rel="noreferrer" {...props} />
  ),
  table: (props: any) => (
    <div className="overflow-x-auto mb-6">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: any) => <th className="px-4 py-3 text-left font-bold text-white/80 border-b border-white/10 text-xs uppercase tracking-widest" {...props} />,
  td: (props: any) => <td className="px-4 py-3 text-zinc-400 border-b border-white/5" {...props} />,
  hr: () => <hr className="border-white/10 my-10" />,
  strong: (props: any) => <strong className="text-white font-bold" {...props} />,
};

const categoryColors: Record<string, string> = {
  "Project Story": "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "Whitepaper": "text-violet-400 bg-violet-500/10 border-violet-500/20",
  "LinkedIn": "text-sky-400 bg-sky-500/10 border-sky-500/20",
  "Tutorial": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const colors = categoryColors[post.category] ?? categoryColors["Project Story"];
  const image = slugToThumb[slug];

  return (
    <main className="min-h-screen bg-[#09090b] text-white">

      {/* Header */}
      <section className="pt-32 pb-16 px-6 lg:px-24 border-b border-white/5 relative overflow-hidden">
        {image && (
          <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
            <img src={image} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-transparent" />
          </div>
        )}
        <div className="absolute top-0 left-0 w-[500px] h-[400px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none z-0" />
        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/blog" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group mb-10">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${colors}`}>
              <BookOpen className="w-3.5 h-3.5" />
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime} min read
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-xl text-zinc-400 leading-relaxed mb-8">{post.description}</p>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 text-[10px] font-semibold text-zinc-500 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
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
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>

          {/* Footer */}
          <div className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-zinc-500 text-sm">Written by Bilal Ahamad</p>
              <p className="text-zinc-600 text-xs mt-1">Technical QA Lead & AI-Driven Engineer</p>
            </div>
            <div className="flex gap-4">
              <a href="https://github.com/bilalahamad0" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-zinc-400 hover:text-white hover:border-white/20 transition-all">
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

      {/* Related Posts Nav */}
      <section className="py-12 px-6 lg:px-24 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            All Posts
          </Link>
        </div>
      </section>
    </main>
  );
}
