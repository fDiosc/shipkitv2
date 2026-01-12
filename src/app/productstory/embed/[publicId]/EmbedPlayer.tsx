"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { MousePointer2, ChevronLeft, ChevronRight } from "lucide-react";
import { EmbedResizeHandler } from "@/components/productstory/EmbedResizeHandler";

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
    arrowPosition?: string | null;
    offsetX?: number | null;
    offsetY?: number | null;
}

interface Screen {
    id: string;
    order: number;
    imageUrl: string;
    hotspots: Hotspot[];
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

interface EmbedPlayerProps {
    demoId: string;
    publicId: string;
    screens: Screen[];
    steps: Step[];
    showBranding: boolean;
    autoplay?: boolean;
}

function getTooltipTransform(position: string | null | undefined): { transform: string; arrowPosition: string } {
    const pos = position || "bottom-center";

    const transforms: Record<string, { transform: string; arrowPosition: string }> = {
        "top-left": { transform: "translate(-100%, -100%) translate(-8px, -8px)", arrowPosition: "bottom-right" },
        "top-center": { transform: "translate(-50%, -100%) translate(0, -8px)", arrowPosition: "bottom-center" },
        "top-right": { transform: "translate(0%, -100%) translate(8px, -8px)", arrowPosition: "bottom-left" },
        "middle-left": { transform: "translate(-100%, -50%) translate(-8px, 0)", arrowPosition: "right-center" },
        "middle-center": { transform: "translate(-50%, -50%)", arrowPosition: "none" },
        "middle-right": { transform: "translate(0%, -50%) translate(8px, 0)", arrowPosition: "left-center" },
        "bottom-left": { transform: "translate(-100%, 0%) translate(-8px, 8px)", arrowPosition: "top-right" },
        "bottom-center": { transform: "translate(-50%, 0%) translate(0, 8px)", arrowPosition: "top-center" },
        "bottom-right": { transform: "translate(0%, 0%) translate(8px, 8px)", arrowPosition: "top-left" },
    };

    return transforms[pos] || transforms["bottom-center"];
}

export function EmbedPlayer({
    demoId,
    publicId,
    screens,
    steps,
    showBranding,
    autoplay = false,
}: EmbedPlayerProps) {
    const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
    const [currentHotspotIndex, setCurrentHotspotIndex] = useState(0);

    const currentScreen = screens[currentScreenIndex];
    // Sort hotspots by orderInScreen
    const sortedHotspots = [...(currentScreen?.hotspots || [])].sort((a, b) =>
        ((a as any).orderInScreen ?? 0) - ((b as any).orderInScreen ?? 0)
    );
    const currentHotspot = sortedHotspots[currentHotspotIndex];
    const totalScreens = screens.length;

    // Reset hotspot index when screen changes
    useEffect(() => {
        setCurrentHotspotIndex(0);
    }, [currentScreenIndex]);

    // Handle clicking on hotspot - advance to next hotspot or next screen
    const handleHotspotClick = useCallback(() => {
        if (currentHotspotIndex < sortedHotspots.length - 1) {
            // More hotspots on this screen - advance to next hotspot
            setCurrentHotspotIndex(prev => prev + 1);
        } else {
            // Last hotspot on screen - go to next screen
            if (currentScreenIndex < screens.length - 1) {
                setCurrentScreenIndex(prev => prev + 1);
            }
        }
    }, [currentHotspotIndex, sortedHotspots.length, currentScreenIndex, screens.length]);

    const handlePrevious = useCallback(() => {
        if (currentHotspotIndex > 0) {
            // Go back to previous hotspot on same screen
            setCurrentHotspotIndex(prev => prev - 1);
        } else if (currentScreenIndex > 0) {
            // Go to previous screen's last hotspot
            const prevScreen = screens[currentScreenIndex - 1];
            const prevHotspots = prevScreen?.hotspots || [];
            setCurrentScreenIndex(prev => prev - 1);
            setCurrentHotspotIndex(prevHotspots.length > 0 ? prevHotspots.length - 1 : 0);
        }
    }, [currentHotspotIndex, currentScreenIndex, screens]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" || e.key === " ") {
                e.preventDefault();
                handleHotspotClick();
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                handlePrevious();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleHotspotClick, handlePrevious]);

    // Track view event
    useEffect(() => {
        const viewerId = (() => {
            if (typeof window === "undefined") return "";
            let id = localStorage.getItem("ps_viewer_id");
            if (!id) {
                id = `v_${Date.now()}_${Math.random().toString(36).substring(7)}`;
                localStorage.setItem("ps_viewer_id", id);
            }
            return id;
        })();

        const sessionId = `s_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        const payload = {
            demoId,
            publicId,
            viewerId,
            sessionId,
            eventType: "demo_view",
            referrer: document.referrer,
            userAgent: navigator.userAgent,
        };

        try {
            if (navigator.sendBeacon) {
                navigator.sendBeacon("/api/analytics/demo-events", JSON.stringify(payload));
            } else {
                fetch("/api/analytics/demo-events", {
                    method: "POST",
                    body: JSON.stringify(payload),
                    keepalive: true,
                });
            }
        } catch (e) {
            console.error("Analytics error:", e);
        }
    }, [demoId, publicId]);

    if (!currentScreen) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white">
                <p>No screens available</p>
            </div>
        );
    }

    const tooltipPos = getTooltipTransform(currentHotspot?.arrowPosition);

    const progress = ((currentHotspotIndex + 1) / (sortedHotspots.length || 1)) * 100;

    return (
        <>
            <EmbedResizeHandler />

            <div className="relative bg-[#F9FAFB] min-h-screen flex flex-col items-center justify-center p-4">
                {/* Main demo area */}
                <div className="flex-1 flex items-center justify-center w-full max-w-5xl mx-auto py-4 overflow-hidden">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Screen image with premium shadow */}
                        <img
                            src={currentScreen.imageUrl}
                            alt={`Step ${currentScreenIndex + 1}`}
                            className="max-w-full max-h-[calc(100vh-120px)] object-contain rounded-xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.15)] bg-white"
                        />

                        {/* Current Hotspot/Modal Rendering */}
                        {currentHotspot && (
                            <>
                                {/* Backdrop for Intro/Closing Modals */}
                                {(currentHotspot.type === "intro" || currentHotspot.type === "closing") && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-40 rounded-xl animate-in fade-in duration-300" />
                                )}

                                {currentHotspot.type === "action" || !currentHotspot.type ? (
                                    /* Standard Action Hotspot - Pulsing Beacon + Tooltip */
                                    <div
                                        className="absolute z-30"
                                        style={{
                                            left: `${currentHotspot.x * 100}%`,
                                            top: `${currentHotspot.y * 100}%`,
                                        }}
                                    >
                                        <div className="relative">
                                            <div
                                                className="absolute rounded-full animate-ping opacity-30"
                                                style={{
                                                    backgroundColor: BRAND_BLUE,
                                                    width: 32,
                                                    height: 32,
                                                    left: -16,
                                                    top: -16,
                                                }}
                                            />

                                            {/* Main beacon */}
                                            <div
                                                className="relative w-7 h-7 rounded-full flex items-center justify-center shadow-lg -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 active:scale-95 transition-transform border-2 border-white"
                                                style={{ backgroundColor: BRAND_BLUE }}
                                                onClick={handleHotspotClick}
                                            >
                                                <MousePointer2 className="w-3.5 h-3.5 text-white" />
                                            </div>
                                        </div>

                                        {/* Tooltip Balloon */}
                                        <div
                                            className="absolute z-20"
                                            style={{
                                                left: 0,
                                                top: 0,
                                                transform: tooltipPos.transform,
                                            }}
                                        >
                                            <div
                                                className="rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.25)] overflow-hidden"
                                                style={{
                                                    backgroundColor: BRAND_BLUE,
                                                    minWidth: 220,
                                                    maxWidth: 280,
                                                }}
                                            >
                                                <p className="text-white font-bold text-xs leading-relaxed">
                                                    {currentHotspot.tooltipText || "Click the hotspot to continue."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Intro/Closing Modal - Centered for Embed */
                                    <div className="absolute inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                                        <div
                                            className="pointer-events-auto w-full max-w-[280px] bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 fade-in duration-300"
                                            style={{ borderTop: `3px solid ${BRAND_BLUE}` }}
                                        >
                                            <div className="p-6 text-center">
                                                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-4 text-xl shadow-sm">
                                                    {currentHotspot.type === "intro" ? "🎬" : "🎉"}
                                                </div>

                                                <h3 className="text-base font-bold text-neutral-900 mb-2 tracking-tight">
                                                    {currentHotspot.label || (currentHotspot.type === "intro" ? "Welcome!" : "Thanks!")}
                                                </h3>

                                                <p className="text-neutral-600 text-[13px] leading-snug mb-6">
                                                    {currentHotspot.tooltipText || (currentHotspot.type === "intro"
                                                        ? "Explore our quick product tour."
                                                        : "Tour completed!")}
                                                </p>

                                                <button
                                                    onClick={handleHotspotClick}
                                                    className="w-full py-3 px-4 rounded-xl text-white font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-indigo-100"
                                                    style={{ backgroundColor: BRAND_BLUE }}
                                                >
                                                    {currentHotspot.primaryCtaText || (currentHotspot.type === "intro" ? "Start Tour" : "Got it!")}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Navigation arrows - Floating & subtle, kept inside for embed safety */}
                        {(currentScreenIndex > 0 || currentHotspotIndex > 0) && (
                            <button
                                onClick={handlePrevious}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-neutral-200 text-neutral-600 shadow-xl hover:text-indigo-600 transition-all hover:scale-110 z-30"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        )}
                        {(currentScreenIndex < screens.length - 1 || currentHotspotIndex < sortedHotspots.length - 1) && (
                            <button
                                onClick={handleHotspotClick}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-neutral-200 text-neutral-600 shadow-xl hover:text-indigo-600 transition-all hover:scale-110 z-30"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Bottom Controls Area */}
                <div className="w-full max-w-4xl flex flex-col items-center gap-3 pb-4">
                    {/* Segmented Progress Bar */}
                    <div className="w-full flex gap-1 h-1 px-4">
                        {screens.map((_, idx) => {
                            const isCompleted = idx < currentScreenIndex;
                            const isCurrent = idx === currentScreenIndex;
                            return (
                                <div
                                    key={idx}
                                    className="flex-1 h-full rounded-full bg-neutral-200 overflow-hidden cursor-pointer"
                                    onClick={() => {
                                        setCurrentScreenIndex(idx);
                                        setCurrentHotspotIndex(0);
                                    }}
                                >
                                    <div
                                        className={cn(
                                            "h-full transition-all duration-500 ease-out bg-indigo-600",
                                            isCompleted ? "w-full" : isCurrent ? "" : "w-0"
                                        )}
                                        style={{ width: isCurrent ? `${progress}%` : isCompleted ? "100%" : "0%" }}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Branding & CTA */}
                    <div className="w-full flex items-center justify-between px-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-indigo-600 rounded flex items-center justify-center">
                                <span className="text-[8px] text-white font-bold">S</span>
                            </div>
                            <span className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider">ShipKit</span>
                        </div>

                        {showBranding && (
                            <a
                                href="https://shipkit.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-bold text-neutral-400 hover:text-indigo-600 transition-colors uppercase tracking-widest flex items-center gap-1.5"
                            >
                                Get your own demo
                                <ChevronRight className="w-3 h-3" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
