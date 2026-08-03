import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared";
import { ContactForm } from "@/components/forms/client-forms";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the International Online Islamic Academy.",
};

export default function ContactPage() {
  return (
    <div className="section-padding">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading title="Contact us" description="We respond within 24 hours." />
          <div className="mt-8 space-y-4 text-muted-foreground">
            <p>Email: hello@islamic-academy.example</p>
            <p>WhatsApp: available via the chat bubble on every page</p>
            <p className="text-sm">Registered office: 123 Education Lane, London, UK</p>
          </div>
        </div>
        <div className="glass-card p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
