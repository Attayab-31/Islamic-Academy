"use client";

import { useActionState } from "react";
import {
  createTeacherLoginAction,
  initialTeacherLoginActionState,
} from "@/app/admin/actions";

export function TeacherLoginForm() {
  const [state, formAction, pending] = useActionState(
    createTeacherLoginAction,
    initialTeacherLoginActionState
  );

  return (
    <form action={formAction} className="grid gap-3 md:grid-cols-4">
      <label className="space-y-1 text-xs font-medium text-muted-foreground">
        <span>Teacher full name</span>
        <input
          name="name"
          placeholder="Dr Mazhar Javed"
          className="w-full rounded border border-border bg-background px-2 py-2 text-sm"
          required
        />
      </label>
      <label className="space-y-1 text-xs font-medium text-muted-foreground">
        <span>Login email</span>
        <input
          name="email"
          type="email"
          placeholder="teacher@example.com"
          className="w-full rounded border border-border bg-background px-2 py-2 text-sm"
          required
        />
      </label>
      <label className="space-y-1 text-xs font-medium text-muted-foreground">
        <span>Password</span>
        <input
          name="password"
          type="password"
          placeholder="Minimum 8 characters"
          minLength={8}
          className="w-full rounded border border-border bg-background px-2 py-2 text-sm"
          required
        />
      </label>
      <div className="flex flex-col justify-end gap-2">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded bg-gold px-3 py-2 text-sm font-medium text-night disabled:opacity-60"
        >
          {pending ? "Creating..." : "Create login"}
        </button>
        {state.error ? (
          <p className="text-xs text-destructive">{state.error}</p>
        ) : null}
        {state.ok && state.message ? (
          <p className="text-xs text-emerald-600">{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}
