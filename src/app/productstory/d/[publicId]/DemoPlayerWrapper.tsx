"use client";

import { DemoPlayer } from "@/components/productstory/DemoPlayer";
import { useCallback } from "react";

interface Screen {
    id: string;
    order: number;
    imageUrl: string;
    hotspots: {
        id: string;
        type: string | null;
        targetScreenId: string | null;
        x: number;
        y: number;
        w: number;
        h: number;
        label: string | null;
        tooltipText: string | null;
    }[];
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

interface DemoPlayerWrapperProps {
    demoId: string;
    publicId: string;
    screens: Screen[];
    steps: Step[];
    showBranding: boolean;
}

export function DemoPlayerWrapper({ demoId, publicId, screens, steps, showBranding }: DemoPlayerWrapperProps) {
    // Generate viewer ID (persistent across sessions)
    const getViewerId = () => {
        if (typeof window === "undefined") return "";

        let viewerId = localStorage.getItem("ps_viewer_id");
        if (!viewerId) {
            viewerId = `v_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            localStorage.setItem("ps_viewer_id", viewerId);
        }
        return viewerId;
    };

    // Generate session ID (new for each page load)
    const sessionId = typeof window !== "undefined"
        ? `s_${Date.now()}_${Math.random().toString(36).substring(7)}`
        : "";

    const handleEvent = useCallback((event: {
        type: string;
        screenId?: string;
        hotspotId?: string;
        stepIndex?: number;
    }) => {
        // Send analytics event
        const payload = {
            demoId,
            publicId,
            viewerId: getViewerId(),
            sessionId,
            eventType: event.type,
            screenId: event.screenId,
            hotspotId: event.hotspotId,
            stepIndex: event.stepIndex,
            referrer: typeof window !== "undefined" ? document.referrer : "",
            userAgent: typeof window !== "undefined" ? navigator.userAgent : "",
        };

        // Use sendBeacon for reliability (or fetch as fallback)
        if (typeof navigator !== "undefined" && navigator.sendBeacon) {
            navigator.sendBeacon("/api/analytics/demo-events", JSON.stringify(payload));
        } else {
            fetch("/api/analytics/demo-events", {
                method: "POST",
                body: JSON.stringify(payload),
                keepalive: true,
            }).catch(console.error);
        }
    }, [demoId, publicId, sessionId]);

    return (
        <DemoPlayer
            screens={screens}
            steps={steps}
            showBranding={showBranding}
            onEvent={handleEvent}
        />
    );
}
