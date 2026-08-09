"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

type ResetPasswordFormProps = {
    token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const payload = {
            token,
            password: formData.get("password")?.toString() ?? "",
            confirmPassword: formData.get("confirmPassword")?.toString() ?? "",
        };

        const response = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));
        setLoading(false);

        if (!response.ok) {
            setError(data.error ?? "Unable to reset password.");
            return;
        }

        router.push(data.redirectTo ?? "/portal");
        router.refresh();
    }

    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            <div>
                <Label htmlFor="password">New password</Label>
                <Input id="password" name="password" type="password" autoComplete="new-password" minLength={12} required className="mt-2" />
                <p className="mt-1 text-xs text-muted-foreground">At least 12 characters.</p>
            </div>
            <div>
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={12} required className="mt-2" />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update password"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
                <Link href="/login" className="text-gold hover:underline">
                    Back to sign in
                </Link>
            </p>
        </form>
    );
}
