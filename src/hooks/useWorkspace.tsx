"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";

interface Workspace {
    id: string;
    name: string;
    slug: string;
    plan: string | null;
    logoUrl: string | null;
    currentUserRole?: string;
}

interface WorkspaceContextType {
    workspace: Workspace | null;
    workspaces: Workspace[];
    isLoading: boolean;
    setWorkspace: (workspace: Workspace) => void;
    refreshWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({
    children,
    initialWorkspace,
    initialWorkspaces = [],
}: {
    children: ReactNode;
    initialWorkspace?: Workspace | null;
    initialWorkspaces?: Workspace[];
}) {
    const [workspace, setWorkspace] = useState<Workspace | null>(initialWorkspace || null);
    const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
    const [isLoading, setIsLoading] = useState(!initialWorkspace);
    const params = useParams();
    const router = useRouter();

    const refreshWorkspaces = async () => {
        try {
            const res = await fetch("/api/workspaces");
            if (res.ok) {
                const data = await res.json();
                setWorkspaces(data.workspaces || []);
            }
        } catch (error) {
            console.error("Failed to fetch workspaces:", error);
        }
    };

    // If workspace changes based on URL params
    useEffect(() => {
        const slug = params?.workspaceSlug as string;
        if (slug && workspaces.length > 0) {
            const found = workspaces.find(w => w.slug === slug);
            if (found && found.id !== workspace?.id) {
                setWorkspace(found);
            }
        }
    }, [params?.workspaceSlug, workspaces]);

    return (
        <WorkspaceContext.Provider value={{
            workspace,
            workspaces,
            isLoading,
            setWorkspace,
            refreshWorkspaces,
        }}>
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext);
    if (context === undefined) {
        throw new Error("useWorkspace must be used within a WorkspaceProvider");
    }
    return context;
}

export function useCurrentWorkspace() {
    const { workspace } = useWorkspace();
    return workspace;
}
