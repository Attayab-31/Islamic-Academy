import Link from "next/link";

const footerLinks = {
  Learn: [
    { href: "/courses", label: "Courses" },
    { href: "/programs", label: "Programs" },
    { href: "/teachers", label: "Teachers" },
    { href: "/pricing", label: "Pricing" },
  ],
  Trust: [
    { href: "/safeguarding", label: "Safeguarding" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/faq", label: "FAQ" },
    { href: "/how-it-works", label: "How It Works" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/teach-with-us", label: "Teach With Us" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/cookies", label: "Cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-night text-parchment">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 lg:grid-cols-5 md:px-8">
        <div className="lg:col-span-1">
          <p className="font-display text-xl">Islamic Academy</p>
          <p className="mt-3 text-sm text-parchment/70">
            Live one-on-one Quran and Islamic education for families in 17+ countries.
          </p>
          <p className="mt-4 text-xs text-parchment/50">
            Registered office: 123 Education Lane, London, UK (online delivery worldwide)
          </p>
        </div>
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">{title}</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-parchment/70 hover:text-gold focus-ring">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-parchment/10 py-6 text-center text-xs text-parchment/50">
        © {new Date().getFullYear()} International Online Islamic Academy. All rights reserved.
      </div>
    </footer>
  );
}
