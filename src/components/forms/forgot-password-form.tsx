"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function ForgotPasswordForm() {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email")?.toString() ?? "";

        const response = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await response.json().catch(() => ({}));
        setLoading(false);

        if (!response.ok) {
            setError(data.error ?? "Unable to send reset email.");
            return;
        }

        setMessage(data.message ?? "If an account exists, a reset link has been sent.");
    }

    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" autoComplete="email" required className="mt-2" />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send reset link"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
                <Link href="/login" className="text-gold hover:underline">
                    Back to sign in
                </Link>
            </p>
        </form>
    );
}
