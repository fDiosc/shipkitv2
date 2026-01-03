"use server";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { calComUsername?: string }) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    try {
        await db.update(profiles)
            .set({
                calComUsername: data.calComUsername,
                updatedAt: new Date(),
            })
            .where(eq(profiles.id, userId));

        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { success: false, error: "Failed to update profile" };
    }
}

export async function getProfile() {
    const { userId } = await auth();
    if (!userId) return null;

    return await db.query.profiles.findFirst({
        where: eq(profiles.id, userId),
    });
}
