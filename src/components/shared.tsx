import Link from "next/link";
import { cn } from "@/lib/utils";

export function JsonLd({ data }: { data: object | object[] }) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json.length === 1 ? json[0] : json) }}
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-3xl text-center", className)}>
      {eyebrow && <p className="mb-3 font-arabic text-sm text-gold">{eyebrow}</p>}
      <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-muted-foreground">{description}</p>}
    </div>
  );
}

export function CTABand() {
  return (
    <section className="section-padding relative overflow-hidden bg-night text-parchment">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_50%,#C9A24B_0%,transparent_50%)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="font-display text-3xl md:text-4xl">Book your free trial class today</h2>
        <p className="mt-4 text-parchment/80">
          Meet your teacher on Zoom. No credit card required. Timezone-aware scheduling worldwide.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/free-trial"
            className="inline-flex h-12 items-center rounded-lg bg-gold px-8 font-medium text-night hover:bg-gold/90 focus-ring"
          >
            Book Your Free Trial
          </Link>
          <Link href="/how-it-works" className="inline-flex h-12 items-center px-4 text-gold hover:underline focus-ring">
            See How It Works
          </Link>
        </div>
      </div>
    </section>
  );
}

export function MihrabDivider() {
  return (
    <div className="flex justify-center py-8" aria-hidden>
      <svg width="120" height="24" viewBox="0 0 120 24" fill="none" className="text-gold/40">
        <path d="M0 24 L60 0 L120 24" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}
