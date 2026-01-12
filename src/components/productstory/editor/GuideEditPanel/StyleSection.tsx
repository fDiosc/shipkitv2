"use client";

import { Guide } from "./index";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface StyleSectionProps {
    guide: Guide;
    onUpdate: (updates: Partial<Guide>) => void;
}

export function StyleSection({ guide, onUpdate }: StyleSectionProps) {
    return (
        <div className="space-y-4">
            {/* Background Color */}
            <div className="space-y-2">
                <Label className="text-xs font-medium text-neutral-600">Background Color</Label>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={guide.backgroundColor || "#7C3AED"}
                        onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                        className="w-10 h-10 rounded-lg border cursor-pointer"
                    />
                    <Input
                        value={guide.backgroundColor || "#7C3AED"}
                        onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                        className="flex-1 h-10 font-mono text-sm uppercase"
                        maxLength={9}
                    />
                </div>
            </div>

            {/* Text Color */}
            <div className="space-y-2">
                <Label className="text-xs font-medium text-neutral-600">Text Color</Label>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={guide.textColor || "#FFFFFF"}
                        onChange={(e) => onUpdate({ textColor: e.target.value })}
                        className="w-10 h-10 rounded-lg border cursor-pointer"
                    />
                    <Input
                        value={guide.textColor || "#FFFFFF"}
                        onChange={(e) => onUpdate({ textColor: e.target.value })}
                        className="flex-1 h-10 font-mono text-sm uppercase"
                        maxLength={9}
                    />
                </div>
            </div>

            {/* Hotspot/Beacon Color */}
            <div className="space-y-2">
                <Label className="text-xs font-medium text-neutral-600">Hotspot Color</Label>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={guide.hotspotColor || "#7C3AED"}
                        onChange={(e) => onUpdate({ hotspotColor: e.target.value })}
                        className="w-10 h-10 rounded-lg border cursor-pointer"
                    />
                    <Input
                        value={guide.hotspotColor || "#7C3AED"}
                        onChange={(e) => onUpdate({ hotspotColor: e.target.value })}
                        className="flex-1 h-10 font-mono text-sm uppercase"
                        maxLength={9}
                    />
                </div>
            </div>

            {/* Font Family */}
            <div className="space-y-2">
                <Label className="text-xs font-medium text-neutral-600">Font</Label>
                <Select
                    value={guide.fontFamily || "Inter"}
                    onValueChange={(value) => onUpdate({ fontFamily: value })}
                >
                    <SelectTrigger className="h-10">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="system-ui">System</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
                <Label className="text-xs font-medium text-neutral-600">Font Size</Label>
                <Select
                    value={guide.fontSize || "md"}
                    onValueChange={(value) => onUpdate({ fontSize: value })}
                >
                    <SelectTrigger className="h-10">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="sm">Small (14px)</SelectItem>
                        <SelectItem value="md">Medium (16px)</SelectItem>
                        <SelectItem value="lg">Large (20px)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Border Radius */}
            <div className="space-y-2">
                <Label className="text-xs font-medium text-neutral-600">Border Radius</Label>
                <div className="flex items-center gap-2">
                    <input
                        type="range"
                        min="0"
                        max="24"
                        value={guide.borderRadius ?? 8}
                        onChange={(e) => onUpdate({ borderRadius: parseInt(e.target.value) })}
                        className="flex-1"
                    />
                    <span className="text-sm text-neutral-600 w-10 text-right">
                        {guide.borderRadius ?? 8}px
                    </span>
                </div>
            </div>

            {/* Preview */}
            <div className="pt-4 border-t">
                <Label className="text-xs font-medium text-neutral-600 mb-3 block">Preview</Label>
                <div
                    className="p-4 rounded-lg"
                    style={{
                        backgroundColor: guide.backgroundColor || "#7C3AED",
                        color: guide.textColor || "#FFFFFF",
                        fontFamily: guide.fontFamily || "Inter",
                        borderRadius: `${guide.borderRadius ?? 8}px`,
                    }}
                >
                    <p className="font-medium" style={{ fontSize: guide.fontSize === "sm" ? "14px" : guide.fontSize === "lg" ? "20px" : "16px" }}>
                        Sample tooltip text
                    </p>
                </div>
            </div>
        </div>
    );
}
