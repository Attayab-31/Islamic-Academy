import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  await prisma.lead.create({
    data: { email: body.email, source: body.source ?? "resource" },
  });
  return NextResponse.json({ ok: true });
}
