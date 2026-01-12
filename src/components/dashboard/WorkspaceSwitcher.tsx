"use client";

import { useWorkspace } from "@/hooks/useWorkspace";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, Settings, Building2 } from "lucide-react";
import { useState } from "react";

export function WorkspaceSwitcher() {
    const { workspace, workspaces, setWorkspace } = useWorkspace();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleWorkspaceChange = (ws: typeof workspace) => {
        if (ws) {
            setWorkspace(ws);
            router.push(`/dashboard/${ws.slug}`);
        }
        setOpen(false);
    };

    if (!workspace) {
        return (
            <div className="h-10 w-48 bg-neutral-100 rounded-lg animate-pulse" />
        );
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2 py-1.5 h-9 hover:bg-neutral-50 border border-transparent hover:border-neutral-100 transition-all text-left max-w-[200px]"
                >
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0 shadow-sm">
                            {workspace.logoUrl ? (
                                <img
                                    src={workspace.logoUrl}
                                    alt={workspace.name}
                                    className="w-full h-full object-cover rounded"
                                />
                            ) : (
                                workspace.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold truncate text-neutral-800">
                                {workspace.name}
                            </p>
                        </div>
                    </div>
                    <ChevronDown className="h-3 w-3 text-neutral-400 flex-shrink-0" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="text-xs text-neutral-500 font-normal">
                    Workspaces
                </DropdownMenuLabel>
                {workspaces.map((ws) => (
                    <DropdownMenuItem
                        key={ws.id}
                        onClick={() => handleWorkspaceChange(ws)}
                        className="cursor-pointer"
                    >
                        <div className="flex items-center gap-3 w-full">
                            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                                {ws.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{ws.name}</p>
                            </div>
                            {ws.id === workspace.id && (
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                            )}
                        </div>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => router.push(`/dashboard/${workspace.slug}/settings`)}
                    className="cursor-pointer"
                >
                    <Settings className="h-4 w-4 mr-2" />
                    Workspace Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => router.push("/dashboard/new-workspace")}
                    className="cursor-pointer text-blue-600"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workspace
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
