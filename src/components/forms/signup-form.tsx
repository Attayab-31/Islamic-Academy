"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function SignupForm() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const payload = {
            name: formData.get("name")?.toString() ?? "",
            email: formData.get("email")?.toString() ?? "",
            password: formData.get("password")?.toString() ?? "",
            confirmPassword: formData.get("confirmPassword")?.toString() ?? "",
        };

        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));
        setLoading(false);

        if (!response.ok) {
            setError(data.error ?? "Unable to create account.");
            return;
        }

        router.push(data.redirectTo ?? "/portal");
        router.refresh();
    }

    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" autoComplete="name" required className="mt-2" />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" autoComplete="email" required className="mt-2" />
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" autoComplete="new-password" minLength={12} required className="mt-2" />
                <p className="mt-1 text-xs text-muted-foreground">At least 12 characters.</p>
            </div>
            <div>
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={12} required className="mt-2" />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-gold hover:underline">
                    Sign in
                </Link>
            </p>
        </form>
    );
}
