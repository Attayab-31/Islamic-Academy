"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function PaymentEnrollmentForm() {
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        country: "",
        courseSlug: "quran-reading-qaida",
        planName: "Direct Transfer Enrollment",
        amount: "199",
        currency: "USD",
        paymentReference: "",
        transferBank: "",
        transferAccountName: "",
        transferAccountNumber: "",
    });

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        const response = await fetch("/api/enrollments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                amount: Number(form.amount),
                paymentMethod: "bank_transfer",
                paymentStatus: "pending_review",
            }),
        });

        if (!response.ok) {
            setError("We could not submit your enrollment right now. Please contact support directly.");
            return;
        }

        setSubmitted(true);
    }

    if (submitted) {
        return (
            <div className="rounded-xl border border-emerald/40 bg-emerald/10 p-6 text-sm text-emerald">
                <h3 className="font-display text-xl text-foreground">Enrollment received</h3>
                <p className="mt-2">Thank you. We have received your transfer details and will confirm your booking within one business day.</p>
            </div>
        );
    }

    return (
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <Label htmlFor="fullName">Full name</Label>
                    <Input id="fullName" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="mt-2" />
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2" />
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <Label htmlFor="phone">Phone / WhatsApp</Label>
                    <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-2" />
                </div>
                <div>
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="mt-2" />
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <Label htmlFor="courseSlug">Course</Label>
                    <Input id="courseSlug" value={form.courseSlug} onChange={(e) => setForm({ ...form, courseSlug: e.target.value })} className="mt-2" />
                </div>
                <div>
                    <Label htmlFor="planName">Plan</Label>
                    <Input id="planName" value={form.planName} onChange={(e) => setForm({ ...form, planName: e.target.value })} className="mt-2" />
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="mt-2" />
                </div>
                <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Input id="currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="mt-2" />
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <Label htmlFor="transferBank">Bank</Label>
                    <Input id="transferBank" value={form.transferBank} onChange={(e) => setForm({ ...form, transferBank: e.target.value })} className="mt-2" />
                </div>
                <div>
                    <Label htmlFor="paymentReference">Reference</Label>
                    <Input id="paymentReference" value={form.paymentReference} onChange={(e) => setForm({ ...form, paymentReference: e.target.value })} className="mt-2" />
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <Label htmlFor="transferAccountName">Account holder</Label>
                    <Input id="transferAccountName" value={form.transferAccountName} onChange={(e) => setForm({ ...form, transferAccountName: e.target.value })} className="mt-2" />
                </div>
                <div>
                    <Label htmlFor="transferAccountNumber">Account number</Label>
                    <Input id="transferAccountNumber" value={form.transferAccountNumber} onChange={(e) => setForm({ ...form, transferAccountNumber: e.target.value })} className="mt-2" />
                </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit">Submit transfer details</Button>
        </form>
    );
}
