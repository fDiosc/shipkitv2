import { db } from "@/db";
import { demos, workspaces, workspaceMembers } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, desc } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Eye, Edit } from "lucide-react";
import { DemoActions } from "@/components/productstory/DemoActions";

interface DemosPageProps {
    params: Promise<{ workspaceSlug: string }>;
}

async function getWorkspaceWithDemos(slug: string, userId: string) {
    const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.slug, slug),
    });

    if (!workspace) return null;

    const membership = await db.query.workspaceMembers.findFirst({
        where: and(
            eq(workspaceMembers.workspaceId, workspace.id),
            eq(workspaceMembers.userId, userId)
        ),
    });

    if (!membership) return null;

    const demosList = await db.query.demos.findMany({
        where: eq(demos.workspaceId, workspace.id),
        orderBy: [desc(demos.createdAt)],
    });

    return { workspace, demos: demosList };
}

export default async function DemosPage({ params }: DemosPageProps) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const { workspaceSlug } = await params;
    const data = await getWorkspaceWithDemos(workspaceSlug, userId);

    if (!data) notFound();

    const { workspace, demos: demosList } = data;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex items-end justify-between border-b border-neutral-100 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Demos</h1>
                    <p className="text-neutral-500 mt-1 max-w-md">
                        Build and manage your interactive product stories.
                    </p>
                </div>
                <Button asChild className="gap-2 shadow-sm font-semibold">
                    <Link href={`/dashboard/${workspaceSlug}/demos/new`}>
                        <Plus className="h-4 w-4" />
                        New Demo
                    </Link>
                </Button>
            </div>

            {/* Demos Grid */}
            {demosList.length === 0 ? (
                <EmptyState workspaceSlug={workspaceSlug} />
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {demosList.map((demo) => (
                        <DemoCard
                            key={demo.id}
                            demo={demo}
                            workspaceSlug={workspaceSlug}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function EmptyState({ workspaceSlug }: { workspaceSlug: string }) {
    return (
        <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-6">
                    <Play className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    No demos yet
                </h3>
                <p className="text-neutral-500 text-center max-w-md mb-6">
                    Create your first interactive demo to showcase your product.
                    Upload screenshots and add hotspots to create clickable product tours.
                </p>
                <Button asChild className="gap-2">
                    <Link href={`/dashboard/${workspaceSlug}/demos/new`}>
                        <Plus className="h-4 w-4" />
                        Create Your First Demo
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}

function DemoCard({ demo, workspaceSlug }: { demo: any; workspaceSlug: string }) {
    const isPublished = demo.status === "published";
    const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://shipkit.app'}/productstory/d/${demo.publicId}`;

    return (
        <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
            {/* Thumbnail */}
            <div className="aspect-video bg-neutral-100 relative overflow-hidden">
                {demo.thumbnailUrl ? (
                    <img
                        src={demo.thumbnailUrl}
                        alt={demo.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Play className="h-12 w-12 text-neutral-300" />
                    </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button
                        asChild
                        size="sm"
                        variant="secondary"
                        className="gap-1.5"
                    >
                        <Link href={`/dashboard/${workspaceSlug}/demos/${demo.id}`}>
                            <Edit className="h-3.5 w-3.5" />
                            Edit
                        </Link>
                    </Button>
                    {isPublished && (
                        <Button
                            asChild
                            size="sm"
                            className="gap-1.5"
                        >
                            <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-3.5 w-3.5" />
                                View
                            </a>
                        </Button>
                    )}
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                    <Badge
                        variant={isPublished ? "default" : "secondary"}
                        className={isPublished ? "bg-green-500" : ""}
                    >
                        {isPublished ? "Published" : "Draft"}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                        <CardTitle className="text-base truncate">{demo.name}</CardTitle>
                        {demo.description && (
                            <CardDescription className="mt-1 line-clamp-2">
                                {demo.description}
                            </CardDescription>
                        )}
                    </div>
                    <DemoActions
                        demoId={demo.id}
                        publicId={demo.publicId}
                        workspaceSlug={workspaceSlug}
                        isPublished={isPublished}
                    />
                </div>
            </CardHeader>
        </Card>
    );
}
