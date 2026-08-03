import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export type AuthRole = "admin" | "portal";

export type AuthUser = {
    email: string;
    role: AuthRole;
    name: string;
};

const SESSION_COOKIE_NAME = "academy_session";
const DEFAULT_SESSION_TTL_MS = 1000 * 60 * 60 * 8;
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@islamicacademy.local";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "academy2026";
const DEFAULT_PORTAL_EMAIL = process.env.PORTAL_EMAIL ?? "portal@islamicacademy.local";
const DEFAULT_PORTAL_PASSWORD = process.env.PORTAL_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;
const AUTH_SECRET = process.env.AUTH_SECRET ?? "local-dev-auth-secret";

function encode(payload: string) {
    return Buffer.from(payload).toString("base64url");
}

function decode(token: string) {
    return Buffer.from(token, "base64url").toString("utf8");
}

function signPayload(payload: string) {
    return `${payload}.${AUTH_SECRET}`;
}

function verifySignature(signedToken: string) {
    const parts = signedToken.split(".");
    if (parts.length < 2) return null;

    const payload = parts.slice(0, -1).join(".");
    const signature = parts[parts.length - 1];

    if (signature !== AUTH_SECRET) return null;
    return payload;
}

export function createSessionToken(user: AuthUser) {
    const payload = {
        sub: user.email,
        role: user.role,
        name: user.name,
        exp: Date.now() + DEFAULT_SESSION_TTL_MS,
    };

    return signPayload(encode(JSON.stringify(payload)));
}

export function verifySessionToken(token: string | undefined): AuthUser | null {
    if (!token) return null;

    const verifiedPayload = verifySignature(token);
    if (!verifiedPayload) return null;

    try {
        const payload = JSON.parse(decode(verifiedPayload));
        if (!payload?.sub || !payload?.role || !payload?.exp) return null;
        if (Date.now() > Number(payload.exp)) return null;

        return {
            email: payload.sub,
            role: payload.role,
            name: payload.name ?? payload.sub,
        } as AuthUser;
    } catch {
        return null;
    }
}

export function authenticateUser(email: string, password: string, role: AuthRole) {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (role === "admin") {
        if (normalizedEmail !== DEFAULT_ADMIN_EMAIL.toLowerCase()) return null;
        if (normalizedPassword !== DEFAULT_ADMIN_PASSWORD) return null;
        return { email: DEFAULT_ADMIN_EMAIL, role: "admin" as const, name: "Administrator" };
    }

    if (normalizedEmail !== DEFAULT_PORTAL_EMAIL.toLowerCase()) return null;
    if (normalizedPassword !== DEFAULT_PORTAL_PASSWORD) return null;

    return { email: DEFAULT_PORTAL_EMAIL, role: "portal" as const, name: "Family Portal" };
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    return verifySessionToken(sessionCookie) ?? null;
}

export function setSessionCookie(response: NextResponse, token: string) {
    response.cookies.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 8,
    });
}

export function clearSessionCookie(response: NextResponse) {
    response.cookies.delete(SESSION_COOKIE_NAME);
}

export function getSessionFromRequest(request: NextRequest) {
    return verifySessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);
}
