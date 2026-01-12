"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MousePointer2 } from "lucide-react";

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

interface DemoPlayerProps {
    screens: Screen[];
    steps: Step[];
    showBranding?: boolean;
    onEvent?: (event: {
        type: string;
        screenId?: string;
        hotspotId?: string;
        stepIndex?: number;
    }) => void;
}

// Get tooltip position based on arrow position
function getTooltipTransform(position: string | null): { transform: string; arrowPosition: string } {
    const pos = position || 'middle-right';

    switch (pos) {
        case 'top-left':
            return { transform: 'translate(-100%, -100%) translate(-15px, -15px)', arrowPosition: 'bottom-right' };
        case 'top-center':
            return { transform: 'translate(-50%, -100%) translate(0, -15px)', arrowPosition: 'bottom-center' };
        case 'top-right':
            return { transform: 'translate(0%, -100%) translate(15px, -15px)', arrowPosition: 'bottom-left' };
        case 'middle-left':
            return { transform: 'translate(-100%, -50%) translate(-15px, 0)', arrowPosition: 'middle-right' };
        case 'middle-right':
            return { transform: 'translate(0%, -50%) translate(15px, 0)', arrowPosition: 'middle-left' };
        case 'bottom-left':
            return { transform: 'translate(-100%, 0%) translate(-15px, 15px)', arrowPosition: 'top-right' };
        case 'bottom-center':
            return { transform: 'translate(-50%, 0%) translate(0, 15px)', arrowPosition: 'top-center' };
        case 'bottom-right':
            return { transform: 'translate(0%, 0%) translate(15px, 15px)', arrowPosition: 'top-left' };
        default:
            return { transform: 'translate(0%, -50%) translate(15px, 0)', arrowPosition: 'middle-left' };
    }
}

// Get arrow styles
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
        default:
            return { ...baseStyles, left: 0, top: '50%', transform: 'translate(-100%, -50%)', borderTop: `${arrowSize}px solid transparent`, borderBottom: `${arrowSize}px solid transparent`, borderRight: `${arrowSize}px solid ${BRAND_BLUE}` };
    }
}

export function DemoPlayer({ screens, steps, showBranding = true, onEvent }: DemoPlayerProps) {
    const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
    const [currentHotspotIndex, setCurrentHotspotIndex] = useState(0);

    const currentScreen = screens[currentScreenIndex];
    // Sort hotspots by orderInScreen (or fallback to array order)
    const sortedHotspots = [...(currentScreen?.hotspots || [])].sort((a, b) =>
        ((a as any).orderInScreen ?? 0) - ((b as any).orderInScreen ?? 0)
    );
    const currentHotspot = sortedHotspots[currentHotspotIndex];
    const totalScreens = screens.length;

    // Track demo view on mount
    useEffect(() => {
        onEvent?.({ type: "demo_view" });
    }, []);

    // Reset hotspot index when screen changes
    useEffect(() => {
        setCurrentHotspotIndex(0);
    }, [currentScreenIndex]);

    // Track screen view
    useEffect(() => {
        if (currentScreen) {
            onEvent?.({ type: "screen_view", screenId: currentScreen.id });
        }
    }, [currentScreenIndex, currentScreen]);

    // Handle clicking on hotspot - advance to next hotspot or next screen
    const handleHotspotClick = useCallback(() => {
        if (currentHotspotIndex < sortedHotspots.length - 1) {
            // More hotspots on this screen - advance to next hotspot
            setCurrentHotspotIndex(prev => prev + 1);
            onEvent?.({ type: "hotspot_click", hotspotId: currentHotspot?.id });
        } else {
            // Last hotspot on screen - go to next screen
            if (currentScreenIndex < screens.length - 1) {
                setCurrentScreenIndex(prev => prev + 1);
                // Note: setCurrentHotspotIndex(0) happens via useEffect above
                onEvent?.({ type: "step_next", stepIndex: currentScreenIndex + 1 });
            } else {
                onEvent?.({ type: "demo_complete" });
            }
        }
    }, [currentHotspotIndex, sortedHotspots.length, currentScreenIndex, screens.length, currentHotspot, onEvent]);

    const handlePrev = useCallback(() => {
        if (currentHotspotIndex > 0) {
            // Go back to previous hotspot on same screen
            setCurrentHotspotIndex(prev => prev - 1);
        } else if (currentScreenIndex > 0) {
            // Go to previous screen's last hotspot
            const prevScreen = screens[currentScreenIndex - 1];
            const prevHotspots = prevScreen?.hotspots || [];
            setCurrentScreenIndex(prev => prev - 1);
            setCurrentHotspotIndex(prevHotspots.length > 0 ? prevHotspots.length - 1 : 0);
            onEvent?.({ type: "step_back", stepIndex: currentScreenIndex - 1 });
        }
    }, [currentHotspotIndex, currentScreenIndex, screens, onEvent]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                handleHotspotClick();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                handlePrev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleHotspotClick, handlePrev]);

    if (!currentScreen) {
        return (
            <div className="flex items-center justify-center h-full bg-neutral-900 text-white">
                <p>No screens available</p>
            </div>
        );
    }

    const tooltipPos = getTooltipTransform(currentHotspot?.arrowPosition ?? null);
    const arrowStyles = getArrowStyles(tooltipPos.arrowPosition);

    const progress = ((currentHotspotIndex + 1) / (sortedHotspots.length || 1)) * 100;

    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center p-4 md:p-8">
            {/* Screen Container */}
            <div className="relative flex-1 flex items-center justify-center w-full max-w-6xl mx-auto mb-12">
                {/* Screen Image with Premium Shadow */}
                <img
                    src={currentScreen.imageUrl}
                    alt={`Demo screen ${currentScreenIndex + 1}`}
                    className="max-w-full max-h-[calc(100vh-160px)] object-contain rounded-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] bg-white"
                    draggable={false}
                />

                {/* Current Hotspot/Modal Rendering */}
                {currentHotspot && (
                    <>
                        {/* Backdrop for Intro/Closing Modals */}
                        {(currentHotspot.type === "intro" || currentHotspot.type === "closing") && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-40 rounded-xl transition-all duration-500 animate-in fade-in" />
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
                                {/* Pulsing Beacon */}
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
                                    <div style={arrowStyles} />
                                    <div
                                        className="rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden"
                                        style={{
                                            backgroundColor: BRAND_BLUE,
                                            minWidth: 240,
                                            maxWidth: 320,
                                        }}
                                    >
                                        <div className="p-5">
                                            <p className="text-white font-bold text-sm leading-relaxed">
                                                {currentHotspot.tooltipText || "Click the hotspot to continue the tour."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Intro/Closing Modal - Centered */
                            <div className="absolute inset-0 flex items-center justify-center z-50 p-6 pointer-events-none">
                                <div
                                    className="pointer-events-auto w-full max-w-md bg-white rounded-3xl shadow-[0_24px_50px_rgba(0,0,0,0.25)] overflow-hidden animate-in zoom-in-95 fade-in duration-300"
                                    style={{
                                        borderTop: `4px solid ${BRAND_BLUE}`
                                    }}
                                >
                                    <div className="p-8 text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-6 text-2xl shadow-sm">
                                            {currentHotspot.type === "intro" ? "🎬" : "🎉"}
                                        </div>

                                        <h3 className="text-2xl font-bold text-neutral-900 mb-3 tracking-tight">
                                            {currentHotspot.label || (currentHotspot.type === "intro" ? "Welcome!" : "Thanks for watching!")}
                                        </h3>

                                        <p className="text-neutral-600 text-[15px] leading-relaxed mb-8">
                                            {currentHotspot.tooltipText || (currentHotspot.type === "intro"
                                                ? "Get ready for a quick tour of our product. Click below to start!"
                                                : "You've successfully completed the product story tour.")}
                                        </p>

                                        <button
                                            onClick={handleHotspotClick}
                                            className="w-full py-4 px-6 rounded-2xl text-white font-bold text-base transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-200"
                                            style={{ backgroundColor: BRAND_BLUE }}
                                        >
                                            {currentHotspot.primaryCtaText || (currentHotspot.type === "intro" ? "Start Tour" : "Complete")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Bottom Controls Area */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center gap-4 bg-gradient-to-t from-neutral-100/50 to-transparent pointer-events-none">

                {/* Segmented Progress Bar - One segment per screen */}
                <div className="w-full max-w-4xl flex gap-1.5 h-1.5 px-4 pointer-events-auto">
                    {screens.map((_, idx) => {
                        const isCompleted = idx < currentScreenIndex;
                        const isCurrent = idx === currentScreenIndex;

                        return (
                            <div
                                key={idx}
                                className="flex-1 h-full rounded-full bg-neutral-200/80 overflow-hidden cursor-pointer group"
                                onClick={() => {
                                    setCurrentScreenIndex(idx);
                                    setCurrentHotspotIndex(0);
                                }}
                            >
                                <div
                                    className={cn(
                                        "h-full transition-all duration-500 ease-out",
                                        isCompleted ? "w-full bg-indigo-600" :
                                            isCurrent ? "bg-indigo-600" : "w-0 bg-neutral-300"
                                    )}
                                    style={{
                                        width: isCurrent ? `${progress}%` : isCompleted ? "100%" : "0%"
                                    }}
                                />
                                {/* Hover tooltip or indicator could go here */}
                            </div>
                        );
                    })}
                </div>

                {/* Footer Controls */}
                <div className="w-full max-w-4xl flex items-center justify-between px-4 pointer-events-auto">
                    {/* Left: Branding */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg shadow-sm">
                            <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center">
                                <span className="text-[10px] text-white font-bold">S</span>
                            </div>
                            <span className="text-xs font-bold text-neutral-800 tracking-tight">ShipKit</span>
                        </div>
                        {showBranding && (
                            <span className="text-[10px] text-neutral-400 font-medium hidden sm:block uppercase tracking-widest">
                                Powered by ProductStory
                            </span>
                        )}
                    </div>

                    {/* Right: CTA */}
                    <a
                        href="https://shipkit.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-full text-xs font-bold shadow-lg hover:bg-neutral-800 transition-all hover:scale-105"
                    >
                        <span>Try ShipKit Free</span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </a>
                </div>
            </div>

            {/* Navigation Arrows - Subtler and floating */}
            <div className="fixed inset-y-0 left-0 right-0 pointer-events-none flex items-center justify-between px-4 md:px-8">
                <button
                    onClick={handlePrev}
                    disabled={currentScreenIndex === 0 && currentHotspotIndex === 0}
                    className={cn(
                        "pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md border border-neutral-200 text-neutral-600 shadow-xl transition-all",
                        currentScreenIndex === 0 && currentHotspotIndex === 0 ? "opacity-0 invisible" : "hover:bg-white hover:text-indigo-600 hover:scale-110 active:scale-95"
                    )}
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={handleHotspotClick}
                    disabled={currentScreenIndex === screens.length - 1 && currentHotspotIndex === sortedHotspots.length - 1}
                    className={cn(
                        "pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md border border-neutral-200 text-neutral-600 shadow-xl transition-all",
                        currentScreenIndex === screens.length - 1 && currentHotspotIndex === sortedHotspots.length - 1 ? "opacity-0 invisible" : "hover:bg-white hover:text-indigo-600 hover:scale-110 active:scale-95"
                    )}
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}

