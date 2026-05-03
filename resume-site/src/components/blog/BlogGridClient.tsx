"use client";
import dynamic from "next/dynamic";
import type { mdxPosts as MdxPostsType } from "@/app/blog/page";
import type { LinkedInPost } from "@/data/portfolio";

type MdxPost = (typeof MdxPostsType)[number];

interface Props {
  mdxPosts: MdxPost[];
  linkedInPosts: LinkedInPost[];
}

const BlogGridInner = dynamic(
  () => import("@/components/blog/BlogGrid").then((m) => ({ default: m.BlogGrid })),
  {
    ssr: false,
    loading: () => (
      <div className="py-10 md:py-12 lg:py-16 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton rounded-3xl h-64" />
          ))}
        </div>
      </div>
    ),
  }
);

export function BlogGridClient({ mdxPosts, linkedInPosts }: Props) {
  return <BlogGridInner mdxPosts={mdxPosts} linkedInPosts={linkedInPosts} />;
}
