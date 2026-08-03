import Link from "next/link";
import type { Metadata } from "next";
import { CTABand, SectionHeading } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { programs } from "@/data/programs";

export const metadata: Metadata = {
  title: "Programs",
  description: "Quran and Islamic education programs for kids, teens, adults, sisters, reverts, and professionals.",
};

export default function ProgramsPage() {
  return (
    <>
      <div className="section-padding">
        <SectionHeading title="Programs for every learner" description="Age-appropriate, objection-aware paths — not generic copy." />
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => (
            <Link key={p.slug} href={`/programs/${p.slug}`} className="glass-card block p-6 focus-ring">
              <h2 className="font-display text-xl">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.headline}</p>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/free-trial"><Button size="lg">Book a free assessment</Button></Link>
        </div>
      </div>
      <CTABand />
    </>
  );
}
