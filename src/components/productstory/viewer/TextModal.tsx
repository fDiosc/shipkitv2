"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TextModalProps {
    title?: string;
    content: string; // HTML content
    backgroundColor?: string;
    textColor?: string;
    fontFamily?: string;
    borderRadius?: number;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    secondaryButtonUrl?: string;
    showStepNumber?: boolean;
    currentStep?: number;
    totalSteps?: number;
    onPrimary: () => void;
    onSecondary?: () => void;
    onClose?: () => void;
}

export function TextModal({
    title,
    content,
    backgroundColor = "#7C3AED",
    textColor = "#FFFFFF",
    fontFamily = "Inter",
    borderRadius = 16,
    primaryButtonText = "Continue",
    secondaryButtonText,
    secondaryButtonUrl,
    showStepNumber = true,
    currentStep = 1,
    totalSteps = 1,
    onPrimary,
    onSecondary,
    onClose,
}: TextModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative z-10 w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                style={{
                    backgroundColor,
                    fontFamily,
                    borderRadius: `${borderRadius}px`,
                }}
            >
                {/* Close button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
                        style={{ color: textColor }}
                    >
                        <X className="w-5 h-5 opacity-70" />
                    </button>
                )}

                {/* Content */}
                <div className="p-8" style={{ color: textColor }}>
                    {/* Step indicator */}
                    {showStepNumber && (
                        <div className="text-sm opacity-70 mb-4">
                            Step {currentStep} of {totalSteps}
                        </div>
                    )}

                    {/* Title */}
                    {title && (
                        <h2 className="text-2xl font-bold mb-4">{title}</h2>
                    )}

                    {/* HTML Content */}
                    <div
                        dangerouslySetInnerHTML={{ __html: content }}
                        className="prose prose-invert prose-lg max-w-none"
                        style={{ color: textColor }}
                    />
                </div>

                {/* Footer */}
                <div className="px-8 pb-8 flex items-center justify-end gap-3">
                    {secondaryButtonText && (
                        secondaryButtonUrl ? (
                            <a
                                href={secondaryButtonUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2.5 text-sm font-medium rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                                style={{ color: textColor }}
                            >
                                {secondaryButtonText}
                            </a>
                        ) : (
                            <button
                                onClick={onSecondary}
                                className="px-5 py-2.5 text-sm font-medium rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                                style={{ color: textColor }}
                            >
                                {secondaryButtonText}
                            </button>
                        )
                    )}

                    <button
                        onClick={onPrimary}
                        className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-white text-neutral-900 hover:bg-neutral-100 transition-colors shadow-lg"
                    >
                        {primaryButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
}

/**
 * Media Modal variant with image/video support
 */
export function MediaModal({
    mediaUrl,
    mediaType = 'image',
    title,
    description,
    backgroundColor = "#1F2937",
    textColor = "#FFFFFF",
    onClose,
    onContinue,
}: {
    mediaUrl: string;
    mediaType?: 'image' | 'video' | 'gif';
    title?: string;
    description?: string;
    backgroundColor?: string;
    textColor?: string;
    onClose?: () => void;
    onContinue: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative z-10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                style={{ backgroundColor }}
            >
                {/* Close button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                {/* Media */}
                <div className="relative aspect-video bg-black">
                    {mediaType === 'video' ? (
                        <video
                            src={mediaUrl}
                            className="w-full h-full object-contain"
                            controls
                            autoPlay
                            muted
                        />
                    ) : (
                        <img
                            src={mediaUrl}
                            alt={title || 'Media'}
                            className="w-full h-full object-contain"
                        />
                    )}
                </div>

                {/* Content */}
                {(title || description) && (
                    <div className="p-6" style={{ color: textColor }}>
                        {title && (
                            <h3 className="text-xl font-semibold mb-2">{title}</h3>
                        )}
                        {description && (
                            <p className="text-sm opacity-80">{description}</p>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="px-6 pb-6 flex justify-end">
                    <button
                        onClick={onContinue}
                        className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
