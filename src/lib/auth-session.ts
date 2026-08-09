import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export type AuthRole = "admin" | "parent" | "teacher";

export type AuthUser = {
  id: string;
  email: string;
  role: AuthRole;
  name: string;
};

const SESSION_COOKIE_NAME = "academy_session";

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (process.env.NODE_ENV === "production") {
    if (!secret || secret.length < 32) {
      throw new Error("AUTH_SECRET must be set to at least 32 characters in production.");
    }
    return secret;
  }

  return secret ?? "local-dev-auth-secret-change-me-before-production";
}

function getSecretKey() {
  return new TextEncoder().encode(getAuthSecret());
}

export async function verifySessionToken(token: string | undefined): Promise<AuthUser | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });

    if (!payload.sub || typeof payload.email !== "string" || typeof payload.role !== "string") {
      return null;
    }

    if (payload.role !== "admin" && payload.role !== "parent" && payload.role !== "teacher") {
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      name: typeof payload.name === "string" ? payload.name : payload.email,
    };
  } catch {
    return null;
  }
}

export async function getSessionFromRequest(request: NextRequest) {
  return verifySessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);
}
