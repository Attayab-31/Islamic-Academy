import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared";
import { ResourceCaptureForm } from "@/components/forms/client-forms";

export const metadata: Metadata = {
  title: "Resources",
  description: "Free guides, printable dua cards, and Arabic alphabet charts.",
};

const resources = [
  { slug: "parent-guide", title: "Parent's Guide to Online Quran Learning", description: "Checklist for evaluating teachers and platforms." },
  { slug: "dua-cards", title: "Printable Daily Dua Cards", description: "Essential duas for children and reverts." },
  { slug: "arabic-alphabet", title: "Arabic Alphabet Chart", description: "Reference chart for Qaida practice at home." },
];

export default function ResourcesPage() {
  return (
    <div className="section-padding">
      <SectionHeading title="Free resources" description="Download guides — email required, no spam." />
      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
        {resources.map((r) => (
          <div key={r.slug} className="glass-card p-6">
            <h2 className="font-display text-lg">{r.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>
            <ResourceCaptureForm resource={r.slug} />
          </div>
        ))}
      </div>
    </div>
  );
}
