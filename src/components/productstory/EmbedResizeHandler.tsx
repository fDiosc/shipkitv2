"use client";

import { useEffect, useRef } from "react";

/**
 * Component that sends resize messages to the parent window
 * for proper iframe embedding support
 */
export function EmbedResizeHandler() {
    const lastHeight = useRef(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const sendHeight = () => {
            const height = document.documentElement.scrollHeight;

            // Only send if height changed significantly (avoid jitter)
            if (Math.abs(height - lastHeight.current) > 5) {
                lastHeight.current = height;
                window.parent.postMessage({
                    type: 'productstory:resize',
                    height,
                    source: 'productstory-embed',
                }, '*');
            }
        };

        // Initial send
        sendHeight();

        // Use ResizeObserver for efficient detection
        const observer = new ResizeObserver(() => {
            sendHeight();
        });
        observer.observe(document.body);

        // Also poll periodically as fallback (for dynamic content)
        intervalRef.current = setInterval(sendHeight, 1000);

        // Send ready event
        window.parent.postMessage({
            type: 'productstory:ready',
            source: 'productstory-embed',
        }, '*');

        return () => {
            observer.disconnect();
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return null;
}
