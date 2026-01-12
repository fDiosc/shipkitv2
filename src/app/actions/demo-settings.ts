"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { demoChapters, demoThemes, demoLeadForms, workspaceMembers, demos, demoHotspots } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ═══════════════════════════════════════════════════════════
// CHAPTERS
// ═══════════════════════════════════════════════════════════

export async function createChapter(demoId: string, name: string, order: number) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Verify access
    const demo = await db.query.demos.findFirst({
        where: eq(demos.id, demoId),
        with: { workspace: true },
    });
    if (!demo) throw new Error("Demo not found");

    const membership = await db.query.workspaceMembers.findFirst({
        where: and(
            eq(workspaceMembers.workspaceId, demo.workspaceId),
            eq(workspaceMembers.userId, userId)
        ),
    });
    if (!membership) throw new Error("Access denied");

    const [chapter] = await db.insert(demoChapters).values({
        demoId,
        name,
        order,
    }).returning();

    revalidatePath(`/dashboard`);
    return { success: true, chapter };
}

export async function updateChapter(chapterId: string, data: { name?: string; order?: number }) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await db.update(demoChapters)
        .set(data)
        .where(eq(demoChapters.id, chapterId));

    revalidatePath(`/dashboard`);
    return { success: true };
}

export async function deleteChapter(chapterId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await db.delete(demoChapters).where(eq(demoChapters.id, chapterId));

    revalidatePath(`/dashboard`);
    return { success: true };
}

// ═══════════════════════════════════════════════════════════
// THEMES
// ═══════════════════════════════════════════════════════════

export async function createTheme(workspaceId: string, data: {
    name: string;
    backgroundColor: string;
    textColor: string;
    hotspotColor: string;
    fontFamily: string;
    borderRadius: number;
    backdropColor: string;
    backdropOpacity: number;
}) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Verify workspace access
    const membership = await db.query.workspaceMembers.findFirst({
        where: and(
            eq(workspaceMembers.workspaceId, workspaceId),
            eq(workspaceMembers.userId, userId)
        ),
    });
    if (!membership) throw new Error("Access denied");

    const [theme] = await db.insert(demoThemes).values({
        workspaceId,
        ...data,
    }).returning();

    revalidatePath(`/dashboard`);
    return { success: true, theme };
}

export async function deleteTheme(themeId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await db.delete(demoThemes).where(eq(demoThemes.id, themeId));

    revalidatePath(`/dashboard`);
    return { success: true };
}

export async function applyThemeToAllHotspots(demoId: string, themeId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Get theme
    const theme = await db.query.demoThemes.findFirst({
        where: eq(demoThemes.id, themeId),
    });
    if (!theme) throw new Error("Theme not found");

    // Get all hotspots for this demo
    const demo = await db.query.demos.findFirst({
        where: eq(demos.id, demoId),
        with: {
            screens: {
                with: { hotspots: true },
            },
        },
    });
    if (!demo) throw new Error("Demo not found");

    // Update all hotspots with theme values
    const hotspotIds = demo.screens.flatMap(s => s.hotspots.map(h => h.id));

    for (const hotspotId of hotspotIds) {
        await db.update(demoHotspots)
            .set({
                backgroundColor: theme.backgroundColor,
                textColor: theme.textColor,
                hotspotColor: theme.hotspotColor,
                fontFamily: theme.fontFamily,
                borderRadius: theme.borderRadius,
                backdropColor: theme.backdropColor,
                backdropOpacity: theme.backdropOpacity,
            })
            .where(eq(demoHotspots.id, hotspotId));
    }

    revalidatePath(`/dashboard`);
    return { success: true, updatedCount: hotspotIds.length };
}

// ═══════════════════════════════════════════════════════════
// LEAD FORMS
// ═══════════════════════════════════════════════════════════

export async function updateLeadForm(demoId: string, data: {
    enabled?: boolean;
    trigger?: string;
    triggerDelay?: number;
    triggerStepIndex?: number;
    fields?: Array<{
        id: string;
        type: 'email' | 'text' | 'select';
        label: string;
        placeholder?: string;
        required: boolean;
        options?: string[];
    }>;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    backgroundColor?: string;
    buttonColor?: string;
    webhookUrl?: string;
}) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Verify access
    const demo = await db.query.demos.findFirst({
        where: eq(demos.id, demoId),
    });
    if (!demo) throw new Error("Demo not found");

    // Check if lead form exists, create if not
    const existingForm = await db.query.demoLeadForms.findFirst({
        where: eq(demoLeadForms.demoId, demoId),
    });

    if (existingForm) {
        await db.update(demoLeadForms)
            .set(data)
            .where(eq(demoLeadForms.id, existingForm.id));
    } else {
        await db.insert(demoLeadForms).values({
            demoId,
            ...data,
        });
    }

    revalidatePath(`/dashboard`);
    return { success: true };
}

export async function getLeadForm(demoId: string) {
    const form = await db.query.demoLeadForms.findFirst({
        where: eq(demoLeadForms.demoId, demoId),
    });
    return form;
}
