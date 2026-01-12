"use server";

import { db } from "@/db";
import { demos, demoScreens, demoHotspots, demoSteps, demoRevisions, workspaces, workspaceMembers } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

// Verify user has access to workspace
async function verifyWorkspaceAccess(workspaceId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const membership = await db.query.workspaceMembers.findFirst({
        where: and(
            eq(workspaceMembers.workspaceId, workspaceId),
            eq(workspaceMembers.userId, userId)
        ),
    });

    if (!membership) throw new Error("Not a member of this workspace");

    return { userId, role: membership.role };
}

/**
 * Get all demos for a workspace
 */
export async function getDemosForWorkspace(workspaceId: string) {
    await verifyWorkspaceAccess(workspaceId);

    const demosList = await db.query.demos.findMany({
        where: eq(demos.workspaceId, workspaceId),
        orderBy: [desc(demos.createdAt)],
        with: {
            screens: {
                orderBy: [demoScreens.order],
                limit: 1, // Just get first screen for thumbnail
            },
        },
    });

    return demosList;
}

/**
 * Get a single demo with all its data
 */
export async function getDemo(demoId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const demo = await db.query.demos.findFirst({
        where: eq(demos.id, demoId),
        with: {
            screens: {
                orderBy: [demoScreens.order],
                with: {
                    hotspots: true,
                },
            },
            steps: {
                orderBy: [demoSteps.order],
            },
            workspace: true,
        },
    });

    if (!demo) return null;

    // Verify access
    await verifyWorkspaceAccess(demo.workspaceId);

    return demo;
}

/**
 * Create a new demo
 */
export async function createDemo(workspaceId: string, name: string, description?: string) {
    const { userId } = await verifyWorkspaceAccess(workspaceId);

    const publicId = nanoid(21);

    const [demo] = await db.insert(demos).values({
        workspaceId,
        createdById: userId,
        name,
        description,
        publicId,
    }).returning();

    // Get workspace slug for redirect
    const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.id, workspaceId),
    });

    revalidatePath(`/dashboard/${workspace?.slug}/demos`);

    return { success: true, demo };
}

/**
 * Update demo settings
 */
export async function updateDemo(demoId: string, data: {
    name?: string;
    description?: string;
    showBranding?: boolean;
    password?: string;
    allowedDomains?: string;
}) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const demo = await db.query.demos.findFirst({
        where: eq(demos.id, demoId),
    });

    if (!demo) throw new Error("Demo not found");

    await verifyWorkspaceAccess(demo.workspaceId);

    await db.update(demos)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(eq(demos.id, demoId));

    revalidatePath(`/dashboard`);

    return { success: true };
}

/**
 * Delete a demo
 */
export async function deleteDemo(demoId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const demo = await db.query.demos.findFirst({
        where: eq(demos.id, demoId),
        with: { workspace: true },
    });

    if (!demo) throw new Error("Demo not found");

    await verifyWorkspaceAccess(demo.workspaceId);

    await db.delete(demos).where(eq(demos.id, demoId));

    revalidatePath(`/dashboard/${demo.workspace.slug}/demos`);

    return { success: true };
}

/**
 * Publish a demo with revision snapshot
 */
export async function publishDemo(demoId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const demo = await db.query.demos.findFirst({
        where: eq(demos.id, demoId),
        with: {
            screens: {
                orderBy: [demoScreens.order],
                with: {
                    hotspots: true,
                },
            },
            steps: {
                orderBy: [demoSteps.order],
            },
            workspace: true,
        },
    });

    if (!demo) throw new Error("Demo not found");

    await verifyWorkspaceAccess(demo.workspaceId);

    // Validate demo has at least one screen
    if (demo.screens.length === 0) {
        return { success: false, error: "Demo must have at least one screen" };
    }

    // Create snapshot content
    const snapshotContent = {
        screens: demo.screens.map(s => ({
            id: s.id,
            order: s.order,
            imageUrl: s.imageUrl,
            width: s.width,
            height: s.height,
            hotspots: s.hotspots.map(h => ({
                id: h.id,
                type: h.type,
                targetScreenId: h.targetScreenId,
                x: h.x,
                y: h.y,
                w: h.w,
                h: h.h,
                label: h.label,
                tooltipText: h.tooltipText,
                arrowPosition: h.arrowPosition,
                offsetX: h.offsetX,
                offsetY: h.offsetY,
                orderInScreen: h.orderInScreen,
            })),
        })),
        steps: demo.steps.map(s => ({
            id: s.id,
            order: s.order,
            screenId: s.screenId,
            hotspotId: s.hotspotId,
            title: s.title,
            body: s.body,
            placement: s.placement,
        })),
        settings: {
            showBranding: demo.showBranding,
            name: demo.name,
            description: demo.description,
        },
    };

    // Get revision count efficiently
    const revisionCount = await db.query.demoRevisions.findMany({
        where: eq(demoRevisions.demoId, demoId),
        columns: { id: true },
    });
    const nextRevisionNumber = revisionCount.length + 1;

    // Create revision
    const [revision] = await db.insert(demoRevisions).values({
        demoId,
        revisionNumber: nextRevisionNumber,
        content: snapshotContent,
        publishedBy: userId,
    }).returning();

    // Update demo with current revision
    await db.update(demos)
        .set({
            status: "published",
            publishedAt: new Date(),
            updatedAt: new Date(),
            currentRevisionId: revision.id,
        })
        .where(eq(demos.id, demoId));

    // Don't revalidatePath here - it causes slow refresh. 
    // Let client handle state update for republish

    return {
        success: true,
        publicUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://shipkit.app'}/productstory/d/${demo.publicId}`,
        revisionNumber: nextRevisionNumber,
    };
}

/**
 * Unpublish a demo
 */
export async function unpublishDemo(demoId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const demo = await db.query.demos.findFirst({
        where: eq(demos.id, demoId),
    });

    if (!demo) throw new Error("Demo not found");

    await verifyWorkspaceAccess(demo.workspaceId);

    await db.update(demos)
        .set({
            status: "draft",
            updatedAt: new Date(),
        })
        .where(eq(demos.id, demoId));

    revalidatePath(`/dashboard`);

    return { success: true };
}

// ═══════════════════════════════════════════════════════════
// SCREENS
// ═══════════════════════════════════════════════════════════

/**
 * Add a screen to a demo
 */
export async function addScreen(demoId: string, imageUrl: string, width?: number, height?: number) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const demo = await db.query.demos.findFirst({
        where: eq(demos.id, demoId),
        with: { screens: true },
    });

    if (!demo) throw new Error("Demo not found");

    await verifyWorkspaceAccess(demo.workspaceId);

    // Get next order
    const nextOrder = demo.screens.length;

    const [screen] = await db.insert(demoScreens).values({
        demoId,
        order: nextOrder,
        imageUrl,
        width,
        height,
    }).returning();

    // Update thumbnail if first screen
    if (nextOrder === 0) {
        await db.update(demos)
            .set({ thumbnailUrl: imageUrl, updatedAt: new Date() })
            .where(eq(demos.id, demoId));
    }

    revalidatePath(`/dashboard`);

    return { success: true, screen };
}

/**
 * Delete a screen
 */
export async function deleteScreen(screenId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const screen = await db.query.demoScreens.findFirst({
        where: eq(demoScreens.id, screenId),
        with: { demo: true },
    });

    if (!screen) throw new Error("Screen not found");

    await verifyWorkspaceAccess(screen.demo.workspaceId);

    await db.delete(demoScreens).where(eq(demoScreens.id, screenId));

    // Reorder remaining screens
    const remainingScreens = await db.query.demoScreens.findMany({
        where: eq(demoScreens.demoId, screen.demoId),
        orderBy: [demoScreens.order],
    });

    for (let i = 0; i < remainingScreens.length; i++) {
        await db.update(demoScreens)
            .set({ order: i })
            .where(eq(demoScreens.id, remainingScreens[i].id));
    }

    revalidatePath(`/dashboard`);

    return { success: true };
}

/**
 * Reorder screens
 */
export async function reorderScreens(demoId: string, screenIds: string[]) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const demo = await db.query.demos.findFirst({
        where: eq(demos.id, demoId),
    });

    if (!demo) throw new Error("Demo not found");

    await verifyWorkspaceAccess(demo.workspaceId);

    for (let i = 0; i < screenIds.length; i++) {
        await db.update(demoScreens)
            .set({ order: i })
            .where(eq(demoScreens.id, screenIds[i]));
    }

    revalidatePath(`/dashboard`);

    return { success: true };
}

// ═══════════════════════════════════════════════════════════
// HOTSPOTS
// ═══════════════════════════════════════════════════════════

/**
 * Create a hotspot
 */
export async function createHotspot(screenId: string, data: {
    type: string;
    targetScreenId?: string;
    x: number;
    y: number;
    w: number;
    h: number;
    label?: string;
    tooltipText?: string;
}) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const screen = await db.query.demoScreens.findFirst({
        where: eq(demoScreens.id, screenId),
        with: { demo: true },
    });

    if (!screen) throw new Error("Screen not found");

    await verifyWorkspaceAccess(screen.demo.workspaceId);

    const [hotspot] = await db.insert(demoHotspots).values({
        screenId,
        ...data,
    }).returning();

    revalidatePath(`/dashboard`);

    return { success: true, hotspot };
}

/**
 * Update a hotspot (with full Guide Edit Panel fields)
 */
export async function updateHotspot(hotspotId: string, data: {
    type?: string;
    targetScreenId?: string | null;
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    label?: string;
    tooltipText?: string;
    htmlContent?: string;

    // Style
    backgroundColor?: string;
    textColor?: string;
    hotspotColor?: string;
    fontFamily?: string;
    fontSize?: string;
    borderRadius?: number;

    // Highlight
    backdropEnabled?: boolean;
    backdropOpacity?: number;
    backdropColor?: string;
    spotlightEnabled?: boolean;
    spotlightColor?: string;
    spotlightPadding?: number;

    // CTAs
    primaryCtaEnabled?: boolean;
    primaryCtaText?: string;
    primaryCtaAction?: string;
    primaryCtaUrl?: string;
    secondaryCtaEnabled?: boolean;
    secondaryCtaText?: string;
    secondaryCtaUrl?: string;

    // Position
    arrowPosition?: string;
    offsetX?: number;
    offsetY?: number;

    // Config
    showStepNumber?: boolean;
    showPreviousButton?: boolean;
    hideOnMouseOut?: boolean;
    autoAdvanceEnabled?: boolean;
    autoAdvanceDelay?: number;
}) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const hotspot = await db.query.demoHotspots.findFirst({
        where: eq(demoHotspots.id, hotspotId),
        with: {
            screen: {
                with: { demo: true }
            }
        },
    });

    if (!hotspot) throw new Error("Hotspot not found");

    await verifyWorkspaceAccess(hotspot.screen.demo.workspaceId);

    // Filter out undefined values and check if there's anything to update
    const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    // If no valid data to update, return early
    if (Object.keys(cleanData).length === 0) {
        return { success: true };
    }

    await db.update(demoHotspots)
        .set(cleanData)
        .where(eq(demoHotspots.id, hotspotId));

    // Remove revalidatePath here - it causes massive slowdowns on frequent updates.
    // The editor uses optimistic updates and local state anyway.

    return { success: true };
}

/**
 * Delete a hotspot
 */
export async function deleteHotspot(hotspotId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const hotspot = await db.query.demoHotspots.findFirst({
        where: eq(demoHotspots.id, hotspotId),
        with: {
            screen: {
                with: { demo: true }
            }
        },
    });

    // Already deleted or doesn't exist - return success (idempotent)
    if (!hotspot) {
        return { success: true };
    }

    await verifyWorkspaceAccess(hotspot.screen.demo.workspaceId);

    await db.delete(demoHotspots).where(eq(demoHotspots.id, hotspotId));

    revalidatePath(`/dashboard`);

    return { success: true };
}

/**
 * Reorder hotspots within a screen
 */
export async function reorderHotspots(screenId: string, orderedHotspotIds: string[]) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const screen = await db.query.demoScreens.findFirst({
        where: eq(demoScreens.id, screenId),
        with: { demo: true },
    });

    if (!screen) throw new Error("Screen not found");

    await verifyWorkspaceAccess(screen.demo.workspaceId);

    // Update orderInScreen for each hotspot
    await Promise.all(
        orderedHotspotIds.map((id, index) =>
            db.update(demoHotspots)
                .set({ orderInScreen: index })
                .where(eq(demoHotspots.id, id))
        )
    );

    // Remove revalidatePath here as well for performance

    return { success: true };
}

