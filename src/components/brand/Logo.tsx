"use client";

import Link from "next/link";

export function Logo({
    className = "",
    iconOnly = false,
    light = false
}: {
    className?: string;
    iconOnly?: boolean;
    light?: boolean;
}) {
    return (
        <Link href="/" className={`flex items-center gap-3 transition-opacity hover:opacity-90 ${className}`}>
            {/* Icon */}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-lg shadow-sm ${light ? "bg-white text-blue-600" : "bg-blue-600 text-white"
                }`}>
                {">_"}
            </div>

            {/* Wordmark */}
            {!iconOnly && (
                <span className={`font-sans font-extrabold text-2xl tracking-tighter ${light ? "text-white" : "text-neutral-900"
                    }`}>
                    ShipKit
                </span>
            )}
        </Link>
    );
}
