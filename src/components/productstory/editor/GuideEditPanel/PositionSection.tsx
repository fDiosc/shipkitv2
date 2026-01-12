"use client";

import { Guide } from "./index";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PositionSectionProps {
    guide: Guide;
    onUpdate: (updates: Partial<Guide>) => void;
}

const positions = [
    { id: "top-left", label: "Top Left" },
    { id: "top-center", label: "Top Center" },
    { id: "top-right", label: "Top Right" },
    { id: "middle-left", label: "Middle Left" },
    { id: "middle-center", label: "Center", disabled: true },
    { id: "middle-right", label: "Middle Right" },
    { id: "bottom-left", label: "Bottom Left" },
    { id: "bottom-center", label: "Bottom Center" },
    { id: "bottom-right", label: "Bottom Right" },
];

export function PositionSection({ guide, onUpdate }: PositionSectionProps) {
    const currentPosition = guide.arrowPosition || "top-left";

    return (
        <div className="space-y-6">
            {/* Arrow Position Grid */}
            <div className="space-y-3">
                <Label className="text-sm font-medium text-neutral-900">Arrow Position</Label>
                <p className="text-xs text-neutral-500">Where the tooltip arrow points from</p>

                <div className="grid grid-cols-3 gap-1 p-2 bg-neutral-100 rounded-lg">
                    {positions.map((pos) => (
                        <button
                            key={pos.id}
                            disabled={pos.disabled}
                            onClick={() => onUpdate({ arrowPosition: pos.id })}
                            className={cn(
                                "aspect-square rounded-md flex items-center justify-center transition-all",
                                pos.disabled && "opacity-30 cursor-not-allowed",
                                currentPosition === pos.id
                                    ? "bg-violet-600 shadow-md"
                                    : "bg-white hover:bg-neutral-50 border border-neutral-200"
                            )}
                            title={pos.label}
                        >
                            <div
                                className={cn(
                                    "w-3 h-3 rounded-full transition-colors",
                                    currentPosition === pos.id
                                        ? "bg-white"
                                        : "bg-neutral-300"
                                )}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Offset */}
            <div className="space-y-3">
                <Label className="text-sm font-medium text-neutral-900">Offset</Label>
                <p className="text-xs text-neutral-500">Fine-tune tooltip position (%)</p>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-neutral-600">X Offset</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                value={guide.offsetX ?? 0}
                                onChange={(e) => onUpdate({ offsetX: parseFloat(e.target.value) || 0 })}
                                className="h-9"
                                min={-100}
                                max={100}
                            />
                            <span className="text-xs text-neutral-500">%</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-neutral-600">Y Offset</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                value={guide.offsetY ?? 0}
                                onChange={(e) => onUpdate({ offsetY: parseFloat(e.target.value) || 0 })}
                                className="h-9"
                                min={-100}
                                max={100}
                            />
                            <span className="text-xs text-neutral-500">%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hotspot Dimensions */}
            <div className="space-y-3">
                <Label className="text-sm font-medium text-neutral-900">Hotspot Size</Label>
                <p className="text-xs text-neutral-500">Clickable area dimensions (%)</p>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-neutral-600">Width</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                value={Math.round((guide.w || 0.1) * 100 * 10) / 10}
                                onChange={(e) => onUpdate({ w: (parseFloat(e.target.value) || 10) / 100 })}
                                className="h-9"
                                step="0.1"
                                min={1}
                                max={100}
                            />
                            <span className="text-xs text-neutral-500">%</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-neutral-600">Height</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                value={Math.round((guide.h || 0.1) * 100 * 10) / 10}
                                onChange={(e) => onUpdate({ h: (parseFloat(e.target.value) || 10) / 100 })}
                                className="h-9"
                                step="0.1"
                                min={1}
                                max={100}
                            />
                            <span className="text-xs text-neutral-500">%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Position Info */}
            <div className="pt-4 border-t">
                <Label className="text-xs font-medium text-neutral-600 mb-3 block">Current Position</Label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-neutral-100 rounded">
                        <span className="text-neutral-500">X:</span>{" "}
                        <span className="font-mono font-medium">{Math.round((guide.x || 0) * 100)}%</span>
                    </div>
                    <div className="p-2 bg-neutral-100 rounded">
                        <span className="text-neutral-500">Y:</span>{" "}
                        <span className="font-mono font-medium">{Math.round((guide.y || 0) * 100)}%</span>
                    </div>
                    <div className="p-2 bg-neutral-100 rounded">
                        <span className="text-neutral-500">W:</span>{" "}
                        <span className="font-mono font-medium">{Math.round((guide.w || 0) * 100)}%</span>
                    </div>
                    <div className="p-2 bg-neutral-100 rounded">
                        <span className="text-neutral-500">H:</span>{" "}
                        <span className="font-mono font-medium">{Math.round((guide.h || 0) * 100)}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
