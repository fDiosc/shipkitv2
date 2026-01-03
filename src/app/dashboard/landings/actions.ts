"use server";

import { db } from "@/db";
import { landings } from "@/db/schema";
import { checkLandingLimit } from "@/app/actions/usage";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createLanding(formData: FormData) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Check Landing Limit
    const { allowed } = await checkLandingLimit();
    if (!allowed) {
        return { success: false, error: "Landing limit reached. Upgrade to Pro for unlimited landings! 🚀" };
    }

    const name = formData.get("name") as string;
    const subdomain = formData.get("subdomain") as string;
    const templateId = formData.get("templateId") as string;

    const designJson = {};

    try {
        const [newLanding] = await db.insert(landings).values({
            userId,
            name,
            subdomain,
            templateId,
            designJson,
            status: "draft",
        }).returning();

        revalidatePath("/dashboard/landings");
        revalidatePath("/dashboard");

        return { success: true, id: newLanding.id };
    } catch (error: any) {
        if (error.message.includes("unique constraint")) {
            return { success: false, error: "Subdomain already taken" };
        }
        console.error("Error creating landing:", error);
        return { success: false, error: "Failed to create landing" };
    }
}

export async function deleteLanding(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    try {
        await db.delete(landings).where(eq(landings.id, id));
        revalidatePath("/dashboard/landings");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete landing" };
    }
}

export async function saveLanding(id: string, designJson: any) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    try {
        await db.update(landings)
            .set({
                designJson,
                updatedAt: new Date()
            })
            .where(eq(landings.id, id));

        revalidatePath(`/editor/${id}`);
        revalidatePath("/dashboard/landings");

        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to save design" };
    }
}

export async function publishLanding(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    try {
        await db.update(landings)
            .set({
                status: "published",
                publishedAt: new Date(),
                updatedAt: new Date()
            })
            .where(eq(landings.id, id));

        revalidatePath(`/editor/${id}`);
        revalidatePath("/dashboard/landings");
        revalidatePath(`/public/${id}`); // Potentially dynamic

        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to publish" };
    }
}
export async function saveIntegrations(id: string, integrations: any) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    try {
        await db.update(landings)
            .set({
                integrations,
                updatedAt: new Date()
            })
            .where(eq(landings.id, id));

        revalidatePath(`/editor/${id}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to save integrations" };
    }
}
