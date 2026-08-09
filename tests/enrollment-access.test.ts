import test from "node:test";
import assert from "node:assert/strict";
import { getEnrollmentAccessState } from "../src/lib/enrollment-access";

test("returns active state for confirmed enrollments inside the access window", () => {
    const now = new Date();
    const state = getEnrollmentAccessState({
        paymentStatus: "confirmed",
        accessStatus: "active",
        accessStartAt: new Date(now.getTime() - 1000 * 60 * 60 * 24),
        accessEndAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 10),
    });

    assert.equal(state.status, "active");
    assert.equal(state.isActive, true);
});

test("returns expired state when the access window has passed", () => {
    const now = new Date();
    const state = getEnrollmentAccessState({
        paymentStatus: "confirmed",
        accessStatus: "active",
        accessStartAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 20),
        accessEndAt: new Date(now.getTime() - 1000 * 60 * 60 * 24),
    });

    assert.equal(state.status, "expired");
    assert.equal(state.isActive, false);
});

test("returns inactive state when payment is still pending review", () => {
    const state = getEnrollmentAccessState({
        paymentStatus: "pending_review",
        accessStatus: "inactive",
    });

    assert.equal(state.status, "inactive");
    assert.equal(state.isActive, false);
});
