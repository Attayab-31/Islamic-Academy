"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

function LoginFormInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email")?.toString() ?? "";
        const password = formData.get("password")?.toString() ?? "";
        const role = formData.get("role")?.toString() ?? "portal";

        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, role }),
        });

        setLoading(false);

        if (!response.ok) {
            setError("Invalid credentials. Please try again.");
            return;
        }

        const redirectTo = searchParams.get("redirect") ?? (role === "admin" ? "/admin" : "/portal");
        router.push(redirectTo);
        router.refresh();
    }

    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            <div>
                <Label htmlFor="role">Access type</Label>
                <select id="role" name="role" defaultValue="portal" className="mt-2 flex h-11 w-full rounded-lg border border-input bg-background px-3 focus-ring">
                    <option value="portal">Family portal</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required className="mt-2" />
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required className="mt-2" />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
            </Button>
        </form>
    );
}

export function LoginForm() {
    return (
        <Suspense fallback={<p className="text-sm text-muted-foreground">Preparing sign-in form...</p>}>
            <LoginFormInner />
        </Suspense>
    );
}
