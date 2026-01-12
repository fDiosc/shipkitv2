import { db } from "@/db";
import { landings, workspaces, workspaceMembers } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, desc } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ExternalLink, Edit3, Users, Globe, Plus } from "lucide-react";
import Link from "next/link";
import { getLandingUrl, normalizeDomain } from "@/lib/urls";

interface LandingsPageProps {
    params: Promise<{ workspaceSlug: string }>;
}

async function getWorkspaceLandings(workspaceSlug: string, userId: string) {
    // Get workspace
    const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.slug, workspaceSlug),
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

    // Get landings for this workspace
    const workspaceLandings = await db.query.landings.findMany({
        where: eq(landings.workspaceId, workspace.id),
        orderBy: [desc(landings.createdAt)],
    });

    return { workspace, landings: workspaceLandings };
}

export default async function WorkspaceLandingsPage({ params }: LandingsPageProps) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const { workspaceSlug } = await params;
    const data = await getWorkspaceLandings(workspaceSlug, userId);

    if (!data) notFound();

    const { workspace, landings: workspaceLandings } = data;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Landings</h1>
                    <p className="text-neutral-500">Manage your landing pages in {workspace.name}.</p>
                </div>
                <Link href={`/dashboard/${workspaceSlug}/landings/new`}>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Landing
                    </Button>
                </Link>
            </div>

            <div className="rounded-xl border border-neutral-100 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-neutral-50/50 hover:bg-neutral-50/50">
                            <TableHead className="w-[300px]">Project</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {workspaceLandings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-neutral-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <Globe className="h-8 w-8 text-neutral-300" />
                                        <p>No landing pages yet</p>
                                        <Link href={`/dashboard/${workspaceSlug}/landings/new`}>
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <Plus className="h-4 w-4" />
                                                Create your first landing
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            workspaceLandings.map((landing) => (
                                <TableRow key={landing.id} className="group cursor-pointer hover:bg-neutral-50/50">
                                    <TableCell className="font-medium">
                                        <Link href={`/editor/${landing.id}`} className="hover:text-blue-600">
                                            {landing.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={landing.status === "published" ? "default" : "secondary"}
                                            className={landing.status === "published" ? "bg-green-100 text-green-700 hover:bg-green-100 shadow-none" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-100 shadow-none"}
                                        >
                                            {landing.status === "published" ? "Live" : "Draft"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-neutral-500">
                                        <span className="flex items-center gap-1">
                                            {landing.subdomain}.{normalizeDomain(process.env.NEXT_PUBLIC_ROOT_DOMAIN || "shipkit.app")}
                                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-neutral-500">
                                        {new Date(landing.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/editor/${landing.id}`} className="flex items-center gap-2">
                                                        <Edit3 className="h-4 w-4" /> Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/${workspaceSlug}/leads?landingId=${landing.id}`} className="flex items-center gap-2">
                                                        <Users className="h-4 w-4" /> View Leads
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <a
                                                        href={getLandingUrl(landing.subdomain)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 cursor-pointer"
                                                    >
                                                        <ExternalLink className="h-4 w-4" /> View Live
                                                    </a>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
