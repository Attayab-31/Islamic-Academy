import { getSiteUrl } from "./utils";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "International Online Islamic Academy",
    url: getSiteUrl(),
    description:
      "Live one-on-one Quran, Tajweed, Hifz, Arabic, and Islamic Studies classes for families worldwide.",
    sameAs: [],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "International Online Islamic Academy",
    url: getSiteUrl(),
    potentialAction: {
      "@type": "SearchAction",
      target: `${getSiteUrl()}/teachers?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function courseSchema(course: { title: string; description: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: "International Online Islamic Academy",
      sameAs: getSiteUrl(),
    },
    url: `${getSiteUrl()}/courses/${course.slug}`,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "PT45M",
    },
  };
}

export function personSchema(teacher: {
  name: string;
  bio: string;
  slug: string;
  credentials: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: teacher.name,
    description: teacher.bio,
    url: `${getSiteUrl()}/teachers/${teacher.slug}`,
    jobTitle: teacher.credentials,
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${getSiteUrl()}${item.href}`,
    })),
  };
}
