import Link from "next/link";
import { CTABand, SectionHeading } from "@/components/shared";
import { Button } from "@/components/ui/button";

export default function PortalPage() {
    return (
        <>
            <div className="section-padding">
                <div className="mx-auto max-w-4xl">
                    <SectionHeading
                        title="Family portal"
                        description="Parents can review schedules, attendance, progress notes, and payment confirmation in one place."
                    />

                    <div className="mt-10 grid gap-6 md:grid-cols-2">
                        <div className="glass-card p-6">
                            <h2 className="font-display text-xl">Student dashboard</h2>
                            <p className="mt-3 text-muted-foreground">View upcoming lessons, homework, and teacher feedback.</p>
                        </div>
                        <div className="glass-card p-6">
                            <h2 className="font-display text-xl">Payments & admin</h2>
                            <p className="mt-3 text-muted-foreground">Upload transfer receipts and track confirmation status.</p>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <Link href="/api/auth/logout" className="text-sm text-gold hover:underline">Sign out</Link>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Button asChild>
                            <Link href="/payment">View payment instructions</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin">Admin view</Link>
                        </Button>
                    </div>
                </div>
            </div>
            <CTABand />
        </>
    );
}
