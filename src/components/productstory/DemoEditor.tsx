"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ScreenList } from "./ScreenList";
import { ScreenCanvas } from "./ScreenCanvas";
import { EditorTopbar } from "./EditorTopbar";
import { GuideEditPanel, Guide } from "./editor/GuideEditPanel";
import { HotspotListPanel } from "./editor/HotspotListPanel";
import { DemoPlayer } from "./DemoPlayer";
import { Button } from "@/components/ui/button";
import { Upload, Image, Loader2 } from "lucide-react";
import { addScreen, createHotspot, updateHotspot, deleteHotspot, deleteScreen, reorderHotspots } from "@/app/actions/demos";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

interface Screen {
    id: string;
    order: number;
    imageUrl: string;
    width: number | null;
    height: number | null;
    hotspots: Hotspot[];
}

interface Hotspot extends Guide {
    // All fields from Guide interface in GuideEditPanel
    orderInScreen?: number | null;
}

interface Step {
    id: string;
    order: number;
    screenId: string;
    hotspotId: string | null;
    title: string | null;
    body: string | null;
    placement: string | null;
}

interface Demo {
    id: string;
    name: string;
    description: string | null;
    status: string | null;
    publicId: string;
    showBranding: boolean | null;
}

interface DemoEditorProps {
    demo: Demo;
    screens: Screen[];
    steps: Step[];
    workspaceSlug: string;
}

export function DemoEditor({ demo, screens: initialScreens, steps, workspaceSlug }: DemoEditorProps) {
    const router = useRouter();
    const [screens, setScreens] = useState<Screen[]>(initialScreens);
    const [selectedScreenId, setSelectedScreenId] = useState<string | null>(screens[0]?.id || null);
    const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
    const [mode, setMode] = useState<"hotspots" | "steps" | "preview">("hotspots");
    const [isUploading, setIsUploading] = useState(false);
    const [isCreatingHotspot, setIsCreatingHotspot] = useState(false);
    const [isAddingHotspot, setIsAddingHotspot] = useState(false);
    const [hasChanges, setHasChanges] = useState(false); // Track unpublished changes

    // Listen for republish success event to reset hasChanges without full refresh
    useEffect(() => {
        const handleRepublished = () => setHasChanges(false);
        window.addEventListener('demo-republished', handleRepublished);
        return () => window.removeEventListener('demo-republished', handleRepublished);
    }, []);

    const selectedScreen = screens.find(s => s.id === selectedScreenId);
    const selectedHotspot = selectedScreen?.hotspots.find(h => h.id === selectedHotspotId);

    // Handle file upload
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setIsUploading(true);

        try {
            for (const file of acceptedFiles) {
                const formData = new FormData();
                formData.append("file", file);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!uploadRes.ok) {
                    console.error("Upload failed");
                    continue;
                }

                const { url, width, height } = await uploadRes.json();
                const result = await addScreen(demo.id, url, width, height);

                if (result.success && result.screen) {
                    const newScreen = { ...result.screen, hotspots: [] };
                    setScreens(prev => [...prev, newScreen]);

                    // Auto-select first uploaded screen
                    if (screens.length === 0) {
                        setSelectedScreenId(result.screen.id);
                    }
                }
            }
        } catch (error) {
            console.error("Error uploading:", error);
        } finally {
            setIsUploading(false);
        }
    }, [demo.id, screens.length]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    });

    // ═══════════════════════════════════════════════════════════
    // HOTSPOT HANDLERS - Connected to server actions
    // ═══════════════════════════════════════════════════════════

    const handleHotspotCreate = useCallback(async (
        screenId: string,
        position: { x: number; y: number }
    ) => {
        // Only create if in "adding" mode
        if (!isAddingHotspot) return;

        const screen = screens.find(s => s.id === screenId);
        const nextOrder = (screen?.hotspots.length || 0);

        setIsCreatingHotspot(true);

        try {
            const result = await createHotspot(screenId, {
                type: "action", // Default type is action hotspot
                x: position.x,
                y: position.y,
                w: 0.05, // Small fixed size for beacon
                h: 0.05,
            });

            if (result.success && result.hotspot) {
                // Optimistic update - add hotspot to local state with all fields
                setScreens(prev => prev.map(screen => {
                    if (screen.id === screenId) {
                        return {
                            ...screen,
                            hotspots: [...screen.hotspots, result.hotspot as Hotspot],
                        };
                    }
                    return screen;
                }));

                // Select the new hotspot
                setSelectedHotspotId(result.hotspot.id);
                setHasChanges(true);
            }
        } catch (error) {
            console.error("Error creating hotspot:", error);
        } finally {
            setIsCreatingHotspot(false);
            setIsAddingHotspot(false); // Exit add mode after creating
        }
    }, [screens, isAddingHotspot]);

    // ═══════════════════════════════════════════════════════════
    // SERVER SYNC DEBOUNCING
    // ═══════════════════════════════════════════════════════════

    // Store pending updates per hotspot to debounce server calls
    const [pendingUpdates, setPendingUpdates] = useState<Record<string, Partial<Hotspot>>>({});

    useEffect(() => {
        const hotspotIds = Object.keys(pendingUpdates);
        if (hotspotIds.length === 0) return;

        const timer = setTimeout(async () => {
            const updatesToSync = { ...pendingUpdates };
            setPendingUpdates({}); // Clear pending before syncing

            for (const [id, updates] of Object.entries(updatesToSync)) {
                try {
                    // Filter out undefined and properly type for server action
                    const serverUpdates: any = {};
                    Object.entries(updates).forEach(([key, value]) => {
                        if (value !== undefined) serverUpdates[key] = value;
                    });

                    if (Object.keys(serverUpdates).length > 0) {
                        await updateHotspot(id, serverUpdates);
                    }
                } catch (error) {
                    console.error(`Failed to sync hotspot ${id}:`, error);
                }
            }
        }, 800); // 800ms debounce for style/text changes

        return () => clearTimeout(timer);
    }, [pendingUpdates]);

    const handleHotspotUpdate = useCallback(async (hotspotId: string, updates: Partial<Hotspot>, immediate = false) => {
        try {
            // 1. Optimistic update (instant UI change)
            setScreens(prev => prev.map(screen => ({
                ...screen,
                hotspots: screen.hotspots.map(h =>
                    h.id === hotspotId ? { ...h, ...updates } : h
                ),
            })));
            setHasChanges(true);

            // 2. Server sync
            if (immediate) {
                // For coordinates from ScreenCanvas onMouseUp, sync immediately
                const serverUpdates: any = {};
                Object.entries(updates).forEach(([key, value]) => {
                    if (value !== undefined) serverUpdates[key] = value;
                });
                await updateHotspot(hotspotId, serverUpdates);
            } else {
                // For style/text changes from GuideEditPanel, debounce
                setPendingUpdates(prev => ({
                    ...prev,
                    [hotspotId]: { ...(prev[hotspotId] || {}), ...updates }
                }));
            }
        } catch (error) {
            console.error("Error updating hotspot:", error);
        }
    }, []);

    const handleHotspotDelete = useCallback(async (hotspotId: string) => {
        try {
            // Optimistic update
            setScreens(prev => prev.map(screen => ({
                ...screen,
                hotspots: screen.hotspots.filter(h => h.id !== hotspotId),
            })));
            setSelectedHotspotId(null);

            await deleteHotspot(hotspotId);
            setHasChanges(true);
        } catch (error) {
            console.error("Error deleting hotspot:", error);
        }
    }, []);

    const handleScreenDelete = useCallback(async (screenId: string) => {
        try {
            setScreens(prev => prev.filter(s => s.id !== screenId));
            if (selectedScreenId === screenId) {
                setSelectedScreenId(screens[0]?.id || null);
            }
            await deleteScreen(screenId);
        } catch (error) {
            console.error("Error deleting screen:", error);
        }
    }, [selectedScreenId, screens]);

    const handleScreenSelect = (screenId: string) => {
        setSelectedScreenId(screenId);
        setSelectedHotspotId(null);
    };

    const handleScreensReorder = (newOrder: string[]) => {
        const reordered = newOrder.map((id, index) => {
            const screen = screens.find(s => s.id === id);
            return screen ? { ...screen, order: index } : null;
        }).filter(Boolean) as Screen[];
        setScreens(reordered);
    };

    const handleHotspotsReorder = useCallback(async (screenId: string, orderedIds: string[]) => {
        // Optimistic update
        setScreens(prev => prev.map(screen => {
            if (screen.id === screenId) {
                const reorderedHotspots = orderedIds.map((id, index) => {
                    const hotspot = screen.hotspots.find(h => h.id === id);
                    return hotspot ? { ...hotspot, orderInScreen: index } : null;
                }).filter(Boolean) as Hotspot[];
                return { ...screen, hotspots: reorderedHotspots };
            }
            return screen;
        }));

        try {
            await reorderHotspots(screenId, orderedIds);
        } catch (error) {
            console.error("Error reordering hotspots:", error);
        }
    }, []);

    // ═══════════════════════════════════════════════════════════
    // PREVIEW MODE
    // ═══════════════════════════════════════════════════════════

    if (mode === "preview") {
        return (
            <div className="flex h-[calc(100vh-4rem)] -m-6 bg-neutral-900">
                <div className="w-64 bg-neutral-800 p-4 flex flex-col">
                    <Button
                        variant="outline"
                        onClick={() => setMode("hotspots")}
                        className="mb-4"
                    >
                        ← Exit Preview
                    </Button>
                    <p className="text-neutral-400 text-sm">
                        This is how your demo will look to viewers.
                        Click on hotspots to navigate.
                    </p>
                </div>
                <div className="flex-1">
                    <DemoPlayer
                        screens={screens}
                        steps={steps}
                        showBranding={demo.showBranding !== false}
                    />
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════════════
    // EDITOR MODE (FULLSCREEN)
    // ═══════════════════════════════════════════════════════════

    return (
        <div className="flex h-screen w-screen bg-neutral-100">
            {/* Left Sidebar: Screens + Hotspots */}
            <div className="w-64 bg-white border-r flex flex-col shrink-0">
                {/* Screens Section */}
                <div className="p-4 border-b">
                    <h3 className="font-semibold text-sm text-neutral-700 mb-2">
                        Screens ({screens.length})
                    </h3>
                    <div className="max-h-48 overflow-y-auto">
                        <ScreenList
                            screens={screens}
                            selectedId={selectedScreenId}
                            onSelect={handleScreenSelect}
                            onReorder={handleScreensReorder}
                            onDelete={handleScreenDelete}
                        />
                    </div>
                </div>

                {/* Upload Area */}
                <div className="px-4 py-3 border-b">
                    <div
                        {...getRootProps()}
                        className={cn(
                            "border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-colors",
                            isDragActive ? "border-blue-500 bg-blue-50" : "border-neutral-200 hover:border-neutral-300",
                            isUploading && "opacity-50 pointer-events-none"
                        )}
                    >
                        <input {...getInputProps()} />
                        {isUploading ? (
                            <Loader2 className="h-5 w-5 mx-auto text-neutral-400 animate-spin" />
                        ) : (
                            <Upload className="h-5 w-5 mx-auto text-neutral-400" />
                        )}
                        <p className="text-xs text-neutral-500 mt-1">
                            {isDragActive ? "Drop here" : isUploading ? "Uploading..." : "Add screens"}
                        </p>
                    </div>
                </div>

                {/* Hotspots Section for current screen */}
                {selectedScreen && (
                    <div className="flex-1 p-4 overflow-y-auto">
                        <HotspotListPanel
                            hotspots={selectedScreen.hotspots.map(h => ({
                                id: h.id,
                                type: h.type,
                                label: h.label,
                                tooltipText: h.tooltipText,
                                orderInScreen: h.orderInScreen ?? 0,
                            }))}
                            selectedHotspotId={selectedHotspotId}
                            onSelect={setSelectedHotspotId}
                            onReorder={(orderedIds) => handleHotspotsReorder(selectedScreen.id, orderedIds)}
                            onDelete={handleHotspotDelete}
                            onAddNew={() => setIsAddingHotspot(prev => !prev)}
                            isAddingMode={isAddingHotspot}
                        />
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Editor Topbar */}
                <EditorTopbar
                    demo={demo}
                    mode={mode}
                    onModeChange={setMode}
                    workspaceSlug={workspaceSlug}
                    hasUnpublishedChanges={demo.status === "published" && hasChanges}
                />

                {/* Canvas Area */}
                <div className="flex-1 flex items-center justify-center p-6 overflow-hidden bg-neutral-800/5">
                    {selectedScreen ? (
                        <div className="relative max-w-5xl w-full">
                            {isCreatingHotspot && (
                                <div className="absolute inset-0 bg-blue-500/10 rounded-lg flex items-center justify-center z-50">
                                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                                </div>
                            )}
                            <ScreenCanvas
                                screen={selectedScreen}
                                mode={mode}
                                selectedHotspotId={selectedHotspotId}
                                onHotspotSelect={setSelectedHotspotId}
                                onHotspotCreate={(position: { x: number; y: number }) => handleHotspotCreate(selectedScreen.id, position)}
                                onHotspotUpdate={handleHotspotUpdate}
                                onHotspotDelete={handleHotspotDelete}
                                allScreens={screens}
                                isAddingHotspot={isAddingHotspot}
                            />
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-2xl bg-neutral-200 flex items-center justify-center mx-auto mb-4">
                                <Image className="h-10 w-10 text-neutral-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                                No screens yet
                            </h3>
                            <p className="text-neutral-500 mb-4 max-w-sm">
                                Upload screenshots of your product to start building your demo
                            </p>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Button className="gap-2">
                                    <Upload className="h-4 w-4" />
                                    Upload Screenshots
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Sidebar: Guide Edit Panel */}
            {mode === "hotspots" && selectedHotspot && (
                <GuideEditPanel
                    guide={selectedHotspot}
                    screens={screens}
                    onUpdate={(updates) => handleHotspotUpdate(selectedHotspot.id, updates)}
                    onDelete={() => handleHotspotDelete(selectedHotspot.id)}
                    onClose={() => setSelectedHotspotId(null)}
                />
            )}
        </div>
    );
}

