"use client";

import { Guide } from "./index";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface ConfigSectionProps {
    guide: Guide;
    onUpdate: (updates: Partial<Guide>) => void;
}

export function ConfigSection({ guide, onUpdate }: ConfigSectionProps) {
    return (
        <div className="space-y-6">
            {/* Show Step Number */}
            <div className="flex items-center justify-between">
                <div>
                    <Label className="text-sm font-medium text-neutral-900">Show Step Number</Label>
                    <p className="text-xs text-neutral-500">Display "1/10" in tooltip</p>
                </div>
                <Switch
                    checked={guide.showStepNumber ?? true}
                    onCheckedChange={(checked) => onUpdate({ showStepNumber: checked })}
                />
            </div>

            {/* Show Previous Button */}
            <div className="flex items-center justify-between">
                <div>
                    <Label className="text-sm font-medium text-neutral-900">Previous Button</Label>
                    <p className="text-xs text-neutral-500">Add "Back" button to tooltip</p>
                </div>
                <Switch
                    checked={guide.showPreviousButton ?? false}
                    onCheckedChange={(checked) => onUpdate({ showPreviousButton: checked })}
                />
            </div>

            {/* Hide on Mouse Out */}
            <div className="flex items-center justify-between">
                <div>
                    <Label className="text-sm font-medium text-neutral-900">Hide on Mouse Out</Label>
                    <p className="text-xs text-neutral-500">Collapse text when mouse leaves</p>
                </div>
                <Switch
                    checked={guide.hideOnMouseOut ?? false}
                    onCheckedChange={(checked) => onUpdate({ hideOnMouseOut: checked })}
                />
            </div>

            {/* Auto-Advance */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label className="text-sm font-medium text-neutral-900">Auto-Advance</Label>
                        <p className="text-xs text-neutral-500">Move to next step automatically</p>
                    </div>
                    <Switch
                        checked={guide.autoAdvanceEnabled ?? false}
                        onCheckedChange={(checked) => onUpdate({ autoAdvanceEnabled: checked })}
                    />
                </div>

                {guide.autoAdvanceEnabled && (
                    <div className="pl-4 border-l-2 border-violet-100">
                        <Label className="text-xs font-medium text-neutral-600 mb-2 block">Delay (seconds)</Label>
                        <div className="flex items-center gap-2">
                            <input
                                type="range"
                                min="1"
                                max="30"
                                value={guide.autoAdvanceDelay ?? 5}
                                onChange={(e) => onUpdate({ autoAdvanceDelay: parseInt(e.target.value) })}
                                className="flex-1"
                            />
                            <Input
                                type="number"
                                value={guide.autoAdvanceDelay ?? 5}
                                onChange={(e) => onUpdate({ autoAdvanceDelay: parseInt(e.target.value) || 5 })}
                                className="w-16 h-8 text-center"
                                min={1}
                                max={30}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Preview */}
            <div className="pt-4 border-t">
                <Label className="text-xs font-medium text-neutral-600 mb-3 block">Preview</Label>
                <div
                    className="p-4 rounded-lg"
                    style={{
                        backgroundColor: guide.backgroundColor || "#7C3AED",
                        fontFamily: guide.fontFamily || "Inter",
                    }}
                >
                    {/* Step number */}
                    {guide.showStepNumber !== false && (
                        <div className="text-xs mb-2 opacity-70" style={{ color: guide.textColor || "#FFFFFF" }}>
                            1 of 10
                        </div>
                    )}

                    <p className="text-sm mb-3" style={{ color: guide.textColor || "#FFFFFF" }}>
                        Sample tooltip content
                    </p>

                    <div className="flex items-center gap-2">
                        {guide.showPreviousButton && (
                            <button
                                className="px-3 py-1.5 text-xs font-medium rounded bg-white/20 hover:bg-white/30 transition-colors"
                                style={{ color: guide.textColor || "#FFFFFF" }}
                            >
                                Back
                            </button>
                        )}
                        {guide.primaryCtaEnabled !== false && (
                            <button className="px-4 py-1.5 text-xs font-medium rounded bg-white text-neutral-900 hover:bg-neutral-100 transition-colors">
                                {guide.primaryCtaText || "Next"}
                            </button>
                        )}
                    </div>

                    {guide.autoAdvanceEnabled && (
                        <div className="mt-3 pt-2 border-t border-white/20">
                            <div className="flex items-center gap-2 text-xs opacity-70" style={{ color: guide.textColor || "#FFFFFF" }}>
                                <div className="w-3 h-3 rounded-full border-2 border-current animate-spin" style={{ borderTopColor: 'transparent' }} />
                                Auto-advancing in {guide.autoAdvanceDelay ?? 5}s
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
