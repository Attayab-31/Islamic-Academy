import Link from "next/link";
import type { Metadata } from "next";
import { CTABand, SectionHeading } from "@/components/shared";
import { blogPosts } from "@/data/content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  description: "Guides on choosing teachers, Qaida, Tajweed, Hifz, and parenting in Islamic education.",
};

export default function BlogPage() {
  return (
    <>
      <div className="section-padding">
        <SectionHeading title="Blog" description="Topic-clustered guides for parents and learners." />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="glass-card block p-6 focus-ring">
              <p className="text-xs text-gold">{post.silo} · {post.date}</p>
              <h2 className="mt-2 font-display text-xl">{post.title}</h2>
              <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
      <CTABand />
    </>
  );
}
