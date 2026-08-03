import type { Metadata } from "next";
import { CTABand, SectionHeading } from "@/components/shared";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "How the Islamic Academy collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
    return (
        <>
            <div className="section-padding">
                <div className="mx-auto max-w-3xl">
                    <SectionHeading title="Privacy policy" description="We are careful with family and student data, especially for minors." />
                    <div className="mt-12 space-y-6 text-muted-foreground">
                        <p>
                            We collect only the information necessary to provide our classes, communicate with families, and maintain safe records for student progress and scheduling.
                        </p>
                        <p>
                            Personal data may include your name, email address, phone number, country, learner age, and billing or payment details when relevant. We use this information to confirm bookings, share class details, and support our service.
                        </p>
                        <p>
                            For learners under 16, we require parent or guardian consent before processing information beyond what is necessary for class delivery. We do not sell personal data to third parties.
                        </p>
                        <p>
                            You may request access, correction, or deletion of your information by contacting us through the contact page.
                        </p>
                    </div>
                </div>
            </div>
            <CTABand />
        </>
    );
}
