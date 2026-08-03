import Link from "next/link";
import type { Metadata } from "next";
import { CTABand, JsonLd, SectionHeading } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/courses";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Courses",
  description: "Quran Reading, Tajweed, Hifz, Arabic, Islamic Studies, and more — live one-on-one online.",
};

export default function CoursesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", href: "/" }, { name: "Courses", href: "/courses" }])} />
      <div className="section-padding">
        <SectionHeading title="Our courses" description="Structured live classes with certified teachers — one-on-one on Zoom." />
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link key={course.slug} href={`/courses/${course.slug}`} className="glass-card block p-6 transition hover:-translate-y-1 focus-ring">
              <h2 className="font-display text-xl">{course.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{course.shortDescription}</p>
              <p className="mt-4 text-xs text-gold">{course.audience.join(" · ")}</p>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/free-trial"><Button size="lg">Book a free trial</Button></Link>
        </div>
      </div>
      <CTABand />
    </>
  );
}
