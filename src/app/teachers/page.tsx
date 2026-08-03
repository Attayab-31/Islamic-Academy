import Link from "next/link";
import type { Metadata } from "next";
import { CTABand, SectionHeading } from "@/components/shared";
import { TeachersFilter } from "@/components/forms/client-forms";
import { filterTeachers, teachers } from "@/data/teachers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Teachers",
  description: "Browse certified Quran teachers. Filter by gender, language, and specialization.",
};

export default async function TeachersPage({
  searchParams,
}: {
  searchParams: Promise<{ gender?: string; language?: string; specialization?: string }>;
}) {
  const params = await searchParams;
  const filtered = filterTeachers({
    gender: params.gender,
    language: params.language,
    specialization: params.specialization,
  });

  const languages = [...new Set(teachers.flatMap((t) => t.languages))];
  const specializations = [...new Set(teachers.flatMap((t) => t.specializations))];

  return (
    <>
      <div className="section-padding">
        <SectionHeading title="Our teachers" description="Filter by gender, language, and specialization." />
        <div className="mx-auto max-w-5xl">
          <TeachersFilter languages={languages} specializations={specializations} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <Link key={t.slug} href={`/teachers/${t.slug}`} className="glass-card block p-6 focus-ring">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 font-display text-gold">
                  {t.name.split(" ")[1]?.[0] ?? "T"}
                </div>
                <h2 className="font-medium">{t.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t.credentials}</p>
                <p className="mt-2 text-xs text-gold">{t.specializations.join(" · ")}</p>
                <p className="mt-2 font-mono text-xs text-muted-foreground">{t.availability}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <CTABand />
    </>
  );
}
