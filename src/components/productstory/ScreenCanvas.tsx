"use client";

import React, { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { MousePointer2, Trash2, GripVertical } from "lucide-react";

// ShipKit brand blue
const BRAND_BLUE = "#4F46E5";

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
    arrowPosition: string | null;
    offsetX: number | null;
    offsetY: number | null;
}

// Get tooltip position based on arrow position
function getTooltipTransform(position: string | null): { transform: string; arrowPosition: string } {
    const pos = position || 'middle-right';

    switch (pos) {
        case 'top-left':
            return { transform: 'translate(-100%, -100%) translate(-20px, -20px)', arrowPosition: 'bottom-right' };
        case 'top-center':
            return { transform: 'translate(-50%, -100%) translate(0, -20px)', arrowPosition: 'bottom-center' };
        case 'top-right':
            return { transform: 'translate(0%, -100%) translate(20px, -20px)', arrowPosition: 'bottom-left' };
        case 'middle-left':
            return { transform: 'translate(-100%, -50%) translate(-20px, 0)', arrowPosition: 'middle-right' };
        case 'middle-right':
            return { transform: 'translate(0%, -50%) translate(20px, 0)', arrowPosition: 'middle-left' };
        case 'bottom-left':
            return { transform: 'translate(-100%, 0%) translate(-20px, 20px)', arrowPosition: 'top-right' };
        case 'bottom-center':
            return { transform: 'translate(-50%, 0%) translate(0, 20px)', arrowPosition: 'top-center' };
        case 'bottom-right':
            return { transform: 'translate(0%, 0%) translate(20px, 20px)', arrowPosition: 'top-left' };
        default:
            return { transform: 'translate(0%, -50%) translate(20px, 0)', arrowPosition: 'middle-left' };
    }
}

// Get arrow styles based on its position on the tooltip
function getArrowStyles(arrowPos: string): React.CSSProperties {
    const baseStyles: React.CSSProperties = {
        position: 'absolute',
        width: 0,
        height: 0,
    };

    const arrowSize = 10;

    switch (arrowPos) {
        case 'middle-left':
            return { ...baseStyles, left: 0, top: '50%', transform: 'translate(-100%, -50%)', borderTop: `${arrowSize}px solid transparent`, borderBottom: `${arrowSize}px solid transparent`, borderRight: `${arrowSize}px solid ${BRAND_BLUE}` };
        case 'middle-right':
            return { ...baseStyles, right: 0, top: '50%', transform: 'translate(100%, -50%)', borderTop: `${arrowSize}px solid transparent`, borderBottom: `${arrowSize}px solid transparent`, borderLeft: `${arrowSize}px solid ${BRAND_BLUE}` };
        case 'top-center':
            return { ...baseStyles, top: 0, left: '50%', transform: 'translate(-50%, -100%)', borderLeft: `${arrowSize}px solid transparent`, borderRight: `${arrowSize}px solid transparent`, borderBottom: `${arrowSize}px solid ${BRAND_BLUE}` };
        case 'bottom-center':
            return { ...baseStyles, bottom: 0, left: '50%', transform: 'translate(-50%, 100%)', borderLeft: `${arrowSize}px solid transparent`, borderRight: `${arrowSize}px solid transparent`, borderTop: `${arrowSize}px solid ${BRAND_BLUE}` };
        case 'top-left':
            return { ...baseStyles, top: 0, left: 10, transform: 'translate(0, -100%)', borderLeft: `${arrowSize}px solid transparent`, borderRight: `${arrowSize}px solid transparent`, borderBottom: `${arrowSize}px solid ${BRAND_BLUE}` };
        case 'top-right':
            return { ...baseStyles, top: 0, right: 10, transform: 'translate(0, -100%)', borderLeft: `${arrowSize}px solid transparent`, borderRight: `${arrowSize}px solid transparent`, borderBottom: `${arrowSize}px solid ${BRAND_BLUE}` };
        case 'bottom-left':
            return { ...baseStyles, bottom: 0, left: 10, transform: 'translate(0, 100%)', borderLeft: `${arrowSize}px solid transparent`, borderRight: `${arrowSize}px solid transparent`, borderTop: `${arrowSize}px solid ${BRAND_BLUE}` };
        case 'bottom-right':
            return { ...baseStyles, bottom: 0, right: 10, transform: 'translate(0, 100%)', borderLeft: `${arrowSize}px solid transparent`, borderRight: `${arrowSize}px solid transparent`, borderTop: `${arrowSize}px solid ${BRAND_BLUE}` };
        default:
            return { ...baseStyles, left: 0, top: '50%', transform: 'translate(-100%, -50%)', borderTop: `${arrowSize}px solid transparent`, borderBottom: `${arrowSize}px solid transparent`, borderRight: `${arrowSize}px solid ${BRAND_BLUE}` };
    }
}

interface Screen {
    id: string;
    imageUrl: string;
    width: number | null;
    height: number | null;
    hotspots: Hotspot[];
}

interface ScreenCanvasProps {
    screen: Screen;
    mode: "hotspots" | "steps" | "preview";
    selectedHotspotId: string | null;
    onHotspotSelect: (id: string | null) => void;
    onHotspotCreate: (position: { x: number; y: number }) => void;
    onHotspotUpdate: (id: string, updates: Partial<Hotspot>, immediate?: boolean) => void;
    onHotspotDelete?: (id: string) => void;
    allScreens: Screen[];
    isAddingHotspot?: boolean;
}

export function ScreenCanvas({
    screen,
    mode,
    selectedHotspotId,
    onHotspotSelect,
    onHotspotCreate,
    onHotspotUpdate,
    onHotspotDelete,
    allScreens,
    isAddingHotspot = false,
}: ScreenCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
    const [resizeCorner, setResizeCorner] = useState<string | null>(null);
    const [isEditingText, setIsEditingText] = useState(false);
    const [editingLabel, setEditingLabel] = useState("");
    const [editingTooltip, setEditingTooltip] = useState("");
    const [editingCtaText, setEditingCtaText] = useState("");
    const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
    // Local state for the hotspot being dragged/resized to avoid frequent server updates
    const [localHotspot, setLocalHotspot] = useState<Partial<Hotspot> | null>(null);

    // Find selected hotspot from array
    const selectedHotspot = screen.hotspots.find(h => h.id === selectedHotspotId);

    // Use local hotspots for rendering during interaction, otherwise use props
    const getHotspotData = (h: Hotspot) => {
        if (activeHotspotId === h.id && localHotspot) {
            return { ...h, ...localHotspot };
        }
        return h;
    };

    const getRelativeCoords = useCallback((e: React.MouseEvent) => {
        if (!containerRef.current) return null;
        const rect = containerRef.current.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height,
        };
    }, []);

    const handleCanvasClick = (e: React.MouseEvent) => {
        if (mode !== "hotspots") return;
        if (!isAddingHotspot) return; // Only create when in "add mode"

        const target = e.target as HTMLElement;
        if (target.closest('[data-hotspot]') || target.closest('[data-tooltip]')) return;

        // Create new hotspot on click
        const coords = getRelativeCoords(e);
        if (coords) {
            onHotspotCreate({ x: coords.x, y: coords.y });
        }
    };

    const handleHotspotMouseDown = (e: React.MouseEvent, hotspot: Hotspot) => {
        if (mode !== "hotspots") return;
        e.stopPropagation();

        const coords = getRelativeCoords(e);
        if (coords) {
            setIsDragging(true);
            setActiveHotspotId(hotspot.id);
            setLocalHotspot({ x: hotspot.x, y: hotspot.y });
            setDragOffset({
                x: coords.x - hotspot.x,
                y: coords.y - hotspot.y,
            });
            onHotspotSelect(hotspot.id);
        }
    };

    const handleResizeMouseDown = (e: React.MouseEvent, corner: string, hotspot: Hotspot) => {
        if (mode !== "hotspots") return;
        e.stopPropagation();
        e.preventDefault();

        setIsResizing(true);
        setResizeCorner(corner);
        setActiveHotspotId(hotspot.id);
        setLocalHotspot({ x: hotspot.x, y: hotspot.y, w: hotspot.w, h: hotspot.h });
        onHotspotSelect(hotspot.id);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!activeHotspotId) return;
        const hotspot = screen.hotspots.find(h => h.id === activeHotspotId);
        if (!hotspot) return;

        const coords = getRelativeCoords(e);
        if (!coords) return;

        if (isDragging && dragOffset) {
            const newX = Math.max(0.02, Math.min(0.98, coords.x - dragOffset.x));
            const newY = Math.max(0.02, Math.min(0.98, coords.y - dragOffset.y));
            setLocalHotspot({ x: newX, y: newY });
        } else if (isResizing && resizeCorner) {
            // Use current visual state (props or localHotspot) as base
            const current = localHotspot || hotspot;
            let newW = current.w || 0;
            let newH = current.h || 0;
            let newX = current.x || 0;
            let newY = current.y || 0;

            const minSize = 0.02; // Reduced min size
            const maxSize = 0.8;

            if (resizeCorner.includes('e')) {
                newW = Math.max(minSize, Math.min(maxSize, coords.x - (current.x || 0) + (current.w || 0) / 2));
            }
            if (resizeCorner.includes('w')) {
                const deltaX = (current.x || 0) - coords.x;
                newW = Math.max(minSize, Math.min(maxSize, (current.w || 0) + deltaX));
                if (newW !== current.w) newX = coords.x;
            }
            if (resizeCorner.includes('s')) {
                newH = Math.max(minSize, Math.min(maxSize, coords.y - (current.y || 0) + (current.h || 0) / 2));
            }
            if (resizeCorner.includes('n')) {
                const deltaY = (current.y || 0) - coords.y;
                newH = Math.max(minSize, Math.min(maxSize, (current.h || 0) + deltaY));
                if (newH !== current.h) newY = coords.y;
            }

            setLocalHotspot({ x: newX, y: newY, w: newW, h: newH });
        }
    };

    const handleMouseUp = () => {
        if (activeHotspotId && localHotspot) {
            // Sync with parent and server ONLY on mouse up
            // Use 'true' to force immediate sync for coordinates
            onHotspotUpdate(activeHotspotId, localHotspot, true);
        }
        setIsDragging(false);
        setIsResizing(false);
        setDragOffset(null);
        setResizeCorner(null);
        setActiveHotspotId(null);
        setLocalHotspot(null);
    };

    const startEditing = (hotspot: Hotspot) => {
        setEditingLabel(hotspot.label || "");
        setEditingTooltip(hotspot.tooltipText || "");
        setEditingCtaText(hotspot.primaryCtaText || "");
        setIsEditingText(true);
        onHotspotSelect(hotspot.id);
    };

    const saveEditing = () => {
        if (!selectedHotspot) return;
        onHotspotUpdate(selectedHotspot.id, {
            label: editingLabel || null,
            tooltipText: editingTooltip || null,
            primaryCtaText: editingCtaText || null,
        });
        setIsEditingText(false);
    };

    const cancelEditing = () => {
        setIsEditingText(false);
        setEditingLabel("");
        setEditingTooltip("");
        setEditingCtaText("");
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative bg-white rounded-lg shadow-2xl overflow-hidden",
                "max-w-full max-h-full",
                isAddingHotspot && "cursor-crosshair"
            )}
            style={{
                aspectRatio: screen.width && screen.height
                    ? `${screen.width} / ${screen.height}`
                    : "16 / 9",
            }}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Screen Image */}
            <img
                src={screen.imageUrl}
                alt="Screen"
                className="w-full h-full object-contain pointer-events-none select-none"
                draggable={false}
            />

            {/* Hotspots - render all of them */}
            {screen.hotspots.map((hotspot, index) => {
                const displayHotspot = getHotspotData(hotspot);
                const isSelected = selectedHotspotId === hotspot.id;

                return (
                    <React.Fragment key={hotspot.id}>
                        {/* Resizable hotspot area (only in editor mode when selected) */}
                        {mode === "hotspots" && isSelected && (
                            <div
                                className="absolute border-2 border-dashed border-indigo-400 bg-indigo-500/10 pointer-events-none"
                                style={{
                                    left: `${(displayHotspot.x - displayHotspot.w / 2) * 100}%`,
                                    top: `${(displayHotspot.y - displayHotspot.h / 2) * 100}%`,
                                    width: `${displayHotspot.w * 100}%`,
                                    height: `${displayHotspot.h * 100}%`,
                                }}
                            >
                                {/* Resize handles */}
                                {['nw', 'ne', 'sw', 'se'].map((corner) => (
                                    <div
                                        key={corner}
                                        className={cn(
                                            "absolute w-3 h-3 bg-white border-2 border-indigo-500 rounded-full pointer-events-auto cursor-",
                                            corner === 'nw' && "-top-1.5 -left-1.5 cursor-nwse-resize",
                                            corner === 'ne' && "-top-1.5 -right-1.5 cursor-nesw-resize",
                                            corner === 'sw' && "-bottom-1.5 -left-1.5 cursor-nesw-resize",
                                            corner === 'se' && "-bottom-1.5 -right-1.5 cursor-nwse-resize"
                                        )}
                                        onMouseDown={(e) => handleResizeMouseDown(e, corner, hotspot)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Beacon point */}
                        <div
                            data-hotspot
                            className={cn(
                                "absolute transition-transform z-10",
                                isDragging && activeHotspotId === hotspot.id && "cursor-grabbing"
                            )}
                            style={{
                                left: `${displayHotspot.x * 100}%`,
                                top: `${displayHotspot.y * 100}%`,
                                transform: 'translate(-50%, -50%)',
                                opacity: (hotspot.type === "intro" || hotspot.type === "closing") ? 0.3 : 1,
                            }}
                            onMouseDown={(e) => handleHotspotMouseDown(e, hotspot)}
                        >
                            <div className="relative cursor-grab">
                                {/* Pulse ring - subtler and only in preview or non-dragging */}
                                {(!isDragging || activeHotspotId !== hotspot.id) && hotspot.type !== "intro" && hotspot.type !== "closing" && (
                                    <div
                                        className="absolute rounded-full animate-ping opacity-20"
                                        style={{
                                            backgroundColor: BRAND_BLUE,
                                            width: 32,
                                            height: 32,
                                            left: -16,
                                            top: -16,
                                        }}
                                    />
                                )}

                                {/* Main beacon */}
                                <div
                                    className={cn(
                                        "relative w-6 h-6 rounded-full flex items-center justify-center shadow-lg -translate-x-1/2 -translate-y-1/2",
                                        isSelected && "ring-4 ring-white/50 scale-110"
                                    )}
                                    style={{ backgroundColor: BRAND_BLUE }}
                                >
                                    <MousePointer2 className="w-3 h-3 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Tooltip Balloon or Modal Preview */}
                        {(isSelected || mode === "preview") && (() => {
                            if (hotspot.type === "action" || !hotspot.type) {
                                const tooltipPos = getTooltipTransform(hotspot.arrowPosition);
                                const arrowStyles = getArrowStyles(tooltipPos.arrowPosition);
                                const offsetX = (hotspot.offsetX || 0) / 100;
                                const offsetY = (hotspot.offsetY || 0) / 100;

                                return (
                                    <div
                                        data-tooltip
                                        className="absolute z-20"
                                        style={{
                                            left: `${(displayHotspot.x + offsetX) * 100}%`,
                                            top: `${(displayHotspot.y + offsetY) * 100}%`,
                                            transform: tooltipPos.transform,
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div style={arrowStyles} />
                                        <div
                                            className="rounded-xl shadow-2xl overflow-hidden"
                                            style={{
                                                backgroundColor: BRAND_BLUE,
                                                minWidth: 240,
                                                maxWidth: 300,
                                            }}
                                        >
                                            <div className="p-4">
                                                {isEditingText && mode === "hotspots" && isSelected ? (
                                                    <div className="space-y-2">
                                                        <textarea
                                                            value={editingTooltip}
                                                            onChange={(e) => setEditingTooltip(e.target.value)}
                                                            placeholder="Description..."
                                                            rows={3}
                                                            className="w-full px-2 py-1 text-sm bg-white/20 text-white placeholder-white/50 rounded border-0 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none font-medium"
                                                            autoFocus
                                                        />
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={saveEditing}
                                                                className="flex-1 py-1.5 text-xs font-semibold bg-white text-indigo-700 rounded hover:bg-neutral-100"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={cancelEditing}
                                                                className="flex-1 py-1.5 text-xs font-semibold bg-white/20 text-white rounded hover:bg-white/30"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div
                                                        onClick={() => mode === "hotspots" && startEditing(hotspot)}
                                                        className={cn(
                                                            mode === "hotspots" && "cursor-text hover:bg-white/5 -m-2 p-2 rounded-lg transition-colors"
                                                        )}
                                                    >
                                                        <p className="text-white/95 text-sm leading-relaxed font-semibold">
                                                            {hotspot.tooltipText || (mode === "hotspots" ? "Click to add description..." : "Click to continue")}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {mode === "hotspots" && isSelected && !isEditingText && (
                                                <div className="flex items-center justify-between px-4 py-2 bg-black/20 border-t border-white/10">
                                                    <span className="text-white/50 text-[10px]">Drag beacon to move</span>
                                                    {onHotspotDelete && (
                                                        <button
                                                            onClick={() => onHotspotDelete(hotspot.id)}
                                                            className="p-1.5 rounded hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                                                            title="Delete hotspot"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            } else if (mode === "hotspots" && isSelected) {
                                /* Intro/Closing Modal Preview in Editor - Smaller & Editable */
                                return (
                                    <div className="absolute inset-0 flex items-center justify-center z-50 p-6 pointer-events-none">
                                        <div className="absolute inset-0 bg-black/10 rounded-lg pointer-events-none" />
                                        <div className="pointer-events-auto w-full max-w-[320px] bg-white rounded-[24px] shadow-2xl p-6 text-center animate-in zoom-in-95 fade-in duration-300 border-t-4" style={{ borderColor: BRAND_BLUE }}>
                                            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-4 text-xl shadow-sm">
                                                {hotspot.type === "intro" ? "🎬" : "🎉"}
                                            </div>

                                            {isEditingText ? (
                                                <div className="space-y-3 mb-6">
                                                    <input
                                                        type="text"
                                                        value={editingLabel}
                                                        onChange={(e) => setEditingLabel(e.target.value)}
                                                        placeholder="Title..."
                                                        className="w-full px-3 py-2 text-lg font-bold text-neutral-900 bg-neutral-50 rounded-lg border-2 border-indigo-100 focus:border-indigo-500 focus:outline-none text-center"
                                                        autoFocus
                                                    />
                                                    <textarea
                                                        value={editingTooltip}
                                                        onChange={(e) => setEditingTooltip(e.target.value)}
                                                        placeholder="Description..."
                                                        rows={3}
                                                        className="w-full px-3 py-2 text-sm text-neutral-600 bg-neutral-50 rounded-lg border-2 border-indigo-100 focus:border-indigo-500 focus:outline-none resize-none text-center"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editingCtaText}
                                                        onChange={(e) => setEditingCtaText(e.target.value)}
                                                        placeholder="Button text..."
                                                        className="w-full px-3 py-2 text-xs font-bold text-center bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 focus:outline-none"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={saveEditing}
                                                            className="flex-1 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={cancelEditing}
                                                            className="flex-1 py-2 text-xs font-bold bg-neutral-100 text-neutral-600 rounded-lg hover:bg-neutral-200 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="cursor-text hover:bg-neutral-50 -mx-2 p-2 rounded-xl transition-colors mb-4"
                                                    onClick={() => startEditing(hotspot)}
                                                >
                                                    <h3 className="text-lg font-bold text-neutral-900 mb-1 tracking-tight">
                                                        {hotspot.label || (hotspot.type === "intro" ? "Welcome!" : "Complete!")}
                                                    </h3>
                                                    <p className="text-neutral-500 text-sm leading-relaxed line-clamp-3">
                                                        {hotspot.tooltipText || (hotspot.type === "intro" ? "Add a welcome message to greet your viewers." : "Add a closing message to finish the tour.")}
                                                    </p>
                                                </div>
                                            )}

                                            <div
                                                className="w-full py-3 px-6 rounded-xl text-white font-bold text-sm shadow-lg shadow-indigo-100 opacity-90 select-none"
                                                style={{ backgroundColor: BRAND_BLUE }}
                                            >
                                                {hotspot.primaryCtaText || (hotspot.type === "intro" ? "Start Tour" : "Got it!")}
                                            </div>
                                            <div className="mt-4 text-[9px] text-neutral-400 font-bold uppercase tracking-[0.2em] select-none">
                                                Click to edit content
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })()}
                    </React.Fragment>
                );
            })}

            {/* Mode Indicator */}
            {mode === "hotspots" && (
                <div className="absolute top-4 left-4 text-xs bg-black/60 text-white px-3 py-1.5 rounded-full backdrop-blur-sm">
                    Click to add hotspot • Drag beacon to move
                </div>
            )}

            {/* Hotspot count */}
            {mode === "hotspots" && screen.hotspots.length > 0 && (
                <div className="absolute top-4 right-4 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-full">
                    {screen.hotspots.length} Hotspot{screen.hotspots.length > 1 ? 's' : ''}
                </div>
            )}
        </div>
    );
}

