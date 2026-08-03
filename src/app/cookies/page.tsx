import type { Metadata } from "next";
import { CTABand, SectionHeading } from "@/components/shared";

export const metadata: Metadata = {
    title: "Cookie Policy",
    description: "How the Islamic Academy uses cookies and local storage on its website.",
};

export default function CookiesPage() {
    return (
        <>
            <div className="section-padding">
                <div className="mx-auto max-w-3xl">
                    <SectionHeading title="Cookie policy" description="We use cookies to improve experience, remember preferences, and support website analytics." />
                    <div className="mt-12 space-y-6 text-muted-foreground">
                        <p>
                            Essential cookies help keep the site functioning, including remembering your timezone and currency preferences for a smoother booking experience.
                        </p>
                        <p>
                            Analytics cookies may be used to understand page performance and improve the experience. These are only used when you accept analytics in our consent banner.
                        </p>
                        <p>
                            You can clear or block cookies from your browser settings. Some website preferences may be reset if cookies are removed.
                        </p>
                    </div>
                </div>
            </div>
            <CTABand />
        </>
    );
}
