import Link from "next/link";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { CTABand, SectionHeading } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { pricingTiers } from "@/data/countries";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Transparent monthly pricing for live one-on-one Quran classes. Multi-currency. Cancel anytime.",
};

export default async function PricingPage() {
  const cookieStore = await cookies();
  const currency = cookieStore.get("currency")?.value ?? "USD";

  return (
    <>
      <div className="section-padding">
        <SectionHeading
          title="Simple, transparent pricing"
          description="All plans include a free trial. Cancel anytime — no hidden fees."
        />
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {pricingTiers.map((tier) => {
            const price = tier.prices[currency as keyof typeof tier.prices] ?? tier.prices.USD;
            return (
              <div key={tier.name} className={`glass-card p-6 ${tier.popular ? "ring-2 ring-gold" : ""}`}>
                {tier.popular && <span className="text-xs font-semibold uppercase text-gold">Most popular</span>}
                <h2 className="mt-2 font-display text-xl">{tier.name}</h2>
                <p className="mt-2 font-display text-3xl text-gold">
                  {formatCurrency(price, currency)}
                  <span className="text-base text-muted-foreground">/mo</span>
                </p>
                <p className="text-sm text-muted-foreground">{tier.sessions} · {tier.duration}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {tier.features.map((f) => (
                    <li key={f}>✓ {f}</li>
                  ))}
                </ul>
                <Link href="/free-trial" className="mt-6 block">
                  <Button className="w-full">Start free trial</Button>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-16 max-w-3xl glass-card p-8">
          <h2 className="font-display text-xl">Cancellation & rescheduling</h2>
          <p className="mt-4 text-muted-foreground">
            Cancel anytime — your subscription ends at the close of the current billing period. Reschedule individual
            classes with at least 24 hours notice at no charge. Late cancellations may forfeit that session.
          </p>
        </div>
      </div>
      <CTABand />
    </>
  );
}
