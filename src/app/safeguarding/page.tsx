import Link from "next/link";
import type { Metadata } from "next";
import { CTABand, SectionHeading } from "@/components/shared";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Safeguarding",
  description: "Child safety policy, teacher vetting, and reporting procedures for online Quran classes.",
};

export default function SafeguardingPage() {
  return (
    <>
      <div className="section-padding">
        <div className="mx-auto max-w-3xl prose prose-neutral dark:prose-invert">
          <SectionHeading
            title="Safeguarding policy"
            description="How we protect children in one-on-one online learning."
          />
          <div className="mt-12 space-y-8 text-muted-foreground">
            <section>
              <h2 className="font-display text-xl text-foreground">Teacher vetting</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>Credential and Ijazah verification</li>
                <li>Reference checks from previous employers or institutions</li>
                <li>Safeguarding training before first student assignment</li>
                <li>Supervised trial period with internal review</li>
              </ul>
            </section>
            <section>
              <h2 className="font-display text-xl text-foreground">During live classes</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>Parents/guardians encouraged present for learners under 12</li>
                <li>Classes conducted on Zoom with waiting room enabled</li>
                <li>No private social media contact between teachers and minors</li>
                <li>Recordings only with explicit consent for quality/training</li>
              </ul>
            </section>
            <section>
              <h2 className="font-display text-xl text-foreground">Reporting concerns</h2>
              <p className="mt-4">
                Report any concern immediately via{" "}
                <Link href="/contact" className="text-gold hover:underline">Contact</Link> or safeguarding@islamic-academy.example.
                We investigate all reports within 24 hours and suspend teachers pending review when required.
              </p>
            </section>
            <section>
              <h2 className="font-display text-xl text-foreground">Data privacy for minors</h2>
              <p className="mt-4">
                We collect only information necessary for scheduling and progress tracking. Parent/guardian consent is
                required for learners under 16. See our <Link href="/privacy" className="text-gold hover:underline">Privacy Policy</Link>.
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
