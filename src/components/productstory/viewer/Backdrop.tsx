"use client";

interface BackdropProps {
    targetRect: {
        x: number;      // Relative 0-1
        y: number;      // Relative 0-1
        w: number;      // Relative 0-1
        h: number;      // Relative 0-1
    } | null;
    enabled: boolean;
    opacity: number;
    color: string;
    spotlightEnabled?: boolean;
    spotlightColor?: string;
    spotlightPadding?: number;
    containerWidth: number;
    containerHeight: number;
}

/**
 * Backdrop with SVG mask to create spotlight effect around hotspot target.
 * Uses native SVG mask for smooth cutout with border-radius support.
 */
export function Backdrop({
    targetRect,
    enabled,
    opacity,
    color,
    spotlightEnabled = false,
    spotlightColor = "#7C3AED",
    spotlightPadding = 8,
    containerWidth,
    containerHeight,
}: BackdropProps) {
    if (!enabled || !targetRect) return null;

    // Convert relative coordinates to absolute pixels
    const x = targetRect.x * containerWidth;
    const y = targetRect.y * containerHeight;
    const w = targetRect.w * containerWidth;
    const h = targetRect.h * containerHeight;

    // Padding for the cutout
    const padding = 4;

    return (
        <svg
            className="absolute inset-0 pointer-events-none z-40"
            width={containerWidth}
            height={containerHeight}
            style={{ opacity }}
        >
            <defs>
                {/* Mask: white = visible, black = transparent (cutout) */}
                <mask id="backdrop-mask">
                    {/* Full white rectangle (backdrop visible everywhere) */}
                    <rect width="100%" height="100%" fill="white" />

                    {/* Black rectangle creates the cutout hole */}
                    <rect
                        x={x - padding}
                        y={y - padding}
                        width={w + padding * 2}
                        height={h + padding * 2}
                        rx={8}
                        fill="black"
                    />
                </mask>
            </defs>

            {/* Backdrop overlay with cutout */}
            <rect
                width="100%"
                height="100%"
                fill={color}
                mask="url(#backdrop-mask)"
            />

            {/* Spotlight border (optional) */}
            {spotlightEnabled && (
                <rect
                    x={x - spotlightPadding}
                    y={y - spotlightPadding}
                    width={w + spotlightPadding * 2}
                    height={h + spotlightPadding * 2}
                    rx={8}
                    fill="none"
                    stroke={spotlightColor}
                    strokeWidth={3}
                    className="animate-pulse"
                />
            )}
        </svg>
    );
}
