import Link from "next/link";
import { HeroSceneLazy } from "@/components/hero/hero-scene-lazy";
import { RosetteAssembly } from "@/components/hero/rosette-assembly";
import { CTABand, JsonLd, MihrabDivider, SectionHeading } from "@/components/shared";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqCategories, testimonials } from "@/data/content";
import { courses } from "@/data/courses";
import { pricingTiers } from "@/data/countries";
import { teachers } from "@/data/teachers";
import { faqSchema, organizationSchema, websiteSchema } from "@/lib/schema";
import { formatCurrency } from "@/lib/utils";

const topFaqs = faqCategories.flatMap((c) => c.items).slice(0, 6);

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema(), faqSchema(topFaqs)]} />

      <section className="relative min-h-[85vh] overflow-hidden section-padding">
        <HeroSceneLazy />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="font-arabic text-gold">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl lg:text-6xl">
              Live Quran classes your family can trust — anywhere in the world
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Certified one-on-one teachers. Timezone-aware booking. Safeguarding you can read before you enroll.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/free-trial"><Button size="lg">Book Your Free Trial Class</Button></Link>
              <Link href="/how-it-works"><Button variant="link" size="lg">See How It Works</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <RosetteAssembly />

      <section className="border-y border-border bg-muted/30 section-padding">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { label: "Verified teachers", value: "40+" },
            { label: "Countries served", value: "17" },
            { label: "Average rating", value: "4.9/5" },
            { label: "Safeguarding", value: "Certified", href: "/safeguarding" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              {stat.href ? (
                <Link href={stat.href} className="font-display text-2xl text-gold hover:underline focus-ring">{stat.value}</Link>
              ) : (
                <p className="font-display text-2xl text-gold">{stat.value}</p>
              )}
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding">
        <SectionHeading
          title="We understand what keeps parents up at night"
          description="Qualified teachers. Engaged children. Schedules that actually work."
        />
        <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3">
          {[
            { title: "Teacher credibility", text: "Every teacher's credentials and Ijazah chain are verified and visible before you book." },
            { title: "Child engagement", text: "Short, focused sessions with patient teachers trained for online learning with kids." },
            { title: "Timezone fit", text: "Book in your local time across 17 countries — evenings, weekends, and early mornings available." },
          ].map((block) => (
            <div key={block.title} className="glass-card p-6">
              <h3 className="font-display text-xl">{block.title}</h3>
              <p className="mt-3 text-muted-foreground">{block.text}</p>
            </div>
          ))}
        </div>
      </section>

      <MihrabDivider />

      <section className="section-padding">
        <SectionHeading title="Your learning path" description="From first letters to confident Hifz — one structured journey." />
        <div className="mx-auto mt-12 flex max-w-4xl flex-col items-center gap-4 md:flex-row md:justify-between">
          {["Qaida", "Quran Reading", "Tajweed", "Hifz"].map((step, i) => (
            <div key={step} className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold text-gold">{i + 1}</div>
              <span className="font-medium">{step}</span>
              {i < 3 && <span className="hidden text-muted-foreground md:inline">→</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding bg-muted/20">
        <SectionHeading title="Meet our teachers" description="Verified credentials. Real specializations." />
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {teachers.slice(0, 4).map((t) => (
            <Link key={t.slug} href={`/teachers/${t.slug}`} className="glass-card block p-5 transition hover:-translate-y-1 focus-ring">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 text-gold font-display text-xl">
                {t.name.split(" ")[1]?.[0] ?? "T"}
              </div>
              <h3 className="font-medium">{t.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.credentials}</p>
              <p className="mt-2 text-xs text-gold">{t.specializations.join(" · ")}</p>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/teachers"><Button variant="outline">View all teachers</Button></Link>
        </div>
      </section>

      <section className="section-padding">
        <SectionHeading title="How it works" />
        <ol className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-4">
          {[
            "Book a free trial",
            "Meet your teacher on Zoom",
            "Get your personalized timetable",
            "Start monthly learning",
          ].map((step, i) => (
            <li key={step} className="text-center">
              <span className="font-display text-3xl text-gold">{i + 1}</span>
              <p className="mt-2 font-medium">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section-padding bg-muted/20">
        <SectionHeading title="Transparent pricing" description="No hidden fees. Cancel anytime." />
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div key={tier.name} className={`glass-card p-6 ${tier.popular ? "ring-2 ring-gold" : ""}`}>
              {tier.popular && <span className="text-xs font-semibold uppercase text-gold">Most popular</span>}
              <h3 className="mt-2 font-display text-xl">{tier.name}</h3>
              <p className="mt-2 font-display text-3xl text-gold">{formatCurrency(tier.prices.USD, "USD")}<span className="text-base text-muted-foreground">/mo</span></p>
              <p className="text-sm text-muted-foreground">{tier.sessions} · {tier.duration}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {tier.features.map((f) => <li key={f}>✓ {f}</li>)}
              </ul>
              <Link href="/free-trial" className="mt-6 block"><Button className="w-full">Start free trial</Button></Link>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center"><Link href="/pricing" className="text-gold hover:underline focus-ring">See full pricing →</Link></p>
      </section>

      <section className="section-padding">
        <SectionHeading title="Families like yours" />
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {testimonials.slice(0, 3).map((t) => (
            <blockquote key={t.name} className="glass-card p-6">
              <p className="text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
              <footer className="mt-4 text-sm font-medium">{t.name} · {t.country}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="section-padding bg-muted/20">
        <SectionHeading title="Common questions" />
        <Accordion type="single" collapsible className="mx-auto mt-8 max-w-3xl">
          {topFaqs.map((faq, i) => (
            <AccordionItem key={faq.question} value={`faq-${i}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="mt-6 text-center"><Link href="/faq" className="text-gold hover:underline">View all FAQs</Link></p>
      </section>

      <CTABand />
    </>
  );
}
