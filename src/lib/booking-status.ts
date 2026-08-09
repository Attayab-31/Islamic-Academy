export const BOOKING_STATUSES = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
} as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[keyof typeof BOOKING_STATUSES];

export function isValidBookingStatus(value: string): value is BookingStatus {
    return Object.values(BOOKING_STATUSES).includes(value as BookingStatus);
}

export function validateBookingStatus(value: string) {
    if (!isValidBookingStatus(value)) {
        throw new Error("Invalid booking status.");
    }

    return value as BookingStatus;
}

export function isCancellableStatus(value: string) {
    return value === BOOKING_STATUSES.PENDING || value === BOOKING_STATUSES.CONFIRMED;
}
