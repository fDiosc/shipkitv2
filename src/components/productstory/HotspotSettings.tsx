"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { X, Trash2, ArrowRight } from "lucide-react";

interface Hotspot {
    id: string;
    type: string | null;
    targetScreenId: string | null;
    x: number;
    y: number;
    w: number;
    h: number;
    label: string | null;
    tooltipText: string | null;
    primaryCtaText?: string | null;
}

interface Screen {
    id: string;
    order: number;
    imageUrl: string;
}

interface HotspotSettingsProps {
    hotspot: Hotspot;
    screens: Screen[];
    onUpdate: (updates: Partial<Hotspot>) => void;
    onDelete: () => void;
}

export function HotspotSettings({ hotspot, screens, onUpdate, onDelete }: HotspotSettingsProps) {
    const [label, setLabel] = useState(hotspot.label || "");
    const [type, setType] = useState(hotspot.type || "navigate");
    const [targetScreenId, setTargetScreenId] = useState(hotspot.targetScreenId || "");
    const [tooltipText, setTooltipText] = useState(hotspot.tooltipText || "");

    const handleSave = () => {
        onUpdate({
            label: label || null,
            type,
            targetScreenId: type === "navigate" ? targetScreenId || null : null,
            tooltipText: type === "tooltip" ? tooltipText || null : null,
        });
    };

    return (
        <div className="w-80 bg-white border-l flex flex-col">
            {/* Header */}
            <div className="h-14 border-b px-4 flex items-center justify-between">
                <h3 className="font-semibold text-sm">Hotspot Settings</h3>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={onDelete}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Label */}
                <div className="space-y-2">
                    <Label htmlFor="label">Label (optional)</Label>
                    <Input
                        id="label"
                        placeholder="e.g., Click here"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                    />
                    <p className="text-xs text-neutral-500">
                        Shown as a small tag above the hotspot
                    </p>
                </div>

                {/* Type */}
                <div className="space-y-2">
                    <Label>Action Type</Label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="navigate">
                                <div className="flex items-center gap-2">
                                    <ArrowRight className="h-4 w-4" />
                                    Navigate to screen
                                </div>
                            </SelectItem>
                            <SelectItem value="tooltip">
                                <div className="flex items-center gap-2">
                                    💬 Show tooltip
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Navigate Options */}
                {type === "navigate" && (
                    <div className="space-y-2">
                        <Label>Target Screen</Label>
                        <Select value={targetScreenId} onValueChange={setTargetScreenId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a screen..." />
                            </SelectTrigger>
                            <SelectContent>
                                {screens.map((screen, index) => (
                                    <SelectItem key={screen.id} value={screen.id}>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-5 rounded bg-neutral-200 overflow-hidden">
                                                <img
                                                    src={screen.imageUrl}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            Screen {index + 1}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Tooltip Options */}
                {type === "tooltip" && (
                    <div className="space-y-2">
                        <Label htmlFor="tooltipText">Tooltip Text</Label>
                        <Textarea
                            id="tooltipText"
                            placeholder="Enter tooltip content..."
                            value={tooltipText}
                            onChange={(e) => setTooltipText(e.target.value)}
                            rows={3}
                        />
                    </div>
                )}

                {/* Position Info */}
                <div className="pt-4 border-t">
                    <p className="text-xs text-neutral-500 mb-2">Position</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-neutral-50 rounded px-2 py-1">
                            X: {(hotspot.x * 100).toFixed(1)}%
                        </div>
                        <div className="bg-neutral-50 rounded px-2 py-1">
                            Y: {(hotspot.y * 100).toFixed(1)}%
                        </div>
                        <div className="bg-neutral-50 rounded px-2 py-1">
                            W: {(hotspot.w * 100).toFixed(1)}%
                        </div>
                        <div className="bg-neutral-50 rounded px-2 py-1">
                            H: {(hotspot.h * 100).toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t p-4">
                <Button onClick={handleSave} className="w-full">
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
