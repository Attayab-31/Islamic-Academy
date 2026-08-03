import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CTABand, SectionHeading } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { countries, getCountry, pricingTiers } from "@/data/countries";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return countries.map((c) => ({ country: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country: slug } = await params;
  const country = getCountry(slug);
  if (!country) return {};
  return {
    title: `Learn Quran Online in ${country.name}`,
    description: `Live one-on-one Quran classes for families in ${country.name}. Local timezone scheduling and ${country.currency} pricing.`,
  };
}

export default async function CountryHubPage({ params }: { params: Promise<{ country: string }> }) {
  const { country: slug } = await params;
  const country = getCountry(slug);
  if (!country) notFound();

  const cookieStore = await cookies();
  const currency = country.currency;
  const standardPrice = pricingTiers[1].prices[currency as keyof typeof pricingTiers[1]["prices"]] ?? pricingTiers[1].prices.USD;

  return (
    <>
      <div className="section-padding">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-gold">{country.name}</p>
          <h1 className="mt-2 font-display text-4xl">Learn Quran online in {country.name}</h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Live one-on-one classes scheduled in {country.timezone.replace("_", " ")} — with pricing in {currency}.
          </p>

          <h2 className="mt-12 font-display text-xl">Sample weekly timetable</h2>
          <ul className="mt-4 space-y-2 font-mono text-sm text-muted-foreground">
            {country.sampleTimetable.map((slot) => (
              <li key={slot}>• {slot}</li>
            ))}
          </ul>

          <h2 className="mt-12 font-display text-xl">Pricing from</h2>
          <p className="mt-2 font-display text-3xl text-gold">
            {formatCurrency(standardPrice, currency)}<span className="text-base text-muted-foreground">/mo</span>
          </p>

          {country.testimonial && (
            <blockquote className="mt-12 glass-card p-6">
              <p className="text-muted-foreground">&ldquo;{country.testimonial.text}&rdquo;</p>
              <footer className="mt-2 text-sm">{country.testimonial.author}</footer>
            </blockquote>
          )}

          {country.faqs.length > 0 && (
            <>
              <h2 className="mt-12 font-display text-xl">{country.name}-specific FAQ</h2>
              <div className="mt-4 space-y-4">
                {country.faqs.map((faq) => (
                  <div key={faq.question} className="glass-card p-5">
                    <p className="font-medium">{faq.question}</p>
                    <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <Link href="/free-trial" className="mt-10 inline-block">
            <Button size="lg">Book free trial in {country.name}</Button>
          </Link>
        </div>
      </div>
      <CTABand />
    </>
  );
}
