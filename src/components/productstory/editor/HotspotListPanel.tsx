"use client";

import { GripVertical, Trash2, Plus, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Hotspot {
    id: string;
    type: string | null;
    label: string | null;
    tooltipText: string | null;
    orderInScreen: number | null;
}

interface HotspotListPanelProps {
    hotspots: Hotspot[];
    selectedHotspotId: string | null;
    onSelect: (id: string) => void;
    onReorder: (orderedIds: string[]) => void;
    onDelete: (id: string) => void;
    onAddNew: () => void;
    isAddingMode?: boolean;
}

export function HotspotListPanel({
    hotspots,
    selectedHotspotId,
    onSelect,
    onReorder,
    onDelete,
    onAddNew,
    isAddingMode = false,
}: HotspotListPanelProps) {
    // Sort by orderInScreen
    const sortedHotspots = [...hotspots].sort(
        (a, b) => (a.orderInScreen || 0) - (b.orderInScreen || 0)
    );

    const handleDragStart = (e: React.DragEvent, index: number) => {
        e.dataTransfer.setData("text/plain", index.toString());
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
        if (sourceIndex === targetIndex) return;

        const newOrder = [...sortedHotspots];
        const [moved] = newOrder.splice(sourceIndex, 1);
        newOrder.splice(targetIndex, 0, moved);

        onReorder(newOrder.map((h) => h.id));
    };

    return (
        <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-neutral-800 text-sm">
                    Hotspots ({hotspots.length})
                </h3>
                <button
                    onClick={onAddNew}
                    className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        isAddingMode
                            ? "bg-green-500 text-white animate-pulse"
                            : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                    )}
                    title={isAddingMode ? "Click on canvas to place hotspot" : "Add new hotspot"}
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {/* Add mode indicator */}
            {isAddingMode && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                    <p className="text-sm text-green-700 font-medium">Click on the screen to place hotspot</p>
                </div>
            )}

            {sortedHotspots.length === 0 && !isAddingMode ? (
                <div className="text-center py-6 text-neutral-400 text-sm">
                    <MousePointer2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No hotspots yet</p>
                    <p className="text-xs mt-1">Click + then click on the screen</p>
                </div>
            ) : sortedHotspots.length === 0 ? null : (
                <div className="space-y-2">
                    {sortedHotspots.map((hotspot, index) => (
                        <div
                            key={hotspot.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            onClick={() => onSelect(hotspot.id)}
                            className={cn(
                                "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all",
                                selectedHotspotId === hotspot.id
                                    ? "border-indigo-500 bg-indigo-50"
                                    : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                            )}
                        >
                            {/* Drag handle */}
                            <div className="cursor-grab active:cursor-grabbing text-neutral-400 hover:text-neutral-600">
                                <GripVertical className="w-4 h-4" />
                            </div>

                            {/* Order number & Type Icon */}
                            <div className="flex flex-col items-center gap-1 shrink-0">
                                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                                    {index + 1}
                                </div>
                                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">
                                    {hotspot.type === "intro" ? "Intro" : hotspot.type === "closing" ? "End" : "Act"}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-neutral-800 truncate">
                                    {hotspot.label || (hotspot.type === "intro" ? "Welcome Modal" : hotspot.type === "closing" ? "Closing Modal" : `Action Hotspot`)}
                                </div>
                                <div className="text-xs text-neutral-500 truncate">
                                    {hotspot.tooltipText || "No description"}
                                </div>
                            </div>

                            {/* Delete */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(hotspot.id);
                                }}
                                className="p-1 rounded hover:bg-red-100 text-neutral-400 hover:text-red-600 transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {hotspots.length > 0 && (
                <p className="text-xs text-neutral-400 text-center pt-2">
                    Drag to reorder • Order determines playback sequence
                </p>
            )}
        </div>
    );
}
