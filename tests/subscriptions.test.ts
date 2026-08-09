import assert from "node:assert/strict";
import test from "node:test";
import { activateEnrollmentAccess, getEnrollmentAccessState } from "../src/lib/subscriptions";

test("active enrollments stay active until their expiry date", () => {
    const now = new Date("2026-08-08T10:00:00.000Z");
    const futureDate = new Date("2026-09-08T10:00:00.000Z");

    const state = getEnrollmentAccessState({
        paymentStatus: "confirmed",
        accessStatus: "active",
        expiresAt: futureDate,
    } as any, now);

    assert.equal(state.isActive, true);
    assert.equal(state.status, "active");
    assert.equal(state.daysRemaining, 31);
});

test("expired enrollments flip to expired state automatically", () => {
    const now = new Date("2026-09-10T10:00:00.000Z");
    const pastDate = new Date("2026-09-08T10:00:00.000Z");

    const state = getEnrollmentAccessState({
        paymentStatus: "confirmed",
        accessStatus: "active",
        expiresAt: pastDate,
    } as any, now);

    assert.equal(state.isActive, false);
    assert.equal(state.status, "expired");
    assert.equal(state.daysRemaining, 0);
});

test("approval creates a one-month active window", () => {
    const now = new Date("2026-08-08T10:00:00.000Z");
    const approved = activateEnrollmentAccess({ paymentStatus: "pending_review" } as any, now);

    assert.equal(approved.paymentStatus, "confirmed");
    assert.equal(approved.accessStatus, "active");
    assert.ok(approved.activatedAt);
    assert.ok(approved.expiresAt);
    assert.equal(approved.expiresAt?.getTime(), new Date("2026-09-08T10:00:00.000Z").getTime());
});
