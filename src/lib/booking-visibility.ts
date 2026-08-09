export type BookingContactVisibilityActor = "parent" | "teacher" | "admin" | "public";

export function canReadBookingContact(actor: BookingContactVisibilityActor) {
    return actor === "parent" || actor === "teacher" || actor === "admin";
}

export function shouldExposePrivateContactForRole(userRole: string | undefined) {
    if (!userRole) return false;
    return ["parent", "teacher", "admin"].includes(userRole);
}
