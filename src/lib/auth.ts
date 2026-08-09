import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma";
import {
  type AuthRole,
  type AuthUser,
  getAuthSecret,
  verifySessionToken,
} from "@/lib/auth-session";

export type { AuthRole, AuthUser };
export { verifySessionToken, getSessionFromRequest } from "@/lib/auth-session";

const SESSION_COOKIE_NAME = "academy_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const BCRYPT_ROUNDS = 12;

function mapRole(role: UserRole): AuthRole {
  if (role === UserRole.ADMIN) return "admin";
  if (role === UserRole.TEACHER) return "teacher";
  return "parent";
}

function getSecretKey() {
  return new TextEncoder().encode(getAuthSecret());
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function createSessionToken(user: AuthUser) {
  return new SignJWT({
    email: user.email,
    role: user.role,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export function toAuthUser(user: {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: mapRole(user.role),
  };
}

async function ensureDefaultUsers() {
  const isProduction = process.env.NODE_ENV === "production";
  const adminEmail =
    process.env.ADMIN_EMAIL?.trim().toLowerCase() ||
    (isProduction ? undefined : "admin@islamicacademy.local");
  const adminPassword =
    process.env.ADMIN_PASSWORD || (isProduction ? undefined : "academy2026");
  const portalEmail =
    process.env.PORTAL_EMAIL?.trim().toLowerCase() ||
    (isProduction ? undefined : "portal@islamicacademy.local");
  const portalPassword =
    process.env.PORTAL_PASSWORD || (isProduction ? undefined : "academy2026");
  const teacherEmail =
    process.env.TEACHER_EMAIL?.trim().toLowerCase() ||
    (isProduction ? undefined : "teacher@islamicacademy.local");
  const teacherPassword =
    process.env.TEACHER_PASSWORD || (isProduction ? undefined : "academy2026");

  if (isProduction && (!adminEmail || !adminPassword)) {
    throw new Error("Missing admin bootstrap credentials in production. Set ADMIN_EMAIL and ADMIN_PASSWORD.");
  }

  const bootstrapUsers = [
    adminEmail && adminPassword
      ? { email: adminEmail, password: adminPassword, name: "Admin User", role: UserRole.ADMIN }
      : null,
    portalEmail && portalPassword
      ? { email: portalEmail, password: portalPassword, name: "Family Portal User", role: UserRole.PARENT }
      : null,
    teacherEmail && teacherPassword
      ? { email: teacherEmail, password: teacherPassword, name: "Teacher User", role: UserRole.TEACHER }
      : null,
  ].filter(Boolean) as Array<{
    email: string;
    password: string;
    name: string;
    role: UserRole;
  }>;

  if (bootstrapUsers.length === 0) {
    return;
  }

  const existingUsers = await prisma.user.findMany({
    where: { email: { in: bootstrapUsers.map((user) => user.email) } },
    select: { email: true },
  });
  const existingEmails = new Set(existingUsers.map((user) => user.email));

  for (const user of bootstrapUsers) {
    if (existingEmails.has(user.email)) {
      continue;
    }

    await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        passwordHash: await hashPassword(user.password),
        role: user.role,
        emailVerified: new Date(),
      },
    });
  }
}

export async function authenticateUser(email: string, password: string) {
  await ensureDefaultUsers();

  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) return null;

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;

  return toAuthUser(user);
}

export async function createParentUser(input: { name: string; email: string; password: string }) {
  await ensureDefaultUsers();
  const normalizedEmail = input.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    throw new Error("EMAIL_EXISTS");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        email: normalizedEmail,
        name: input.name.trim(),
        passwordHash,
        role: UserRole.PARENT,
        emailVerified: new Date(),
      },
    });

    await tx.enrollment.updateMany({
      where: { email: normalizedEmail, userId: null },
      data: { userId: createdUser.id },
    });

    await tx.booking.updateMany({
      where: { contactEmail: normalizedEmail, userId: null },
      data: { userId: createdUser.id },
    });

    return createdUser;
  });

  return toAuthUser(user);
}

export async function createTeacherUser(input: { name: string; email: string; password: string }) {
  await ensureDefaultUsers();
  const normalizedEmail = input.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    throw new Error("EMAIL_EXISTS");
  }

  if (input.password.trim().length < 8) {
    throw new Error("PASSWORD_TOO_SHORT");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        email: normalizedEmail,
        name: input.name.trim(),
        passwordHash,
        role: UserRole.TEACHER,
        emailVerified: new Date(),
      },
    });

    const slug = input.name.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    await tx.teacher.create({
      data: {
        name: input.name.trim(),
        slug: `${slug}-${createdUser.id.slice(0, 6)}`,
        gender: "female",
        languages: "English",
        specializations: "Quran",
        email: normalizedEmail,
        timezone: "UTC",
        userId: createdUser.id,
      },
    });

    return createdUser;
  });

  return toAuthUser(user);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(sessionCookie);
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function authRedirectPath(role: AuthRole) {
  if (role === "admin") return "/admin";
  if (role === "teacher") return "/teacher";
  return "/portal";
}

export async function hashResetToken(token: string) {
  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token)
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function createPasswordResetToken(userId: string) {
  const bytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);
  const token = Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  const tokenHash = await hashResetToken(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

  await prisma.passwordResetToken.deleteMany({
    where: { userId, usedAt: null },
  });

  await prisma.passwordResetToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return token;
}

export async function resetPasswordWithToken(token: string, password: string) {
  const tokenHash = await hashResetToken(token);
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    throw new Error("INVALID_TOKEN");
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    });

    await tx.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    });
  });

  return toAuthUser(resetToken.user);
}
