"use client";

import { useState } from "react";
import { ChevronDown, Check, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface Chapter {
    id: string;
    name: string;
    order: number;
    stepCount: number;
}

interface ChaptersMenuProps {
    chapters: Chapter[];
    currentChapterId: string | null;
    completedChapterIds: Set<string>;
    onSelectChapter: (chapterId: string) => void;
    position?: 'left' | 'center' | 'right';
    buttonText?: string;
    buttonColor?: string;
}

export function ChaptersMenu({
    chapters,
    currentChapterId,
    completedChapterIds,
    onSelectChapter,
    position = 'left',
    buttonText = 'Chapters',
    buttonColor = '#7C3AED',
}: ChaptersMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    const positionClasses = {
        left: 'left-4',
        center: 'left-1/2 -translate-x-1/2',
        right: 'right-4',
    };

    const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);
    const currentChapter = sortedChapters.find(c => c.id === currentChapterId);

    return (
        <div className={`absolute bottom-4 ${positionClasses[position]} z-50`}>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{ backgroundColor: buttonColor }}
                className="px-4 py-2.5 rounded-lg text-white font-medium shadow-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
                <List className="w-4 h-4" />
                {buttonText}
                <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    isOpen && "rotate-180"
                )} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu */}
                    <div className="absolute bottom-full mb-2 left-0 w-72 bg-white rounded-xl shadow-2xl border overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="p-4 border-b bg-neutral-50">
                            <h3 className="font-semibold text-neutral-900">Chapters</h3>
                            {currentChapter && (
                                <p className="text-sm text-neutral-500 mt-0.5">
                                    Currently on: {currentChapter.name}
                                </p>
                            )}
                        </div>

                        <div className="max-h-64 overflow-y-auto">
                            {sortedChapters.map((chapter, index) => {
                                const isCompleted = completedChapterIds.has(chapter.id);
                                const isCurrent = chapter.id === currentChapterId;

                                return (
                                    <button
                                        key={chapter.id}
                                        onClick={() => {
                                            onSelectChapter(chapter.id);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-50 transition-colors text-left",
                                            isCurrent && "bg-violet-50"
                                        )}
                                    >
                                        {/* Status Icon */}
                                        <div className={cn(
                                            "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                                            isCompleted
                                                ? "bg-green-100 text-green-600"
                                                : isCurrent
                                                    ? "bg-violet-100 text-violet-600"
                                                    : "bg-neutral-100 text-neutral-400"
                                        )}>
                                            {isCompleted ? (
                                                <Check className="w-4 h-4" />
                                            ) : (
                                                <span className="text-xs font-medium">{index + 1}</span>
                                            )}
                                        </div>

                                        {/* Chapter Info */}
                                        <div className="flex-1 min-w-0">
                                            <span className={cn(
                                                "block text-sm truncate",
                                                isCurrent ? "font-medium text-violet-700" : "text-neutral-700"
                                            )}>
                                                {chapter.name}
                                            </span>
                                            <span className="text-xs text-neutral-400">
                                                {chapter.stepCount} step{chapter.stepCount !== 1 ? 's' : ''}
                                            </span>
                                        </div>

                                        {/* Current indicator */}
                                        {isCurrent && (
                                            <div className="w-2 h-2 rounded-full bg-violet-500" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
