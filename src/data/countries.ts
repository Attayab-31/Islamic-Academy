export type CountryHub = {
  code: string;
  slug: string;
  name: string;
  currency: string;
  locale: string;
  hreflang: string;
  timezone: string;
  sampleTimetable: string[];
  faqs: { question: string; answer: string }[];
  testimonial?: { text: string; author: string };
};

export const countries: CountryHub[] = [
  {
    code: "US",
    slug: "usa",
    name: "United States",
    currency: "USD",
    locale: "en-US",
    hreflang: "en-us",
    timezone: "America/New_York",
    sampleTimetable: ["Mon 6pm EST — Kids Qaida", "Wed 7pm EST — Adult Tajweed", "Sat 10am EST — Hifz"],
    faqs: [
      { question: "Do you follow US school holidays?", answer: "Yes. You can pause or adjust scheduling during holidays with notice." },
    ],
    testimonial: { text: "Evening classes fit perfectly after work.", author: "James P., New York" },
  },
  {
    code: "GB",
    slug: "uk",
    name: "United Kingdom",
    currency: "GBP",
    locale: "en-GB",
    hreflang: "en-gb",
    timezone: "Europe/London",
    sampleTimetable: ["Tue 5pm GMT — Kids Tajweed", "Thu 6pm GMT — Sisters Hifz", "Sun 11am GMT — Reverts Salah"],
    faqs: [
      { question: "Is safeguarding aligned with UK expectations?", answer: "Yes. Our safeguarding policy covers DBS-style vetting and parent reporting channels." },
    ],
    testimonial: { text: "Safeguarding policy gave us confidence to enroll our daughter.", author: "Amina H., London" },
  },
  {
    code: "CA",
    slug: "canada",
    name: "Canada",
    currency: "CAD",
    locale: "en-CA",
    hreflang: "en-ca",
    timezone: "America/Toronto",
    sampleTimetable: ["Mon 7pm EST — Teens Hifz", "Wed 5pm EST — Kids Qaida", "Sat 9am EST — Arabic"],
    faqs: [
      { question: "Sibling discounts?", answer: "Yes — contact us after your free trial for sibling pricing." },
    ],
  },
  {
    code: "AU",
    slug: "australia",
    name: "Australia",
    currency: "AUD",
    locale: "en-AU",
    hreflang: "en-au",
    timezone: "Australia/Sydney",
    sampleTimetable: ["Tue 6pm AEDT — Kids", "Thu 7pm AEDT — Adults Tajweed", "Sat 8am AEDT — Hifz"],
    faqs: [
      { question: "Australian school holiday scheduling?", answer: "We adjust around NSW/VIC term breaks — ask your teacher when booking." },
    ],
  },
  {
    code: "AE",
    slug: "uae",
    name: "United Arab Emirates",
    currency: "AED",
    locale: "en-AE",
    hreflang: "en-ae",
    timezone: "Asia/Dubai",
    sampleTimetable: ["Sun–Thu 5pm GST — Kids", "Sat 10am GST — Tajweed", "Daily 7am GST — Professionals"],
    faqs: [
      { question: "English or Arabic instruction?", answer: "Both available. Select your preferred language when booking." },
    ],
  },
  {
    code: "DE",
    slug: "germany",
    name: "Germany",
    currency: "EUR",
    locale: "de-DE",
    hreflang: "de-DE",
    timezone: "Europe/Berlin",
    sampleTimetable: ["Mon 6pm CET — Tajweed", "Wed 5pm CET — Kids Qaida", "Sat 10am CET — Islamic Studies"],
    faqs: [
      { question: "GDPR and data privacy?", answer: "We process data under GDPR. See our Privacy Policy for retention and rights." },
    ],
  },
  {
    code: "MY",
    slug: "malaysia",
    name: "Malaysia",
    currency: "MYR",
    locale: "en-MY",
    hreflang: "en-my",
    timezone: "Asia/Kuala_Lumpur",
    sampleTimetable: ["Daily 8pm MYT — Hifz", "Sat 9am MYT — Kids", "Sun 7pm MYT — Arabic"],
    faqs: [],
  },
  {
    code: "SA",
    slug: "saudi-arabia",
    name: "Saudi Arabia",
    currency: "SAR",
    locale: "en-SA",
    hreflang: "en-sa",
    timezone: "Asia/Riyadh",
    sampleTimetable: ["Sun–Thu 4pm AST — Kids", "Fri 10am AST — Tajweed", "Sat 6pm AST — Hifz"],
    faqs: [],
  },
  {
    code: "ZA",
    slug: "south-africa",
    name: "South Africa",
    currency: "ZAR",
    locale: "en-ZA",
    hreflang: "en-za",
    timezone: "Africa/Johannesburg",
    sampleTimetable: ["Mon 6pm SAST — Kids", "Wed 7pm SAST — Adults", "Sat 9am SAST — Reverts"],
    faqs: [
      { question: "POPIA compliance?", answer: "We comply with POPIA for South African families. Details in our Privacy Policy." },
    ],
  },
  {
    code: "SG",
    slug: "singapore",
    name: "Singapore",
    currency: "SGD",
    locale: "en-SG",
    hreflang: "en-sg",
    timezone: "Asia/Singapore",
    sampleTimetable: ["Tue 7pm SGT — Kids", "Thu 8pm SGT — Tajweed", "Sun 10am SGT — Hifz"],
    faqs: [],
  },
  {
    code: "NZ",
    slug: "new-zealand",
    name: "New Zealand",
    currency: "NZD",
    locale: "en-NZ",
    hreflang: "en-nz",
    timezone: "Pacific/Auckland",
    sampleTimetable: ["Mon 6pm NZDT — Kids", "Wed 7pm NZDT — Teens", "Sat 9am NZDT — Qaida"],
    faqs: [],
  },
  {
    code: "IE",
    slug: "ireland",
    name: "Ireland",
    currency: "EUR",
    locale: "en-IE",
    hreflang: "en-ie",
    timezone: "Europe/Dublin",
    sampleTimetable: ["Tue 6pm IST — Kids", "Thu 7pm IST — Sisters", "Sat 11am IST — Tajweed"],
    faqs: [],
  },
];

export function getCountry(slug: string) {
  return countries.find((c) => c.slug === slug);
}

export const pricingTiers = [
  {
    name: "Essentials",
    sessions: "2 sessions / week",
    duration: "30 minutes",
    prices: { USD: 79, GBP: 65, CAD: 99, AUD: 119, EUR: 72, AED: 290, SAR: 295, MYR: 349, ZAR: 1299, SGD: 99, NZD: 129 },
    features: ["Dedicated teacher", "Progress reports", "Reschedule with 24h notice", "WhatsApp reminders"],
  },
  {
    name: "Standard",
    sessions: "3 sessions / week",
    duration: "45 minutes",
    prices: { USD: 119, GBP: 95, CAD: 149, AUD: 179, EUR: 109, AED: 435, SAR: 445, MYR: 529, ZAR: 1999, SGD: 149, NZD: 189 },
    features: ["Everything in Essentials", "Priority scheduling", "Monthly PDF progress report", "Digital certificate on milestones"],
    popular: true,
  },
  {
    name: "Intensive",
    sessions: "5 sessions / week",
    duration: "45 minutes",
    prices: { USD: 179, GBP: 145, CAD: 229, AUD: 269, EUR: 165, AED: 655, SAR: 665, MYR: 799, ZAR: 2999, SGD: 219, NZD: 279 },
    features: ["Everything in Standard", "Hifz-optimized pacing", "Twice-monthly teacher check-in call", "Sibling add-on discount"],
  },
];
