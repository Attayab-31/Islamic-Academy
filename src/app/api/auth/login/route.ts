import { NextResponse } from "next/server";
import { authenticateUser, createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const user = authenticateUser(body.email, body.password, body.role);

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const response = NextResponse.json({ ok: true, role: user.role });
        setSessionCookie(response, createSessionToken(user));
        return response;
    } catch {
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}
