import { db } from "@/db";
import { leads, landings, workspaces, workspaceMembers } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, desc, inArray } from "drizzle-orm";
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
import { Users, Mail, Calendar } from "lucide-react";

interface LeadsPageProps {
    params: Promise<{ workspaceSlug: string }>;
}

async function getWorkspaceLeads(workspaceSlug: string, userId: string) {
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

    // Get all landings for this workspace
    const workspaceLandings = await db.query.landings.findMany({
        where: eq(landings.workspaceId, workspace.id),
    });

    if (workspaceLandings.length === 0) {
        return { workspace, leads: [], landings: [] };
    }

    // Get leads for those landings
    const landingIds = workspaceLandings.map(l => l.id);
    const workspaceLeads = await db.query.leads.findMany({
        where: inArray(leads.landingId, landingIds),
        orderBy: [desc(leads.createdAt)],
        with: {
            landing: true,
        },
    });

    return { workspace, leads: workspaceLeads, landings: workspaceLandings };
}

export default async function WorkspaceLeadsPage({ params }: LeadsPageProps) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const { workspaceSlug } = await params;
    const data = await getWorkspaceLeads(workspaceSlug, userId);

    if (!data) notFound();

    const { workspace, leads: workspaceLeads } = data;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Leads</h1>
                    <p className="text-neutral-500">View and manage leads from {workspace.name}.</p>
                </div>
                <Badge variant="secondary" className="text-sm">
                    {workspaceLeads.length} total
                </Badge>
            </div>

            <div className="rounded-xl border border-neutral-100 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-neutral-50/50 hover:bg-neutral-50/50">
                            <TableHead className="w-[250px]">Email</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {workspaceLeads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-neutral-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <Users className="h-8 w-8 text-neutral-300" />
                                        <p>No leads captured yet</p>
                                        <p className="text-sm text-neutral-400">
                                            Leads will appear here when visitors submit forms on your landings
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            workspaceLeads.map((lead) => (
                                <TableRow key={lead.id} className="hover:bg-neutral-50/50">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-neutral-400" />
                                            {lead.email}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {lead.landing?.name || "Unknown"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-neutral-600">
                                        {lead.name || "-"}
                                    </TableCell>
                                    <TableCell className="text-neutral-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </div>
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
