import Link from "next/link";
import type { Metadata } from "next";
import { CTABand, SectionHeading } from "@/components/shared";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Referral Program",
    description: "Share the Islamic Academy with friends and family and receive a referral credit when they enroll.",
};

export default function ReferralPage() {
    return (
        <>
            <div className="section-padding">
                <div className="mx-auto max-w-3xl">
                    <SectionHeading
                        title="Referral program"
                        description="Recommend us to another family and help them begin their journey with confidence."
                    />
                    <div className="mt-12 glass-card p-8">
                        <p className="text-muted-foreground">
                            Existing families can share their referral code with friends, siblings, or community contacts. When a new family books a trial and enrolls, both parties receive a credit toward future classes.
                        </p>
                        <div className="mt-6 rounded-lg border border-gold/30 bg-gold/10 p-4">
                            <p className="text-sm text-muted-foreground">Your code</p>
                            <p className="mt-2 font-display text-2xl text-gold">ISLAMIC-2026</p>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link href="/free-trial">
                                <Button size="lg">Start a family referral</Button>
                            </Link>
                            <Link href="/portal">
                                <Button size="lg" variant="outline">Open family portal</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <CTABand />
        </>
    );
}
