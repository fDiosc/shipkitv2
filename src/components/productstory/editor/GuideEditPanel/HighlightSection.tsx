"use client";

import { Guide } from "./index";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface HighlightSectionProps {
    guide: Guide;
    onUpdate: (updates: Partial<Guide>) => void;
}

export function HighlightSection({ guide, onUpdate }: HighlightSectionProps) {
    return (
        <div className="space-y-6">
            {/* Backdrop */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label className="text-sm font-medium text-neutral-900">Backdrop</Label>
                        <p className="text-xs text-neutral-500">Dark overlay behind tooltip</p>
                    </div>
                    <Switch
                        checked={guide.backdropEnabled ?? true}
                        onCheckedChange={(checked) => onUpdate({ backdropEnabled: checked })}
                    />
                </div>

                {guide.backdropEnabled !== false && (
                    <div className="pl-4 border-l-2 border-violet-100 space-y-4">
                        {/* Backdrop Color */}
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-neutral-600">Color</Label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={guide.backdropColor || "#000000"}
                                    onChange={(e) => onUpdate({ backdropColor: e.target.value })}
                                    className="w-8 h-8 rounded border cursor-pointer"
                                />
                                <Input
                                    value={guide.backdropColor || "#000000"}
                                    onChange={(e) => onUpdate({ backdropColor: e.target.value })}
                                    className="flex-1 h-8 font-mono text-xs uppercase"
                                    maxLength={9}
                                />
                            </div>
                        </div>

                        {/* Backdrop Opacity */}
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-neutral-600">Opacity</Label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={(guide.backdropOpacity ?? 0.6) * 100}
                                    onChange={(e) => onUpdate({ backdropOpacity: parseInt(e.target.value) / 100 })}
                                    className="flex-1"
                                />
                                <span className="text-xs text-neutral-600 w-10 text-right">
                                    {Math.round((guide.backdropOpacity ?? 0.6) * 100)}%
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Spotlight */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label className="text-sm font-medium text-neutral-900">Spotlight</Label>
                        <p className="text-xs text-neutral-500">Highlight border around element</p>
                    </div>
                    <Switch
                        checked={guide.spotlightEnabled ?? false}
                        onCheckedChange={(checked) => onUpdate({ spotlightEnabled: checked })}
                    />
                </div>

                {guide.spotlightEnabled && (
                    <div className="pl-4 border-l-2 border-violet-100 space-y-4">
                        {/* Spotlight Color */}
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-neutral-600">Color</Label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={guide.spotlightColor || "#7C3AED"}
                                    onChange={(e) => onUpdate({ spotlightColor: e.target.value })}
                                    className="w-8 h-8 rounded border cursor-pointer"
                                />
                                <Input
                                    value={guide.spotlightColor || "#7C3AED"}
                                    onChange={(e) => onUpdate({ spotlightColor: e.target.value })}
                                    className="flex-1 h-8 font-mono text-xs uppercase"
                                    maxLength={9}
                                />
                            </div>
                        </div>

                        {/* Spotlight Padding */}
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-neutral-600">Padding</Label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="24"
                                    value={guide.spotlightPadding ?? 8}
                                    onChange={(e) => onUpdate({ spotlightPadding: parseInt(e.target.value) })}
                                    className="flex-1"
                                />
                                <span className="text-xs text-neutral-600 w-10 text-right">
                                    {guide.spotlightPadding ?? 8}px
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Preview */}
            <div className="pt-4 border-t">
                <Label className="text-xs font-medium text-neutral-600 mb-3 block">Preview</Label>
                <div className="relative h-24 rounded-lg overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200">
                    {/* Backdrop preview */}
                    {guide.backdropEnabled !== false && (
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundColor: guide.backdropColor || "#000000",
                                opacity: guide.backdropOpacity ?? 0.6,
                            }}
                        />
                    )}
                    {/* Cutout preview */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-10 rounded bg-white"
                        style={{
                            boxShadow: guide.spotlightEnabled
                                ? `0 0 0 ${guide.spotlightPadding ?? 8}px ${guide.spotlightColor || "#7C3AED"}`
                                : undefined,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
