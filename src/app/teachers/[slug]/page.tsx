import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CTABand, JsonLd, SectionHeading } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { getTeacher, teachers } from "@/data/teachers";
import { breadcrumbSchema, personSchema } from "@/lib/schema";

export function generateStaticParams() {
  return teachers.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const teacher = getTeacher(slug);
  if (!teacher) return {};
  return { title: teacher.name, description: teacher.bio };
}

export default async function TeacherProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const teacher = getTeacher(slug);
  if (!teacher) notFound();

  return (
    <>
      <JsonLd
        data={[
          personSchema(teacher),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Teachers", href: "/teachers" },
            { name: teacher.name, href: `/teachers/${teacher.slug}` },
          ]),
        ]}
      />
      <div className="section-padding">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-start gap-6">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gold/20 font-display text-3xl text-gold">
              {teacher.name.split(" ")[1]?.[0] ?? "T"}
            </div>
            <div>
              <h1 className="font-display text-3xl">{teacher.name}</h1>
              <p className="mt-2 text-muted-foreground">{teacher.credentials}</p>
              <p className="mt-1 text-sm text-gold">{teacher.ijazah}</p>
            </div>
          </div>

          <p className="mt-8 text-lg text-muted-foreground">{teacher.bio}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="glass-card p-4">
              <p className="text-sm text-muted-foreground">Years teaching</p>
              <p className="font-display text-2xl">{teacher.yearsTeaching}+</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-sm text-muted-foreground">Availability</p>
              <p className="font-mono text-sm">{teacher.availability}</p>
            </div>
          </div>

          <h2 className="mt-10 font-display text-xl">Specializations</h2>
          <p className="mt-2 text-muted-foreground">{teacher.specializations.join(" · ")}</p>

          <h2 className="mt-10 font-display text-xl">Languages</h2>
          <p className="mt-2 text-muted-foreground">{teacher.languages.join(", ")}</p>

          <h2 className="mt-10 font-display text-xl">Student reviews</h2>
          {teacher.reviews.map((r) => (
            <blockquote key={r.author} className="mt-4 glass-card p-5">
              <p className="text-muted-foreground">&ldquo;{r.text}&rdquo;</p>
              <footer className="mt-2 text-sm">{r.author} · {r.country}</footer>
            </blockquote>
          ))}

          <Link href={`/free-trial?teacher=${teacher.slug}`} className="mt-10 inline-block">
            <Button size="lg">Book a trial with {teacher.name.split(" ").slice(-1)[0]}</Button>
          </Link>
        </div>
      </div>
      <CTABand />
    </>
  );
}
