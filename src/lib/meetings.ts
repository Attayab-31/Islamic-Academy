export type MeetingProvider = "zoom" | "demo";

export type MeetingCreateInput = {
    topic: string;
    startTime: Date;
    durationMinutes: number;
    timezone: string;
    contactEmail?: string;
    teacherZoomUserId?: string | null;
    teacherId?: string;
    teacherName?: string;
};

export type MeetingCreateResult = {
    provider: MeetingProvider;
    meetingId: string;
    joinUrl: string;
    raw?: unknown;
};

function generateDemoLink() {
    return `https://zoom.us/j/${Math.floor(100000000 + Math.random() * 900000000)}`;
}

import { runWithRetryAndIdempotency } from "@/lib/retry";

export async function createMeeting(input: MeetingCreateInput): Promise<MeetingCreateResult> {
    const provider = (process.env.MEETING_PROVIDER ?? "demo").trim().toLowerCase();

    if (provider === "zoom") {
        return runWithRetryAndIdempotency(`meeting:${input.topic}:${input.startTime.toISOString()}:${input.teacherId ?? "unknown"}`, () => createZoomMeeting(input), {
            maxAttempts: 3,
            baseDelayMs: 750,
            maxDelayMs: 3000,
            onRetry: (error, attempt) => {
                console.warn(`[meeting] retry ${attempt}/3 after failure:`, error);
            },
        });
    }

    if (process.env.NODE_ENV === "production") {
        throw new Error("MEETING_PROVIDER must be configured to 'zoom' in production.");
    }

    return {
        provider: "demo",
        meetingId: `demo-${Date.now().toString(36)}`,
        joinUrl: generateDemoLink(),
    };
}

async function createZoomMeeting(input: MeetingCreateInput): Promise<MeetingCreateResult> {
    const accountId = process.env.ZOOM_ACCOUNT_ID;
    const clientId = process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;

    if (!accountId || !clientId || !clientSecret) {
        throw new Error("Zoom OAuth credentials are not configured.");
    }

    const oauthResponse = await fetch(
        `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`,
        {
            method: "POST",
            headers: {
                Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    if (!oauthResponse.ok) {
        const body = await oauthResponse.text();
        throw new Error(`Zoom token exchange failed: ${body}`);
    }

    const tokenPayload = (await oauthResponse.json()) as { access_token?: string };
    const accessToken = tokenPayload.access_token;

    if (!accessToken) {
        throw new Error("Zoom token exchange did not return an access token.");
    }

    const teacherZoomUserId = input.teacherZoomUserId?.trim();

    if (!teacherZoomUserId) {
        console.warn(
            `[zoom-fallback] Teacher ${input.teacherId ?? "unknown"} (${input.teacherName ?? "unknown"}) is missing zoomUserId. Falling back to host account /v2/users/me/meetings.`
        );
    }

    const zoomUserEndpoint = teacherZoomUserId
        ? `https://api.zoom.us/v2/users/${encodeURIComponent(teacherZoomUserId)}/meetings`
        : "https://api.zoom.us/v2/users/me/meetings";

    const meetingResponse = await fetch(zoomUserEndpoint, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            topic: input.topic,
            type: 2,
            start_time: input.startTime.toISOString(),
            duration: Math.max(30, Math.round(input.durationMinutes)),
            timezone: input.timezone,
            settings: {
                join_before_host: false,
                waiting_room: true,
                approval_type: 0,
                contact_email: input.contactEmail ?? "",
            },
        }),
    });

    if (!meetingResponse.ok) {
        const body = await meetingResponse.text();
        throw new Error(`Zoom meeting creation failed: ${body}`);
    }

    const payload = (await meetingResponse.json()) as {
        id?: number;
        join_url?: string;
    };

    if (!payload.id || !payload.join_url) {
        throw new Error("Zoom meeting response did not contain an id or join_url.");
    }

    return {
        provider: "zoom",
        meetingId: String(payload.id),
        joinUrl: payload.join_url,
        raw: payload,
    };
}
