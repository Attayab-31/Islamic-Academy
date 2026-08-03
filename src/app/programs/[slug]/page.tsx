import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CTABand, SectionHeading } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { getProgram, programs } from "@/data/programs";

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program) return {};
  return { title: `${program.title} Program`, description: program.description };
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program) notFound();

  return (
    <>
      <div className="section-padding">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl">{program.headline}</h1>
          <p className="mt-6 text-lg text-muted-foreground">{program.description}</p>

          <h2 className="mt-12 font-display text-2xl">What we address</h2>
          <div className="mt-6 space-y-4">
            {program.objections.map((o) => (
              <div key={o.concern} className="glass-card p-5">
                <p className="font-medium">{o.concern}</p>
                <p className="mt-2 text-muted-foreground">{o.answer}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-12 font-display text-2xl">Highlights</h2>
          <ul className="mt-4 space-y-2">
            {program.highlights.map((h) => (
              <li key={h} className="text-muted-foreground">✓ {h}</li>
            ))}
          </ul>

          {program.slug === "sisters" && (
            <p className="mt-8">
              <Link href="/teachers?gender=female" className="text-gold hover:underline focus-ring">
                Browse female teachers →
              </Link>
            </p>
          )}

          <Link href={`/free-trial?program=${program.slug}`} className="mt-10 inline-block">
            <Button size="lg">Book free trial</Button>
          </Link>
        </div>
      </div>
      <CTABand />
    </>
  );
}
