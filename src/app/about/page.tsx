import Link from "next/link";
import type { Metadata } from "next";
import { CTABand, SectionHeading } from "@/components/shared";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description: "Mission, method, and accreditation of the International Online Islamic Academy.",
};

export default function AboutPage() {
  return (
    <>
      <div className="section-padding">
        <div className="mx-auto max-w-3xl">
          <SectionHeading title="About us" description="Premium, transparent, globally accessible Islamic education." />
          <div className="mt-12 space-y-8 text-muted-foreground">
            <section>
              <h2 className="font-display text-xl text-foreground">Our mission</h2>
              <p className="mt-4">
                We connect families worldwide with certified, vetted Quran and Islamic studies teachers — through live
                one-on-one classes that fit real schedules and real anxieties about trust and safety.
              </p>
            </section>
            <section>
              <h2 className="font-display text-xl text-foreground">Our method</h2>
              <p className="mt-4">
                Structured curricula (Qaida → Reading → Tajweed → Hifz), continuity with the same teacher, visible
                progress for parents, and timezone-aware scheduling — not generic group webinars.
              </p>
            </section>
            <section>
              <h2 className="font-display text-xl text-foreground">Accreditation & credentials</h2>
              <p className="mt-4">
                Teachers hold verified Ijazah chains and institutional qualifications. Credential verification is part of
                our onboarding — see <Link href="/teach-with-us" className="text-gold hover:underline">Teach With Us</Link> for
                the bar we hold ourselves to.
              </p>
            </section>
          </div>
          <Link href="/free-trial" className="mt-10 inline-block">
            <Button size="lg">Book a free trial</Button>
          </Link>
        </div>
      </div>
      <CTABand />
    </>
  );
}
