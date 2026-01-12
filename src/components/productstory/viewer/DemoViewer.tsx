"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { Backdrop } from "./Backdrop";
import { cn } from "@/lib/utils";

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
    htmlContent: string | null;
    backgroundColor: string | null;
    textColor: string | null;
    hotspotColor: string | null;
    fontFamily: string | null;
    fontSize: string | null;
    borderRadius: number | null;
    backdropEnabled: boolean | null;
    backdropOpacity: number | null;
    backdropColor: string | null;
    spotlightEnabled: boolean | null;
    spotlightColor: string | null;
    spotlightPadding: number | null;
    primaryCtaEnabled: boolean | null;
    primaryCtaText?: string | null;
    primaryCtaAction: string | null;
    secondaryCtaEnabled: boolean | null;
    secondaryCtaText: string | null;
    secondaryCtaUrl: string | null;
    showStepNumber: boolean | null;
    showPreviousButton: boolean | null;
    autoAdvanceEnabled: boolean | null;
    autoAdvanceDelay: number | null;
    arrowPosition: string | null;
}

interface Screen {
    id: string;
    order: number;
    imageUrl: string;
    width: number | null;
    height: number | null;
    hotspots: Hotspot[];
}

interface Step {
    id: string;
    order: number;
    screenId: string;
    hotspotId: string | null;
    title: string | null;
    body: string | null;
}

interface DemoViewerProps {
    screens: Screen[];
    steps: Step[];
    showBranding?: boolean;
    autoPlay?: boolean;
    onEvent?: (event: string, data?: Record<string, any>) => void;
}

export function DemoViewer({
    screens,
    steps,
    showBranding = true,
    autoPlay = false,
    onEvent,
}: DemoViewerProps) {
    const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
    const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const sortedScreens = [...screens].sort((a, b) => a.order - b.order);
    const currentScreen = sortedScreens[currentScreenIndex];
    const totalScreens = sortedScreens.length;

    // Measure container size
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                setContainerSize({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Auto-advance when activeHotspot has autoAdvance enabled
    useEffect(() => {
        if (activeHotspot?.autoAdvanceEnabled) {
            const delay = (activeHotspot.autoAdvanceDelay ?? 5) * 1000;
            const timer = setTimeout(() => {
                goToNextScreen();
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [activeHotspot, currentScreenIndex]);

    // Track view event
    useEffect(() => {
        onEvent?.('view', { screenId: currentScreen?.id, screenIndex: currentScreenIndex });
    }, [currentScreenIndex, currentScreen?.id, onEvent]);

    const goToNextScreen = useCallback(() => {
        if (currentScreenIndex < totalScreens - 1) {
            setCurrentScreenIndex(prev => prev + 1);
            setActiveHotspot(null);
        }
    }, [currentScreenIndex, totalScreens]);

    const goToPrevScreen = useCallback(() => {
        if (currentScreenIndex > 0) {
            setCurrentScreenIndex(prev => prev - 1);
            setActiveHotspot(null);
        }
    }, [currentScreenIndex]);

    const handleHotspotClick = useCallback((hotspot: Hotspot) => {
        onEvent?.('hotspot_click', { hotspotId: hotspot.id, screenId: currentScreen?.id });

        if (hotspot.type === 'navigate' && hotspot.targetScreenId) {
            const targetIndex = sortedScreens.findIndex(s => s.id === hotspot.targetScreenId);
            if (targetIndex !== -1) {
                setCurrentScreenIndex(targetIndex);
                setActiveHotspot(null);
            }
        } else if (hotspot.type === 'tooltip') {
            setActiveHotspot(activeHotspot?.id === hotspot.id ? null : hotspot);
        } else {
            // Default: go to next screen
            goToNextScreen();
        }
    }, [sortedScreens, currentScreen, activeHotspot, goToNextScreen, onEvent]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            goToNextScreen();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goToPrevScreen();
        } else if (e.key === 'Escape') {
            setActiveHotspot(null);
            if (isFullscreen) setIsFullscreen(false);
        }
    }, [goToNextScreen, goToPrevScreen, isFullscreen]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    if (!currentScreen) {
        return (
            <div className="flex items-center justify-center h-full bg-neutral-900 text-neutral-400">
                No screens to display
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full bg-neutral-900 overflow-hidden flex flex-col"
        >
            {/* Main Content */}
            <div className="flex-1 relative flex items-center justify-center p-4 md:p-8">
                {/* Screenshot */}
                <div className="relative max-w-full max-h-full">
                    <img
                        src={currentScreen.imageUrl}
                        alt={`Screen ${currentScreenIndex + 1}`}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        draggable={false}
                    />

                    {/* Backdrop for active tooltip */}
                    {activeHotspot && activeHotspot.backdropEnabled !== false && (
                        <Backdrop
                            targetRect={{
                                x: activeHotspot.x,
                                y: activeHotspot.y,
                                w: activeHotspot.w,
                                h: activeHotspot.h,
                            }}
                            enabled={true}
                            opacity={activeHotspot.backdropOpacity ?? 0.6}
                            color={activeHotspot.backdropColor || "#000000"}
                            spotlightEnabled={activeHotspot.spotlightEnabled ?? false}
                            spotlightColor={activeHotspot.spotlightColor || "#7C3AED"}
                            spotlightPadding={activeHotspot.spotlightPadding ?? 8}
                            containerWidth={containerSize.width}
                            containerHeight={containerSize.height}
                        />
                    )}

                    {/* Hotspots */}
                    {currentScreen.hotspots.map((hotspot) => (
                        <button
                            key={hotspot.id}
                            onClick={() => handleHotspotClick(hotspot)}
                            className={cn(
                                "absolute transition-all cursor-pointer group",
                                activeHotspot?.id === hotspot.id && "z-50"
                            )}
                            style={{
                                left: `${hotspot.x * 100}%`,
                                top: `${hotspot.y * 100}%`,
                                width: `${hotspot.w * 100}%`,
                                height: `${hotspot.h * 100}%`,
                            }}
                        >
                            {/* Pulsing beacon */}
                            <div
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full animate-pulse"
                                style={{
                                    backgroundColor: hotspot.hotspotColor || "#7C3AED",
                                    boxShadow: `0 0 0 4px ${hotspot.hotspotColor || "#7C3AED"}40`,
                                }}
                            />

                            {/* Tooltip */}
                            {activeHotspot?.id === hotspot.id && (
                                <div
                                    className="absolute z-50 min-w-[200px] max-w-[300px] rounded-lg shadow-xl p-4"
                                    style={{
                                        backgroundColor: hotspot.backgroundColor || "#7C3AED",
                                        color: hotspot.textColor || "#FFFFFF",
                                        fontFamily: hotspot.fontFamily || "Inter",
                                        borderRadius: `${hotspot.borderRadius ?? 8}px`,
                                        left: '100%',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        marginLeft: '12px',
                                    }}
                                >
                                    {/* Arrow */}
                                    <div
                                        className="absolute w-3 h-3 rotate-45"
                                        style={{
                                            backgroundColor: hotspot.backgroundColor || "#7C3AED",
                                            left: '-6px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                        }}
                                    />

                                    {/* Step number */}
                                    {hotspot.showStepNumber !== false && (
                                        <div className="text-xs opacity-70 mb-2">
                                            {currentScreenIndex + 1} of {totalScreens}
                                        </div>
                                    )}

                                    {/* Content */}
                                    {hotspot.htmlContent ? (
                                        <div
                                            dangerouslySetInnerHTML={{ __html: hotspot.htmlContent }}
                                            className="prose prose-sm prose-invert"
                                        />
                                    ) : (
                                        <>
                                            {hotspot.label && (
                                                <h4 className="font-semibold text-sm mb-1">{hotspot.label}</h4>
                                            )}
                                            {hotspot.tooltipText && (
                                                <p className="text-sm opacity-90">{hotspot.tooltipText}</p>
                                            )}
                                        </>
                                    )}

                                    {/* CTAs */}
                                    <div className="flex items-center gap-2 mt-3">
                                        {hotspot.showPreviousButton && currentScreenIndex > 0 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    goToPrevScreen();
                                                }}
                                                className="px-3 py-1.5 text-xs font-medium rounded bg-white/20 hover:bg-white/30 transition-colors"
                                            >
                                                Back
                                            </button>
                                        )}
                                        {hotspot.secondaryCtaEnabled && hotspot.secondaryCtaText && (
                                            <a
                                                href={hotspot.secondaryCtaUrl || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="px-3 py-1.5 text-xs font-medium rounded bg-white/20 hover:bg-white/30 transition-colors"
                                            >
                                                {hotspot.secondaryCtaText}
                                            </a>
                                        )}
                                        {hotspot.primaryCtaEnabled !== false && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    goToNextScreen();
                                                }}
                                                className="px-4 py-1.5 text-xs font-medium rounded bg-white text-neutral-900 hover:bg-neutral-100 transition-colors"
                                            >
                                                {hotspot.primaryCtaText || "Next"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="relative z-50 flex items-center justify-between p-4 bg-neutral-900/80 backdrop-blur-sm">
                {/* Navigation Arrows */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={goToPrevScreen}
                        disabled={currentScreenIndex === 0}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={goToNextScreen}
                        disabled={currentScreenIndex === totalScreens - 1}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Step Indicators */}
                <div className="flex items-center gap-1.5">
                    {sortedScreens.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCurrentScreenIndex(index);
                                setActiveHotspot(null);
                            }}
                            className={cn(
                                "transition-all duration-200 rounded-full",
                                index === currentScreenIndex
                                    ? "w-6 h-2 bg-violet-500"
                                    : "w-2 h-2 bg-white/40 hover:bg-white/60"
                            )}
                        />
                    ))}
                </div>

                {/* Fullscreen + Branding */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                        {isFullscreen ? (
                            <Minimize2 className="w-4 h-4" />
                        ) : (
                            <Maximize2 className="w-4 h-4" />
                        )}
                    </button>

                    {showBranding && (
                        <a
                            href="https://shipkit.app/productstory"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-white/50 hover:text-white/70 transition-colors"
                        >
                            Made with ProductStory
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
