import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { ContextualHelp } from "@/components/dashboard/ContextualHelp";
import { WorkspaceProvider } from "@/hooks/useWorkspace";
import { db } from "@/db";
import { workspaceMembers } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getOrCreateDefaultWorkspace } from "@/app/actions/workspaces";

async function getWorkspacesForUser(userId: string) {
    const memberships = await db.query.workspaceMembers.findMany({
        where: eq(workspaceMembers.userId, userId),
        with: {
            workspace: true,
        },
    });

    return memberships.map(m => ({
        ...m.workspace,
        role: m.role,
        currentUserRole: m.role,
    }));
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();
    if (!userId) {
        redirect("/sign-in");
    }

    // Get or create default workspace
    let workspacesList = await getWorkspacesForUser(userId);

    // If user has no workspaces, create one
    if (workspacesList.length === 0) {
        await getOrCreateDefaultWorkspace();
        workspacesList = await getWorkspacesForUser(userId);
    }

    // Get the first workspace as default
    const defaultWorkspace = workspacesList[0] || null;

    return (
        <WorkspaceProvider
            initialWorkspace={defaultWorkspace}
            initialWorkspaces={workspacesList}
        >
            <div className="flex h-screen bg-white overflow-hidden">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Topbar */}
                    <Topbar />

                    {/* Dynamic Content */}
                    <main className="flex-1 overflow-y-auto bg-neutral-50/50 p-6">
                        <div className="mx-auto max-w-7xl">
                            {children}
                        </div>
                    </main>
                </div>
                <ContextualHelp />
            </div>
        </WorkspaceProvider>
    );
}

