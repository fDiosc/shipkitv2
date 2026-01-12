import { db } from "@/db";
import { demoAnalyticsEvents, demos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            demoId,
            publicId,
            viewerId,
            sessionId,
            eventType,
            screenId,
            hotspotId,
            stepIndex,
            referrer,
            userAgent,
        } = body;

        // Validate required fields
        if (!demoId || !viewerId || !sessionId || !eventType) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Verify demo exists (optional, can skip for performance)
        // const demo = await db.query.demos.findFirst({
        //     where: eq(demos.id, demoId),
        // });
        // if (!demo) {
        //     return NextResponse.json({ error: "Demo not found" }, { status: 404 });
        // }

        // Insert event
        await db.insert(demoAnalyticsEvents).values({
            demoId,
            viewerId,
            sessionId,
            eventType,
            screenId: screenId || null,
            hotspotId: hotspotId || null,
            stepIndex: stepIndex ?? null,
            referrer: referrer || null,
            userAgent: userAgent || null,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Analytics error:", error);
        // Don't fail silently - log but return success to not break the demo
        return NextResponse.json({ success: true });
    }
}

// Support for sendBeacon which sends as Content-Type: text/plain
export async function OPTIONS() {
    return new NextResponse(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
