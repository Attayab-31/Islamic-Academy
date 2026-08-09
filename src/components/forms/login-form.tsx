"use client";

import Link from "next/link";
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

        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json().catch(() => ({}));
        setLoading(false);

        if (!response.ok) {
            setError(data.error ?? "Invalid credentials. Please try again.");
            return;
        }

        const redirectTo = searchParams.get("redirect") ?? data.redirectTo ?? "/portal";
        router.push(redirectTo);
        router.refresh();
    }

    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" autoComplete="email" required className="mt-2" />
            </div>
            <div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-xs text-gold hover:underline">
                        Forgot password?
                    </Link>
                </div>
                <Input id="password" name="password" type="password" autoComplete="current-password" required className="mt-2" />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
                New parent?{" "}
                <Link href="/signup" className="text-gold hover:underline">
                    Create an account
                </Link>
            </p>
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
