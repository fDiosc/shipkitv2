import { db } from "@/db";
import { workspaces, workspaceMembers } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const memberships = await db.query.workspaceMembers.findMany({
            where: eq(workspaceMembers.userId, userId),
            with: {
                workspace: true,
            },
        });

        const workspaceList = memberships.map(m => ({
            ...m.workspace,
            role: m.role,
        }));

        return NextResponse.json({ workspaces: workspaceList });
    } catch (error) {
        console.error("Error fetching workspaces:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name } = body;

        if (!name || typeof name !== "string") {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        // Generate a unique slug
        let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 30);
        let attempts = 0;

        while (attempts < 10) {
            const existing = await db.query.workspaces.findFirst({
                where: eq(workspaces.slug, slug),
            });

            if (!existing) break;

            const suffix = Math.random().toString(36).substring(2, 6);
            slug = `${slug.substring(0, 25)}-${suffix}`;
            attempts++;
        }

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

        return NextResponse.json({ workspace }, { status: 201 });
    } catch (error) {
        console.error("Error creating workspace:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
