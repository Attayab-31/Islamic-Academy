export type Teacher = {
  slug: string;
  name: string;
  gender: "male" | "female";
  languages: string[];
  specializations: string[];
  credentials: string;
  ijazah: string;
  yearsTeaching: number;
  bio: string;
  availability: string;
  reviews: { text: string; author: string; country: string }[];
};

export const teachers: Teacher[] = [
  {
    slug: "fatima-al-hassan",
    name: "Ustadha Fatima Al-Hassan",
    gender: "female",
    languages: ["English", "Arabic"],
    specializations: ["Tajweed", "Qaida", "Kids"],
    credentials: "BA Islamic Studies, Al-Azhar University",
    ijazah: "Ijazah in Hafs an Asim via Shaykh Ahmad Al-Misri",
    yearsTeaching: 12,
    bio: "Fatima specializes in gentle, engaging instruction for children and sisters. She has taught hundreds of students across the US, UK, and Gulf regions.",
    availability: "Mon–Thu, 2pm–9pm GMT",
    reviews: [
      { text: "My daughter finally enjoys Quran class. Fatima is patient and structured.", author: "Sarah M.", country: "UK" },
    ],
  },
  {
    slug: "omar-rahman",
    name: "Ustadh Omar Rahman",
    gender: "male",
    languages: ["English", "Arabic", "Urdu"],
    specializations: ["Hifz", "Tajweed", "Adults"],
    credentials: "Hifz completion, Darul Uloom graduate",
    ijazah: "Ijazah in Warsh and Hafs",
    yearsTeaching: 15,
    bio: "Omar guides Hifz students with structured muraja'ah plans and clear milestones. Popular with adult learners returning to Quran.",
    availability: "Daily, 6am–12pm EST",
    reviews: [
      { text: "Clear Hifz plan and honest feedback every week.", author: "Ahmed K.", country: "USA" },
    ],
  },
  {
    slug: "aisha-malik",
    name: "Ustadha Aisha Malik",
    gender: "female",
    languages: ["English", "French"],
    specializations: ["Reverts", "Salah & Duas", "Islamic Studies"],
    credentials: "Certified Islamic Studies instructor",
    ijazah: "Sanad in Tajweed, European Institute of Islamic Sciences",
    yearsTeaching: 8,
    bio: "Aisha works primarily with reverts and new Muslims — Salah, duas, and foundational Islamic studies in a warm, non-judgmental setting.",
    availability: "Mon–Sat, 10am–6pm CET",
    reviews: [
      { text: "As a revert, I felt welcomed from day one.", author: "Emma L.", country: "France" },
    ],
  },
  {
    slug: "yusuf-ibrahim",
    name: "Ustadh Yusuf Ibrahim",
    gender: "male",
    languages: ["English", "Arabic", "Malay"],
    specializations: ["Arabic", "Tafseer", "Teens"],
    credentials: "MA Quranic Arabic, IIUM",
    ijazah: "Ijazah in Qira'at studies",
    yearsTeaching: 10,
    bio: "Yusuf teaches Quranic Arabic and introductory Tafseer for teens and adults who want understanding alongside recitation.",
    availability: "Tue–Sun, 7pm–11pm MYT",
    reviews: [
      { text: "Arabic finally makes sense in the context of the Quran.", author: "Hassan R.", country: "Malaysia" },
    ],
  },
  {
    slug: "maryam-siddiqui",
    name: "Ustadha Maryam Siddiqui",
    gender: "female",
    languages: ["English", "Urdu"],
    specializations: ["Noorani Qaida", "Kids", "Sisters"],
    credentials: "Certified Qaida instructor, 10+ years",
    ijazah: "Ijazah in Tajweed, Pakistan",
    yearsTeaching: 11,
    bio: "Maryam is known for structured Noorani Qaida progress with young learners and sisters beginning their Quran journey.",
    availability: "Mon–Fri, 4pm–10pm GMT",
    reviews: [
      { text: "Both my daughters love their classes with Maryam.", author: "Zainab A.", country: "Canada" },
    ],
  },
  {
    slug: "khalid-omar",
    name: "Ustadh Khalid Omar",
    gender: "male",
    languages: ["English", "Arabic", "German"],
    specializations: ["Tajweed", "Professionals", "Adults"],
    credentials: "Al-Azhar Faculty of Islamic Studies",
    ijazah: "Ijazah Hafs an Asim",
    yearsTeaching: 14,
    bio: "Khalid offers early-morning and lunch-hour slots for professionals in Europe and the Middle East seeking Tajweed refinement.",
    availability: "Mon–Fri, 6am–2pm CET",
    reviews: [
      { text: "Perfect before-work sessions. Very professional.", author: "Thomas B.", country: "Germany" },
    ],
  },
];

export function getTeacher(slug: string) {
  return teachers.find((t) => t.slug === slug);
}

export function filterTeachers(filters: {
  gender?: string;
  language?: string;
  specialization?: string;
}) {
  return teachers.filter((t) => {
    if (filters.gender && filters.gender !== "any" && t.gender !== filters.gender) return false;
    if (filters.language && !t.languages.some((l) => l.toLowerCase().includes(filters.language!.toLowerCase()))) return false;
    if (filters.specialization && !t.specializations.some((s) => s.toLowerCase().includes(filters.specialization!.toLowerCase()))) return false;
    return true;
  });
}
