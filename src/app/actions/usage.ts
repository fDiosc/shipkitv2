"use server";

import { db } from "@/db";
import { profiles, landings } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, sql, and, count } from "drizzle-orm";

export async function checkAIGenerationLimit() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.query.profiles.findFirst({
        where: eq(profiles.id, userId),
    });

    if (!user) throw new Error("User not found");

    if (user.subscriptionTier === "pro") {
        return { allowed: true, remaining: "unlimited" };
    }

    // Monthly reset logic
    const now = new Date();
    const lastReset = new Date(user.aiGenerationsResetAt);
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    if (lastReset < oneMonthAgo) {
        await db.update(profiles)
            .set({
                aiGenerationsUsed: 0,
                aiGenerationsResetAt: now,
            })
            .where(eq(profiles.id, userId));

        return { allowed: true, remaining: 10 };
    }

    const remaining = Math.max(0, 10 - user.aiGenerationsUsed);
    return {
        allowed: remaining > 0,
        remaining,
        resetDate: user.aiGenerationsResetAt
    };
}

export async function incrementAIGenerationProgress() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await db.update(profiles)
        .set({
            aiGenerationsUsed: sql`${profiles.aiGenerationsUsed} + 1`,
            updatedAt: new Date(),
        })
        .where(eq(profiles.id, userId));
}

export async function checkLandingLimit() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.query.profiles.findFirst({
        where: eq(profiles.id, userId),
    });

    if (!user) throw new Error("User not found");

    if (user.subscriptionTier === "pro") {
        return { allowed: true };
    }

    const [{ count: landingCount }] = await db.select({ count: count() })
        .from(landings)
        .where(eq(landings.userId, userId));

    return { allowed: landingCount < 2 };
}
