import Link from "next/link";
import type { Metadata } from "next";
import { CTABand, SectionHeading } from "@/components/shared";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Teach With Us",
    description: "Join the International Online Islamic Academy as a vetted Quran and Islamic studies teacher.",
};

const standards = [
    "Verified credentials and Ijazah chains",
    "Safeguarding training and parent-facing communication",
    "Patient, online-friendly teaching for children and adults",
    "Clear lesson planning and progress updates",
];

export default function TeachWithUsPage() {
    return (
        <>
            <div className="section-padding">
                <div className="mx-auto max-w-3xl">
                    <SectionHeading
                        title="Teach with us"
                        description="We welcome qualified teachers who are committed to safe, high-quality, one-on-one Islamic education."
                    />
                    <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="glass-card p-8">
                            <h2 className="font-display text-2xl">What we look for</h2>
                            <ul className="mt-4 space-y-3 text-muted-foreground">
                                {standards.map((item) => (
                                    <li key={item} className="flex gap-2">
                                        <span className="mt-1 text-gold">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="glass-card p-8">
                            <h2 className="font-display text-2xl">Why teachers join</h2>
                            <p className="mt-4 text-muted-foreground">
                                You will work with families who value continuity, clear communication, and a premium learning experience.
                                We provide a structured onboarding process and a strong safeguarding culture.
                            </p>
                            <Link href="/contact" className="mt-6 inline-block">
                                <Button size="lg">Apply to teach</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <CTABand />
        </>
    );
}
