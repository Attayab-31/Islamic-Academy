"use server";

import { revalidatePath } from "next/cache";
import { createTeacherUser, getCurrentUser } from "@/lib/auth";

export type TeacherLoginActionState = {
  ok: boolean;
  error?: string;
  message?: string;
};

export const initialTeacherLoginActionState: TeacherLoginActionState = {
  ok: false,
};

export async function createTeacherLoginAction(
  _prevState: TeacherLoginActionState,
  formData: FormData
): Promise<TeacherLoginActionState> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return { ok: false, error: "Unauthorized. Please sign in as an admin." };
    }

    const name = formData.get("name")?.toString()?.trim();
    const email = formData.get("email")?.toString()?.trim().toLowerCase();
    const password = formData.get("password")?.toString();

    if (!name || !email || !password || password.trim().length < 8) {
      return {
        ok: false,
        error: "Teacher name, email, and a password of at least 8 characters are required.",
      };
    }

    await createTeacherUser({ name, email, password });
    revalidatePath("/admin");

    return {
      ok: true,
      message: `Teacher login created for ${email}.`,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_EXISTS") {
      return { ok: false, error: "An account with this email already exists." };
    }

    console.error("createTeacherLogin failed:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to create teacher login.",
    };
  }
}
