export type Program = {
  slug: string;
  title: string;
  headline: string;
  description: string;
  objections: { concern: string; answer: string }[];
  highlights: string[];
};

export const programs: Program[] = [
  {
    slug: "kids",
    title: "Kids",
    headline: "Engaging one-on-one Quran classes built for young learners",
    description:
      "Short, focused sessions with patient teachers who keep children engaged — with safeguarding policies parents can read before booking.",
    objections: [
      { concern: "Will my child stay focused online?", answer: "Teachers use age-appropriate pacing, visuals, and breaks. Parents receive weekly progress notes." },
      { concern: "Is the teacher qualified and safe?", answer: "Every teacher is vetted, credentialed, and safeguarding-trained. Read our full policy at /safeguarding." },
    ],
    highlights: ["Ages 4+", "Female teacher option", "Parent progress reports", "Gamified practice between classes"],
  },
  {
    slug: "teens",
    title: "Teens",
    headline: "Structured Quran learning that respects their schedule",
    description:
      "Flexible evening and weekend slots for teens balancing school — Tajweed, Hifz, or Islamic studies with a consistent teacher.",
    objections: [
      { concern: "School schedule conflicts", answer: "Book around your timezone with rescheduling options shown upfront." },
    ],
    highlights: ["Flexible scheduling", "Hifz and Tajweed tracks", "Same teacher continuity"],
  },
  {
    slug: "adults",
    title: "Adults",
    headline: "Learn at your pace — no judgment, no crowded classrooms",
    description:
      "Whether you're returning to Quran, starting fresh, or deepening Tajweed — one-on-one classes fit real adult life.",
    objections: [
      { concern: "I feel embarrassed starting late", answer: "Many adult students begin with us. Teachers are trained to be encouraging and private." },
    ],
    highlights: ["Beginner-friendly", "Tajweed and Arabic tracks", "30-minute session options"],
  },
  {
    slug: "sisters",
    title: "Sisters",
    headline: "Female teachers available — always, on request",
    description:
      "Learn with confidence. Filter our teacher directory for female instructors and book a free trial with your preferred teacher.",
    objections: [
      { concern: "Can I guarantee a female teacher?", answer: "Yes. Select 'Female teacher only' in booking and we'll match you accordingly." },
    ],
    highlights: ["Female teacher guarantee", "Private one-on-one Zoom", "Sisters-only testimonials"],
  },
  {
    slug: "reverts",
    title: "Reverts & New Muslims",
    headline: "Start gently — Salah, Qaida, and Islamic basics at your pace",
    description:
      "Judgment-free, beginner-paced classes for new Muslims. Your teacher meets you where you are.",
    objections: [
      { concern: "I don't know where to start", answer: "Book a free assessment. We'll recommend Salah, Qaida, or Islamic studies based on your goals." },
    ],
    highlights: ["Revert-friendly teachers", "Salah & duas track", "No prior knowledge required"],
  },
  {
    slug: "professionals",
    title: "Busy Professionals",
    headline: "Quran learning that fits your calendar",
    description:
      "Early morning, lunch break, or late evening slots across timezones. Short sessions, clear reschedule policy.",
    objections: [
      { concern: "I travel often", answer: "Reschedule with notice. Your teacher and materials stay consistent." },
    ],
    highlights: ["30-min sessions", "Timezone-aware booking", "Transparent cancellation policy"],
  },
];

export function getProgram(slug: string) {
  return programs.find((p) => p.slug === slug);
}
