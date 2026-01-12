import { db } from "@/db";
import { workspaces, workspaceMembers } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

interface WorkspaceLayoutProps {
    children: React.ReactNode;
    params: Promise<{ workspaceSlug: string }>;
}

async function getWorkspaceBySlug(slug: string, userId: string) {
    const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.slug, slug),
    });

    if (!workspace) return null;

    // Check membership
    const membership = await db.query.workspaceMembers.findFirst({
        where: and(
            eq(workspaceMembers.workspaceId, workspace.id),
            eq(workspaceMembers.userId, userId)
        ),
    });

    if (!membership) return null;

    return { ...workspace, role: membership.role };
}

export default async function WorkspaceLayout({
    children,
    params,
}: WorkspaceLayoutProps) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const { workspaceSlug } = await params;
    const workspace = await getWorkspaceBySlug(workspaceSlug, userId);

    if (!workspace) {
        notFound();
    }

    return <>{children}</>;
}
