export type Course = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  audience: string[];
  syllabus: string[];
  qualifications: string[];
  faqs: { question: string; answer: string }[];
};

export const courses: Course[] = [
  {
    slug: "quran-reading-qaida",
    title: "Quran Reading & Qaida",
    shortDescription: "Build fluent Quran reading from the Arabic alphabet onward.",
    description:
      "A structured path from letter recognition to confident recitation. Ideal for beginners of all ages who want a calm, one-on-one foundation before Tajweed or Hifz.",
    audience: ["Kids", "Teens", "Adults", "Reverts"],
    syllabus: [
      "Arabic alphabet and vowel marks",
      "Joining letters and basic words",
      "Short surahs with teacher correction",
      "Fluency drills and reading rhythm",
    ],
    qualifications: [
      "Certified Qaida instructors",
      "Child-friendly teaching methodology",
      "Progress tracking for parents",
    ],
    faqs: [
      {
        question: "How long does Qaida usually take?",
        answer: "Most students progress in 3–6 months with consistent weekly classes, depending on age and practice.",
      },
      {
        question: "Can adults start here?",
        answer: "Yes. Many reverts and adult learners begin with Qaida in a judgment-free, paced environment.",
      },
    ],
  },
  {
    slug: "noorani-qaida",
    title: "Noorani Qaida",
    shortDescription: "Classic Noorani Qaida curriculum with live correction.",
    description:
      "Learn through the widely trusted Noorani Qaida method with a dedicated teacher who corrects pronunciation and pacing in every session.",
    audience: ["Kids", "Teens", "Adults"],
    syllabus: [
      "Noorani Qaida lessons 1–17",
      "Tajweed basics integrated early",
      "Reading from the Mushaf",
      "Teacher-assigned home practice",
    ],
    qualifications: ["Ijazah-qualified teachers", "Structured lesson plans", "Weekly parent updates"],
    faqs: [
      {
        question: "Is Noorani Qaida different from general Qaida?",
        answer: "Noorani Qaida is a specific, widely used primer. We follow its lesson sequence with live correction.",
      },
    ],
  },
  {
    slug: "tajweed",
    title: "Tajweed",
    shortDescription: "Refine pronunciation, articulation, and recitation rules.",
    description:
      "For students who can read Arabic and want accurate, beautiful recitation. Your teacher works through Tajweed rules with practical application in every class.",
    audience: ["Kids", "Teens", "Adults"],
    syllabus: [
      "Makharij and Sifaat",
      "Noon and Meem rules",
      "Madd and stopping rules",
      "Applied recitation with feedback",
    ],
    qualifications: ["Tajweed-specialist teachers", "Audio review between sessions", "Certificate on completion"],
    faqs: [
      {
        question: "Do I need to finish Qaida first?",
        answer: "You should read Arabic comfortably. If not, we recommend starting with Qaida or a free assessment.",
      },
    ],
  },
  {
    slug: "hifz",
    title: "Hifz (Memorization)",
    shortDescription: "Personalized Hifz plan with revision systems and parent visibility.",
    description:
      "One-on-one memorization with a teacher who tracks new memorization, revision (muraja'ah), and long-term retention — with progress visible to parents.",
    audience: ["Kids", "Teens", "Adults"],
    syllabus: [
      "Placement and pace planning",
      "New memorization sessions",
      "Daily/weekly revision structure",
      "Quarterly progress reviews",
    ],
    qualifications: ["Experienced Hifz teachers", "Structured muraja'ah plans", "Parent progress reports"],
    faqs: [
      {
        question: "How long does Hifz take?",
        answer: "It varies widely by age, schedule, and consistency. Your teacher sets a realistic plan after assessment.",
      },
    ],
  },
  {
    slug: "arabic",
    title: "Arabic for Quran",
    shortDescription: "Understand Quranic Arabic vocabulary and grammar foundations.",
    description:
      "Build understanding of Quranic vocabulary and basic grammar so recitation becomes meaningful — not rote.",
    audience: ["Teens", "Adults", "Reverts"],
    syllabus: ["High-frequency Quranic words", "Basic grammar patterns", "Short ayah analysis", "Vocabulary retention tools"],
    qualifications: ["Arabic language specialists", "Quran-context teaching", "Works alongside Tajweed"],
    faqs: [
      {
        question: "Is this classical Arabic or Quranic focus?",
        answer: "Our Arabic track is Quranic-context first — vocabulary and grammar that help you understand what you recite.",
      },
    ],
  },
  {
    slug: "islamic-studies",
    title: "Islamic Studies",
    shortDescription: "Aqeedah, Fiqh basics, and living Islam for families.",
    description:
      "Age-appropriate Islamic studies covering belief, worship, character, and daily practice — taught one-on-one or in sibling pairs.",
    audience: ["Kids", "Teens", "Adults", "Reverts"],
    syllabus: ["Aqeedah foundations", "Salah and worship", "Akhlaaq and adab", "Age-appropriate Fiqh"],
    qualifications: ["Qualified Islamic studies teachers", "Safeguarding-trained", "Parent-friendly summaries"],
    faqs: [
      {
        question: "Can siblings share a class?",
        answer: "Yes, with teacher approval we offer paired sessions for siblings at similar levels.",
      },
    ],
  },
  {
    slug: "duas-and-salah",
    title: "Duas & Salah",
    shortDescription: "Learn Salah step-by-step and essential daily duas.",
    description:
      "Perfect for reverts, teens, and families who want practical worship skills — how to pray, what to say, and why it matters.",
    audience: ["Kids", "Teens", "Adults", "Reverts"],
    syllabus: ["Wudu and Salah steps", "Essential daily duas", "Jumu'ah and Eid basics", "Practice with teacher feedback"],
    qualifications: ["Patient, beginner-focused teachers", "Female teacher option", "Printable guides"],
    faqs: [
      {
        question: "Is this only for new Muslims?",
        answer: "No. Many families use this track to strengthen Salah and daily duas together.",
      },
    ],
  },
  {
    slug: "seerah",
    title: "Seerah",
    shortDescription: "The life of the Prophet ﷺ — engaging and structured.",
    description:
      "Explore the Seerah with a teacher who adapts depth and pacing to the learner's age and background.",
    audience: ["Kids", "Teens", "Adults"],
    syllabus: ["Pre-prophethood context", "Makkan period", "Madinan period", "Lessons for daily life"],
    qualifications: ["Seerah-specialist teachers", "Story-based for children", "Discussion-based for adults"],
    faqs: [
      {
        question: "What age is Seerah suitable for?",
        answer: "We offer age-appropriate Seerah from young children through adult learners.",
      },
    ],
  },
  {
    slug: "tafseer",
    title: "Tafseer",
    shortDescription: "Guided understanding of selected surahs and themes.",
    description:
      "For students ready to go beyond recitation — guided Tafseer sessions on selected surahs with qualified teachers.",
    audience: ["Teens", "Adults"],
    syllabus: ["Surah selection by level", "Theme and context", "Vocabulary in context", "Reflection and application"],
    qualifications: ["Qualified Tafseer teachers", "Structured reading lists", "Respectful, scholarly tone"],
    faqs: [
      {
        question: "What level do I need for Tafseer?",
        answer: "Comfortable Quran reading and basic Islamic literacy. Your free assessment helps place you correctly.",
      },
    ],
  },
];

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}
