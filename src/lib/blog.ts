import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content/blog");

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  category: "Project Story" | "Whitepaper" | "LinkedIn" | "Tutorial";
  readingTime: number;
  featured?: boolean;
  linkedinUrl?: string;
  content: string;
};

function calcReadingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.ceil(words / 200); // avg 200 wpm
}

// Clamp a description for use in a <meta name="description"> tag.
// Search engines (Bing/Google) flag descriptions over ~160 chars, so truncate
// at a word boundary and append an ellipsis. The full, untruncated text can
// still render as the on-page excerpt — this only guards the meta tag.
export function metaDescription(desc: string): string {
  const MAX = 160;
  if (desc.length <= MAX) return desc;
  const slice = desc.slice(0, MAX - 1); // reserve one char for the ellipsis
  const lastSpace = slice.lastIndexOf(" ");
  const trimmed = (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).replace(
    /[\s.,;:—-]+$/,
    ""
  );
  return `${trimmed}…`;
}

export function getAllPosts(): Omit<BlogPost, "content">[] {
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const rawSlug = file.replace(/\.mdx$/, "");
    const slug = rawSlug.replace(/[^a-zA-Z0-9-]/g, "");
    const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
    const { data, content } = matter(raw);

    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "",
      description: data.description ?? "",
      tags: data.tags ?? [],
      category: data.category ?? "Project Story",
      readingTime: calcReadingTime(content),
      featured: data.featured ?? false,
      linkedinUrl: data.linkedinUrl,
    } as Omit<BlogPost, "content">;
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const safeSlug = slug.replace(/[^a-zA-Z0-9-]/g, "");
  return {
    slug: safeSlug,
    title: data.title ?? slug,
    date: data.date ?? "",
    description: data.description ?? "",
    tags: data.tags ?? [],
    category: data.category ?? "Project Story",
    readingTime: calcReadingTime(content),
    featured: data.featured ?? false,
    linkedinUrl: data.linkedinUrl,
    content,
  };
}
