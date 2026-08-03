import type { Metadata } from "next";
import { CTABand, SectionHeading } from "@/components/shared";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Terms for booking, rescheduling, and attending live Quran classes at the Islamic Academy.",
};

export default function TermsPage() {
    return (
        <>
            <div className="section-padding">
                <div className="mx-auto max-w-3xl">
                    <SectionHeading title="Terms of service" description="These terms govern trial bookings, class attendance, and student support." />
                    <div className="mt-12 space-y-6 text-muted-foreground">
                        <p>
                            Trial classes are offered free of charge and are intended to help families assess fit before enrolling in ongoing lessons.
                        </p>
                        <p>
                            Reschedules should be made at least 24 hours in advance. Late cancellations may result in forfeiture of the session at the discretion of the academy.
                        </p>
                        <p>
                            Families are responsible for ensuring that the learner is present at the scheduled time and that the learning environment is appropriate for online class participation.
                        </p>
                        <p>
                            The academy may update these terms from time to time. Continued use of our services after any update constitutes acceptance of the revised terms.
                        </p>
                    </div>
                </div>
            </div>
            <CTABand />
        </>
    );
}
