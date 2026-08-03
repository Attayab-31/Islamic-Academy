import Link from "next/link";
import type { Metadata } from "next";
import { CTABand, SectionHeading } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { PaymentEnrollmentForm } from "@/components/forms/payment-enrollment-form";

export const metadata: Metadata = {
    title: "Direct Transfer Payment",
    description: "Complete your enrollment with a direct bank transfer or cash deposit.",
};

const paymentDetails = [
    { label: "Bank", value: "Dubai Islamic Bank" },
    { label: "Account Name", value: "Islamic Academy Intl" },
    { label: "Account Number", value: "101234567890" },
    { label: "Reference", value: "Use your full name and course" },
];

export default function PaymentPage() {
    return (
        <>
            <div className="section-padding">
                <div className="mx-auto max-w-3xl">
                    <SectionHeading
                        title="Make your enrollment payment"
                        description="We use direct bank transfer and secure manual confirmation for all family enrollments."
                    />

                    <div className="mt-10 glass-card p-8">
                        <h2 className="font-display text-2xl">Payment instructions</h2>
                        <ul className="mt-6 space-y-3 text-muted-foreground">
                            {paymentDetails.map((item) => (
                                <li key={item.label} className="flex justify-between gap-4 border-b border-border/60 pb-3">
                                    <span>{item.label}</span>
                                    <span className="font-medium text-foreground">{item.value}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-6 text-sm text-muted-foreground">
                            After transfer, send the receipt to our support team and we will activate your class schedule within one business day.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Button asChild>
                                <Link href="/free-trial">Continue to booking</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/contact">Contact support</Link>
                            </Button>
                        </div>

                        <div className="mt-8 border-t border-border/60 pt-8">
                            <h3 className="font-display text-xl">Submit transfer details</h3>
                            <p className="mt-2 text-sm text-muted-foreground">Send your transfer details here and our operations team will review them.</p>
                            <PaymentEnrollmentForm />
                        </div>
                    </div>
                </div>
            </div>
            <CTABand />
        </>
    );
}
