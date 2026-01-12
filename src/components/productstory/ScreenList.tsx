"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { GripVertical, Trash2 } from "lucide-react";

interface Screen {
    id: string;
    order: number;
    imageUrl: string;
    hotspots: any[];
}

interface ScreenListProps {
    screens: Screen[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onReorder: (newOrder: string[]) => void;
    onDelete?: (id: string) => void;
}

export function ScreenList({ screens, selectedId, onSelect, onReorder, onDelete }: ScreenListProps) {
    const sortedScreens = useMemo(() => {
        return [...screens].sort((a, b) => a.order - b.order);
    }, [screens]);

    if (screens.length === 0) {
        return (
            <div className="text-center py-8 text-neutral-400 text-sm">
                No screens uploaded
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {sortedScreens.map((screen, index) => (
                <div
                    key={screen.id}
                    className={cn(
                        "w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-left group relative",
                        selectedId === screen.id
                            ? "bg-blue-50 ring-2 ring-blue-500"
                            : "hover:bg-neutral-50"
                    )}
                >
                    {/* Drag Handle */}
                    <div className="opacity-0 group-hover:opacity-100 cursor-grab">
                        <GripVertical className="h-4 w-4 text-neutral-300" />
                    </div>

                    {/* Clickable content */}
                    <button
                        onClick={() => onSelect(screen.id)}
                        className="flex-1 flex items-center gap-2"
                    >
                        {/* Thumbnail */}
                        <div className="w-16 h-10 rounded bg-neutral-100 overflow-hidden flex-shrink-0">
                            <img
                                src={screen.imageUrl}
                                alt={`Screen ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm font-medium text-neutral-700 truncate">
                                Screen {index + 1}
                            </p>
                            <p className="text-xs text-neutral-400">
                                {screen.hotspots.length} hotspot{screen.hotspots.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </button>

                    {/* Delete button */}
                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(screen.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-500 transition-all"
                            title="Delete screen"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

