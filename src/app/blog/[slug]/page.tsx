import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CTABand } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/content";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <article className="section-padding">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-gold">{post.silo} · {post.date}</p>
          <h1 className="mt-2 font-display text-4xl">{post.title}</h1>
          <div className="mt-8 space-y-4 text-muted-foreground">
            <p>{post.excerpt}</p>
            <p>
              This pillar article connects to our structured courses and free trial booking. Every learner&apos;s path
              begins with a free assessment — whether you&apos;re choosing a teacher, comparing Qaida methods, or planning Hifz.
            </p>
            <p>
              Key takeaway: prioritize verified credentials, safeguarding transparency, and timezone-fit scheduling —
              the three gaps most online academies leave unaddressed.
            </p>
          </div>
          <Link href="/free-trial" className="mt-10 inline-block">
            <Button size="lg">Book a free trial</Button>
          </Link>
          <p className="mt-6">
            <Link href="/blog" className="text-gold hover:underline">← Back to blog</Link>
          </p>
        </div>
      </article>
      <CTABand />
    </>
  );
}
