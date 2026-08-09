export type EnrollmentAccessStatus = "pending" | "active" | "expired" | "rejected";

export type EnrollmentAccessSnapshot = {
    paymentStatus: string;
    accessStatus: EnrollmentAccessStatus;
    activatedAt: Date | null;
    expiresAt: Date | null;
};

export function activateEnrollmentAccess(
    enrollment: Partial<EnrollmentAccessSnapshot> & { paymentStatus?: string },
    now: Date = new Date(),
): EnrollmentAccessSnapshot {
    const paymentStatus = enrollment.paymentStatus === "confirmed" ? "confirmed" : "confirmed";
    const activatedAt = now;
    const expiresAt = new Date(now);
    expiresAt.setUTCMonth(expiresAt.getUTCMonth() + 1);

    return {
        paymentStatus,
        accessStatus: "active",
        activatedAt,
        expiresAt,
    };
}

export function getEnrollmentAccessState(
    enrollment: Partial<EnrollmentAccessSnapshot> & { paymentStatus?: string },
    now: Date = new Date(),
): {
    isActive: boolean;
    status: EnrollmentAccessStatus;
    daysRemaining: number;
    activatedAt: Date | null;
    expiresAt: Date | null;
} {
    const paymentStatus = enrollment.paymentStatus ?? "pending_review";
    const expiresAt = enrollment.expiresAt ? new Date(enrollment.expiresAt) : null;
    const activatedAt = enrollment.activatedAt ? new Date(enrollment.activatedAt) : null;

    if (paymentStatus === "rejected") {
        return { isActive: false, status: "rejected", daysRemaining: 0, activatedAt, expiresAt };
    }

    if (paymentStatus !== "confirmed") {
        return { isActive: false, status: "pending", daysRemaining: 0, activatedAt, expiresAt };
    }

    if (!expiresAt) {
        return { isActive: true, status: "active", daysRemaining: 30, activatedAt, expiresAt };
    }

    const diffMs = expiresAt.getTime() - now.getTime();
    const diffDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    if (diffMs <= 0) {
        return { isActive: false, status: "expired", daysRemaining: 0, activatedAt, expiresAt };
    }

    return { isActive: true, status: "active", daysRemaining: diffDays, activatedAt, expiresAt };
}
