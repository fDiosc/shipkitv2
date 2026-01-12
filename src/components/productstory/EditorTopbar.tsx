"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    ArrowLeft,
    Eye,
    Play,
    MousePointer2,
    ListOrdered,
    Settings,
    Globe,
    Link as LinkIcon,
    MoreHorizontal,
    Loader2,
    RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { publishDemo, unpublishDemo } from "@/app/actions/demos";

interface Demo {
    id: string;
    name: string;
    status: string | null;
    publicId: string;
}

interface EditorTopbarProps {
    demo: Demo;
    mode: "hotspots" | "steps" | "preview";
    onModeChange: (mode: "hotspots" | "steps" | "preview") => void;
    workspaceSlug: string;
    hasUnpublishedChanges?: boolean;
}

export function EditorTopbar({ demo, mode, onModeChange, workspaceSlug, hasUnpublishedChanges = false }: EditorTopbarProps) {
    const router = useRouter();
    const [isPublishing, setIsPublishing] = useState(false);
    const isPublished = demo.status === "published";
    const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://shipkit.app'}/productstory/d/${demo.publicId}`;

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            const result = await publishDemo(demo.id);
            if (!result.success) {
                alert(result.error || "Failed to publish");
                return;
            }
            // If republishing (already published), don't need full refresh
            if (isPublished) {
                // Just need to signal success - parent will reset hasChanges
                window.dispatchEvent(new CustomEvent('demo-republished'));
            } else {
                // First time publish - need refresh to update UI state
                router.refresh();
            }
        } catch (error) {
            console.error("Error publishing:", error);
        } finally {
            setIsPublishing(false);
        }
    };

    const handleUnpublish = async () => {
        setIsPublishing(true);
        try {
            await unpublishDemo(demo.id);
            router.refresh();
        } catch (error) {
            console.error("Error unpublishing:", error);
        } finally {
            setIsPublishing(false);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(publicUrl);
    };

    const modes = [
        { id: "hotspots", label: "Hotspots", icon: MousePointer2 },
        { id: "steps", label: "Steps", icon: ListOrdered },
        { id: "preview", label: "Preview", icon: Eye },
    ] as const;

    return (
        <div className="h-14 bg-white border-b flex items-center justify-between px-4">
            {/* Left: Back + Demo Name */}
            <div className="flex items-center gap-3">
                <Link
                    href={`/dashboard/${workspaceSlug}/demos`}
                    className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 text-neutral-500" />
                </Link>

                <div className="flex items-center gap-2">
                    <h1 className="font-semibold text-neutral-900">{demo.name}</h1>
                    <Badge
                        variant={isPublished ? "default" : "secondary"}
                        className={cn(
                            "text-xs",
                            isPublished && !hasUnpublishedChanges && "bg-green-500",
                            isPublished && hasUnpublishedChanges && "bg-orange-500"
                        )}
                    >
                        {isPublished
                            ? (hasUnpublishedChanges ? "Unpublished Changes" : "Published")
                            : "Draft"
                        }
                    </Badge>
                </div>
            </div>

            {/* Center: Mode Tabs */}
            <div className="flex items-center bg-neutral-100 rounded-lg p-1">
                {modes.map((m) => (
                    <button
                        key={m.id}
                        onClick={() => onModeChange(m.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                            mode === m.id
                                ? "bg-white text-neutral-900 shadow-sm"
                                : "text-neutral-500 hover:text-neutral-700"
                        )}
                    >
                        <m.icon className="h-4 w-4" />
                        {m.label}
                    </button>
                ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                {isPublished && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyLink}
                        className="gap-2"
                    >
                        <LinkIcon className="h-4 w-4" />
                        Copy Link
                    </Button>
                )}

                {/* Republish button - shows when published AND has changes */}
                {isPublished && hasUnpublishedChanges && (
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="gap-2 bg-orange-500 hover:bg-orange-600"
                    >
                        {isPublishing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="h-4 w-4" />
                        )}
                        Republish
                    </Button>
                )}

                {/* Publish button - shows when NOT published */}
                {!isPublished && (
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="gap-2"
                    >
                        {isPublishing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Play className="h-4 w-4" />
                        )}
                        Publish
                    </Button>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/${workspaceSlug}/demos/${demo.id}/settings`}>
                                <Settings className="h-4 w-4 mr-2" />
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        {isPublished && (
                            <>
                                <DropdownMenuItem asChild>
                                    <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                                        <Globe className="h-4 w-4 mr-2" />
                                        View Public Page
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleUnpublish}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    Unpublish Demo
                                </DropdownMenuItem>
                            </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/${workspaceSlug}/demos/${demo.id}/analytics`}>
                                Analytics
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

