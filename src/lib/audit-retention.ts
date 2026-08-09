export const AUDIT_RETENTION_DAYS = 365;

export async function pruneBookingAuditRetention(prisma: {
    bookingAuditEvent: {
        deleteMany(args: { where: { createdAt: { lt: Date } } }): Promise<unknown>;
    };
}, retentionDays = AUDIT_RETENTION_DAYS) {
    const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

    await prisma.bookingAuditEvent.deleteMany({
        where: {
            createdAt: {
                lt: cutoff,
            },
        },
    });
}
