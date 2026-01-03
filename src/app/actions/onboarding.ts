"use server";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateOnboardingStatus(wizardKey: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    try {
        const user = await db.query.profiles.findFirst({
            where: eq(profiles.id, userId),
        });

        const currentStatus = (user?.onboardingStatus as Record<string, boolean>) || {};
        const newStatus = {
            ...currentStatus,
            [wizardKey]: true,
        };

        await db.update(profiles)
            .set({ onboardingStatus: newStatus })
            .where(eq(profiles.id, userId));

        revalidatePath("/dashboard");
        revalidatePath("/editor");

        return { success: true };
    } catch (error) {
        console.error("Error updating onboarding status:", error);
        return { success: false };
    }
}
