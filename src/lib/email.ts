import { getSiteUrl } from "@/lib/utils";
import { runWithRetryAndIdempotency } from "@/lib/retry";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

type EmailProvider = "resend" | "sendgrid" | "dev-log";

function getEmailProvider(): EmailProvider {
  const configuredProvider = process.env.EMAIL_PROVIDER?.trim().toLowerCase();
  if (configuredProvider === "sendgrid") return "sendgrid";
  if (configuredProvider === "resend") return "resend";

  if (process.env.RESEND_API_KEY) return "resend";
  if (process.env.SENDGRID_API_KEY) return "sendgrid";

  return "dev-log";
}

async function sendWithResend(input: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "noreply@islamicacademy.local";

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      return logDevEmail(input);
    }
    throw new Error("RESEND_API_KEY is required in production to send email.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend delivery failed: ${body}`);
  }

  return { ok: true as const, mode: "resend" as const };
}

async function sendWithSendGrid(input: SendEmailInput) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.EMAIL_FROM ?? "noreply@islamicacademy.local";

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      return logDevEmail(input);
    }
    throw new Error("SENDGRID_API_KEY is required in production to send email.");
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: input.to }] }],
      from: { email: from },
      subject: input.subject,
      content: [
        { type: "text/plain", value: input.text },
        { type: "text/html", value: input.html },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`SendGrid delivery failed: ${body}`);
  }

  return { ok: true as const, mode: "sendgrid" as const };
}

async function logDevEmail(input: SendEmailInput) {
  console.info("[email:dev]", input.subject, "→", input.to);
  console.info(input.text);
  return { ok: true as const, mode: "dev-log" as const };
}

export async function sendEmail(input: SendEmailInput) {
  const provider = getEmailProvider();

  const operation = async () => {
    if (provider === "sendgrid") {
      return sendWithSendGrid(input);
    }

    if (provider === "resend") {
      return sendWithResend(input);
    }

    return logDevEmail(input);
  };

  return runWithRetryAndIdempotency(`email:${input.to}:${input.subject}`, operation, {
    maxAttempts: 3,
    baseDelayMs: 750,
    maxDelayMs: 3000,
    onRetry: (error, attempt) => {
      console.warn(`[email] retry ${attempt}/3 after failure:`, error);
    },
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${getSiteUrl()}/reset-password?token=${encodeURIComponent(token)}`;

  return sendEmail({
    to: email,
    subject: "Reset your Islamic Academy password",
    text: `Reset your password using this link (valid for 1 hour):\n\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
    html: `
      <p>Reset your password using the link below (valid for 1 hour):</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  const portalUrl = `${getSiteUrl()}/portal`;

  return sendEmail({
    to: email,
    subject: "Welcome to Islamic Academy",
    text: `Assalamu alaikum ${name},\n\nYour family portal account is ready.\n\nSign in: ${getSiteUrl()}/login\nPortal: ${portalUrl}`,
    html: `
      <p>Assalamu alaikum ${name},</p>
      <p>Your family portal account is ready.</p>
      <p><a href="${getSiteUrl()}/login">Sign in</a> · <a href="${portalUrl}">Family portal</a></p>
    `,
  });
}

export async function sendBookingConfirmationEmail(input: {
  to: string;
  contactName: string;
  learnerName: string;
  reference: string;
  courseSlug: string;
  teacherName: string;
  start: Date | string;
  end: Date | string;
  zoomLink: string;
}) {
  const start = input.start instanceof Date ? input.start : new Date(input.start);
  const end = input.end instanceof Date ? input.end : new Date(input.end);
  const startLabel = start.toLocaleString();
  const endLabel = end.toLocaleString();

  return sendEmail({
    to: input.to,
    subject: `Islamic Academy trial booking confirmed: ${input.reference}`,
    text: `Assalamu alaikum ${input.contactName},\n\nYour free trial request has been confirmed.\n\nReference: ${input.reference}\nLearner: ${input.learnerName}\nCourse: ${input.courseSlug}\nTeacher: ${input.teacherName}\nStart: ${startLabel}\nEnd: ${endLabel}\nZoom: ${input.zoomLink}\n\nWe will contact you shortly with the next class details.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1b1b1b">
        <p>Assalamu alaikum ${input.contactName},</p>
        <p>Your free trial request has been confirmed.</p>
        <table style="border-collapse: collapse; margin-top: 12px">
          <tbody>
            <tr><td style="padding: 6px 12px 6px 0; font-weight: 700">Reference</td><td style="padding: 6px">${input.reference}</td></tr>
            <tr><td style="padding: 6px 12px 6px 0; font-weight: 700">Learner</td><td style="padding: 6px">${input.learnerName}</td></tr>
            <tr><td style="padding: 6px 12px 6px 0; font-weight: 700">Course</td><td style="padding: 6px">${input.courseSlug}</td></tr>
            <tr><td style="padding: 6px 12px 6px 0; font-weight: 700">Teacher</td><td style="padding: 6px">${input.teacherName}</td></tr>
            <tr><td style="padding: 6px 12px 6px 0; font-weight: 700">Start</td><td style="padding: 6px">${startLabel}</td></tr>
            <tr><td style="padding: 6px 12px 6px 0; font-weight: 700">End</td><td style="padding: 6px">${endLabel}</td></tr>
            <tr><td style="padding: 6px 12px 6px 0; font-weight: 700">Zoom</td><td style="padding: 6px"><a href="${input.zoomLink}">${input.zoomLink}</a></td></tr>
          </tbody>
        </table>
        <p style="margin-top: 12px">We will contact you shortly with the next class details.</p>
      </div>
    `,
  });
}
