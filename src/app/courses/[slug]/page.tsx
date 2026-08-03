import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CTABand, JsonLd, SectionHeading } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { courses, getCourse } from "@/data/courses";
import { breadcrumbSchema, courseSchema, faqSchema } from "@/lib/schema";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};
  return { title: course.title, description: course.description };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  return (
    <>
      <JsonLd
        data={[
          courseSchema(course),
          faqSchema(course.faqs),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Courses", href: "/courses" },
            { name: course.title, href: `/courses/${course.slug}` },
          ]),
        ]}
      />
      <div className="section-padding">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-gold">{course.audience.join(" · ")}</p>
          <h1 className="mt-2 font-display text-4xl">{course.title}</h1>
          <p className="mt-6 text-lg text-muted-foreground">{course.description}</p>
          <Link href={`/free-trial?course=${course.slug}`} className="mt-8 inline-block">
            <Button size="lg">Book free trial for {course.title}</Button>
          </Link>

          <h2 className="mt-12 font-display text-2xl">Syllabus outline</h2>
          <ul className="mt-4 space-y-2">
            {course.syllabus.map((s) => (
              <li key={s} className="flex gap-2 text-muted-foreground"><span className="text-gold">•</span>{s}</li>
            ))}
          </ul>

          <h2 className="mt-12 font-display text-2xl">Teacher qualifications</h2>
          <ul className="mt-4 space-y-2">
            {course.qualifications.map((q) => (
              <li key={q} className="text-muted-foreground">✓ {q}</li>
            ))}
          </ul>

          <h2 className="mt-12 font-display text-2xl">FAQ</h2>
          <Accordion type="single" collapsible className="mt-4">
            {course.faqs.map((faq, i) => (
              <AccordionItem key={faq.question} value={`f-${i}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
      <CTABand />
    </>
  );
}
