"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Palette, Focus, MousePointer2, Grid3X3, Settings, X } from "lucide-react";
import { StyleSection } from "./StyleSection";
import { HighlightSection } from "./HighlightSection";
import { CTAsSection } from "./CTAsSection";
import { PositionSection } from "./PositionSection";
import { ConfigSection } from "./ConfigSection";

export interface Guide {
    id: string;
    type: string | null;
    targetScreenId: string | null;
    x: number;
    y: number;
    w: number;
    h: number;
    label: string | null;
    tooltipText: string | null;
    htmlContent: string | null;
    primaryCtaText?: string | null;

    // Style
    backgroundColor: string | null;
    textColor: string | null;
    hotspotColor: string | null;
    fontFamily: string | null;
    fontSize: string | null;
    borderRadius: number | null;

    // Highlight
    backdropEnabled: boolean | null;
    backdropOpacity: number | null;
    backdropColor: string | null;
    spotlightEnabled: boolean | null;
    spotlightColor: string | null;
    spotlightPadding: number | null;

    // CTAs
    primaryCtaEnabled: boolean | null;
    primaryCtaAction: string | null;
    primaryCtaUrl: string | null;
    secondaryCtaEnabled: boolean | null;
    secondaryCtaText: string | null;
    secondaryCtaUrl: string | null;

    // Position
    arrowPosition: string | null;
    offsetX: number | null;
    offsetY: number | null;

    // Config
    showStepNumber: boolean | null;
    showPreviousButton: boolean | null;
    hideOnMouseOut: boolean | null;
    autoAdvanceEnabled: boolean | null;
    autoAdvanceDelay: number | null;
}

interface Screen {
    id: string;
    order: number;
    imageUrl: string;
}

interface GuideEditPanelProps {
    guide: Guide;
    screens: Screen[];
    onUpdate: (updates: Partial<Guide>) => void;
    onDelete: () => void;
    onClose: () => void;
}

const tabs = [
    { id: "style", label: "Style", icon: Palette },
    { id: "highlight", label: "Highlight", icon: Focus },
    { id: "ctas", label: "CTAs", icon: MousePointer2 },
    { id: "position", label: "Position", icon: Grid3X3 },
    { id: "config", label: "Config", icon: Settings },
];

export function GuideEditPanel({ guide, screens, onUpdate, onDelete, onClose }: GuideEditPanelProps) {
    const [activeTab, setActiveTab] = useState("style");

    return (
        <div className="w-80 bg-white border-l flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b space-y-3">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-semibold text-sm text-neutral-900">Guide Settings</h3>
                        <p className="text-xs text-neutral-500 mt-1">Customize this hotspot</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-neutral-100 rounded-md text-neutral-400 hover:text-neutral-600 transition-colors"
                        title="Close settings"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Hotspot Type Selector - Storylane style */}
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { id: "intro", label: "Intro", desc: "Centered modal", icon: "🎬" },
                        { id: "action", label: "Action", desc: "Click hotspot", icon: "👆" },
                        { id: "closing", label: "Closing", desc: "End modal", icon: "🎉" },
                    ].map((type) => (
                        <button
                            key={type.id}
                            onClick={() => onUpdate({ type: type.id })}
                            className={cn(
                                "p-2 rounded-lg border text-center transition-all",
                                guide.type === type.id
                                    ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                                    : "border-neutral-200 hover:border-neutral-300"
                            )}
                        >
                            <span className="text-lg block mb-1">{type.icon}</span>
                            <span className={cn(
                                "text-xs font-medium block",
                                guide.type === type.id ? "text-indigo-700" : "text-neutral-700"
                            )}>
                                {type.label}
                            </span>
                            <span className="text-[10px] text-neutral-400">{type.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b px-2">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex-1 py-3 px-2 text-xs font-medium flex flex-col items-center gap-1 transition-colors relative",
                                activeTab === tab.id
                                    ? "text-violet-600"
                                    : "text-neutral-400 hover:text-neutral-600"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{tab.label}</span>
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-violet-600 rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeTab === "style" && (
                    <StyleSection guide={guide} onUpdate={onUpdate} />
                )}
                {activeTab === "highlight" && (
                    <HighlightSection guide={guide} onUpdate={onUpdate} />
                )}
                {activeTab === "ctas" && (
                    <CTAsSection guide={guide} screens={screens} onUpdate={onUpdate} />
                )}
                {activeTab === "position" && (
                    <PositionSection guide={guide} onUpdate={onUpdate} />
                )}
                {activeTab === "config" && (
                    <ConfigSection guide={guide} onUpdate={onUpdate} />
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t space-y-2">
                <button
                    onClick={onDelete}
                    className="w-full py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    Delete Hotspot
                </button>
            </div>
        </div>
    );
}
