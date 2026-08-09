export type EnrollmentAccessStatus = "inactive" | "active" | "expired";

export type EnrollmentAccessState = {
    status: EnrollmentAccessStatus;
    isActive: boolean;
    isExpired: boolean;
    accessStartAt?: Date | null;
    accessEndAt?: Date | null;
};

export function buildConfirmedAccessWindow(referenceDate = new Date()) {
    const startAt = new Date(referenceDate);
    startAt.setHours(0, 0, 0, 0);

    const endAt = new Date(startAt);
    endAt.setMonth(endAt.getMonth() + 1);

    return {
        accessStatus: "active" as const,
        activatedAt: startAt,
        expiresAt: endAt,
    };
}

export function getEnrollmentAccessState(input: {
    paymentStatus?: string | null;
    accessStatus?: string | null;
    accessStartAt?: Date | null;
    accessEndAt?: Date | null;
}): EnrollmentAccessState {
    const now = new Date();
    const paymentStatus = input.paymentStatus ?? "pending_review";
    const accessStatus = input.accessStatus ?? "inactive";
    const accessStartAt = input.accessStartAt ?? null;
    const accessEndAt = input.accessEndAt ?? null;

    if (paymentStatus !== "confirmed") {
        return {
            status: "inactive",
            isActive: false,
            isExpired: false,
            accessStartAt,
            accessEndAt,
        };
    }

    if (accessStatus === "active" && accessStartAt && accessEndAt) {
        const isExpired = now > accessEndAt;
        return {
            status: isExpired ? "expired" : "active",
            isActive: !isExpired,
            isExpired,
            accessStartAt,
            accessEndAt,
        };
    }

    return {
        status: "inactive",
        isActive: false,
        isExpired: false,
        accessStartAt,
        accessEndAt,
    };
}
