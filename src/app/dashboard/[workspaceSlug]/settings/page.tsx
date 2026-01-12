import { db } from "@/db";
import { workspaces, workspaceMembers } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { Settings, Building2, Users, Palette, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SettingsPageProps {
    params: Promise<{ workspaceSlug: string }>;
}

async function getWorkspace(workspaceSlug: string, userId: string) {
    const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.slug, workspaceSlug),
    });

    if (!workspace) return null;

    const membership = await db.query.workspaceMembers.findFirst({
        where: and(
            eq(workspaceMembers.workspaceId, workspace.id),
            eq(workspaceMembers.userId, userId)
        ),
    });

    if (!membership) return null;

    return { ...workspace, role: membership.role };
}

export default async function WorkspaceSettingsPage({ params }: SettingsPageProps) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const { workspaceSlug } = await params;
    const workspace = await getWorkspace(workspaceSlug, userId);

    if (!workspace) notFound();

    const isOwner = workspace.role === "owner";

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Settings</h1>
                <p className="text-neutral-500">Manage your workspace settings and preferences.</p>
            </div>

            {/* Workspace Details */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-neutral-600" />
                        <CardTitle>Workspace Details</CardTitle>
                    </div>
                    <CardDescription>
                        Basic information about your workspace.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Workspace Name</Label>
                            <Input
                                id="name"
                                defaultValue={workspace.name}
                                disabled={!isOwner}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug">URL Slug</Label>
                            <Input
                                id="slug"
                                defaultValue={workspace.slug}
                                disabled
                                className="bg-neutral-50"
                            />
                        </div>
                    </div>
                    {isOwner && (
                        <Button>Save Changes</Button>
                    )}
                </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-neutral-600" />
                        <CardTitle>Team Members</CardTitle>
                    </div>
                    <CardDescription>
                        Manage who has access to this workspace.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-neutral-500">
                        <Users className="h-8 w-8 mx-auto mb-2 text-neutral-300" />
                        <p>Team management coming soon</p>
                    </div>
                </CardContent>
            </Card>

            {/* Branding */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-neutral-600" />
                        <CardTitle>Branding</CardTitle>
                    </div>
                    <CardDescription>
                        Customize your workspace appearance.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-neutral-500">
                        <Palette className="h-8 w-8 mx-auto mb-2 text-neutral-300" />
                        <p>Branding settings coming soon</p>
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            {isOwner && (
                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="text-red-600">Danger Zone</CardTitle>
                        <CardDescription>
                            Irreversible actions for your workspace.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="destructive">
                            Delete Workspace
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
