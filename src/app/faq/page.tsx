import type { Metadata } from "next";
import { CTABand, JsonLd, SectionHeading } from "@/components/shared";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqCategories, testimonials } from "@/data/content";
import { faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about safety, scheduling, pricing, and learning progress.",
};

const allFaqs = faqCategories.flatMap((c) => c.items);

export default function FAQPage() {
  return (
    <>
      <JsonLd data={faqSchema(allFaqs)} />
      <div className="section-padding">
        <SectionHeading title="Frequently asked questions" />
        {faqCategories.map((cat) => (
          <div key={cat.category} className="mx-auto mt-12 max-w-3xl">
            <h2 className="font-display text-xl text-gold">{cat.category}</h2>
            <Accordion type="single" collapsible className="mt-4">
              {cat.items.map((faq, i) => (
                <AccordionItem key={faq.question} value={`${cat.category}-${i}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
      <CTABand />
    </>
  );
}

export function TestimonialsPageContent() {
  return (
    <div className="section-padding">
      <SectionHeading title="What families say" description="Real progress stories — never guaranteed outcomes." />
      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
        {testimonials.map((t) => (
          <blockquote key={t.name} className="glass-card p-6">
            <p className="text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
            <footer className="mt-4 text-sm">
              <strong>{t.name}</strong> · {t.country} · {t.course}
            </footer>
          </blockquote>
        ))}
      </div>
    </div>
  );
}
