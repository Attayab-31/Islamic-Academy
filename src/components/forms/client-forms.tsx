"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { courses } from "@/data/courses";
import { programs } from "@/data/programs";
import type { TimeSlot } from "@/lib/booking";
import { generateIcsEvent } from "@/lib/dates";

const learnerSchema = z.object({
  learnerName: z.string().min(2),
  learnerAge: z.string().min(1),
  level: z.string().min(1),
  language: z.string().min(1),
  teacherGender: z.enum(["any", "male", "female"]),
});

const contactSchema = z.object({
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  country: z.string().min(2),
  whatsappOptIn: z.boolean().optional(),
});

type BookingResult = {
  reference: string;
  zoomLink: string;
  teacherName: string;
  slotStart: string;
  slotEnd: string;
  courseSlug: string;
};

export function BookingFlow({
  initialCourse,
  initialProgram,
  initialTeacher,
  timezone,
  slots,
}: {
  initialCourse?: string;
  initialProgram?: string;
  initialTeacher?: string;
  timezone: string;
  slots: TimeSlot[];
}) {
  const [step, setStep] = useState(1);
  const [courseSlug, setCourseSlug] = useState(initialCourse ?? "");
  const [programSlug, setProgramSlug] = useState(initialProgram ?? "");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [tz, setTz] = useState(timezone);
  const [result, setResult] = useState<BookingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const learnerForm = useForm<z.infer<typeof learnerSchema>>({
    resolver: zodResolver(learnerSchema),
    defaultValues: { teacherGender: "any", level: "beginner", language: "English" },
  });

  const contactForm = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { whatsappOptIn: true },
  });

  async function submitBooking(data: z.infer<typeof contactSchema>) {
    if (!selectedSlot || !courseSlug) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug,
          programSlug: programSlug || undefined,
          teacherId: selectedSlot.teacherId,
          teacherSlug: initialTeacher,
          timezone: tz,
          slotStart: selectedSlot.start.toISOString(),
          slotEnd: selectedSlot.end.toISOString(),
          ...learnerForm.getValues(),
          ...data,
        }),
      });
      if (!res.ok) throw new Error("Booking failed");
      const json = await res.json();
      setResult(json);
      setStep(5);
    } catch {
      setError("Something went wrong. Please try again or contact us on WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  function downloadIcs() {
    if (!result) return;
    const ics = generateIcsEvent({
      title: "Free Trial Quran Class",
      description: `Reference: ${result.reference}`,
      start: new Date(result.slotStart),
      end: new Date(result.slotEnd),
      location: result.zoomLink,
    });
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trial-class.ics";
    a.click();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex gap-2" aria-label="Booking progress">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded ${s <= step ? "bg-gold" : "bg-muted"}`}
            aria-current={s === step ? "step" : undefined}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <h2 className="font-display text-2xl">Choose your track</h2>
          <div>
            <Label htmlFor="course">Course</Label>
            <select
              id="course"
              className="mt-2 flex h-11 w-full rounded-lg border border-input bg-background px-3 focus-ring"
              value={courseSlug}
              onChange={(e) => setCourseSlug(e.target.value)}
            >
              <option value="">Select a course</option>
              {courses.map((c) => (
                <option key={c.slug} value={c.slug}>{c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="program">Audience (optional)</Label>
            <select
              id="program"
              className="mt-2 flex h-11 w-full rounded-lg border border-input bg-background px-3 focus-ring"
              value={programSlug}
              onChange={(e) => setProgramSlug(e.target.value)}
            >
              <option value="">Select audience</option>
              {programs.map((p) => (
                <option key={p.slug} value={p.slug}>{p.title}</option>
              ))}
            </select>
          </div>
          <Button disabled={!courseSlug} onClick={() => setStep(2)}>Continue</Button>
        </div>
      )}

      {step === 2 && (
        <form className="space-y-4" onSubmit={learnerForm.handleSubmit(() => setStep(3))}>
          <h2 className="font-display text-2xl">Learner profile</h2>
          <div>
            <Label htmlFor="learnerName">Learner name</Label>
            <Input id="learnerName" {...learnerForm.register("learnerName")} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="learnerAge">Age band</Label>
            <select id="learnerAge" className="mt-2 flex h-11 w-full rounded-lg border border-input bg-background px-3 focus-ring" {...learnerForm.register("learnerAge")}>
              <option value="4-7">4–7</option>
              <option value="8-12">8–12</option>
              <option value="13-17">13–17</option>
              <option value="18+">18+</option>
            </select>
          </div>
          <div>
            <Label htmlFor="level">Current level</Label>
            <select id="level" className="mt-2 flex h-11 w-full rounded-lg border border-input bg-background px-3 focus-ring" {...learnerForm.register("level")}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <Label htmlFor="language">Preferred language</Label>
            <Input id="language" {...learnerForm.register("language")} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="teacherGender">Teacher preference</Label>
            <select id="teacherGender" className="mt-2 flex h-11 w-full rounded-lg border border-input bg-background px-3 focus-ring" {...learnerForm.register("teacherGender")}>
              <option value="any">No preference</option>
              <option value="female">Female only</option>
              <option value="male">Male only</option>
            </select>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button type="submit">Continue</Button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl">Pick a time</h2>
          <div>
            <Label htmlFor="timezone">Your timezone</Label>
            <Input id="timezone" value={tz} onChange={(e) => setTz(e.target.value)} className="mt-2 font-mono text-sm" />
          </div>
          <div className="grid gap-2 max-h-80 overflow-y-auto" role="listbox" aria-label="Available time slots">
            {slots.length === 0 && <p className="text-muted-foreground">No slots available. Please contact us.</p>}
            {slots.slice(0, 20).map((slot) => (
              <button
                key={slot.id}
                type="button"
                role="option"
                aria-selected={selectedSlot?.id === slot.id}
                onClick={() => setSelectedSlot(slot)}
                className={`rounded-lg border p-3 text-left text-sm focus-ring ${selectedSlot?.id === slot.id ? "border-gold bg-accent" : "border-border"}`}
              >
                <span className="font-mono">{slot.label}</span>
                <span className="block text-muted-foreground">with {slot.teacherName}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button disabled={!selectedSlot} onClick={() => setStep(4)}>Continue</Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <form className="space-y-4" onSubmit={contactForm.handleSubmit(submitBooking)}>
          <h2 className="font-display text-2xl">Contact details</h2>
          <div>
            <Label htmlFor="contactName">Your name</Label>
            <Input id="contactName" {...contactForm.register("contactName")} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="contactEmail">Email</Label>
            <Input id="contactEmail" type="email" {...contactForm.register("contactEmail")} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="contactPhone">Phone / WhatsApp (optional)</Label>
            <Input id="contactPhone" {...contactForm.register("contactPhone")} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" {...contactForm.register("country")} className="mt-2" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...contactForm.register("whatsappOptIn")} className="focus-ring" />
            Send WhatsApp reminders
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(3)}>Back</Button>
            <Button type="submit" disabled={loading}>{loading ? "Booking..." : "Confirm Free Trial"}</Button>
          </div>
        </form>
      )}

      {step === 5 && result && (
        <div className="space-y-6 text-center">
          <h2 className="font-display text-2xl text-emerald">You&apos;re booked!</h2>
          <p className="text-muted-foreground">Reference: <span className="font-mono">{result.reference}</span></p>
          <div className="glass-card p-6 text-left">
            <p><strong>Teacher:</strong> {result.teacherName}</p>
            <p className="mt-2"><strong>When:</strong> {new Date(result.slotStart).toLocaleString()}</p>
            <p className="mt-2"><strong>Zoom:</strong> <a href={result.zoomLink} className="text-gold hover:underline focus-ring">{result.zoomLink}</a></p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={downloadIcs}>Download calendar invite</Button>
            <Button variant="outline" asChild>
              <a href={result.zoomLink} target="_blank" rel="noopener noreferrer">Open Zoom link</a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">A confirmation email has been sent with the same details.</p>
        </div>
      )}
    </div>
  );
}

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const form = useForm({
    defaultValues: { name: "", email: "", message: "" },
  });

  async function onSubmit(data: { name: string; email: string; message: string }) {
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSent(true);
  }

  if (sent) return <p className="text-emerald">Thank you. We&apos;ll respond within 24 hours.</p>;

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...form.register("name", { required: true })} className="mt-2" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...form.register("email", { required: true })} className="mt-2" />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" {...form.register("message", { required: true })} className="mt-2" />
      </div>
      <Button type="submit">Send message</Button>
    </form>
  );
}

export function ResourceCaptureForm({ resource }: { resource: string }) {
  const [done, setDone] = useState(false);
  const form = useForm({ defaultValues: { email: "" } });

  async function onSubmit(data: { email: string }) {
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email, source: resource }),
    });
    setDone(true);
  }

  if (done) return <p className="text-sm text-emerald">Check your email for the download link.</p>;

  return (
    <form className="mt-4 flex gap-2" onSubmit={form.handleSubmit(onSubmit)}>
      <Input type="email" placeholder="your@email.com" {...form.register("email", { required: true })} />
      <Button type="submit">Get guide</Button>
    </form>
  );
}

export function TeachersFilter({ languages, specializations }: { languages: string[]; specializations: string[] }) {
  return (
    <form className="mb-8 flex flex-wrap gap-4" method="get">
      <select name="gender" className="h-11 rounded-lg border border-input bg-background px-3 focus-ring" defaultValue="any">
        <option value="any">Any gender</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
      </select>
      <select name="language" className="h-11 rounded-lg border border-input bg-background px-3 focus-ring" defaultValue="">
        <option value="">Any language</option>
        {languages.map((l) => <option key={l} value={l}>{l}</option>)}
      </select>
      <select name="specialization" className="h-11 rounded-lg border border-input bg-background px-3 focus-ring" defaultValue="">
        <option value="">Any specialization</option>
        {specializations.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <Button type="submit">Filter</Button>
    </form>
  );
}

export function CookieConsent() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="fixed bottom-16 left-4 right-4 z-50 rounded-xl border border-border bg-background p-4 shadow-lg md:bottom-4 md:left-auto md:right-4 md:max-w-md">
      <p className="text-sm text-muted-foreground">
        We use essential cookies and analytics (with consent) to improve your experience. See our{" "}
        <a href="/cookies" className="text-gold hover:underline">Cookie Policy</a>.
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={() => setVisible(false)}>Accept</Button>
        <Button size="sm" variant="outline" onClick={() => setVisible(false)}>Essential only</Button>
      </div>
    </div>
  );
}
