import Link from "next/link";
import type { Metadata } from "next";
import { CTABand, SectionHeading } from "@/components/shared";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Book a free trial, meet your teacher on Zoom, get your timetable, and start learning.",
};

const steps = [
  {
    title: "Book a free trial",
    detail: "Choose your course, learner profile, and a time slot in your timezone. No credit card required.",
  },
  {
    title: "Meet your teacher on Zoom",
    detail: "You'll receive a Zoom link and calendar invite immediately. For young children, we recommend a parent present.",
  },
  {
    title: "Get your personalized timetable",
    detail: "After the trial, your teacher recommends a weekly schedule and learning path based on level and goals.",
  },
  {
    title: "Start monthly learning",
    detail: "Choose a pricing tier, subscribe when ready, and receive progress reports and WhatsApp reminders.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <div className="section-padding">
        <SectionHeading
          title="How it works"
          description="What happens after you click 'Book Free Trial' — no surprises."
        />
        <div className="mx-auto mt-12 max-w-3xl space-y-8">
          {steps.map((step, i) => (
            <div key={step.title} className="flex gap-6">
              <span className="font-display text-4xl text-gold">{i + 1}</span>
              <div>
                <h2 className="font-display text-xl">{step.title}</h2>
                <p className="mt-2 text-muted-foreground">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-3xl glass-card p-8">
          <h2 className="font-display text-xl">Rescheduling</h2>
          <p className="mt-4 text-muted-foreground">
            Reschedule with 24+ hours notice via your portal or WhatsApp. Your confirmation email includes all details
            and your assigned teacher&apos;s bio.
          </p>
        </div>

        <div className="mt-12 text-center">
          <Link href="/free-trial"><Button size="lg">Book your free trial</Button></Link>
        </div>
      </div>
      <CTABand />
    </>
  );
}
