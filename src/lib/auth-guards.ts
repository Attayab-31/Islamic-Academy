import { NextResponse } from "next/server";
import { AuthRole, AuthUser, getCurrentUser, getSessionFromRequest } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    return { user: null as null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { user, response: null };
}

export async function requireRole(role: AuthRole) {
  const result = await requireUser();
  if (!result.user) return result;
  if (result.user.role !== role) {
    return { user: null as null, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return result;
}

export async function requireAdmin() {
  return requireRole("admin");
}

export async function requireParent() {
  return requireRole("parent");
}

export async function requireTeacher() {
  return requireRole("teacher");
}

export async function requireTeacherFromRequest(request: NextRequest) {
  const result = await requireUserFromRequest(request);
  if (!result.user) return result;
  if (result.user.role !== "teacher" && result.user.role !== "admin") {
    return { user: null as null, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return result;
}

export async function requireUserFromRequest(request: NextRequest) {
  const user = await getSessionFromRequest(request);
  if (!user) {
    return { user: null as null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { user, response: null };
}

export async function requireAdminFromRequest(request: NextRequest) {
  const result = await requireUserFromRequest(request);
  if (!result.user) return result;
  if (result.user.role !== "admin") {
    return { user: null as null, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return result;
}

export function assertUser(user: AuthUser | null): asserts user is AuthUser {
  if (!user) {
    throw new Error("Unauthorized");
  }
}
