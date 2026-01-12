"use client";

import { useState } from "react";
import { Check, Palette, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface Theme {
    id: string;
    name: string;
    isDefault: boolean;
    backgroundColor: string;
    textColor: string;
    hotspotColor: string;
    fontFamily: string;
    borderRadius: number;
    backdropColor: string;
    backdropOpacity: number;
}

interface ThemeSelectorProps {
    themes: Theme[];
    selectedThemeId: string | null;
    onSelectTheme: (themeId: string) => void;
    onCreateTheme: (theme: Omit<Theme, 'id' | 'isDefault'>) => void;
    onDeleteTheme: (themeId: string) => void;
    onApplyToAll: (themeId: string) => void;
}

// Preset themes
const presetThemes: Omit<Theme, 'id' | 'isDefault'>[] = [
    {
        name: "Purple (Default)",
        backgroundColor: "#7C3AED",
        textColor: "#FFFFFF",
        hotspotColor: "#7C3AED",
        fontFamily: "Inter",
        borderRadius: 8,
        backdropColor: "#000000",
        backdropOpacity: 0.6,
    },
    {
        name: "Ocean Blue",
        backgroundColor: "#0EA5E9",
        textColor: "#FFFFFF",
        hotspotColor: "#0EA5E9",
        fontFamily: "Inter",
        borderRadius: 8,
        backdropColor: "#0C4A6E",
        backdropOpacity: 0.7,
    },
    {
        name: "Forest Green",
        backgroundColor: "#059669",
        textColor: "#FFFFFF",
        hotspotColor: "#10B981",
        fontFamily: "Inter",
        borderRadius: 12,
        backdropColor: "#064E3B",
        backdropOpacity: 0.6,
    },
    {
        name: "Sunset Orange",
        backgroundColor: "#F97316",
        textColor: "#FFFFFF",
        hotspotColor: "#F97316",
        fontFamily: "Inter",
        borderRadius: 8,
        backdropColor: "#431407",
        backdropOpacity: 0.65,
    },
    {
        name: "Midnight",
        backgroundColor: "#1F2937",
        textColor: "#F9FAFB",
        hotspotColor: "#6366F1",
        fontFamily: "Inter",
        borderRadius: 8,
        backdropColor: "#000000",
        backdropOpacity: 0.8,
    },
    {
        name: "Rose",
        backgroundColor: "#DB2777",
        textColor: "#FFFFFF",
        hotspotColor: "#EC4899",
        fontFamily: "Inter",
        borderRadius: 16,
        backdropColor: "#500724",
        backdropOpacity: 0.6,
    },
];

export function ThemeSelector({
    themes,
    selectedThemeId,
    onSelectTheme,
    onCreateTheme,
    onDeleteTheme,
    onApplyToAll,
}: ThemeSelectorProps) {
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [newTheme, setNewTheme] = useState<Omit<Theme, 'id' | 'isDefault'>>({
        name: "",
        backgroundColor: "#7C3AED",
        textColor: "#FFFFFF",
        hotspotColor: "#7C3AED",
        fontFamily: "Inter",
        borderRadius: 8,
        backdropColor: "#000000",
        backdropOpacity: 0.6,
    });

    const handleCreateTheme = () => {
        if (!newTheme.name.trim()) return;
        onCreateTheme(newTheme);
        setShowCreateDialog(false);
        setNewTheme({
            name: "",
            backgroundColor: "#7C3AED",
            textColor: "#FFFFFF",
            hotspotColor: "#7C3AED",
            fontFamily: "Inter",
            borderRadius: 8,
            backdropColor: "#000000",
            backdropOpacity: 0.6,
        });
    };

    const allThemes = [...themes];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-neutral-900">Demo Themes</Label>
                <button
                    onClick={() => setShowCreateDialog(true)}
                    className="text-xs text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
                >
                    <Plus className="w-3 h-3" />
                    New Theme
                </button>
            </div>

            {/* Theme Grid */}
            <div className="grid grid-cols-2 gap-2">
                {allThemes.map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => onSelectTheme(theme.id)}
                        className={cn(
                            "relative p-3 rounded-lg border text-left transition-all",
                            selectedThemeId === theme.id
                                ? "ring-2 ring-violet-500 border-transparent"
                                : "border-neutral-200 hover:border-neutral-300"
                        )}
                    >
                        {/* Color Preview */}
                        <div
                            className="w-full h-8 rounded-md mb-2 flex items-center justify-center group"
                            style={{ backgroundColor: theme.backgroundColor }}
                        >
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: theme.hotspotColor }}
                            />

                            {/* Delete button */}
                            {!theme.isDefault && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteTheme(theme.id);
                                    }}
                                    className="absolute top-1 right-1 p-1 rounded bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            )}
                        </div>

                        {/* Theme Name */}
                        <span className="text-xs font-medium text-neutral-700 truncate block">
                            {theme.name}
                        </span>

                        {/* Selected indicator */}
                        {selectedThemeId === theme.id && (
                            <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Preset Themes */}
            <div className="pt-4 border-t">
                <Label className="text-xs font-medium text-neutral-500 uppercase mb-2 block">
                    Presets
                </Label>
                <div className="flex flex-wrap gap-1">
                    {presetThemes.map((preset, index) => (
                        <button
                            key={index}
                            onClick={() => onCreateTheme(preset)}
                            className="w-7 h-7 rounded-md border border-neutral-200 hover:scale-110 transition-transform"
                            style={{ backgroundColor: preset.backgroundColor }}
                            title={preset.name}
                        />
                    ))}
                </div>
            </div>

            {/* Apply to All */}
            {selectedThemeId && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onApplyToAll(selectedThemeId)}
                    className="w-full"
                >
                    <Palette className="w-3.5 h-3.5 mr-2" />
                    Apply to all hotspots
                </Button>
            )}

            {/* Create Theme Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create New Theme</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Theme Name</Label>
                            <Input
                                value={newTheme.name}
                                onChange={(e) => setNewTheme(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="My Custom Theme"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs">Background</Label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={newTheme.backgroundColor}
                                        onChange={(e) => setNewTheme(prev => ({ ...prev, backgroundColor: e.target.value }))}
                                        className="w-8 h-8 rounded border cursor-pointer"
                                    />
                                    <Input
                                        value={newTheme.backgroundColor}
                                        onChange={(e) => setNewTheme(prev => ({ ...prev, backgroundColor: e.target.value }))}
                                        className="flex-1 h-8 font-mono text-xs"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Text</Label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={newTheme.textColor}
                                        onChange={(e) => setNewTheme(prev => ({ ...prev, textColor: e.target.value }))}
                                        className="w-8 h-8 rounded border cursor-pointer"
                                    />
                                    <Input
                                        value={newTheme.textColor}
                                        onChange={(e) => setNewTheme(prev => ({ ...prev, textColor: e.target.value }))}
                                        className="flex-1 h-8 font-mono text-xs"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Hotspot</Label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={newTheme.hotspotColor}
                                        onChange={(e) => setNewTheme(prev => ({ ...prev, hotspotColor: e.target.value }))}
                                        className="w-8 h-8 rounded border cursor-pointer"
                                    />
                                    <Input
                                        value={newTheme.hotspotColor}
                                        onChange={(e) => setNewTheme(prev => ({ ...prev, hotspotColor: e.target.value }))}
                                        className="flex-1 h-8 font-mono text-xs"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Backdrop</Label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={newTheme.backdropColor}
                                        onChange={(e) => setNewTheme(prev => ({ ...prev, backdropColor: e.target.value }))}
                                        className="w-8 h-8 rounded border cursor-pointer"
                                    />
                                    <Input
                                        value={newTheme.backdropColor}
                                        onChange={(e) => setNewTheme(prev => ({ ...prev, backdropColor: e.target.value }))}
                                        className="flex-1 h-8 font-mono text-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="pt-4 border-t">
                            <Label className="text-xs mb-2 block">Preview</Label>
                            <div
                                className="p-4 rounded-lg"
                                style={{
                                    backgroundColor: newTheme.backgroundColor,
                                    color: newTheme.textColor,
                                    fontFamily: newTheme.fontFamily,
                                    borderRadius: `${newTheme.borderRadius}px`,
                                }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: newTheme.hotspotColor }}
                                    />
                                    <span className="text-xs opacity-70">Hotspot</span>
                                </div>
                                <p className="text-sm font-medium">Sample tooltip text</p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateTheme} disabled={!newTheme.name.trim()}>
                            Create Theme
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
