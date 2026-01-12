"use server";

import { db } from "@/db";
import { workspaces, workspaceMembers, profiles } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Generate a URL-friendly slug from a name
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 30);
}

// Generate a unique slug by appending random chars if needed
async function generateUniqueSlug(baseName: string): Promise<string> {
    let slug = generateSlug(baseName);
    let attempts = 0;

    while (attempts < 10) {
        const existing = await db.query.workspaces.findFirst({
            where: eq(workspaces.slug, slug),
        });

        if (!existing) return slug;

        // Append random suffix
        const suffix = Math.random().toString(36).substring(2, 6);
        slug = `${generateSlug(baseName)}-${suffix}`;
        attempts++;
    }

    // Fallback to timestamp
    return `${generateSlug(baseName)}-${Date.now()}`;
}

/**
 * Ensure profile exists in database (handles race condition with webhook)
 */
async function ensureProfileExists(userId: string): Promise<void> {
    const existingProfile = await db.query.profiles.findFirst({
        where: eq(profiles.id, userId),
    });

    if (existingProfile) return;

    // Profile doesn't exist yet - create it from Clerk data
    const user = await currentUser();
    if (!user) throw new Error("No user found");

    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()
        || user.emailAddresses?.[0]?.emailAddress?.split('@')[0]
        || 'User';

    await db.insert(profiles)
        .values({
            id: userId,
            fullName,
            avatarUrl: user.imageUrl,
        })
        .onConflictDoNothing();
}

/**
 * Get all workspaces for the current user
 */
export async function getUserWorkspaces() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const memberships = await db.query.workspaceMembers.findMany({
        where: eq(workspaceMembers.userId, userId),
        with: {
            workspace: true,
        },
    });

    return memberships.map(m => ({
        ...m.workspace,
        role: m.role,
    }));
}

/**
 * Get a single workspace by slug (with membership check)
 */
export async function getWorkspaceBySlug(slug: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.slug, slug),
        with: {
            members: {
                with: {
                    user: true,
                },
            },
        },
    });

    if (!workspace) return null;

    // Check if user is a member
    const isMember = workspace.members.some(m => m.userId === userId);
    if (!isMember) return null;

    const userMembership = workspace.members.find(m => m.userId === userId);

    return {
        ...workspace,
        currentUserRole: userMembership?.role,
    };
}

/**
 * Create a new workspace
 */
export async function createWorkspace(name: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Ensure profile exists first
    await ensureProfileExists(userId);

    const slug = await generateUniqueSlug(name);

    const [workspace] = await db.insert(workspaces).values({
        name,
        slug,
    }).returning();

    // Add the creator as owner
    await db.insert(workspaceMembers).values({
        workspaceId: workspace.id,
        userId,
        role: "owner",
    });

    revalidatePath("/dashboard");

    return { success: true, workspace };
}

/**
 * Create a personal workspace for a user (called on signup)
 */
export async function createPersonalWorkspace(userId: string, userName?: string) {
    // Ensure profile exists first
    await ensureProfileExists(userId);

    const workspaceName = userName ? `${userName}'s Workspace` : "My Workspace";
    const slug = await generateUniqueSlug(workspaceName);

    const [workspace] = await db.insert(workspaces).values({
        name: workspaceName,
        slug,
    }).returning();

    await db.insert(workspaceMembers).values({
        workspaceId: workspace.id,
        userId,
        role: "owner",
    });

    return workspace;
}

/**
 * Get or create a default workspace for the current user
 * Used during the transition period
 */
export async function getOrCreateDefaultWorkspace() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Check if user has any workspaces
    const existingMembership = await db.query.workspaceMembers.findFirst({
        where: eq(workspaceMembers.userId, userId),
        with: {
            workspace: true,
        },
    });

    if (existingMembership) {
        return existingMembership.workspace;
    }

    // Ensure profile exists before creating workspace
    await ensureProfileExists(userId);

    // Get user profile for name
    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.id, userId),
    });

    // Create a personal workspace
    return createPersonalWorkspace(userId, profile?.fullName || undefined);
}

/**
 * Update workspace settings
 */
export async function updateWorkspace(workspaceId: string, data: { name?: string; logoUrl?: string }) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Check if user is owner or admin
    const membership = await db.query.workspaceMembers.findFirst({
        where: and(
            eq(workspaceMembers.workspaceId, workspaceId),
            eq(workspaceMembers.userId, userId)
        ),
    });

    if (!membership || !["owner", "admin"].includes(membership.role)) {
        throw new Error("Not authorized to update this workspace");
    }

    await db.update(workspaces)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(eq(workspaces.id, workspaceId));

    revalidatePath("/dashboard");

    return { success: true };
}

/**
 * Add a member to workspace
 */
export async function addWorkspaceMember(workspaceId: string, userEmail: string, role: string = "member") {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Check if current user is owner or admin
    const membership = await db.query.workspaceMembers.findFirst({
        where: and(
            eq(workspaceMembers.workspaceId, workspaceId),
            eq(workspaceMembers.userId, userId)
        ),
    });

    if (!membership || !["owner", "admin"].includes(membership.role)) {
        throw new Error("Not authorized to add members");
    }

    // TODO: Look up user by email, invite if not exists
    // For now, this is a placeholder - would need email lookup via Clerk

    return { success: false, error: "Email invite not yet implemented" };
}

/**
 * Remove a member from workspace
 */
export async function removeWorkspaceMember(workspaceId: string, memberUserId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Check if current user is owner
    const membership = await db.query.workspaceMembers.findFirst({
        where: and(
            eq(workspaceMembers.workspaceId, workspaceId),
            eq(workspaceMembers.userId, userId)
        ),
    });

    if (!membership || membership.role !== "owner") {
        throw new Error("Only owners can remove members");
    }

    // Cannot remove yourself if you're the only owner
    if (memberUserId === userId) {
        throw new Error("Cannot remove yourself as the owner");
    }

    await db.delete(workspaceMembers)
        .where(and(
            eq(workspaceMembers.workspaceId, workspaceId),
            eq(workspaceMembers.userId, memberUserId)
        ));

    revalidatePath("/dashboard");

    return { success: true };
}
