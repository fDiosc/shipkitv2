import { db } from "@/db";
import { demos, demoScreens, demoSteps, demoHotspots, workspaces, workspaceMembers } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, asc } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { DemoEditor } from "@/components/productstory/DemoEditor";

interface DemoEditPageProps {
    params: Promise<{
        workspaceSlug: string;
        demoId: string;
    }>;
}

async function getDemoWithAccess(demoId: string, userId: string) {
    const demo = await db.query.demos.findFirst({
        where: eq(demos.id, demoId),
        with: {
            workspace: true,
            screens: true,
            steps: true,
        },
    });

    if (!demo) return null;

    // Verify membership
    const membership = await db.query.workspaceMembers.findFirst({
        where: and(
            eq(workspaceMembers.workspaceId, demo.workspaceId),
            eq(workspaceMembers.userId, userId)
        ),
    });

    if (!membership) return null;

    // Get screens with hotspots separately to avoid query issues
    const screens = await db.query.demoScreens.findMany({
        where: eq(demoScreens.demoId, demoId),
        with: {
            hotspots: true,
        },
        orderBy: [asc(demoScreens.order)],
    });

    // Get steps separately
    const steps = await db.query.demoSteps.findMany({
        where: eq(demoSteps.demoId, demoId),
        orderBy: [asc(demoSteps.order)],
    });

    return { ...demo, screens, steps };
}

export default async function DemoEditPage({ params }: DemoEditPageProps) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const { workspaceSlug, demoId } = await params;
    const demo = await getDemoWithAccess(demoId, userId);

    if (!demo) notFound();

    // Verify workspace slug matches
    if (demo.workspace.slug !== workspaceSlug) {
        redirect(`/dashboard/${demo.workspace.slug}/demos/${demoId}`);
    }

    return (
        <DemoEditor
            demo={{
                id: demo.id,
                name: demo.name,
                description: demo.description,
                status: demo.status,
                publicId: demo.publicId,
                showBranding: demo.showBranding,
            }}
            screens={demo.screens.map(s => ({
                id: s.id,
                order: s.order,
                imageUrl: s.imageUrl,
                width: s.width,
                height: s.height,
                // Pass all hotspot fields from database
                hotspots: s.hotspots,
            }))}
            steps={demo.steps.map(s => ({
                id: s.id,
                order: s.order,
                screenId: s.screenId,
                hotspotId: s.hotspotId,
                title: s.title,
                body: s.body,
                placement: s.placement,
            }))}
            workspaceSlug={workspaceSlug}
        />
    );
}
