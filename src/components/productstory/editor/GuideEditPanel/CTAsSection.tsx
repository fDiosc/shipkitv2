"use client";

import { Guide } from "./index";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Screen {
    id: string;
    order: number;
    imageUrl: string;
}

interface CTAsSectionProps {
    guide: Guide;
    screens: Screen[];
    onUpdate: (updates: Partial<Guide>) => void;
}

export function CTAsSection({ guide, screens, onUpdate }: CTAsSectionProps) {
    return (
        <div className="space-y-6">
            {/* Primary CTA */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label className="text-sm font-medium text-neutral-900">Primary Button</Label>
                        <p className="text-xs text-neutral-500">Main action button (Next)</p>
                    </div>
                    <Switch
                        checked={guide.primaryCtaEnabled ?? true}
                        onCheckedChange={(checked) => onUpdate({ primaryCtaEnabled: checked })}
                    />
                </div>

                {guide.primaryCtaEnabled !== false && (
                    <div className="pl-4 border-l-2 border-violet-100 space-y-4">
                        {/* Button Text */}
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-neutral-600">Button Text</Label>
                            <Input
                                value={guide.primaryCtaText || "Next"}
                                onChange={(e) => onUpdate({ primaryCtaText: e.target.value })}
                                placeholder="Next"
                                className="h-9"
                            />
                        </div>

                        {/* Action Type */}
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-neutral-600">Action</Label>
                            <Select
                                value={guide.primaryCtaAction || "next"}
                                onValueChange={(value) => onUpdate({ primaryCtaAction: value })}
                            >
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="next">Go to next step</SelectItem>
                                    <SelectItem value="screen">Go to specific screen</SelectItem>
                                    <SelectItem value="url">Open URL</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Target Screen (if action is screen) */}
                        {guide.primaryCtaAction === "screen" && (
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-neutral-600">Target Screen</Label>
                                <Select
                                    value={guide.targetScreenId || ""}
                                    onValueChange={(value) => onUpdate({ targetScreenId: value })}
                                >
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Select screen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {screens.map((screen) => (
                                            <SelectItem key={screen.id} value={screen.id}>
                                                Screen {screen.order + 1}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* URL (if action is url) */}
                        {guide.primaryCtaAction === "url" && (
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-neutral-600">URL</Label>
                                <Input
                                    value={guide.primaryCtaUrl || ""}
                                    onChange={(e) => onUpdate({ primaryCtaUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="h-9"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Secondary CTA */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label className="text-sm font-medium text-neutral-900">Secondary Button</Label>
                        <p className="text-xs text-neutral-500">Additional action (Learn more)</p>
                    </div>
                    <Switch
                        checked={guide.secondaryCtaEnabled ?? false}
                        onCheckedChange={(checked) => onUpdate({ secondaryCtaEnabled: checked })}
                    />
                </div>

                {guide.secondaryCtaEnabled && (
                    <div className="pl-4 border-l-2 border-violet-100 space-y-4">
                        {/* Button Text */}
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-neutral-600">Button Text</Label>
                            <Input
                                value={guide.secondaryCtaText || ""}
                                onChange={(e) => onUpdate({ secondaryCtaText: e.target.value })}
                                placeholder="Learn more"
                                className="h-9"
                            />
                        </div>

                        {/* URL */}
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-neutral-600">URL</Label>
                            <Input
                                value={guide.secondaryCtaUrl || ""}
                                onChange={(e) => onUpdate({ secondaryCtaUrl: e.target.value })}
                                placeholder="https://..."
                                className="h-9"
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
                    }}
                >
                    <p className="text-sm mb-3" style={{ color: guide.textColor || "#FFFFFF" }}>
                        Sample tooltip content
                    </p>
                    <div className="flex items-center gap-2">
                        {guide.secondaryCtaEnabled && guide.secondaryCtaText && (
                            <button className="px-3 py-1.5 text-xs font-medium rounded bg-white/20 hover:bg-white/30 transition-colors" style={{ color: guide.textColor || "#FFFFFF" }}>
                                {guide.secondaryCtaText}
                            </button>
                        )}
                        {guide.primaryCtaEnabled !== false && (
                            <button className="px-4 py-1.5 text-xs font-medium rounded bg-white text-neutral-900 hover:bg-neutral-100 transition-colors">
                                {guide.primaryCtaText || "Next"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
