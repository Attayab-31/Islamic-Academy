import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function updateStatus(formData: FormData) {
    "use server";

    const id = formData.get("id")?.toString();
    const paymentStatus = formData.get("paymentStatus")?.toString();
    const adminNotes = formData.get("adminNotes")?.toString();

    if (!id || !paymentStatus) return;

    await prisma.enrollment.update({
        where: { id },
        data: { paymentStatus, adminNotes: adminNotes ?? null },
    });

    revalidatePath("/admin");
}

export default async function AdminPage() {
    const enrollments = await prisma.enrollment.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="section-padding">
            <div className="mx-auto max-w-6xl">
                <h1 className="font-display text-3xl">Admin operations</h1>
                <p className="mt-3 text-muted-foreground">Review enrollments, payment transfer details, and pending family onboarding.</p>

                <div className="mt-4 flex justify-end">
                    <Link href="/api/auth/logout" className="text-sm text-gold hover:underline">Sign out</Link>
                </div>

                <div className="mt-8 overflow-hidden rounded-xl border border-border">
                    <table className="min-w-full divide-y divide-border text-sm">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Course</th>
                                <th className="px-4 py-3 text-left">Plan</th>
                                <th className="px-4 py-3 text-left">Amount</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Reference</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrollments.map((item) => (
                                <tr key={item.id} className="border-t border-border align-top">
                                    <td className="px-4 py-3">{item.fullName}</td>
                                    <td className="px-4 py-3">{item.courseSlug}</td>
                                    <td className="px-4 py-3">{item.planName}</td>
                                    <td className="px-4 py-3">{formatCurrency(item.amount, item.currency)}</td>
                                    <td className="px-4 py-3">{item.paymentStatus}</td>
                                    <td className="px-4 py-3">{item.paymentReference ?? "—"}</td>
                                    <td className="px-4 py-3">
                                        <form action={updateStatus} className="flex flex-wrap gap-2">
                                            <input type="hidden" name="id" value={item.id} />
                                            <select name="paymentStatus" defaultValue={item.paymentStatus} className="rounded border border-border bg-background px-2 py-1 text-xs">
                                                <option value="pending_review">Pending review</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                            <input type="text" name="adminNotes" defaultValue={item.adminNotes ?? ""} placeholder="Notes" className="rounded border border-border bg-background px-2 py-1 text-xs" />
                                            <button type="submit" className="rounded bg-gold px-2 py-1 text-xs text-night">Save</button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
