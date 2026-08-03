import type { Metadata } from "next";
import { CTABand } from "@/components/shared";
import { TestimonialsPageContent } from "@/app/faq/page";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Reviews from families learning Quran online with our certified teachers.",
};

export default function TestimonialsPage() {
  return (
    <>
      <TestimonialsPageContent />
      <CTABand />
    </>
  );
}
